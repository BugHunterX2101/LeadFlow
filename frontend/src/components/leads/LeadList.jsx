import { LeadCard } from './LeadCard.jsx'

export function LeadList({ leads, onLeadClick, searchQuery }) {
  return (
    <section className="lead-list-section">
      <div className="section-heading">
        <h2>All Leads</h2>
        <span>{leads.length} visible</span>
      </div>
      <div className="lead-list">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} searchQuery={searchQuery} onClick={() => onLeadClick(lead.id)} />
        ))}
      </div>
    </section>
  )
}