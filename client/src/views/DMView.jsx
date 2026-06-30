import { useState } from 'react'
import Dashboard from '../components/dm/Dashboard'
import EventPanel from '../components/dm/EventPanel'
import StagePanel from '../components/dm/StagePanel'
import MessageComposer from '../components/dm/MessageComposer'
import TimerPanel from '../components/dm/TimerPanel'
import AdventurePanel from '../components/dm/AdventurePanel'
import { useGame } from '../context/GameContext'

const TABS = [
  { id: 'leitung',   label: 'Leitung' },
  { id: 'anzeige',   label: 'Anzeige' },
  { id: 'adventure', label: 'Adventure' },
]

// Ein Block im Leitungs-Layout — bleibt beim Umbruch zusammen.
function Block({ title, children }) {
  return (
    <div style={{ breakInside: 'avoid', marginBottom: 16 }}>
      <div style={{
        fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--gold-dim)', margin: '0 0 8px 2px',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export default function DMView() {
  const { state } = useGame()
  const [tab, setTab] = useState('leitung')

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
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="scroll-area">
        {tab === 'leitung' && (
          // Mehrspaltig: auf breiten Schirmen mehrere Reihen, alles auf einmal sichtbar.
          <div style={{ columnWidth: '380px', columnGap: '16px' }}>
            <Block title="Übersicht"><Dashboard /></Block>
            <Block title="Ereignisse"><EventPanel /></Block>
            <Block title="Nachrichten"><MessageComposer /></Block>
            <Block title="Timer"><TimerPanel /></Block>
          </div>
        )}
        {tab === 'anzeige' && <StagePanel />}
        {tab === 'adventure' && <AdventurePanel />}
      </div>
    </div>
  )
}
