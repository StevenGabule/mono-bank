import { CardDoc } from './card'
import { UserDoc } from './user'
import mongoose from 'mongoose'

interface TransactionAttrs {
  recipient?: CardDoc
  sender?: CardDoc
  card: CardDoc
  amount?: number
  rest?: number
  description?: string
  user: UserDoc
}

export interface TransactionDoc extends mongoose.Document {
  amount: Number
  rest: Number
  createdAt: Date
  description: String
  card: CardDoc
  recipient: CardDoc
  sender: CardDoc
  user: UserDoc
  updatedAt: Date
}

interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc
}

const transactionSchema = new mongoose.Schema({
  rest: { type: Number },
  amount: { type: Number },
  description: { type: String },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
  card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  toJSON: {
    transform(_, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    }
  }
})

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs)
}

const Transaction = mongoose.model<TransactionDoc, TransactionModel>('Transaction', transactionSchema)

export { Transaction }
