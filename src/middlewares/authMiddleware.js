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

// Admin check guard for authenticated requests
export const requireAdminIfAuth = (req, res, next) => {
  // If not authenticated yet (no req.user), skip (first-user bootstrap path)
  if (!req.user) return next()
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: admin-only' })
  }
  next()
}

// Conditional auth: allow first user creation without auth when DB has zero users
export const conditionalAuth = async (req, res, next) => {
  try {
    const count = await User.countDocuments()
    if (count === 0) {
      // No users yet: skip auth for this request (used for first admin creation)
      return next()
    }
  } catch (e) {
    // If we can't determine user count, fall back to requiring auth
  }
  return authenticateToken(req, res, next)
}
