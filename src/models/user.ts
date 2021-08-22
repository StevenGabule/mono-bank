import { Password } from './../services/password'
import mongoose from 'mongoose'

interface UserAttrs {
  name: string
  email: string
  password: string
}

export interface UserDoc extends mongoose.Document {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform(_, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password
      delete ret.__v
    }
  }
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }

  done()
})

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
