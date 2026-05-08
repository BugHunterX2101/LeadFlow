import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { Modal } from '../ui/Modal.jsx'
import { StatusBadge } from '../ui/StatusBadge.jsx'
import { FollowUpBadge } from '../ui/FollowUpBadge.jsx'
import { formatAbsoluteDateTime, formatRelativeTime } from '../../utils/date.js'
import { STATUS_META } from '../../types/index.js'
import { getLeadFollowUpState } from '../../utils/filters.js'

export function LeadTimelineModal({ lead, onClose, onSaveStatus, onSaveDiscussion }) {
  const [status, setStatus] = useState(lead.status)
  const [note, setNote] = useState('')
  const [setFollowUp, setSetFollowUp] = useState(false)
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpTime, setFollowUpTime] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [error, setError] = useState('')

  const leadFollowUp = getLeadFollowUpState(lead)
  const timeline = useMemo(() => [...lead.discussions], [lead.discussions])

  useEffect(() => {
    setStatus(lead.status)
  }, [lead.id, lead.status])

  const handleStatusSave = async () => {
    setSavingStatus(true)
    setError('')
    try {
      await onSaveStatus(status)
    } catch (cause) {
      setError(cause.message || 'Failed to update status')
    } finally {
      setSavingStatus(false)
    }
  }

  const handleNoteSubmit = async (event) => {
    event.preventDefault()
    setSavingNote(true)
    setError('')
    try {
      const followUpAt = setFollowUp ? `${followUpDate}T${followUpTime}:00Z` : undefined
      await onSaveDiscussion({ note, follow_up_at: followUpAt, status })
      setNote('')
      setSetFollowUp(false)
      setFollowUpDate('')
      setFollowUpTime('')
    } catch (cause) {
      setError(cause.message || 'Failed to save discussion')
    } finally {
      setSavingNote(false)
    }
  }

  return (
    <Modal title={`Timeline for ${lead.name}`} onClose={onClose} className="modal-timeline">
      <div className="modal-header modal-header--timeline">
        <div>
          <h2>{lead.name}</h2>
          <p>{lead.company ?? 'No company'}</p>
          {lead.phone ? <p>📞 {lead.phone}</p> : null}
        </div>
        <button type="button" className="icon-button" aria-label="Close lead timeline" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="timeline-toolbar">
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {Object.keys(STATUS_META).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="ghost-button" onClick={handleStatusSave} disabled={savingStatus}>
          {savingStatus ? 'Saving...' : 'Save Status'}
        </button>
      </div>

      <div className="timeline-summary">
        <StatusBadge status={lead.status} />
        {leadFollowUp.due ? (
          <FollowUpBadge overdue={leadFollowUp.overdue}>
            Follow-up · {formatAbsoluteDateTime(lead.follow_up_at)}
          </FollowUpBadge>
        ) : null}
      </div>

      <div className="timeline-list" aria-label="Discussion timeline">
        {timeline.map((entry) => (
          <article key={entry.id} className="timeline-entry">
            <div className="timeline-entry__header">
              <span>{formatAbsoluteDateTime(entry.created_at)}</span>
              <span>{formatRelativeTime(entry.created_at)}</span>
              {entry.follow_up_at ? <FollowUpBadge overdue={false}>Follow-up set</FollowUpBadge> : null}
            </div>
            <p>{entry.note}</p>
          </article>
        ))}
      </div>

      <form className="stack timeline-form" onSubmit={handleNoteSubmit}>
        <label>
          <span>Log a new discussion...</span>
          <textarea required rows={4} value={note} onChange={(event) => setNote(event.target.value)} />
        </label>

        <label className="checkbox-row">
          <input type="checkbox" checked={setFollowUp} onChange={(event) => setSetFollowUp(event.target.checked)} />
          <span>Set Follow-Up</span>
        </label>

        {setFollowUp ? (
          <div className="followup-grid">
            <label>
              <span>Date</span>
              <input type="date" required={setFollowUp} value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} />
            </label>
            <label>
              <span>Time</span>
              <input type="time" required={setFollowUp} value={followUpTime} onChange={(event) => setFollowUpTime(event.target.value)} />
            </label>
          </div>
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}

        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
          <button type="submit" className="primary-button" disabled={savingNote}>
            {savingNote ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </form>
    </Modal>
  )
}