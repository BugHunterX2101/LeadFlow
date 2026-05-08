import cors from 'cors'
import express from 'express'
import { createLeadsRouter } from './routes/leads.js'
import { errorHandler } from './middleware/errorHandler.js'

export function createApp(prisma) {
  const app = express()

  // Configure CORS with restricted origins
  const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
      ]
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  }
  app.use(cors(corsOptions))
  app.use(express.json({ limit: '10mb' }))

  app.get('/health', (req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/leads', createLeadsRouter(prisma))

  app.use(errorHandler)

  return app
}