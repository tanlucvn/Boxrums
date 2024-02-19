import { registerSchema, loginSchema, verifyEmailSchema } from '../utils/validationSchema.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/verification.js';
import { randomOTPNumber, randomTokenString } from '../utils/generate_keys.js';
import { signAccessToken } from '../utils/jwt.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt'
import User from '../models/User.js';

/**
 * ==========================
 * REGISTER
 * ==========================
 */
const register = async (req, res, next) => {
    try {

        /** Validation dữ liệu đầu vào từ request body bằng registerSchema */
        const result = await registerSchema.validateAsync(req.body)

        /** Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa */
        const emailDoesExist = await User.findOne({ email: result.email })
        if (emailDoesExist) {

            /** Nếu email đã tồn tại, ném lỗi Conflict */
            throw createHttpError.Conflict('E-mail is already been registered')
        }

        /** Chuyển đổi username thành chữ thường và kiểm tra xem đã tồn tại trong cơ sở dữ liệu chưa */
        const username = result.username.toLowerCase()
        const userNamedoesExist = await User.findOne({ name: username })
        if (userNamedoesExist) {

            /** Nếu username đã tồn tại, ném lỗi Conflict */
            throw createHttpError.Conflict('Username is already been registered')
        }

        /** Tạo một instance User mới dựa trên dữ liệu đã validate và lưu vào CSDL */
        const newVerificationToken = randomTokenString();
        const user = new User({
            name: username,
            displayName: result.username,
            email: result.email,
            password: result.password,
            createdAt: new Date().toISOString(),
            onlineAt: new Date().toISOString(),
            role: '1',
            verificationToken: newVerificationToken
        })
        const savedUser = await user.save()

        /** Tạo access token cho người dùng đã lưu */
        const accessToken = await signAccessToken(savedUser)

        /** Gửi email cho người đăng ký */
        await sendVerificationEmail(user);

        /** Trả về thông tin của người dùng đã lưu và access token dưới dạng JSON */
        res.json({
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                displayName: savedUser.displayName,
                picture: savedUser.picture,
                role: savedUser.role,
            },
            accessToken
        })
    } catch (error) {

        /** Đặt status là 422 nếu là lỗi validation từ Joi */
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}


/**
 * ==========================
 * LOGIN
 * ==========================
 */
const login = async (req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body)

        const username = result.username.toLowerCase()
        const user = await User.findOne({ name: username })
        if (!user) throw createHttpError.NotFound('User not registered')

        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw createHttpError.Unauthorized('Username or password not valid')

        if (!user.verified) {
            throw createHttpError.Unauthorized('Email not verified');
        }

        const accessToken = await signAccessToken(user)

        res.json({
            user: {
                id: user._id,
                name: user.name,
                displayName: user.displayName,
                picture: user.picture,
                role: user.role
            },
            accessToken
        })
    } catch (error) {
        if (error.isJoi === true) {
            return next(createHttpError.BadRequest('Invalid username or password'))
        }
        next(error)
    }
}

const resendVerificationEmail = async (req, res, next) => {
    try {
        const result = req.body
        const username = result.username.toLowerCase()
        const user = await User.findOne({ name: username })

        await sendVerificationEmail(user);

        res.json({ email: user.email, message: "Re-send verification email successfully!" })
    } catch (error) {

    }
}


/**
 * ==========================
 * EMAIL VERIFICATION
 * ==========================
 */
const verificationToken = async ({ token }) => {
    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) throw createHttpError.BadRequest('Verification failed');

        user.verified = Date.now();
        user.verificationToken = undefined;
        await user.save();

        return user
    } catch (err) {
        throw createHttpError.InternalServerError("Invalid Token");
    }
}

const verifyEmail = async (req, res, next) => {
    try {
        const result = await verifyEmailSchema.validateAsync(req.body)

        /** Gửi email cho người đăng ký */
        const user = await verificationToken({ token: result.token });

        /** Trả về thông tin của người dùng đã lưu và access token dưới dạng JSON */
        res.json({ message: 'Verification successful, you can now login', userId: user._id });
    } catch (error) {

        /** Đặt status là 422 nếu là lỗi validation từ Joi */
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}


/**
 * ==========================
 * FORGOT AND RESET PASSWORD
 * ==========================
 */
const forgotPassword = async (req, res, next) => {
    try {
        const result = req.body
        const user = await User.findOne({ email: result.email });

        // always return ok response to prevent email enumeration
        if (!user) return;

        // create reset token that expires after 24 hours
        user.resetToken = {
            token: randomTokenString(),
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
        await user.save();

        // send email
        await sendPasswordResetEmail(user);
        res.json({ message: 'Please check your email for password reset instructions', user: user });
    } catch (err) {
        res.json({ message: err.message });
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const result = req.body
        const user = await User.findOne({
            'resetToken.token': result.token,
            'resetToken.expires': { $gt: Date.now() }
        });

        if (!user) throw createHttpError.BadRequest('Invalid token');

        // update password and remove reset token
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(result.password, salt)

        user.password = hashedPassword;
        user.passwordReset = Date.now();
        user.resetToken = undefined;

        /* 
            Vì người dùng đã nhận token qua mail (user là chủ email),
            Nên nếu người dùng chưa xác minh mail thì khi đổi lại mật khẩu sẽ cho xác minh mail luôn
        */
        if (!user.verified) {
            user.verified = Date.now();
            user.verificationToken = undefined;
        }

        await user.save();

        res.json({ message: 'Password reset successfully', user: user });
    } catch (err) {
        res.json({ message: err.message });
    }
}


export { register, login, verifyEmail, forgotPassword, resetPassword, resendVerificationEmail }
