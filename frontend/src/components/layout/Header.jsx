export function Header({ onAddLead }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">LeadFlow</p>
        <h1>Single-screen CRM for fast follow-up work.</h1>
      </div>
      <button type="button" className="primary-button" onClick={onAddLead}>
        + Add New Lead
      </button>
    </header>
  )
}