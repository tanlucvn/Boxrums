import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';
import createHttpError from 'http-errors';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Notification from '../models/Notification.js';

/** Lấy đường dẫn của file hiện tại và thư mục của nó */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Kiểm tra loại file tải lên có phải là ảnh không */
const checkFileType = (file, callback) => {
    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) return callback(null, true)
    else callback('It\'s not image', false)
}

/**
 * storage - Tạo cấu hình lưu trữ cho Multer để định nghĩa nơi lưu trữ và tên file của ảnh được tải lên.
 */
const storage = (dest, name) => {
    return multer.diskStorage({
        destination: path.join(__dirname, '..', '..', '..', 'public', dest),
        filename: (req, file, callback) => {

            /** Tạo hay nói cách khác là Đổi tên file với tiền tố, thời gian và phần mở rộng của file gốc */
            callback(null, name + '_' + Date.now() + path.extname(file.originalname))
        }
    })
}

/**
 * upload - Sử dụng Multer để xử lý việc tải lên file ảnh.
 */
const upload = multer({
    // Cấu hình lưu trữ và đặt tên file cho ảnh tải lên 
    storage: storage('users', 'picture'),
    // Giới hạn kích thước file 8Mb
    limits: { fileSize: 1048576 * 8 }, // 8Mb
    // Kiểm tra loại file
    fileFilter: (req, file, callback) => checkFileType(file, callback)
}).single('picture') // Đảm bảo chỉ có một file tải lên với key là 'picture'

/**
 * getProfile - Lấy thông tin profile của người dùng.
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: new Types.ObjectId(req.payload.id) })
        res.json({
            id: user._id,
            name: user.name,
            displayName: user.displayName,
            email: user.email,
            createdAt: user.createdAt,
            onlineAt: user.onlineAt,
            picture: user.picture,
            role: user.role
        })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

/**
 * uploadUserPicture - Tải lên và cập nhật ảnh người dùng.
 */
const uploadUserPicture = (req, res, next) => {
    try {
        upload(req, res, (err) => {
            if (err) return next(createHttpError.BadRequest(err))

            if (req.file) {
                sharp(req.file.path)
                    .resize(300, 300)
                    .toBuffer()
                    .then(async data => {
                        fs.writeFileSync(req.file.path, data)
                        const picture = { picture: `${process.env.BACKEND}/users/${req.file.filename}` }

                        await User.updateOne({ _id: new Types.ObjectId(req.payload.id) }, picture)

                        res.json(picture)
                    })
                    .catch(err => {
                        // Xử lý lỗi nếu có vấn đề trong quá trình xử lý ảnh
                        next(createHttpError.InternalServerError())
                    })
            } else {
                // Nếu không có file được tải lên, trả về lỗi BadRequest
                next(createHttpError.BadRequest())
            }
        })
    } catch (err) {
        next(err)
    }
}


/**
 * setOnline - Cập nhật trạng thái online của người dùng.
 */
const setOnline = async (req, res, next) => {
    try {
        await User.updateOne({ _id: new Types.ObjectId(req.payload.id) }, { onlineAt: new Date().toISOString() })
        res.json({ success: true })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const editPassword = async (req, res, next) => {
    try {
        const { password, newPassword } = req.body

        if (!password) return next(createHttpError.BadRequest('Password must not be empty'))
        if (!newPassword) return next(createHttpError.BadRequest('newPassword must not be empty'))

        const user = await User.findOne({ _id: new Types.ObjectId(req.payload.id) })

        if (!user) return next(createHttpError.BadRequest('User not found'))

        const isMatch = await user.isValidPassword(password)
        if (!isMatch) return next(createHttpError.BadRequest('Password not valid'))

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await User.updateOne({ _id: new Types.ObjectId(req.payload.id) }, { password: hashedPassword })

        res.json({ message: 'Password successfully changed' })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const getNotifications = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort } = req.query

        let createdAt
        if (sort === 'old') {
            createdAt = 1
        } else {
            createdAt = -1
        }

        const populate = [{
            path: 'to',
            select: '_id name displayName onlineAt picture role ban'
        }, {
            path: 'from',
            select: '_id name displayName onlineAt picture role ban'
        }]
        const notifications = await Notification.paginate({ to: req.payload.id }, { sort: { createdAt }, page, limit, populate })

        if (notifications.totalDocs) {
            await Notification.updateMany({ to: req.payload.id, read: false }, { read: true })
        }

        res.json(notifications)
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

const deleteNotifications = async (req, res, next) => {
    try {
        await Notification.deleteMany({ to: req.payload.id, read: true })

        res.json({ message: 'Notifications successfully deleted' })
    } catch (err) {
        next(createHttpError.InternalServerError({ message: err.message }))
    }
}

export { getProfile, uploadUserPicture, setOnline, editPassword, getNotifications, deleteNotifications }
