import { Types } from 'mongoose';
import createHttpError from 'http-errors';

import User from '../models/User.js';
import Board from '../models/Board.js';
import Thread from '../models/Thread.js';
import Answer from '../models/Answer.js';
import Ban from '../models/Ban.js';
import Report from '../models/Report.js';
import File from '../models/File.js';
import Comment from '../models/Comment.js';
import Dialogue from '../models/Dialogue.js';
import Message from '../models/Message.js';
import AuthHistory from '../models/AuthHistory.js';

const getStats = async (req, res, next) => {
    try {
        const bans = await User.find({ ban: { $ne: null } })

        res.json([{
            _id: 1,
            title: 'Users',
            count: await User.countDocuments()
        }, {
            _id: 2,
            title: 'Boards',
            count: await Board.countDocuments()
        }, {
            _id: 3,
            title: 'Threads',
            count: await Thread.countDocuments()
        }, {
            _id: 4,
            title: 'Answers',
            count: await Answer.countDocuments()
        }, {
            _id: 5,
            title: 'Bans',
            count: bans.length
        }, {
            _id: 6,
            title: 'Files',
            count: await File.countDocuments()
        }])
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getUsers = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort } = req.query

        let users
        const select = '_id name displayName createdAt onlineAt picture karma role ban'
        if (sort === 'online') {
            const date = new Date()
            date.setMinutes(date.getMinutes() - 5)
            users = await User.paginate({ onlineAt: { $gte: date.toISOString() } }, { sort: { onlineAt: -1 }, page, limit, select })
        } else if (sort === 'admin') {
            users = await User.paginate({ role: { $gte: 2 } }, { sort: { onlineAt: -1 }, page, limit, select })
        } else if (sort === 'old') {
            users = await User.paginate({}, { sort: { createdAt: 1 }, page, limit, select })
        } else if (sort === 'karma') {
            users = await User.paginate({}, { sort: { karma: -1, onlineAt: -1 }, page, limit, select })
        } else {
            users = await User.paginate({}, { sort: { createdAt: -1 }, page, limit, select })
        }

        res.json(users)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getUser = async (req, res, next) => {
    try {
        const { userName } = req.query

        if (!userName) return next(createHttpError.BadRequest('userName must not be empty'))

        const select = '_id name displayName createdAt onlineAt picture karma role ban'
        const populate = {
            path: 'ban',
            select: '_id admin reason body createdAt expiresAt',
            populate: {
                path: 'admin',
                select: '_id name displayName onlineAt picture role'
            }
        }
        const user = await User.findOne({ name: userName }, select).populate(populate)

        if (!user) return next(createHttpError.BadRequest('User not found'))

        if (user.ban) {
            if (user.ban.expiresAt < new Date().toISOString()) {
                await User.updateOne({ _id: new Types.ObjectId(user._id) }, { ban: null })
                user.ban = null
            }
        }

        res.json(user)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getAdmins = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query

        const select = '_id name displayName createdAt onlineAt picture role ban'
        const admins = await User.paginate({ role: { $gte: 2 } }, { sort: { createdAt: -1 }, page, limit, select })

        res.json(admins)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getBans = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort } = req.query

        let bans
        if (sort === 'all') {
            const populate = [{
                path: 'user',
                select: '_id name displayName onlineAt picture role ban'
            }, {
                path: 'admin',
                select: '_id name displayName onlineAt picture role'
            }]
            bans = await Ban.paginate({}, { sort: { createdAt: -1 }, page, limit, populate })
        } else {
            const select = '_id name displayName createdAt onlineAt picture role ban'
            const populate = {
                path: 'ban',
                select: '_id admin reason body createdAt expiresAt',
                populate: {
                    path: 'admin',
                    select: '_id name displayName onlineAt picture role'
                }
            }
            bans = await User.paginate({ ban: { $ne: null } }, { page, limit, select, populate })
        }

        res.json(bans)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getUserBans = async (req, res, next) => {
    try {
        const { userId, limit = 10, page = 1 } = req.query

        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))

        const populate = [{
            path: 'user',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'admin',
            select: '_id name displayName onlineAt picture role'
        }]
        const bans = await Ban.paginate({ user: userId }, { sort: { createdAt: -1 }, page, limit, populate })

        res.json(bans)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getBan = async (req, res, next) => {
    try {
        const { userId } = req.query

        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))

        const select = '_id name displayName createdAt onlineAt picture role ban'
        const populate = {
            path: 'ban',
            select: '_id admin reason body createdAt expiresAt',
            populate: {
                path: 'admin',
                select: '_id name displayName onlineAt picture role'
            }
        }
        const user = await User.findOne({ _id: new Types.ObjectId(userId) }, select).populate(populate)

        res.json(user)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const createBan = async (req, res, next) => {
    try {
        const { userId, reason, body = '', expiresAt } = req.body
        const moder = req.payload.role >= 2

        if (!moder) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))
        if (reason.trim() === '') return next(createHttpError.BadRequest('Reason must not be empty'))
        if (!expiresAt) return next(createHttpError.BadRequest('expiresAt must not be empty'))

        const user = await User.findById(userId).select('role')

        if (!user) return next(createHttpError.BadRequest('User not found'))
        if (req.payload.role < user.role) return next(createHttpError.Unauthorized('Action not allowed'))

        const now = new Date().toISOString()

        const newBan = new Ban({
            user: userId,
            admin: req.payload.id,
            reason,
            body: body.substring(0, 100),
            createdAt: now,
            expiresAt
        })

        const ban = await newBan.save()

        const diff = new Date(expiresAt) - new Date(now)
        const minutes = diff / 60000
        await User.updateOne({ _id: new Types.ObjectId(userId) }, { $inc: { karma: minutes > 43799 ? -50 : -20 }, ban: ban._id })

        res.json(ban)

        req.io.to('notification:' + userId).emit('ban', ban)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const unBan = async (req, res, next) => {
    try {
        const { userId } = req.body
        const moder = req.payload.role >= 2

        if (!moder) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))

        await User.updateOne({ _id: new Types.ObjectId(userId) }, { $inc: { karma: 10 }, ban: null })

        res.json('User unbanned')

        req.io.to('banned:' + userId).emit('unban', { message: 'Unbanned' })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const deleteBan = async (req, res, next) => {
    try {
        const { banId } = req.body
        const moder = req.payload.role >= 2

        if (!moder) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!banId) return next(createHttpError.BadRequest('banId must not be empty'))

        const ban = await Ban.findById(banId)
        await ban.deleteOne()

        res.json('Ban successfully deleted')
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getUserStats = async (req, res, next) => {
    try {
        const { userId } = req.query

        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))

        const user = await User.findById(userId)

        if (!user) return next(createHttpError.BadRequest('User not found'))

        const threads = await Thread.find({ author: new Types.ObjectId(userId) })
        const answers = await Answer.find({ author: new Types.ObjectId(userId) })
        const bans = await Ban.find({ user: new Types.ObjectId(userId) })
        const files = await File.find({ author: new Types.ObjectId(userId) })
        const comments = await Comment.find({ author: new Types.ObjectId(userId) })

        res.json({
            threadsCount: threads.length,
            answersCount: answers.length,
            bansCount: bans.length,
            filesCount: files.length,
            fileCommentsCount: comments.length,
            karma: user.karma
        })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getUserThreads = async (req, res, next) => {
    try {
        const { userId, limit = 10, page = 1 } = req.query

        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const threads = await Thread.paginate({ author: userId }, { sort: { createdAt: -1 }, page, limit, populate })

        res.json(threads)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getUserAnswers = async (req, res, next) => {
    try {
        const { userId, limit = 10, page = 1 } = req.query

        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        const answers = await Answer.paginate({ author: userId }, { sort: { createdAt: -1 }, page, limit, populate })

        res.json(answers)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getAuthHistory = async (req, res, next) => {
    try {
        const { userId, limit = 10, page = 1 } = req.query
        const moder = req.payload.role >= 2

        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))
        if (req.payload.id !== userId) {
            if (!moder) {
                return next(createHttpError.Unauthorized('Action not allowed'))
            }
        }

        const populate = {
            path: 'user',
            select: '_id name displayName onlineAt picture role ban'
        }
        const authHistory = await AuthHistory.paginate({ user: userId }, { sort: { loginAt: -1 }, page, limit, populate })

        res.json(authHistory)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const searchAuthHistory = async (req, res, next) => {
    try {
        const { ip, limit = 10, page = 1 } = req.query
        const moder = req.payload.role >= 2

        if (!moder) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!ip) return next(createHttpError.BadRequest('ip must not be empty'))

        const populate = {
            path: 'user',
            select: '_id name displayName onlineAt picture role ban'
        }
        const authHistory = await AuthHistory.paginate(
            { $text: { $search: ip } },
            { sort: { ip: -1, ua: -1, loginAt: -1 }, page, limit, populate }
        )

        res.json(authHistory)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getReports = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort } = req.query
        const moder = req.payload.role >= 2

        if (!moder) return next(createHttpError.Unauthorized('Action not allowed'))

        const populate = {
            path: 'from',
            select: '_id name displayName onlineAt picture role ban'
        }
        const read = sort === 'read' ? { read: true } : { read: false }
        const reports = await Report.paginate(read, { sort: { createdAt: -1 }, page, limit, populate })

        if (reports.totalDocs) {
            await Report.updateMany({ read: false }, { read: true })
        }

        res.json(reports)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const createReport = async (req, res, next) => {
    try {
        const { threadId, postId, body } = req.body

        if (!threadId) return next(createHttpError.BadRequest('threadId must not be empty'))
        if (!postId) return next(createHttpError.BadRequest('postId must not be empty'))
        if (body.trim() === '') return next(createHttpError.BadRequest('Report body must not be empty'))

        const reportExist = await Report.find({ postId: new Types.ObjectId(postId) })
        if (reportExist.length) return next(createHttpError.BadRequest('Report to the post already has'))

        const thread = await Thread.findById(threadId)

        const newReport = new Report({
            from: req.payload.id,
            threadId,
            postId,
            title: thread.title,
            body: body.substring(0, 1000),
            createdAt: new Date().toISOString(),
            read: false
        })
        const report = await newReport.save()

        const populate = {
            path: 'from',
            select: '_id name displayName onlineAt picture role ban'
        }
        const populatedReport = await Report.findById(report._id).populate(populate)

        res.json(populatedReport)

        req.io.to('adminNotification').emit('newAdminNotification', { type: 'report' })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const deleteReports = async (req, res, next) => {
    try {
        const moder = req.payload.role >= 2

        if (!moder) return next(createHttpError.Unauthorized('Action not allowed'))

        await Report.deleteMany({ read: true })

        res.json({ message: 'Reports successfully deleted' })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const search = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, query, type } = req.query

        if (!query) return next(createHttpError.BadRequest('query must not be empty'))

        const populate = [{
            path: 'author',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'likes',
            select: '_id name displayName picture'
        }]
        let results
        const regexQuery = new RegExp(query, 'i');
        if (type === 'answers') {
            results = await Answer.paginate({ $or: [{ body: regexQuery }] }, { sort: { createdAt: -1 }, page, limit, populate })
        } else if (type === 'users') {
            const select = '_id name displayName createdAt onlineAt picture role ban'
            results = await User.paginate({ $or: [{ name: regexQuery }, { displayName: regexQuery }] }, { sort: { onlineAt: -1 }, page, limit, select })
        } else if (type === 'boards') {
            results = await Board.paginate({ $or: [{ title: regexQuery }] }, { sort: { createdAt: -1 }, page, limit })
        } else {
            results = await Thread.paginate({ $or: [{ title: regexQuery }] }, { sort: { createdAt: -1 }, page, limit, populate })
        }

        res.json(results)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const editRole = async (req, res, next) => {
    try {
        const { userId, role = 1 } = req.body
        const admin = req.payload.role === 3

        if (!admin) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!role || !Number.isInteger(role) || role < 1) return next(createHttpError.BadRequest('Role must be number'))
        if (!role > 2) return next(createHttpError.BadRequest('Max role number: 2'))
        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))

        await User.updateOne({ _id: new Types.ObjectId(userId) }, { role })

        res.json({ message: 'User role updated' })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.body
        const admin = req.payload.role === 3

        if (!admin) return next(createHttpError.Unauthorized('Action not allowed'))
        if (!userId) return next(createHttpError.BadRequest('userId must not be empty'))

        const user = await User.findById(userId)

        await Ban.deleteMany({ user: userId })

        const dialogues = await Dialogue.find({
            $or: [{
                to: new Types.ObjectId(userId)
            }, {
                from: new Types.ObjectId(userId)
            }]
        })
        await Promise.all(dialogues.map(async (item) => {
            const dialogue = await Dialogue.findById(item._id)
            await dialogue.deleteOne()
        }))

        const messages = await Message.find({
            $or: [{
                to: new Types.ObjectId(userId)
            }, {
                from: new Types.ObjectId(userId)
            }]
        })
        await Promise.all(messages.map(async (item) => {
            const message = await Message.findById(item._id)

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

            await messages.deleteOne()
        }))

        await user.deleteOne()

        res.json({ message: 'User successfully deleted' })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

export { getStats, getUsers, getUser, getAdmins, getBans, getUserBans, getBan, createBan, unBan, deleteBan, getUserStats, getUserThreads, getUserAnswers, getAuthHistory, searchAuthHistory, getReports, createReport, deleteReports, search, editRole, deleteUser }
