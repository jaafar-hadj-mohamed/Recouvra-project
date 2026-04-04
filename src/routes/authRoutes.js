import { Router } from 'express'
import { loginHandler } from '../controllers/authController.js'

const router = Router()

/**
 * @openapi
 * /api/auth/login:
 *   post:
   *     description: User login
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
       *       200:
   *         description: token
 */
router.post('/login', loginHandler)

export default router
