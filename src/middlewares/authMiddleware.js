import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' })
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Forbidden' })
    req.user = user
    next()
  })
}

export const authorizeRoles = (...allowed) => {
  return (req, res, next) => {
    const userRole = req.user?.role
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' })
    }
    next()
  }
}
