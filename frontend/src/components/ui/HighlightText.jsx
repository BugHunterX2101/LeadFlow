import { splitHighlight } from '../../utils/status.js'

export function HighlightText({ text, query }) {
  return splitHighlight(text, query).map((part, index) =>
    part.highlight ? (
      <mark key={`${part.text}-${index}`} className="search-highlight">
        {part.text}
      </mark>
    ) : (
      <span key={`${part.text}-${index}`}>{part.text}</span>
    )
  )
}