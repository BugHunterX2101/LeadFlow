import { isSameLocalDay, isOverdue } from './date.js'

export function applyLeadFilters(leads, status, search) {
  const searchTerm = search.trim().toLowerCase()
  return leads.filter((lead) => {
    const matchesStatus = status === 'All' || lead.status === status
    const matchesSearch = !searchTerm || lead.name.toLowerCase().includes(searchTerm)
    return matchesStatus && matchesSearch
  })
}

export function getTodayFollowUps(leads, now = new Date()) {
  return leads
    .filter((lead) => lead.follow_up_at && isSameLocalDay(lead.follow_up_at, now))
    .sort((left, right) => new Date(left.follow_up_at) - new Date(right.follow_up_at))
}

export function getLeadFollowUpState(lead, now = new Date()) {
  if (!lead.follow_up_at) return { due: false, overdue: false }
  return {
    due: true,
    overdue: isOverdue(lead.follow_up_at, now)
  }
}

export function formatPreview(text, maxLength = 80) {
  if (!text) return 'No discussion yet.'
  const compact = text.replace(/\s+/g, ' ').trim()
  return compact.length > maxLength ? `${compact.slice(0, maxLength - 1)}…` : compact
}