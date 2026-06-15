import { useGame } from '../../context/GameContext'
import MapRenderer from '../../maps/MapRenderer'

export default function MapDisplay({ fullscreen = false }) {
  const { state } = useGame()

  if (!state.map?.type) {
    return <div className="empty-state">Der DM hat noch keine Karte geöffnet</div>
  }

  const mapDef = state.adventure?.maps?.find(m => m.id === state.map.type)

  if (fullscreen) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0e0c08',
      }}>
        {mapDef && (
          <div style={{
            textAlign: 'center', padding: '6px 12px',
            fontSize: '0.8rem', color: 'var(--gold)',
            borderBottom: '1px solid var(--border-dim)',
            flexShrink: 0,
          }}>
            {mapDef.label}
            {state.map.marker && (
              <span style={{ marginLeft: 10, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                ● {state.map.marker.label}
              </span>
            )}
          </div>
        )}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MapRenderer
            mapId={state.map.type}
            marker={state.map.marker}
            interactive={true}
            puzzleState={state.puzzles?.[state.map.type]}
            puzzleWrong={state.puzzleWrong === state.map.type}
            fullscreen
          />
        </div>
      </div>
    )
  }

  return (
    <div className="gap-12">
      {mapDef && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--gold)', marginBottom: 4 }}>{mapDef.label}</div>
        </div>
      )}
      <div className="map-container">
        <MapRenderer
          mapId={state.map.type}
          marker={state.map.marker}
          interactive={true}
          puzzleState={state.puzzles?.[state.map.type]}
          puzzleWrong={state.puzzleWrong === state.map.type}
        />
      </div>
      {state.map.marker && (
        <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          ● {state.map.marker.label}
        </div>
      )}
    </div>
  )
}
