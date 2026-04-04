import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { successResponse, errorResponse } from '../utils/responseHandler.js'
import { login } from '../services/authService.js'

export const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body
    // basic validation via Joi in route (validators can be wired later)
    const user = await User.findOne({ email })
    if (!user) return errorResponse(res, 'Invalid email or password', null, 401)
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return errorResponse(res, 'Invalid email or password', null, 401)
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' })
    return successResponse(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful')
  } catch (e) {
    return next(e)
  }
}

export default { loginHandler }
