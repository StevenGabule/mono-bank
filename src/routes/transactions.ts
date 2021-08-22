import express, { Request, Response } from 'express'
import { requireAuth } from '../middlewares/require-auth'
import { Card } from '../models/card'
import { Transaction } from '../models/transaction'

const router = express.Router()

router.post('/api/deposit', requireAuth, async (req: Request, res: Response) => {
  try {
    const { amount, cardId } = req.body
    const card = await Card.findOne({ user: req.currentUser!, _id: cardId })

    if (card) {
      card.balance = card.balance + amount
      await card.save()

      await Transaction.build({
        user: req.currentUser!,
        card,
        amount,
        rest: card.balance,
        description: `Deposit amount: ${amount} usd card: ${card.balance}`
      }).save()
      return res.status(400).send(card)
    }
    return res.status(400).send({ error: 'card not found!' })
  } catch (error) {
    console.log(error.message)
    return res.send(error.message)
  }
})

router.post('/api/withdraw', requireAuth, async (req: Request, res: Response) => {
  try {
    const { amount, cardId } = req.body
    const card = await Card.findOne({ user: req.currentUser!, _id: cardId })

    if (card) {
      if ((card.balance - amount) < 0) {
        return res.status(400).send({
          error: 'Limit on the card'
        })
      }
      card.balance = card.balance - amount
      await card.save()

      await Transaction.build({
        user: req.currentUser!,
        card,
        amount,
        rest: card.balance,
        description: `Deposit amount: ${amount} usd card: ${card.balance}`
      }).save()
      return res.status(400).send(card)
    }
    return res.status(400).send({ error: 'card not found!' })
  } catch (error) {
    console.log(error.message)
    return res.send(error.message)
  }
})

router.post('/api/p2p', requireAuth, async (req: Request, res: Response) => {
  try {
    const { amount, cardFrom, cardTo } = req.body
    const sender = await Card.findOne({
      user: req.currentUser!,
      _id: cardFrom
    }).populate('user')

    if (!sender) {
      return res.status(400).send({ error: 'Card from not found!' })
    }

    const recipient = await Card.findById({ _id: cardTo }).populate('user')

    if (!recipient) {
      return res.status(400).send({ error: 'Card to not found!' })
    }

    if ((sender.balance - amount) < 0) {
      return res.status(400).send({ error: 'Limit no the card' })
    }

    sender.balance = sender.balance - amount
    await sender.save()

    await Transaction.build({
      user: sender.user!,
      card: sender,
      recipient,
      sender,
      amount,
      rest: sender.balance,
      description: `P2P amount: ${amount} USD card: ${recipient.number}`
    }).save()

    recipient.balance = recipient.balance + amount
    await recipient.save()

    await Transaction.build({
      user: recipient.user,
      card: recipient,
      sender,
      amount,
      rest: recipient.balance,
      description: `P2P amount: ${amount} USD card: ${recipient.number}`
    }).save()

    res.status(200).send({ status: true })
  } catch (error) {
    console.log(error.message)
    return res.send(error.message)
  }
})

export { router as transactionRouter }
