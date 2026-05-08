export function FollowUpBadge({ overdue = false, children }) {
  return <span className={`followup-badge ${overdue ? 'is-overdue' : ''}`}>{children}</span>
}