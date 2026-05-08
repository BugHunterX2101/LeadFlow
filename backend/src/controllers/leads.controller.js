import { createLead, getLeadById, listLeads, updateLead } from '../services/leads.service.js'

export const createLeadsController = (prisma) => ({
  list: async (req, res, next) => {
    try {
      const leads = await listLeads(prisma, req.query)
      res.json(leads)
    } catch (error) {
      next(error)
    }
  },
  getById: async (req, res, next) => {
    try {
      const lead = await getLeadById(prisma, req.params.id)
      res.json(lead)
    } catch (error) {
      next(error)
    }
  },
  create: async (req, res, next) => {
    try {
      const lead = await createLead(prisma, req.body)
      res.status(201).json(lead)
    } catch (error) {
      next(error)
    }
  },
  update: async (req, res, next) => {
    try {
      const lead = await updateLead(prisma, req.params.id, req.body)
      res.json(lead)
    } catch (error) {
      next(error)
    }
  }
})