import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
dotenv.config()

// Basic environment validation
if (!process.env.JWT_SECRET) {
  console.error('FATAL: Missing JWT_SECRET in environment. Please define it in .env or .env.example.')
  process.exit(1)
}

import { specs } from './config/swagger.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import clientRouter from './routes/clientRoutes.js'
import invoiceRouter from './routes/invoiceRoutes.js'
import paymentRouter from './routes/paymentRoutes.js'
import actionRouter from './routes/actionRoutes.js'
import statsRouter from './routes/statsRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { dbConnect } from './config/db.js'

const app = express()

// ─── Security & Parsing ──────────────────────────────────────────────────────
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ─── Swagger Docs ─────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ success: true, message: 'Billing API is running', version: '0.1.0' })
})
// Simple health endpoint for root or external checks
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok' })
})

// ─── API Routes ───────────────────────────────────────────────────────────────
// Health check root (no auth required)
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Billing API is running' })
})
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/clients', clientRouter)
app.use('/api/invoices', invoiceRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/actions', actionRouter)
app.use('/api/stats', statsRouter)

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` })
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler)

// ─── DB connection (init at startup) ─────────────────────────────────────────
export const initApp = async () => {
  await dbConnect()
  return app
}

export default app
