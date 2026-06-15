import { useState } from 'react'
import Dashboard from '../components/dm/Dashboard'
import EventPanel from '../components/dm/EventPanel'
import PlayerList from '../components/dm/PlayerList'
import MessageComposer from '../components/dm/MessageComposer'
import TimerPanel from '../components/dm/TimerPanel'
import MapControl from '../components/dm/MapControl'
import { useGame } from '../context/GameContext'

const TABS = [
  { id: 'dashboard', label: 'Übersicht' },
  { id: 'events',    label: 'Ereignisse' },
  { id: 'map',       label: 'Karte' },
  { id: 'messages',  label: 'Nachrichten' },
  { id: 'timer',     label: 'Timer' },
  { id: 'players',   label: 'Spieler' },
]

export default function DMView() {
  const { state } = useGame()
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="screen">
      <div className="header">
        <h1>DM – {state.adventure?.title ?? 'Kein Adventure geladen'}</h1>
        <span className="badge badge-green">{state.players.length} online</span>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="scroll-area">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'events'    && <EventPanel />}
        {tab === 'map'       && <MapControl />}
        {tab === 'messages'  && <MessageComposer />}
        {tab === 'timer'     && <TimerPanel />}
        {tab === 'players'   && <PlayerList />}
      </div>
    </div>
  )
}
