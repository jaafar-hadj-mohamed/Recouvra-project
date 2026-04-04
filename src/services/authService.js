import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const login = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Invalid email or password')
  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid email or password')
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' })
  return { token, user }
}
