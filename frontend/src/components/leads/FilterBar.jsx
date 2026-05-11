import { STATUSES, STATUS_META } from '../../types/index.js'

export function FilterBar({ activeStatus, onChange }) {
  return (
    <div className="filter-bar" role="tablist" aria-label="Lead status filters">
      {STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          className={`filter-pill ${activeStatus === status ? 'is-active' : ''}`}
          aria-pressed={activeStatus === status}
          onClick={() => onChange(status)}
        >
          {STATUS_META[status]?.label ?? status}
        </button>
      ))}
    </div>
  )
}