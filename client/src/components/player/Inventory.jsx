import { useGame } from '../../context/GameContext'

export default function Inventory() {
  const { state } = useGame()

  const floorLabel = state.adventure?.floors?.find(f => f.id === state.currentFloor)?.label

  return (
    <div className="gap-12">
      {/* Fortschritt */}
      {state.adventure && (
        <div className="card">
          <div className="section-title">Fortschritt</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            {state.adventure.floors.map(f => {
              const unlocked = state.unlockedFloors.includes(f.id)
              const current = state.currentFloor === f.id
              return (
                <div
                  key={f.id}
                  className={`progress-step ${current ? 'current' : unlocked ? 'unlocked' : ''}`}
                  title={f.label}
                />
              )
            })}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            {floorLabel ?? 'Noch nicht gestartet'}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card">
        <div className="section-title">Gefundene Items</div>
        {state.inventory.length === 0
          ? <div className="empty-state" style={{ padding: '12px 0' }}>Noch nichts gefunden</div>
          : state.inventory.map((item, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-dim)' }}>
                <div style={{ color: 'var(--gold)', fontSize: '0.9rem', marginBottom: 4 }}>✦ {item.name}</div>
                {item.description && item.description !== item.name && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{item.description}</div>
                )}
              </div>
            ))
        }
      </div>

      {/* Kristall Kurzanzeige */}
      {state.crystal && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: state.crystal.color, boxShadow: `0 0 10px ${state.crystal.glowColor ?? state.crystal.color}`, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>{state.crystal.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Archiv der Stimmen</div>
          </div>
        </div>
      )}
    </div>
  )
}
