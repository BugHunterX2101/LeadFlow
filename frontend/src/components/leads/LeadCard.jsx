import { FollowUpBadge } from '../ui/FollowUpBadge.jsx'
import { StatusBadge } from '../ui/StatusBadge.jsx'
import { HighlightText } from '../ui/HighlightText.jsx'
import { formatAbsoluteDateTime, formatRelativeTime } from '../../utils/date.js'
import { formatPreview, getLeadFollowUpState } from '../../utils/filters.js'

export function LeadCard({ lead, searchQuery, onClick, now = new Date() }) {
  const followUpState = getLeadFollowUpState(lead, now)
  const lastNote = lead.last_note?.note ?? ''

  return (
    <button type="button" className={`lead-card ${lead.status === 'Won' || lead.status === 'Lost' ? 'is-muted' : ''}`} onClick={onClick}>
      <div className="lead-card__topline">
        <h3>
          <HighlightText text={lead.name} query={searchQuery} />
          <span className="company-name">{lead.company ? ` (${lead.company})` : ''}</span>
        </h3>
        <StatusBadge status={lead.status} />
      </div>

      <p className="lead-card__preview">{formatPreview(lastNote)}</p>

      <div className="lead-card__meta">
        <span>{lead.last_note?.created_at ? formatRelativeTime(lead.last_note.created_at, now) : 'No activity yet'}</span>
        {followUpState.due ? (
          <FollowUpBadge overdue={followUpState.overdue}>
            {followUpState.overdue ? 'Overdue' : 'Follow-up'} · {formatAbsoluteDateTime(lead.follow_up_at)}
          </FollowUpBadge>
        ) : null}
      </div>
    </button>
  )
}