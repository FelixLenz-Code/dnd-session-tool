import { useState } from 'react'
import { useGame } from '../context/GameContext'
import MessageFeed from '../components/player/MessageFeed'
import PuzzleView from '../components/player/PuzzleView'
import CrystalView from '../components/player/CrystalView'
import Inventory from '../components/player/Inventory'
import TimerBanner from '../components/player/TimerBanner'
import { PUZZLE_BY_FLOOR } from '../puzzles'

export default function PlayerView() {
  const { state } = useGame()
  const [tab, setTab] = useState('feed')

  // Rätsel-Tab: sichtbar, sobald die aktuelle Etage ein interaktives Rätsel hat
  const showRiddle = !!PUZZLE_BY_FLOOR[state.currentFloor]

  // Kristall-Tab: sichtbar sobald ein Kristall zugewiesen ist ODER Spieler im Archiv
  const crystalFloorId = state.adventure?.crystals?.[0]?.floorId ?? 'floor-4'
  const showCrystal = state.crystal != null || state.currentFloor === crystalFloorId

  const TABS = [
    { id: 'feed',      label: 'Feed' },
    ...(showRiddle ? [{ id: 'riddle', label: 'Rätsel' }] : []),
    ...(showCrystal ? [{ id: 'crystal', label: 'Kristall' }] : []),
    { id: 'inventory', label: 'Inventar' },
  ]

  // Falls der aktive Tab wegfällt (z. B. Rätsel gelöst → Etagenwechsel), auf Feed zurück
  const activeTab = TABS.some(t => t.id === tab) ? tab : 'feed'

  const floorLabel = state.adventure?.floors?.find(f => f.id === state.currentFloor)?.label

  return (
    <div className="screen">
      <TimerBanner />

      <div className="header">
        <h1>{state.playerName}</h1>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          {floorLabel ?? state.adventure?.title ?? 'Warte auf DM…'}
        </span>
      </div>

      {state.adventure && (
        <div style={{ padding: '8px 16px', background: 'var(--bg-mid)', borderBottom: '1px solid var(--border-dim)' }}>
          <FloorProgress />
        </div>
      )}

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id === 'crystal' && state.crystal && (
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: state.crystal.color, marginLeft: 6 }} />
            )}
          </button>
        ))}
      </div>

      <div className="scroll-area">
        {activeTab === 'feed'      && <MessageFeed />}
        {activeTab === 'riddle'    && <PuzzleView />}
        {activeTab === 'crystal'   && <CrystalView />}
        {activeTab === 'inventory' && <Inventory />}
      </div>
    </div>
  )
}

function FloorProgress() {
  const { state } = useGame()
  const floors = state.adventure?.floors ?? []

  return (
    <div className="progress-bar">
      {floors.map(f => {
        const isUnlocked = state.unlockedFloors.includes(f.id)
        const isCurrent = state.currentFloor === f.id
        return (
          <div
            key={f.id}
            className={`progress-step ${isCurrent ? 'current' : isUnlocked ? 'unlocked' : ''}`}
            title={f.label}
          />
        )
      })}
    </div>
  )
}
