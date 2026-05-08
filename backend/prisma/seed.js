import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const leads = [
  {
    name: 'Alice Johnson',
    company: 'Acme Corp',
    phone: '555-0100',
    status: 'Qualified',
    followUpAt: new Date('2026-05-10T09:00:00Z'),
    discussions: [
      {
        note: 'Lead created manually.',
        createdAt: new Date('2026-05-01T08:00:00Z')
      },
      {
        note: 'Sent revised proposal after call.',
        createdAt: new Date('2026-05-08T14:22:00Z'),
        followUpAt: new Date('2026-05-10T09:00:00Z')
      }
    ]
  },
  {
    name: 'Marcus Lee',
    company: 'Northwind',
    phone: '555-0111',
    status: 'Contacted',
    followUpAt: new Date('2026-05-09T15:00:00Z'),
    discussions: [
      { note: 'Intro email sent.', createdAt: new Date('2026-05-02T10:30:00Z') },
      { note: 'Left voicemail and scheduled check-in.', createdAt: new Date('2026-05-07T16:00:00Z'), followUpAt: new Date('2026-05-09T15:00:00Z') }
    ]
  },
  {
    name: 'Sofia Patel',
    company: 'Globex',
    phone: '555-0122',
    status: 'ProposalSent',
    followUpAt: new Date('2026-05-08T11:00:00Z'),
    discussions: [
      { note: 'Discovery call completed.', createdAt: new Date('2026-05-03T11:15:00Z') },
      { note: 'Proposal sent for review.', createdAt: new Date('2026-05-08T09:45:00Z') }
    ]
  },
  {
    name: 'Jordan Kim',
    company: 'Initech',
    phone: '555-0133',
    status: 'Won',
    discussions: [
      { note: 'Qualified and moving to close.', createdAt: new Date('2026-05-04T12:00:00Z') },
      { note: 'Contract signed. Deal won.', createdAt: new Date('2026-05-08T18:30:00Z') }
    ]
  },
  {
    name: 'Priya Shah',
    company: 'Umbrella',
    phone: '555-0144',
    status: 'Lost',
    discussions: [
      { note: 'Initial conversation logged.', createdAt: new Date('2026-05-02T14:00:00Z') },
      { note: 'Budget was redirected elsewhere. Marked as lost.', createdAt: new Date('2026-05-06T08:20:00Z') }
    ]
  }
]

async function main() {
  await prisma.discussion.deleteMany()
  await prisma.lead.deleteMany()

  for (const lead of leads) {
    await prisma.lead.create({
      data: {
        name: lead.name,
        company: lead.company,
        phone: lead.phone,
        status: lead.status,
        followUpAt: lead.followUpAt ?? null,
        discussions: {
          create: lead.discussions.map((discussion) => ({
            note: discussion.note,
            createdAt: discussion.createdAt,
            followUpAt: discussion.followUpAt ?? null
          }))
        }
      }
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })