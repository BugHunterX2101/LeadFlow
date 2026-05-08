import { useMemo, useState } from 'react'
import { Header } from './components/layout/Header.jsx'
import { FilterBar } from './components/leads/FilterBar.jsx'
import { SearchBar } from './components/leads/SearchBar.jsx'
import { FollowUpSection } from './components/leads/FollowUpSection.jsx'
import { LeadList } from './components/leads/LeadList.jsx'
import { AddLeadModal } from './components/modals/AddLeadModal.jsx'
import { LeadTimelineModal } from './components/modals/LeadTimelineModal.jsx'
import { useLeads } from './hooks/useLeads.js'
import { useLeadDetail } from './hooks/useLeadDetail.js'
import { applyLeadFilters, getTodayFollowUps } from './utils/filters.js'

export default function App() {
  const [activeStatus, setActiveStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)

  const { allLeads, leads, loading, error, refresh, createLead } = useLeads({
    status: activeStatus,
    search: searchQuery
  })

  const selectedLeadDetail = useLeadDetail(selectedLeadId, Boolean(selectedLeadId), refresh)

  const todayFollowUps = useMemo(() => getTodayFollowUps(applyLeadFilters(allLeads, activeStatus, searchQuery)), [allLeads, activeStatus, searchQuery])

  const handleCreateLead = async (payload) => {
    await createLead(payload)
    await refresh()
  }

  return (
    <main className="app-shell">
      <Header onAddLead={() => setIsAddLeadOpen(true)} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <FilterBar activeStatus={activeStatus} onChange={setActiveStatus} />

      {error ? <p className="notice error">{error}</p> : null}
      {loading ? <p className="notice">Loading leads...</p> : null}

      <FollowUpSection leads={todayFollowUps} onLeadClick={setSelectedLeadId} searchQuery={searchQuery} />
      <LeadList leads={leads} onLeadClick={setSelectedLeadId} searchQuery={searchQuery} />

      {isAddLeadOpen ? <AddLeadModal onClose={() => setIsAddLeadOpen(false)} onSave={handleCreateLead} /> : null}

      {selectedLeadId && selectedLeadDetail.lead ? (
        <LeadTimelineModal
          lead={selectedLeadDetail.lead}
          onClose={() => setSelectedLeadId(null)}
          onSaveStatus={selectedLeadDetail.saveStatus}
          onSaveDiscussion={selectedLeadDetail.saveDiscussion}
        />
      ) : null}
    </main>
  )
}