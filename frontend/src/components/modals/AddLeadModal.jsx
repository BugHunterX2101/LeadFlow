import { useState } from 'react'
import { Modal } from '../ui/Modal.jsx'

export function AddLeadModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', company: '', phone: '', status: 'New' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (cause) {
      setError(cause.message || 'Failed to save lead')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Add New Lead" onClose={onClose} className="modal-add-lead">
      <div className="modal-header">
        <h2>Add New Lead</h2>
        <button type="button" className="icon-button" aria-label="Close add lead modal" onClick={onClose}>
          ×
        </button>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          <span>Full Name</span>
          <input
            autoFocus
            required
            maxLength={200}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="John Doe"
          />
        </label>
        <label>
          <span>Company</span>
          <input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="Stark Industries" />
        </label>
        <label>
          <span>Phone</span>
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="555-0123" />
        </label>
        <label>
          <span>Status</span>
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </form>
    </Modal>
  )
}