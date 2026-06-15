import { useGame } from '../../context/GameContext'
import MapRenderer from '../../maps/MapRenderer'

export default function MapDisplay() {
  const { state } = useGame()

  if (!state.map?.type) {
    return <div className="empty-state">Der DM hat noch keine Karte geöffnet</div>
  }

  const mapDef = state.adventure?.maps?.find(m => m.id === state.map.type)

  return (
    <div className="gap-12">
      {mapDef && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--gold)', marginBottom: 4 }}>{mapDef.label}</div>
        </div>
      )}
      <div className="map-container">
        <MapRenderer mapId={state.map.type} marker={state.map.marker} />
      </div>
      {state.map.marker && (
        <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          ● {state.map.marker.label}
        </div>
      )}
    </div>
  )
}
