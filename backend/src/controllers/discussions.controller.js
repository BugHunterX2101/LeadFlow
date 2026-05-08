import { addDiscussion } from '../services/discussions.service.js'

export const createDiscussionsController = (prisma) => ({
  create: async (req, res, next) => {
    try {
      const discussion = await addDiscussion(prisma, req.params.id, req.body)
      res.status(201).json(discussion)
    } catch (error) {
      next(error)
    }
  }
})