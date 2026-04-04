import { Router } from 'express'
import { createClient, getClients, getClientById, updateClient, deleteClient } from '../controllers/clientController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = Router()
router.use(authenticateToken)
router.post('/', createClient)
router.get('/', getClients)
router.get('/:id', getClientById)
router.put('/:id', updateClient)
router.delete('/:id', deleteClient)
export default router
