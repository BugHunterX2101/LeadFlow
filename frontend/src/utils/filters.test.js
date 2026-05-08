import { describe, expect, it } from 'vitest'
import { applyLeadFilters, formatPreview, getTodayFollowUps } from './filters.js'
import { formatRelativeTime, isSameLocalDay } from './date.js'

describe('LeadFlow utilities', () => {
  it('filters by status and search', () => {
    const leads = [
      { name: 'Alice Johnson', status: 'Qualified' },
      { name: 'Marcus Lee', status: 'Contacted' },
      { name: 'Alicia Keys', status: 'Qualified' }
    ]

    expect(applyLeadFilters(leads, 'Qualified', 'ali')).toHaveLength(2)
    expect(applyLeadFilters(leads, 'Contacted', '')).toEqual([{ name: 'Marcus Lee', status: 'Contacted' }])
  })

  it('identifies today follow-ups', () => {
    const today = new Date('2026-05-09T12:00:00Z')
    const leads = [
      { follow_up_at: '2026-05-09T15:00:00Z' },
      { follow_up_at: '2026-05-10T10:00:00Z' },
      { follow_up_at: null }
    ]

    expect(getTodayFollowUps(leads, today)).toHaveLength(1)
    expect(isSameLocalDay('2026-05-09T01:00:00Z', today)).toBe(true)
  })

  it('formats previews and relative dates', () => {
    expect(formatPreview('  hello   world  ')).toBe('hello world')
    expect(formatRelativeTime('2026-05-08T12:00:00Z', new Date('2026-05-09T12:00:00Z'))).toBe('1 day ago')
  })
})