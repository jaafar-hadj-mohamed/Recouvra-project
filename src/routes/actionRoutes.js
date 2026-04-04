import { Router } from 'express'
import { createAction, getActions } from '../controllers/actionController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = Router()
router.use(authenticateToken)
router.post('/', createAction)
router.get('/', getActions)
export default router
