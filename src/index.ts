import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { app } from './app'

const start = async () => {
  dotenv.config()

  if (!process.env.JWT_SECRET) {
    throw new Error('process.env.JWT_SECRET must be defined!')
  }

  if (!process.env.MONGO_DB) {
    throw new Error('process.env.MONGO_DB must be defined!')
  }

  await mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })

  app.listen(3000, () => {
    console.log('App is running on port: 3000')
  })
}

start()
