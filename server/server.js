
import { MONGO_IP, MONGO_PORT } from './config.js'

import dotenv from 'dotenv'
dotenv.config({path: './config.env'})
// console.log(process.env)

import app from './app.js'
import mongoose from 'mongoose'

mongoose.connect(MONGO_IP).then((res) => {
    console.log('db connection successfull')
})

app.listen(MONGO_PORT, () => {
    console.log('server has started')
})
