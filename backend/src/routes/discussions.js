import { Router } from 'express'
import { createDiscussionsController } from '../controllers/discussions.controller.js'
import { validateInput } from '../middleware/validation.js'

export function createDiscussionsRouter(prisma) {
  const router = Router({ mergeParams: true })
  const controller = createDiscussionsController(prisma)

  router.post('/', validateInput({ note: true, followUpAt: false }), controller.create)

  return router
}