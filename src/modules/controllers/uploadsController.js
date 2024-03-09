import path from 'path'
import { Types } from 'mongoose'
import createHttpError from 'http-errors'
import multer from 'multer'

import User from '../models/User.js'
import Folder from '../models/Folder.js'
import File from '../models/File.js'
import Comment from '../models/Comment.js'
import Notification from '../models/Notification.js'

import deleteFiles from '../utils/deleteFiles.js'
import { videoTypes } from '../utils/checkFileExec.js'
import { singleUpload } from '../utils/storage.js'
import createThumbnail from '../utils/createThumbnail.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ==========================
 * FOLDER CONTROLLERS
 * ==========================
 */
const getFolders = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, pagination = true } = req.query

        const folders = await Folder.paginate({}, { sort: { position: -1 }, page, limit, pagination: JSON.parse(pagination) })

        res.json(folders)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getFolder = async (req, res, next) => {
    try {
        const { name, folderId } = req.query;

        if (!name && !folderId) {
            throw createHttpError.BadRequest('Folder name or folderId must not be empty');
        }

        let folder;

        if (name) {
            folder = await Folder.findOne({ name });
        } else {
            folder = await Folder.findById(folderId);
        }

        if (!folder) {
            throw createHttpError.NotFound('Folder not found');
        }

        res.json(folder);
    } catch (err) {
        next(createHttpError(err instanceof createHttpError.HttpError ? err : 500, err.message));
    }
};

