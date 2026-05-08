import { useEffect, useMemo, useState } from 'react'
import { createLead, getLeads, updateLead } from '../api/leadflow.js'
import { applyLeadFilters } from '../utils/filters.js'

function sortByUpdatedAt(leads) {
  return [...leads].sort((left, right) => new Date(right.updated_at) - new Date(left.updated_at))
}

export function useLeads(filters) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getLeads()
      setLeads(sortByUpdatedAt(data))
    } catch (cause) {
      setError(cause.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const filteredLeads = useMemo(
    () => applyLeadFilters(leads, filters.status, filters.search),
    [leads, filters.status, filters.search]
  )

  const createAndStoreLead = async (payload) => {
    const lead = await createLead(payload)
    setLeads((current) => sortByUpdatedAt([lead, ...current]))
    return lead
  }

  const updateAndStoreLead = async (id, payload) => {
    const lead = await updateLead(id, payload)
    setLeads((current) => sortByUpdatedAt(current.map((item) => (item.id === id ? lead : item))))
    return lead
  }

  return {
    leads: filteredLeads,
    allLeads: leads,
    loading,
    error,
    refresh,
    createLead: createAndStoreLead,
    updateLead: updateAndStoreLead,
    setLeads
  }
}