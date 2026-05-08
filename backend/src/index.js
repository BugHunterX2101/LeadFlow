import 'dotenv/config'
import { createApp } from './app.js'
import { prisma } from './lib/prisma.js'
import { env } from './lib/env.js'

const port = Number(env.PORT ?? 3001)
const app = createApp(prisma)

const server = app.listen(port, () => {
  console.log(`LeadFlow API listening on http://localhost:${port}`)
})

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received, shutting down gracefully...`)
  
  server.close(async () => {
    try {
      await prisma.$disconnect()
      console.log('Prisma disconnected')
      process.exit(0)
    } catch (error) {
      console.error('Error during shutdown:', error)
      process.exit(1)
    }
  })

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout')
    process.exit(1)
  }, 30000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
