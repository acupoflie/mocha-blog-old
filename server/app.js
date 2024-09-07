import express from 'express';
import errorHandler from './controllers/errorController.js';
import passport from 'passport'
import configurePassport from './utils/passport.js';

const app = express()


// IMPORTING ROUTES
import authRouter from './routes/authRouter.js';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';

// USING MIDDLEWARES
configurePassport(passport)
app.use(passport.initialize())

app.use(express.json())
app.use(express.static('../client'))

// CONNECTING ROUTES
app.use(authRouter)
app.use(postRouter)
app.use(userRouter)

// GLOBAL ERROR HANDLER
app.use(errorHandler)

export default app;