import { useState } from 'react'
import { useGame } from '../context/GameContext'
import MessageFeed from '../components/player/MessageFeed'
import MapDisplay from '../components/player/MapDisplay'
import CrystalView from '../components/player/CrystalView'
import Inventory from '../components/player/Inventory'
import TimerBanner from '../components/player/TimerBanner'

export default function PlayerView() {
  const { state } = useGame()
  const [tab, setTab] = useState('feed')

  // Kristall-Tab: sichtbar sobald ein Kristall zugewiesen ist ODER Spieler im Archiv
  const crystalFloorId = state.adventure?.crystals?.[0]?.floorId ?? 'floor-4'
  const showCrystal = state.crystal != null || state.currentFloor === crystalFloorId

  const TABS = [
    { id: 'feed',      label: 'Feed' },
    { id: 'map',       label: 'Karte' },
    ...(showCrystal ? [{ id: 'crystal', label: 'Kristall' }] : []),
    { id: 'inventory', label: 'Inventar' },
  ]

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
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id === 'crystal' && state.crystal && (
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: state.crystal.color, marginLeft: 6 }} />
            )}
          </button>
        ))}
      </div>

      <div className="scroll-area">
        {tab === 'feed'      && <MessageFeed />}
        {tab === 'map'       && <MapDisplay />}
        {tab === 'crystal'   && <CrystalView />}
        {tab === 'inventory' && <Inventory />}
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
