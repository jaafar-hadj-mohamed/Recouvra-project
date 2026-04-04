import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { successResponse, errorResponse } from '../utils/responseHandler.js'

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    // If there are no users yet, force this user to admin role
    const count = await User.countDocuments()
    const finalRole = (count === 0) ? 'admin' : (role || 'agent')
    const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10)
    const user = await User.create({ name, email, password: hash, role: finalRole })
    return successResponse(res, { id: user._id, name: user.name, email: user.email, role: user.role }, 'User created')
  } catch (e) {
    return next(e)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password')
    return successResponse(res, users, 'Users retrieved')
  } catch (e) {
    return next(e)
  }
}

export default { createUser, getUsers }
