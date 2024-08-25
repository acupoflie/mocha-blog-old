
import dotenv from 'dotenv'
dotenv.config({path: './config.env'})

import app from './app.js'
import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_CONN_STR).then((res) => {
    console.log('db connection successfull')
})

app.listen(process.env.PORT || 3554, () => {
    console.log('server has started')
})
