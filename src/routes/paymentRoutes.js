import { Router } from 'express'
import { createPayment } from '../controllers/paymentController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = Router()
router.use(authenticateToken)
router.post('/', createPayment)
export default router
