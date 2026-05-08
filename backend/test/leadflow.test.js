import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import request from 'supertest'
import { createApp } from '../src/app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const backendDir = path.resolve(__dirname, '..')
const prismaCli = path.join(backendDir, 'node_modules', '.bin', process.platform === 'win32' ? 'prisma.cmd' : 'prisma')
const defaultTestDatabaseUrl = 'postgresql://leadflow:leadflow@postgres:5432/leadflow?schema=public'

let prisma
let app
let PrismaClient

beforeAll(async () => {
  process.env.DATABASE_URL = defaultTestDatabaseUrl
  const commandOptions = {
    cwd: backendDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: defaultTestDatabaseUrl
    }
  }

  execSync(`"${prismaCli}" generate --schema prisma/schema.prisma`, commandOptions)
  execSync(`"${prismaCli}" db push --schema prisma/schema.prisma --skip-generate`, commandOptions)
  execSync('node prisma/seed.js', commandOptions)
  ;({ PrismaClient } = await import('@prisma/client'))
  prisma = new PrismaClient()
  app = createApp(prisma)
})

afterAll(async () => {
  await prisma?.$disconnect()
})

describe('LeadFlow API', () => {
  it('lists leads with summaries and supports filters', async () => {
    const response = await request(app).get('/api/leads').expect(200)
    expect(response.body).toHaveLength(5)
    expect(response.body[0]).toHaveProperty('last_note')

    const filtered = await request(app).get('/api/leads?status=Qualified').expect(200)
    expect(filtered.body.every((lead) => lead.status === 'Qualified')).toBe(true)
  })

  it('creates a lead and appends a system note', async () => {
    const created = await request(app)
      .post('/api/leads')
      .send({ name: 'Test Lead', company: 'Demo Co', phone: '555-0199', status: 'New' })
      .expect(201)

    expect(created.body.name).toBe('Test Lead')

    const detail = await request(app).get(`/api/leads/${created.body.id}`).expect(200)
    expect(detail.body.discussions[0].note).toBe('Lead created manually.')
  })

  it('returns a full lead with discussions and accepts new notes', async () => {
    const [firstLead] = await request(app).get('/api/leads').expect(200).then((res) => res.body)
    const detail = await request(app).get(`/api/leads/${firstLead.id}`).expect(200)
    expect(detail.body.discussions.length).toBeGreaterThan(0)

    const discussion = await request(app)
      .post(`/api/leads/${firstLead.id}/discussions`)
      .send({ note: 'Follow-up scheduled', follow_up_at: '2026-05-11T10:00:00Z' })
      .expect(201)

    expect(discussion.body.note).toBe('Follow-up scheduled')

    const updated = await request(app).get(`/api/leads/${firstLead.id}`).expect(200)
    expect(updated.body.follow_up_at).toBe('2026-05-11T10:00:00.000Z')
    expect(updated.body.discussions[0].note).toBe('Follow-up scheduled')
  })

  it('updates status and follow-up time', async () => {
    const [firstLead] = await request(app).get('/api/leads').expect(200).then((res) => res.body)
    const updated = await request(app)
      .patch(`/api/leads/${firstLead.id}`)
      .send({ status: 'Contacted', follow_up_at: '2026-05-12T09:00:00Z' })
      .expect(200)

    expect(updated.body.status).toBe('Contacted')
    expect(updated.body.follow_up_at).toBe('2026-05-12T09:00:00.000Z')
  })

  it('rejects invalid input and missing leads', async () => {
    await request(app).post('/api/leads').send({}).expect(400)
    await request(app).get('/api/leads/does-not-exist').expect(404)
  })
})