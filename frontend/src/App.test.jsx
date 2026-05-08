import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

const leadList = [
  {
    id: 'lead-1',
    name: 'Alice Johnson',
    company: 'Acme Corp',
    phone: '555-0100',
    status: 'Qualified',
    follow_up_at: '2026-05-10T09:00:00.000Z',
    created_at: '2026-05-08T18:43:52.893Z',
    updated_at: '2026-05-08T18:43:52.893Z',
    last_note: { note: 'Sent revised proposal after call.', created_at: '2026-05-08T14:22:00.000Z' }
  }
]

const leadDetail = {
  ...leadList[0],
  discussions: [
    {
      id: 'discussion-1',
      note: 'Sent revised proposal after call.',
      follow_up_at: '2026-05-10T09:00:00.000Z',
      created_at: '2026-05-08T14:22:00.000Z'
    }
  ]
}

describe('App smoke test', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async (url) => {
      if (String(url).includes('/api/leads/lead-1')) {
        return { ok: true, json: async () => leadDetail }
      }

      if (String(url).includes('/api/leads')) {
        return { ok: true, json: async () => leadList }
      }

      return { ok: true, json: async () => ({}) }
    }))
  })

  it('renders the lead list and opens a timeline modal', async () => {
    render(<App />)

    expect(await screen.findByText('LeadFlow')).toBeInTheDocument()
    expect(await screen.findByText('Alice Johnson')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /alice johnson/i }))

    const dialog = await screen.findByRole('dialog', { name: /timeline for alice johnson/i })
    expect(within(dialog).getByRole('heading', { name: 'Alice Johnson' })).toBeInTheDocument()
    expect(within(dialog).getByText('Sent revised proposal after call.')).toBeInTheDocument()
  })
})