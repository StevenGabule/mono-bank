import express, { Request, Response } from 'express'
import { Password } from './../services/password'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'

import { currentUser } from '../middlewares/current-user'

const router = express.Router()

router.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).send({ error: 'Email is already used!' })
  }

  const user = User.build({ name, email, password })
  await user.save()

  const userJwt = jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email
  }, process.env.JWT_SECRET!)

  req.session = {
    jwt: userJwt
  }
  return res.status(201).send(user)
})

router.post('/api/auth/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body
  const existingUser = await User.findOne({ email })

  if (!existingUser) {
    return res.status(400).send({ error: 'Invalid credentials' })
  }

  const passwordMatch = await Password.compare(existingUser.password, password)
  if (!passwordMatch) {
    return res.status(400).send({ error: 'Invalid credentials' })
  }

  const userJwt = jwt.sign({
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email
  }, process.env.JWT_SECRET!)

  req.session = {
    jwt: userJwt
  }
  return res.status(200).send(existingUser)
})

router.post('/api/auth/signout', async (req: Request, res: Response) => {
  req.session = null
  res.send({})
})

router.post('/api/auth/me', currentUser, async (req: Request, res: Response) => {
  return res.send({ currentUser: req.currentUser || null })
})

export { router as authRouter }
