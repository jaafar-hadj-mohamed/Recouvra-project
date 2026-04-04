import { Router } from 'express'
import { createUser, getUsers } from '../controllers/userController.js'
import { conditionalAuth, requireAdminIfAuth } from '../middlewares/authMiddleware.js'
import User from '../models/User.js'

const router = Router()
// Chain: allow first user bootstrap (no auth), otherwise require auth and admin role
router.post('/', async (req, res, next) => {
  const count = await User.countDocuments()
  if (count === 0) {
    return next()
  }
  return conditionalAuth(req, res, next)
}, requireAdminIfAuth, createUser)
// Fallback for listing users (still protected by auth as configured by conditionalAuth)
router.get('/', conditionalAuth, getUsers)

export default router
