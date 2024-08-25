import express from 'express';
import errorHandler from './controllers/errorController.js';

const app = express()

import authRouter from './routes/authRouter.js';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';

app.use(express.json())
app.use(express.static('../client'))

app.use(authRouter)
app.use(postRouter)
app.use(userRouter)

app.use(errorHandler)

export default app;