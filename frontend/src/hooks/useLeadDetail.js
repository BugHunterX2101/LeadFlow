import { useEffect, useRef, useState } from 'react'
import { addDiscussion, getLead, updateLead } from '../api/leadflow.js'

export function useLeadDetail(leadId, isOpen, onMutate) {
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const cancelRef = useRef(false)

  const refresh = async () => {
    if (!leadId || !isOpen) return
    cancelRef.current = false
    setLoading(true)
    setError('')
    try {
      const data = await getLead(leadId)
      if (!cancelRef.current) setLead(data)
    } catch (cause) {
      if (!cancelRef.current) setError(cause.message || 'Failed to load lead')
    } finally {
      if (!cancelRef.current) setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
    return () => { cancelRef.current = true }
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