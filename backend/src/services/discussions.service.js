import { badRequest, notFound } from '../lib/errors.js'

const normalizeFollowUpAt = (value) => {
  if (value === undefined) return undefined
  if (value === null) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw badRequest('follow_up_at must be a valid ISO 8601 date')
  }
  return date
}

export async function addDiscussion(prisma, leadId, data) {
  const note = String(data?.note ?? '').trim()
  if (!note) {
    throw badRequest('note is required')
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) {
    throw notFound('Lead not found')
  }

  const followUpAt = normalizeFollowUpAt(data?.follow_up_at)

  const discussion = await prisma.$transaction(async (tx) => {
    const created = await tx.discussion.create({
      data: {
        leadId,
        note,
        followUpAt
      }
    })

    if (followUpAt !== undefined) {
      await tx.lead.update({
        where: { id: leadId },
        data: { followUpAt }
      })
    }

    return created
  })

  return {
    id: discussion.id,
    note: discussion.note,
    follow_up_at: discussion.followUpAt ? discussion.followUpAt.toISOString() : null,
    created_at: discussion.createdAt.toISOString()
  }
}