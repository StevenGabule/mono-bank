import express from 'express'
import cookieSession from 'cookie-session'

import { currentUser } from './middlewares/current-user'
import { authRouter } from './routes/auth'
import { cardsRouter } from './routes/cards'
import { transactionRouter } from './routes/transactions'

const app = express()

app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieSession({
  signed: false,
  secure: false
}))

app.use(authRouter)
app.use(currentUser)
app.use(cardsRouter)
app.use(transactionRouter)

app.get('*', async () => {
  throw new Error('Route not exists')
})

export { app }
