import express from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword, resendVerificationEmail } from '../modules/controllers/authController.js'
import { dcLogin, fbLogin } from '../modules/controllers/integrationsAuthController.js';
const authRouter = express.Router();


authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/resend-verify-email', resendVerificationEmail)
authRouter.post('/verify-email', verifyEmail)
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/discord', dcLogin)
authRouter.post('/facebook', fbLogin)

authRouter.get('/', (req, res) => {
    res.json({ route: 'Auth router' })
})

export default authRouter;
