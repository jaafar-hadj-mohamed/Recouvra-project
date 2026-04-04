import { Router } from 'express'
import { createInvoice, getInvoices, updateInvoice } from '../controllers/invoiceController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = Router()
router.use(authenticateToken)
router.post('/', createInvoice)
router.get('/', getInvoices)
router.put('/:id', updateInvoice)
export default router
