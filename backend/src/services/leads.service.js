import { badRequest, notFound } from '../lib/errors.js'

const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'ProposalSent', 'Won', 'Lost']

const normalizeFollowUpAt = (value, fieldName) => {
  if (value === undefined) return undefined
  if (value === null) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw badRequest(`${fieldName} must be a valid ISO 8601 date`)
  }
  return date
}

const serializeLeadListItem = (lead) => ({
  id: lead.id,
  name: lead.name,
  company: lead.company,
  phone: lead.phone,
  status: lead.status,
  follow_up_at: lead.followUpAt ? lead.followUpAt.toISOString() : null,
  created_at: lead.createdAt.toISOString(),
  updated_at: lead.updatedAt.toISOString(),
  last_note: lead.discussions[0]
    ? {
        note: lead.discussions[0].note,
        created_at: lead.discussions[0].createdAt.toISOString()
      }
    : null
})

const serializeLeadDetail = (lead) => ({
  id: lead.id,
  name: lead.name,
  company: lead.company,
  phone: lead.phone,
  status: lead.status,
  follow_up_at: lead.followUpAt ? lead.followUpAt.toISOString() : null,
  created_at: lead.createdAt.toISOString(),
  updated_at: lead.updatedAt.toISOString(),
  discussions: lead.discussions.map((discussion) => ({
    id: discussion.id,
    note: discussion.note,
    follow_up_at: discussion.followUpAt ? discussion.followUpAt.toISOString() : null,
    created_at: discussion.createdAt.toISOString()
  }))
})

export async function listLeads(prisma, query = {}) {
  const { status, search } = query
  const where = {}

  if (status && status !== 'All') {
    if (!VALID_STATUSES.includes(status)) {
      throw badRequest('Invalid status filter')
    }
    where.status = status
  }

  if (search) {
    where.name = { contains: String(search), mode: 'insensitive' }
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      discussions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { note: true, createdAt: true }
      }
    }
  })

  return leads.map(serializeLeadListItem)
}

export async function getLeadById(prisma, id) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      discussions: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          note: true,
          followUpAt: true,
          createdAt: true
        }
      }
    }
  })

  if (!lead) {
    throw notFound('Lead not found')
  }

  return serializeLeadDetail(lead)
}

export async function createLead(prisma, data) {
  const name = String(data?.name ?? '').trim()
  if (!name) {
    throw badRequest('name is required')
  }
  if (name.length > 200) {
    throw badRequest('name must be 200 characters or fewer')
  }

  const status = data?.status ?? 'New'
  if (!VALID_STATUSES.includes(status)) {
    throw badRequest('Invalid status')
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      company: data?.company?.trim() || null,
      phone: data?.phone?.trim() || null,
      status,
      discussions: {
        create: [{ note: 'Lead created manually.' }]
      }
    },
    include: {
      discussions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { note: true, createdAt: true }
      }
    }
  })

  return serializeLeadListItem(lead)
}

export async function updateLead(prisma, id, data) {
  const existing = await prisma.lead.findUnique({ where: { id } })
  if (!existing) {
    throw notFound('Lead not found')
  }

  const payload = {}
  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status)) {
      throw badRequest('Invalid status')
    }
    payload.status = data.status
  }

  if (data.follow_up_at !== undefined) {
    payload.followUpAt = normalizeFollowUpAt(data.follow_up_at, 'follow_up_at')
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: payload,
    include: {
      discussions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { note: true, createdAt: true }
      }
    }
  })

  return serializeLeadListItem(lead)
}

export { VALID_STATUSES }