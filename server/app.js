import express from 'express';
import errorHandler from './controllers/errorController.js';
import passport from 'passport'
import { jwtStrategy } from './utils/passport.js';

const app = express()


// IMPORTING ROUTES
import authRouter from './routes/authRouter.js';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';

// USING MIDDLEWARES
app.use(express.json())
app.use(express.static('../client'))

passport.use(jwtStrategy)
app.use(passport.initialize())

// CONNECTING ROUTES
app.use(authRouter)
app.use(postRouter)
app.use(userRouter)

// GLOBAL ERROR HANDLER
app.use(errorHandler)

export default app;