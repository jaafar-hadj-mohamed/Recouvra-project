import { Router } from 'express'
import { createUser, getUsers } from '../controllers/userController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = Router()

router.use(authenticateToken)

router.post('/', createUser)
router.get('/', getUsers)

export default router