const createFolder = async (req, res, next) => {
    try {
        const { name, title, body, position } = req.body
        const admin = req.payload.role === 3

        if (!admin) return next(createHttpError.Unauthorized('Action not allowed'))
        if (name.trim() === '') return next(createHttpError.BadRequest('Folder name must not be empty'))
        if (title.trim() === '') return next(createHttpError.BadRequest('Folder title must not be empty'))
        if (!position || !Number.isInteger(position) || position < 0) return next(createHttpError.BadRequest('Position must be number'))

        const nameUrl = name.trim().toLowerCase().substring(0, 12).replace(/[^a-z0-9-_]/g, '')

        const nameExist = await Folder.findOne({ name: nameUrl })
        if (nameExist) return next(createHttpError.Conflict('Folder with this short name is already been created'))

        const newFolder = new Folder({
            name: nameUrl,
            title: title.trim().substring(0, 21),
            body: body.substring(0, 100),
            position,
            createdAt: new Date().toISOString(),
            filesCount: 0
        })

        const folder = await newFolder.save()

        res.json(folder)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const deleteFolder = async (req, res, next) => {
    try {
        const { folderId } = req.body
        const admin = req.payload.role === 3

        if (!admin) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!folderId) return next(createHttpError.BadRequest('folderId must not be empty'))

        const folder = await Folder.findById(folderId)
        await folder.deleteOne()

        res.json({ message: 'Folder successfully deleted' })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const editFolder = async (req, res, next) => {
    try {
        const { folderId, name, title, body, position } = req.body
        const admin = req.payload.role === 3

        if (!admin) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!folderId) return next(createHttpError.BadRequest('folderId must not be empty'))
        if (name.trim() === '') return next(createHttpError.BadRequest('Folder name must not be empty'))
        if (title.trim() === '') return next(createHttpError.BadRequest('Folder title must not be empty'))
        if (!position || !Number.isInteger(position) || position < 0) return next(createHttpError.BadRequest('Position must be number'))

        const nameUrl = name.trim().toLowerCase().substring(0, 12).replace(/[^a-z0-9-_]/g, '')

        const nameExist = await Folder.findOne({ name: nameUrl })
        if (nameExist) return next(createHttpError.Conflict('Folder with this short name is already been created'))

        await Folder.updateOne({ _id: new Types.ObjectId(folderId) }, {
            name: nameUrl,
            title: title.trim().substring(0, 21),
            body: body.substring(0, 100),
            position
        })
        const folder = await Folder.findById(folderId)

        res.json(folder)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}


/**
 * ==========================
 * FILE CONTROLLERS
 * ==========================
 */
const getAdminAllFiles = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort } = req.query
        const moder = req.payload.role >= 2

        if (!moder) return next(createHttpError.Unauthorized('Action not allowed'))

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const moderated = sort === 'moderated' ? { moderated: true } : { moderated: false }
        const files = await File.paginate(moderated, { sort: { createdAt: -1 }, page, limit, populate })

        res.json(files)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getAllFiles = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const files = await File.paginate({ moderated: true }, { sort: { createdAt: -1 }, page, limit, populate })

        res.json(files)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getFiles = async (req, res, next) => {
    try {
        const { folderId, limit = 10, page = 1 } = req.query

        if (!folderId) return next(createHttpError.BadRequest('folderId must not be empty'))

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const files = await File.paginate({ folderId, moderated: true }, { sort: { createdAt: -1 }, page, limit, populate })

        res.json(files)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getFile = async (req, res, next) => {
    try {
        const { fileId } = req.query

        if (!fileId) return next(createHttpError.BadRequest('fileId must not be empty'))

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const file = await File.findById(fileId).populate(populate)

        if (!file) {
            throw createHttpError.NotFound('File not found');
        }

        const folder = await Folder.findById(file.folderId).select('_id name title')

        if (!file.moderated) return res.json({ folder, message: 'File on moderation' })

        res.json({ folder, file })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const createFile = async (req, res, next) => {
    try {
        singleUpload(req, res, async (err) => {
            if (err) return next(createHttpError.BadRequest(err.message))

            if (!req.file) {
                return next(createHttpError.BadRequest('File upload failed'))
            }

            let { folderId, banner, title, body, desc, tags } = req.body

            if (!folderId) return next(createHttpError.BadRequest('folderId must not be empty'))
            if (title.trim() === '') return next(createHttpError.BadRequest('File title must not be empty'))
            if (!body) return next(createHttpError.BadRequest('File body must not be empty'))

            if (tags) {
                if (typeof tags === 'string') {
                    tags = tags.split(',').map(tag => tag.trim().toLowerCase());
                } else if (Array.isArray(tags)) {
                    tags = tags.map(tag => tag.toLowerCase());
                }
            }


            const now = new Date().toISOString()

            let thumb = null
            if (videoTypes.find(i => i === req.file.mimetype)) {
                const thumbFilename = req.file.filename.replace(path.extname(req.file.filename), '.jpg')

                await createThumbnail(req.file.path, 'uploads', thumbFilename)

                thumb = `/uploads/thumbnails/${thumbFilename}`
            }

            const newFile = new File({
                folderId,
                banner: banner,
                title: title.trim().substring(0, 100),
                body: body,
                desc: desc,
                tags: tags,
                createdAt: now,
                author: req.payload.id,
                file: {
                    url: `/uploads/${req.file.filename}`,
                    thumb,
                    type: req.file.mimetype,
                    size: req.file.size
                },
                downloads: 0,
                commentsCount: 0,
                moderated: false
            })

            const file = await newFile.save()

            await Folder.updateOne({ _id: new Types.ObjectId(file.folderId) }, { $inc: { filesCount: 1 } })

            res.json(file)

            req.io.to('adminNotification').emit('newAdminNotification', { type: 'file' })
        })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const deleteFile = async (req, res, next) => {
    try {
        const { fileId } = req.body
        const moder = req.payload.role >= 2

        if (!moder) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!fileId) return next(createHttpError.BadRequest('fileId must not be empty'))

        const file = await File.findById(fileId).populate({ path: 'author', select: 'role' })

        if (!file.author) {
            file.author = {
                role: 1
            }
        }
        if (req.payload.role < file.author.role) return next(createHttpError.Unauthorized('Action not allowed'))

        const deleteArray = []
        deleteArray.push(path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(file.file.url)))
        if (file.file.thumb) {
            deleteArray.push(path.join(__dirname, '..', '..', '..', 'public', 'uploads', 'thumbnails', path.basename(file.file.thumb)))
        }

        deleteFiles(deleteArray, (err) => {
            if (err) console.error(err)
        })

        await file.deleteOne()

        await Comment.deleteMany({ fileId })
        await Folder.updateOne({ _id: new Types.ObjectId(file.folderId) }, { $inc: { filesCount: -1 } })

        res.json({ message: 'File successfully deleted' })

        req.io.to('file:' + fileId).emit('fileDeleted', { id: fileId })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const editFile = async (req, res, next) => {
    try {
        const { fileId, title, body } = req.body

        if (!fileId) return next(createHttpError.BadRequest('fileId must not be empty'))
        if (title.trim() === '') return next(createHttpError.BadRequest('File title must not be empty'))
        if (body.trim() === '') return next(createHttpError.BadRequest('File body must not be empty'))

        const file = await File.findById(fileId).populate({ path: 'author', select: 'role' })

        if (!file.author) {
            file.author = {
                role: 1
            }
        }
        if (req.payload.id !== file.author._id) {
            if (req.payload.role < file.author.role) {
                return next(createHttpError.Unauthorized('Action not allowed'))
            }
        }

        await File.updateOne({ _id: new Types.ObjectId(fileId) }, {
            title: title.trim().substring(0, 100),
            body: body.substring(0, 1000)
        })

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const editedFile = await File.findById(fileId).populate(populate)

        res.json(editedFile)

        req.io.to('file:' + fileId).emit('fileEdited', editedFile)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const likeFile = async (req, res, next) => {
    try {
        const { fileId } = req.body

        if (!fileId) return next(createHttpError.BadRequest('fileId must not be empty'))

        const file = await File.findById(fileId)

        if (file.likes.find(like => like.toString() === req.payload.id)) {
            file.likes = file.likes.filter(like => like.toString() !== req.payload.id) // unlike
        } else {
            file.likes.push(req.payload.id) // like
        }
        await file.save()

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const likedFile = await File.findById(fileId).populate(populate)

        res.json(likedFile)

        req.io.to('file:' + fileId).emit('fileLiked', likedFile)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const moderateFile = async (req, res, next) => {
    try {
        const { fileId } = req.body
        const moder = req.payload.role >= 2

        if (!moder) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!fileId) return next(createHttpError.BadRequest('fileId must not be empty'))

        await File.updateOne({ _id: new Types.ObjectId(fileId) }, { moderated: true })

        const file = File.findById(fileId)

        await User.updateOne({ _id: new Types.ObjectId(file.author) }, { $inc: { karma: 3 } })

        res.json({ message: 'File successfully moderated' })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}


/**
 * ==========================
 * COMMENT CONTROLLERS
 * ==========================
 */
const getComments = async (req, res, next) => {
    try {
        const { fileId, limit = 10, page = 1, pagination = true } = req.query

        if (!fileId) return next(createHttpError.BadRequest('fileId must not be empty'))

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const comments = await Comment.paginate({ fileId }, { page, limit, populate, pagination: JSON.parse(pagination) })

        res.json(comments)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const createComment = async (req, res, next) => {
    try {
        const { fileId, commentedTo, body } = req.body

        if (!fileId) return next(createHttpError.BadRequest('fileId must not be empty'))
        if (body.trim() === '') return next(createHttpError.BadRequest('Comment body must not be empty'))

        const now = new Date().toISOString()

        const file = await File.findById(fileId)

        const newComment = new Comment({
            fileId,
            commentedTo,
            body: body.substring(0, 1000),
            createdAt: now,
            author: req.payload.id
        })

        const comment = await newComment.save()

        await File.updateOne({ _id: new Types.ObjectId(fileId) }, { $inc: { commentsCount: 1 } })

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const populatedComment = await Comment.findById(comment._id).populate(populate)

        await User.updateOne({ _id: new Types.ObjectId(req.payload.id) }, {
            $inc: {
                karma: populatedComment.author._id === req.payload.id ? 1 : 2
            }
        })

        res.json(populatedComment)

        req.io.to('file:' + fileId).emit('commentCreated', populatedComment)

        let type = 'commentToFile'
        let to = file.author
        if (commentedTo && commentedTo !== fileId) {
            const commentTo = await Comment.findById(commentedTo)
            type = 'commentToComment'
            to = commentTo.author
        }

        if (!commentedTo && req.payload.id === file.author.toString()) return

        const newNotification = new Notification({
            type,
            to,
            from: req.payload.id,
            pageId: fileId,
            title: file.title,
            body: body.substring(0, 1000),
            createdAt: new Date().toISOString(),
            read: false
        })
        const notification = await newNotification.save()

        const populateNotification = [{
            path: 'to',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'from',
            select: '_id name displayName onlineAt picture role ban'
        }]
        const populatedNotification = await Notification.findById(notification._id).populate(populateNotification)

        req.io.to('notification:' + to).emit('newNotification', populatedNotification)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.body

        if (!commentId) return next(createHttpError.BadRequest('commentId must not be empty'))

        const comment = await Comment.findById(commentId).populate({ path: 'author', select: 'role' })

        if (!comment.author) {
            comment.author = {
                role: 1
            }
        }
        if (req.payload.id === comment.author._id || req.payload.role >= comment.author.role) {
            await comment.deleteOne()

            await File.updateOne({ _id: new Types.ObjectId(comment.fileId) }, { $inc: { commentsCount: -1 } })

            res.json({ message: 'Comment successfully deleted' })

            req.io.to('file:' + comment.fileId).emit('commentDeleted', { id: commentId })
        } else {
            return next(createHttpError.Unauthorized('Action not allowed'))
        }
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const likeComment = async (req, res, next) => {
    try {
        const { commentId } = req.body

        if (!commentId) return next(createHttpError.BadRequest('commentId must not be empty'))

        const comment = await Comment.findById(commentId)

        if (comment.likes.find(like => like.toString() === req.payload.id)) {
            comment.likes = comment.likes.filter(like => like.toString() !== req.payload.id) // unlike
        } else {
            comment.likes.push(req.payload.id) // like
        }
        await comment.save()

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const likedComment = await Comment.findById(commentId).populate(populate)

        res.json(likedComment)

        req.io.to('file:' + comment.fileId).emit('commentLiked', likeComment)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}


/**
 * ==========================
 * DOWNLOAD CONTROLLERS
 * ==========================
 */
const download = async (req, res, next) => {
    try {
        const { fileId } = req.body

        if (!fileId) return next(createHttpError.BadRequest('fileId must not be empty'))

        await File.updateOne({ _id: new Types.ObjectId(fileId) }, { $inc: { downloads: 1 } })

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const file = await File.findById(fileId).populate(populate)

        res.json(file)

        req.io.to('file:' + fileId).emit('fileDownloaded', file)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

export { getFolders, getFolder, createFolder, deleteFolder, editFolder, getAdminAllFiles, getAllFiles, getFiles, getFile, createFile, deleteFile, editFile, likeFile, moderateFile, getComments, createComment, deleteComment, likeComment, download }