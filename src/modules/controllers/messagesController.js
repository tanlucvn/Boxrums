import path from 'path';
import { Types } from 'mongoose';
import createHttpError from 'http-errors';

import User from '../models/User.js';
import Dialogue from '../models/Dialogue.js';
import Message from '../models/Message.js';

import deleteFiles from '../utils//deleteFiles.js';
import { videoTypes } from '../utils/checkFileExec.js';
import { messageUpload } from '../utils/storage.js';
import createThumbnail from '../utils/createThumbnail.js';



const getDialogues = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query

        const populate = [{
            path: 'from',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'to',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'lastMessage'
        }]
        const dialogues = await Dialogue.paginate({
            $or: [{
                to: new Types.ObjectId(req.payload.id)
            }, {
                from: new Types.ObjectId(req.payload.id)
            }]
        }, {
            sort: { updatedAt: -1 },
            page,
            limit,
            populate
        })

        if (dialogues.length) {
            if (req.payload.id !== dialogues[0].to) return next(createHttpError.Unauthorized('Action not allowed'))
        }

        res.json(dialogues)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getDialogue = async (req, res, next) => {
    try {
        const { userName } = req.query

        if (!userName) return next(createHttpError.BadRequest('userName must not be empty'))

        const user = await User.findOne({ name: userName })

        if (!user) return next(createHttpError.BadRequest('User not found'))

        const dialogue = await Dialogue.findOne({
            $or: [{
                to: new Types.ObjectId(user._id),
                from: new Types.ObjectId(req.payload.id)
            }, {
                to: new Types.ObjectId(req.payload.id),
                from: new Types.ObjectId(user._id)
            }]
        })

        res.json(dialogue)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getMessages = async (req, res, next) => {
    try {
        const { dialogueId, limit = 10, page = 1 } = req.query

        if (!dialogueId) return next(createHttpError.BadRequest('dialogueId must not be empty'))

        const dialogue = await Dialogue.findById(dialogueId)

        if (dialogue.from.toString() !== req.payload.id) {
            if (dialogue.to.toString() !== req.payload.id) {
                return next(createHttpError.Unauthorized('Action not allowed'))
            }
        }

        const populate = [{
            path: 'from',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'to',
            select: '_id name displayName onlineAt picture role ban'
        }]
        const messages = await Message.paginate({ dialogueId }, { sort: { createdAt: -1 }, page, limit, populate })

        const groups = messages.docs.reduce((groups, item) => {
            const date = new Date(item.createdAt).toISOString().split('T')[0]
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(item)
            return groups
        }, {})

        const grouped = Object.keys(groups).map((date, index) => {
            const msgList = groups[date].reverse()
            return {
                groupId: date,
                date,
                messages: msgList
            }
        })

        messages.docs = grouped

        res.json(messages)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const createMessage = async (req, res, next) => {
    try {
        messageUpload(req, res, async (err) => {
            if (err) return next(createHttpError.BadRequest(err.message))

            const { dialogueId, body = '', to } = JSON.parse(req.body.postData)

            if (!to) return next(createHttpError.BadRequest('"to" must not be empty'))

            let files = null
            if (req.files.length) {
                files = []
                await Promise.all(req.files.map(async (item) => {
                    if (videoTypes.find(i => i === item.mimetype)) {
                        const thumbFilename = item.filename.replace(path.extname(item.filename), '.jpg')

                        await createThumbnail(item.path, 'message', thumbFilename)

                        files.push({
                            file: `/message/${item.filename}`,
                            thumb: `/message/thumbnails/${thumbFilename}`,
                            type: item.mimetype,
                            size: item.size
                        })
                    } else {
                        files.push({
                            file: `/message/${item.filename}`,
                            thumb: null,
                            type: item.mimetype,
                            size: item.size
                        })
                    }
                }))
            }

            let isNewDialogue = false
            let dId
            const dialogueExist = await Dialogue.findOne({ _id: new Types.ObjectId(dialogueId) })

            if (!dialogueExist) {
                isNewDialogue = true

                const newDialogue = new Dialogue({
                    from: req.payload.id,
                    to
                })

                const dialogue = await newDialogue.save()
                dId = dialogue._id

                req.io.emit('joinToDialogue', dialogue)
            } else {
                dId = dialogueExist._id
            }

            const now = new Date().toISOString()

            const newMessage = new Message({
                dialogueId: dId,
                body: body.substring(0, 1000),
                createdAt: now,
                from: req.payload.id,
                to,
                file: files,
                read: false
            })

            const message = await newMessage.save()
            await Dialogue.updateOne({ _id: new Types.ObjectId(dId) }, { lastMessage: message._id, updatedAt: now })

            res.json(message)

            const populate = [{
                path: 'from',
                select: '_id name displayName onlineAt picture role ban'
            }, {
                path: 'to',
                select: '_id name displayName onlineAt picture role ban'
            }]
            const populatedMessage = await Message.findById(message._id).populate(populate)

            req.io.to('pm:' + dId).emit('newMessage', populatedMessage)

            const populatedDialogue = [{
                path: 'from',
                select: '_id name displayName onlineAt picture role ban'
            }, {
                path: 'to',
                select: '_id name displayName onlineAt picture role ban'
            }, {
                path: 'lastMessage'
            }]
            const newOrUpdatedDialogue = await Dialogue.findById(dId).populate(populatedDialogue)

            if (isNewDialogue) {
                req.io.to('dialogues:' + to).emit('newDialogue', newOrUpdatedDialogue)
            } else {
                req.io.to('dialogues:' + to).emit('updateDialogue', newOrUpdatedDialogue)
            }

            const dialogues = await Dialogue.find({
                $or: [{
                    to: new Types.ObjectId(req.payload.id)
                }, {
                    from: new Types.ObjectId(req.payload.id)
                }]
            }).populate({ path: 'lastMessage' })

            const noRead = dialogues.filter(item => item.lastMessage && !item.lastMessage.read && item.lastMessage.to.toString() === to)

            req.io.to('pmCount:' + to).emit('messagesCount', { count: noRead.length })
        })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const deleteMessage = async (req, res, next) => {
    try {
        const { dialogueId, groupId, messageId } = req.body

        if (!dialogueId) return next(createHttpError.BadRequest('dialogueId must not be empty'))
        if (!groupId) return next(createHttpError.BadRequest('groupId must not be empty'))
        if (!messageId) return next(createHttpError.BadRequest('messageId must not be empty'))

        const message = await Message.findById(messageId)

        if (message.file && message.file.length) {
            const files = message.file.reduce((array, item) => {
                if (item.thumb) {
                    return [
                        ...array,
                        path.join(__dirname, '..', '..', '..', 'public', 'message', path.basename(item.file)),
                        path.join(__dirname, '..', '..', '..', 'public', 'message', 'thumbnails', path.basename(item.thumb))
                    ]
                }

                return [
                    ...array,
                    path.join(__dirname, '..', '..', '..', 'public', 'message', path.basename(item.file))
                ]
            }, [])

            deleteFiles(files, (err) => {
                if (err) console.error(err)
            })
        }

        await message.delete()

        const messages = await Message.find({ dialogueId: new Types.ObjectId(dialogueId) }).sort({ createdAt: -1 })
        if (messages.length) {
            await Dialogue.updateOne({ _id: new Types.ObjectId(dialogueId) }, { lastMessage: messages[0]._id, updatedAt: messages[0].createdAt })
        } else {
            const dialogue = await Dialogue.findById(dialogueId)
            await dialogue.delete()
        }

        res.json({ message: 'Message successfully deleted' })

        req.io.to('pm:' + dialogueId).emit('messageDeleted', { id: messageId, groupId })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

export { getDialogues, getDialogue, getMessages, createMessage, deleteMessage }