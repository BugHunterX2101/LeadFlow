export function formatAbsoluteDateTime(value) {
  if (!value) return 'No date'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value))
}

export function formatRelativeTime(value, now = new Date()) {
  if (!value) return ''
  const target = new Date(value)
  const diffSeconds = Math.round((target.getTime() - now.getTime()) / 1000)
  const absSeconds = Math.abs(diffSeconds)
  const ranges = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60]
  ]

  for (const [unit, size] of ranges) {
    if (absSeconds >= size || unit === 'minute') {
      const valueInUnit = Math.max(1, Math.round(absSeconds / size))
      const label = `${valueInUnit} ${unit}${valueInUnit === 1 ? '' : 's'}`
      return diffSeconds >= 0 ? `in ${label}` : `${label} ago`
    }
  }

  return 'just now'
}

export function isSameLocalDay(value, now = new Date()) {
  const date = new Date(value)
  return date.toDateString() === now.toDateString()
}

export function isOverdue(value, now = new Date()) {
  return Boolean(value) && new Date(value).getTime() < now.getTime()
}