import dotenv from 'dotenv';
dotenv.config()

import path from 'path';
import { fileURLToPath } from 'url';

import http from 'http';
import express from 'express';
import cors from 'cors';

import { rateLimit } from 'express-rate-limit';
import createHttpError from 'http-errors';

import DB from './modules/DB.js';

import authRouter from './routes/auth.js';
import apiRouter from './routes/api.js';
import router from './routes/index.js';
import socket from './modules/socket/index.js';

const app = express();
const httpServer = http.createServer(app);
// const server = httpServer.listen(process.env.PORT || 8000);
const io = socket(httpServer, {
    cors: {
        origin: '*',
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '..', '/public')));
app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: {
        error: {
            status: 429,
            message: 'Too many requests per minute'
        }
    }
});

app.use((req, res, next) => {
    req.io = io
    next()
})

app.use('/auth', limiter);
app.use('/api', limiter);

app.use('/', router)
app.use('/auth', authRouter)
app.use('/api', apiRouter)

app.use((req, res, next) => {
    next(createHttpError.NotFound())
});

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
});

const port = process.env.PORT || 8000;

DB().then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen({ port }, () => {
        console.log(`Server run on ${process.env.BACKEND}`)
    })
}).catch((err) => console.error('Error connecting to MongoDB:', err))