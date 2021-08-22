import express, { Request, Response } from 'express'
import { Card } from '../models/card'
import { requireAuth } from '../middlewares/require-auth'

const router = express.Router()

router.post('/api/cards', requireAuth, async (req: Request, res: Response) => {
  const card = await Card.build({ user: req.currentUser! }).save()
  return res.status(201).send(card)
})

router.get('/api/cards', async (req: Request, res: Response) => {
  const cards = await Card.find({ user: req.currentUser! })
  return res.status(200).send(cards)
})

export { router as cardsRouter }
