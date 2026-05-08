import { Router } from 'express'
import { createLeadsController } from '../controllers/leads.controller.js'
import { createDiscussionsRouter } from './discussions.js'
import { validateInput } from '../middleware/validation.js'

export function createLeadsRouter(prisma) {
  const router = Router()
  const controller = createLeadsController(prisma)

  router.get('/', controller.list)
  router.post('/', validateInput({ name: true, company: false, phone: false, status: false }), controller.create)
  router.get('/:id', controller.getById)
  router.patch('/:id', validateInput({ name: false, company: false, phone: false, status: false }), controller.update)
  router.use('/:id/discussions', createDiscussionsRouter(prisma))

  return router
}