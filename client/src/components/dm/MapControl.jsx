import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import MapRenderer from '../../maps/MapRenderer'

export default function MapControl() {
  const { state, actions } = useGame()
  const [markerLabel, setMarkerLabel] = useState('Ihr seid hier')
  const [showMarker, setShowMarker] = useState(true)

  const maps = state.adventure?.maps ?? []
  const currentMapId = state.map?.type

  // Karte ist verfügbar wenn:
  // - 'velmoor' und 'tower' immer
  // - floor-X wenn die Etage freigeschaltet ist
  function isMapUnlocked(mapId) {
    if (mapId === 'velmoor' || mapId === 'tower') return true
    return (state.unlockedMaps ?? []).includes(mapId)
  }

  function selectMap(mapId) {
    const marker = showMarker ? { label: markerLabel } : null
    actions.updateMap(mapId, marker)
  }

  function updateMarker() {
    actions.updateMap(currentMapId, showMarker ? { label: markerLabel } : null)
  }

  return (
    <div className="gap-12">
      {/* Kartenauswahl */}
      <div className="card">
        <div className="section-title">Karte wählen</div>
        {maps.length === 0
          ? <div className="empty-state" style={{ padding: '12px 0' }}>Kein Adventure geladen</div>
          : (
            <div className="gap-8">
              {maps.map(m => {
                const unlocked = isMapUnlocked(m.id)
                const active = currentMapId === m.id
                return (
                  <button
                    key={m.id}
                    className={`btn ${active ? 'btn-gold' : ''}`}
                    onClick={() => unlocked && selectMap(m.id)}
                    disabled={!unlocked}
                    style={{
                      opacity: unlocked ? 1 : 0.35,
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <span>{active ? '▶ ' : ''}{m.label}</span>
                    {!unlocked && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🔒 gesperrt</span>}
                  </button>
                )
              })}
            </div>
          )
        }
      </div>

      {/* Marker */}
      <div className="card">
        <div className="section-title">Spieler-Marker</div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text)' }}>
            <input type="checkbox" checked={showMarker} onChange={e => setShowMarker(e.target.checked)} />
            Marker auf Karte anzeigen
          </label>
        </div>
        {showMarker && (
          <div className="form-group">
            <label className="form-label">Marker-Text</label>
            <input className="input" value={markerLabel} onChange={e => setMarkerLabel(e.target.value)} />
          </div>
        )}
        <button className="btn btn-gold btn-full" onClick={updateMarker} disabled={!currentMapId}>
          Marker aktualisieren
        </button>
      </div>

      {/* Vorschau */}
      {currentMapId && (
        <div className="card">
          <div className="section-title">Vorschau (was Spieler sehen)</div>
          <div className="map-container">
            <MapRenderer mapId={currentMapId} marker={state.map?.marker} />
          </div>
        </div>
      )}
    </div>
  )
}
