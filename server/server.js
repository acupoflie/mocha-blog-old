
import { MONGO_IP, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } from './config.js'

import dotenv from 'dotenv'
dotenv.config({path: './config.env'})
// console.log(process.env)

import app from './app.js'
import mongoose from 'mongoose'

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
mongoose.connect(mongoURL).then((res) => {
    console.log('db connection successfull')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`server has started on port ${port}`)
})
