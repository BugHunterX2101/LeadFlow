import { LeadCard } from './LeadCard.jsx'
import { getTodayFollowUps } from '../../utils/filters.js'

export function FollowUpSection({ leads, onLeadClick, searchQuery }) {
  const followUps = getTodayFollowUps(leads)

  if (!followUps.length) {
    return null
  }

  return (
    <section className="followup-section">
      <div className="section-heading">
        <h2>Today&apos;s Follow-Ups</h2>
        <span>📣</span>
      </div>
      <div className="lead-list followup-list">
        {followUps.map((lead) => (
          <LeadCard key={lead.id} lead={lead} searchQuery={searchQuery} onClick={() => onLeadClick(lead.id)} />
        ))}
      </div>
    </section>
  )
}