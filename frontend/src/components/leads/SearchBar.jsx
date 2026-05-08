export function SearchBar({ value, onChange }) {
  return (
    <label className="search-bar">
      <span>Search leads by name</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type a name..."
      />
    </label>
  )
}