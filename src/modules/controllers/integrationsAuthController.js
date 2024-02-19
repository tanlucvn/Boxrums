import express from 'express';
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import { signAccessToken } from '../utils/jwt.js';


const dcLogin = async (req, res, next) => {
    try {
        const { code } = req.query;
        const redirectUri = `${process.env.CLIENT}/auth/discord`

        const params = new URLSearchParams();
        params.append('client_id', process.env.DC_ID);
        params.append('client_secret', process.env.DC_SECRET);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', redirectUri);
        params.append('scope', 'identify email');

        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();

        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${data.access_token}`,
            },
        });

        const userData = await userResponse.json();

        const existingUser = await User.findOne({ email: userData.email });

        if (existingUser) {
            const accessToken = await signAccessToken(existingUser);
            return res.json({ user: existingUser, accessToken });
        }

        const newUser = new User({
            name: userData.username,
            displayName: userData.username,
            email: userData.email,
            password: generateRandomPassword(10),
            createdAt: new Date().toISOString(),
        });

        const savedUser = await newUser.save();
        const accessToken = await signAccessToken(savedUser);

        return res.json({
            user: {
                id: user._id,
                name: user.name,
                displayName: user.displayName,
                picture: user.picture,
                role: user.role
            },
            accessToken
        });
    } catch (error) {
        return next(error);
    }
};

const fbLogin = async (req, res, next) => {
    try {
        const { code } = req.query;
        const redirectUri = `${process.env.CLIENT}/auth/facebook`;

        const params = new URLSearchParams();
        params.append('client_id', process.env.FB_ID);
        params.append('client_secret', process.env.FB_SECRET);
        params.append('redirect_uri', redirectUri);
        params.append('code', code);

        const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();

        // Lấy thông tin người dùng từ Facebook API
        const userData = await getUserData(data.access_token);

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            const accessToken = await signAccessToken(existingUser);
            return res.json({ user: existingUser, accessToken });
        }

        const newUser = new User({
            name: userData.username,
            displayName: userData.username,
            email: userData.email,
            password: generateRandomPassword(10),
            createdAt: new Date().toISOString(),
        });

        const savedUser = await newUser.save();
        const accessToken = await signAccessToken(savedUser);

        return res.json({
            user: {
                id: user._id,
                name: user.name,
                displayName: user.displayName,
                picture: user.picture,
                role: user.role
            },
            accessToken
        });
    } catch (error) {
        return next(error);
    }
};


const generateRandomPassword = (length) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < length; ++i) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

const getUserData = async (accessToken) => {
    const url = `https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        const userData = await response.json();
        return userData;
    } catch (error) {
        throw new Error('Error fetching user data from Facebook API');
    }
};

export { dcLogin, fbLogin };