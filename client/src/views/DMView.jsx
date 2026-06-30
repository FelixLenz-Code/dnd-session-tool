import { useState } from 'react'
import Cockpit from '../components/dm/Cockpit'
import ConfrontationPanel from '../components/dm/ConfrontationPanel'
import AdventurePanel from '../components/dm/AdventurePanel'
import { useGame } from '../context/GameContext'

export default function DMView() {
  const { state } = useGame()
  const [tab, setTab] = useState('cockpit')

  const hasFinale = (state.adventure?.floors ?? []).some(f => f.id === 'konfrontation')
  const TABS = [
    { id: 'cockpit',   label: 'Cockpit' },
    ...(hasFinale ? [{ id: 'finale', label: 'Finale' }] : []),
    { id: 'adventure', label: 'Adventure' },
  ]
  // Falls der aktive Tab wegfällt, auf Cockpit zurück.
  const activeTab = TABS.some(t => t.id === tab) ? tab : 'cockpit'

  return (
    <div className="screen">
      <div className="header">
        <h1>DM – {state.adventure?.title ?? 'Kein Adventure geladen'}</h1>
        <span className={`badge ${state.displayOnline ? 'badge-green' : 'badge-red'}`}>
          Display {state.displayOnline ? 'verbunden' : 'offline'}
        </span>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="scroll-area">
        {activeTab === 'cockpit' && <Cockpit />}
        {activeTab === 'finale' && <ConfrontationPanel />}
        {activeTab === 'adventure' && <AdventurePanel />}
      </div>
    </div>
  )
}
