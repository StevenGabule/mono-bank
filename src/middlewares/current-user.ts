import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User, UserDoc } from '../models/user'

interface UserPayload {
  id: string
  name: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDoc
    }
  }
}

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next()
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET!) as UserPayload
    const user = await User.findById(payload.id)
    if (user) {
      req.currentUser = user
    }
  } catch (error: any) {
    console.log(error.message)
  }
  next()
}
