import express from 'express';
const app = express()

import authRouter from './routes/authRouter.js';

app.use(express.json())
app.use(express.static('../client'))

app.use(authRouter)

export default app;