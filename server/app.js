import express from 'express';
import errorHandler from './controllers/errorController.js';
import passport from 'passport'
import configurePassport from './utils/passport.js';
import helmet from 'helmet';
import cors from 'cors'

const app = express()


// IMPORTING ROUTES
import authRouter from './routes/authRouter.js';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';

// USING MIDDLEWARES
configurePassport(passport)
app.use(passport.initialize())

app.use(helmet())
const corsOptions = {
    origin: 'https://2047854.playcode.io', // Replace with your front-end URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions))
app.set('trust proxy')
app.use(express.json())
app.use(express.static('../client'))

// CONNECTING ROUTES
app.use("/api", authRouter)
app.use("/api", postRouter)
app.use("/api", userRouter)

// GLOBAL ERROR HANDLER
app.use(errorHandler)

export default app;
