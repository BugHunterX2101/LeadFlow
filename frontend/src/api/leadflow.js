const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

async function requestJSON(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const message = payload?.error ?? `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload
}

export function getLeads(query = {}) {
  const params = new URLSearchParams()
  if (query.status && query.status !== 'All') params.set('status', query.status)
  if (query.search) params.set('search', query.search)
  const suffix = params.toString() ? `?${params.toString()}` : ''
  return requestJSON(`/api/leads${suffix}`)
}

export function getLead(id) {
  return requestJSON(`/api/leads/${id}`)
}

export function createLead(payload) {
  return requestJSON('/api/leads', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateLead(id, payload) {
  return requestJSON(`/api/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
}

export function addDiscussion(id, payload) {
  return requestJSON(`/api/leads/${id}/discussions`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}