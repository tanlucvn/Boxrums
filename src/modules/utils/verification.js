import nodemailer from 'nodemailer';

/** 
 * ==========================
 * SEND EMAIL
 * ==========================
 */
const sendVerificationEmail = (user) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verifyLink = `${process.env.CLIENT}/verify-email?token=${user.verificationToken}`

        // Email data
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify your email",
            html: `
            <body style="font-family: 'Noto Sans', monospace, Courier New; background: #eee;">
                <div style="display: block; width: 470px; padding: 60px 100px; margin: 50px auto; background: #0c0c0c; box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3); border-radius: 10px; color: #fff">
                <p style="color: #fff"><strong>Email Verification</strong></p>
                <hr>
                <p style="color: #fff">
                    Thank you for using our service! Please verify your email address.
                </p>
                <p style="color: #fff">
                    To proceed with the email verification, please click the button below:
                </p>
                <a href="${verifyLink}" style="display: inline-block; padding: 10px; background-color: #916bc2; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p style="color: #fff">Or copy link below:</p>
                <code style="background-color: #171717; color: #916bc2; padding: 5px; border-radius: 3px; display: inline-block; margin-top: 10px; width: 100%; text-decoration: none;">${verifyLink}</code>
                <p style="color: #fff">If you did not request an email verification or if you do not want to verify your email, please ignore this email.</p>
                <p style="color: #ddd; margin-top: 10px; font-size: 0.8rem">Please note that the verification link is valid for a limited time. If you don't verify your email within this time frame, you may need to request another verification.</p>
                
                <table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;border-top: 3px dashed #eee;padding-top:20px;margin-top: 40px;">
                    <tbody>
                    <tr valign="top">
                        <td style="padding-left:20px;width:10px;padding-right:20px;"> <a href="${process.env.CLIENT}"><img src="https://i.ibb.co/X3hW7jH/logoIcon.png?fit=crop&format=auto&height=512&version=1681408581&width=512" height="120" width="120" alt="Boxrum Logo"></a></td>
                        <td style="border-right:3px dashed #eee;"></td>
                        <td>
                        <div style="text-align: initial; font: 16px; color: #916bc2; padding: 0 20px; line-height: 24px;">BOXRUM<br> <span style="font-size: 14px; color: #ddd;">Forums Website</span> </div>
                        <div style="color: #999; font-size: 14px; text-align: initial; padding: 20px 20px;">
                            Follow Boxrum on<br /><a href="${process.env.CLIENT}" style="color: #999; text-decoration: none; line-height: 24px;">Website</a>&nbsp;&nbsp;-&nbsp;&nbsp;<a href="https://github.com/tanlucvn/boxrum" style="color: #999; text-decoration: none; line-height: 24px;">Github</a>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </body>
            `
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // Nếu gửi email bị lỗi, trả về lỗi cho client
                return next(new Error("Error occurred while sending email."));
            }
        });
    } catch (error) {
        console.log(error); // Bắt lỗi và chuyển cho middleware xử lý lỗi
    }
}

const sendPasswordResetEmail = (user) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `${process.env.CLIENT}/reset-password?token=${user.resetToken.token}`

        // Email data
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Sign-up Verification API - Reset Password",
            html: `
            <body style="font-family: 'Noto Sans', monospace, Courier New; background: #eee;">
                <div style="display: block; width: 470px; padding: 60px 100px; margin: 50px auto; background: #0c0c0c; box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3); border-radius: 10px; color: #fff">
                <p style="color: #fff"><strong>Password Reset Email</strong></p>
                <hr>
                <p style="color: #fff">
                    Thank you for using our service! We have received a request to reset your password.
                </p>
                <p style="color: #fff">
                    To proceed with the password reset, please click the button below:
                </p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px; background-color: #916bc2; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p style="color: #fff">Or copy link below:</p>
                <code style="background-color: #171717; color: #916bc2; padding: 5px; border-radius: 3px; display: inline-block; margin-top: 10px; width: 100%; text-decoration: none;">${process.env.CLIENT}/reset-password?token=${user.resetToken.token}</code>
                <p style="color: #fff">If you did not request a password reset or if you do not want to change your password, please ignore this email.</p>
                <p style="color: #ddd; margin-top: 10px; font-size: 0.8rem">Please note that the password reset link is valid for a limited time. If you don't reset your password within this time frame, you may need to request another reset.</p>
                
                <table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;border-top: 3px dashed #eee;padding-top:20px;margin-top: 40px;">
                    <tbody>
                    <tr valign="top">
                        <td style="padding-left:20px;width:10px;padding-right:20px;"> <a href="${process.env.CLIENT}"><img src="https://i.ibb.co/X3hW7jH/logoIcon.png?fit=crop&format=auto&height=512&version=1681408581&width=512" height="120" width="120" alt="Boxrum Logo"></a></td>
                        <td style="border-right:3px dashed #eee;"></td>
                        <td>
                        <div style="text-align: initial; font: 16px; color: #916bc2; padding: 0 20px; line-height: 24px;">BOXRUM<br> <span style="font-size: 14px; color: #ddd;">Forums Website</span> </div>
                        <div style="color: #999; font-size: 14px; text-align: initial; padding: 20px 20px;">
                            Follow Boxrum on<br /><a href="${process.env.CLIENT}" style="color: #999; text-decoration: none; line-height: 24px;">Website</a>&nbsp;&nbsp;-&nbsp;&nbsp;<a href="https://github.com/tanlucvn/boxrum" style="color: #999; text-decoration: none; line-height: 24px;">Github</a>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </body>
        `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return next(new Error("Error occurred while sending email."));
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export { sendVerificationEmail, sendPasswordResetEmail }