import { UserDoc } from './user'
import mongoose from 'mongoose'

interface CardAttrs {
  balance?: Number
  user: UserDoc
}

export interface CardDoc extends mongoose.Document {
  balance: any
  number: string
  user: UserDoc
  createdAt: Date
  updatedAt: Date
}

interface CardModel extends mongoose.Model<CardDoc> {
  build(attrs: CardAttrs): CardDoc
}

const cardSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  number: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  toJSON: {
    transform(_, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.user
      delete ret.__v
    }
  }
})

cardSchema.statics.build = (attrs: CardAttrs) => {
  return new Card(attrs)
}

const makeNumber = (): string => {
  let number: string = ''
  for (let i = 0; i < 16; i++) {
    number += Math.floor(Math.random() * 10)
  }
  return number
}

cardSchema.pre('save', async function (done) {
  this.set('number', makeNumber())
  done()
})

const Card = mongoose.model<CardDoc, CardModel>('Card', cardSchema)

export { Card }
