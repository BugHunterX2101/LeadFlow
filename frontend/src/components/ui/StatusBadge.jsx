import { getStatusMeta } from '../../utils/status.js'

export function StatusBadge({ status }) {
  const meta = getStatusMeta(status)
  return <span className={`status-badge ${meta.className}`}>{meta.label}</span>
}