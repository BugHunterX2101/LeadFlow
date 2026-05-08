import { useEffect, useState } from 'react'
import { addDiscussion, getLead, updateLead } from '../api/leadflow.js'

export function useLeadDetail(leadId, isOpen, onMutate) {
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = async () => {
    if (!leadId || !isOpen) return
    setLoading(true)
    setError('')
    try {
      const data = await getLead(leadId)
      setLead(data)
    } catch (cause) {
      setError(cause.message || 'Failed to load lead')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [leadId, isOpen])

  const saveStatus = async (status) => {
    const updated = await updateLead(leadId, { status })
    await refresh()
    onMutate?.()
    return updated
  }

  const saveDiscussion = async (payload) => {
    if (payload.status && payload.status !== lead?.status) {
      await updateLead(leadId, { status: payload.status })
    }
    await addDiscussion(leadId, payload)
    await refresh()
    onMutate?.()
  }

  return { lead, loading, error, refresh, saveStatus, saveDiscussion, setLead }
}