import { STATUS_META } from '../types/index.js'

export function getStatusMeta(status) {
  return STATUS_META[status] ?? STATUS_META.New
}

export function splitHighlight(text, query) {
  const value = String(text ?? '')
  const term = String(query ?? '').trim()
  if (!term) {
    return [{ text: value, highlight: false }]
  }

  const index = value.toLowerCase().indexOf(term.toLowerCase())
  if (index === -1) {
    return [{ text: value, highlight: false }]
  }

  return [
    { text: value.slice(0, index), highlight: false },
    { text: value.slice(index, index + term.length), highlight: true },
    { text: value.slice(index + term.length), highlight: false }
  ].filter((part) => part.text)
}