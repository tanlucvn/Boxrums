import Joi from 'joi';

/**
 * Đây là Schema sử dụng Joi để xử lý và kiểm tra thông tin Đăng ký.
 * @typedef {Object} registerSchema
 * @property {Joi.StringSchema} username - Chứa ký tự chữ và số, ít nhất 3 ký tự, tối đa 21 ký tự, và bắt buộc.
 * @property {Joi.StringSchema} email - Phải là định dạng email hợp lệ, chuyển về chữ thường, và bắt buộc.
 * @property {Joi.StringSchema} password - Ít nhất 6 ký tự, tối đa 50 ký tự, và bắt buộc.
 */
const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(21).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(50).required()
})

/**
 * Đây là Schema sử dụng Joi để xử lý và kiểm tra thông tin Đăng nhập.
 * @typedef {Object} loginSchema
 * @property {Joi.StringSchema} username - Chứa ký tự chữ và số, ít nhất 3 ký tự, tối đa 21 ký tự, và bắt buộc.
 * @property {Joi.StringSchema} password - Ít nhất 6 ký tự, tối đa 50 ký tự, và bắt buộc.
 */
const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(21).required(),
    password: Joi.string().min(6).max(50).required()
})

const verifyEmailSchema = Joi.object({
    token: Joi.string().required()
})

export { registerSchema, loginSchema, verifyEmailSchema };
