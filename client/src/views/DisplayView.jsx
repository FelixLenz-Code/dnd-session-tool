import { useGame } from '../context/GameContext'
import PuzzleView from '../components/player/PuzzleView'
import CrystalGallery from '../components/display/CrystalGallery'
import TimerBanner from '../components/player/TimerBanner'

// Das geteilte Spieler-iPad. Zeigt immer nur die aktuelle Bühne, die der DM steuert.
export default function DisplayView() {
  const { state } = useGame()
  const mode = state.stage?.mode ?? 'cover'

  const floorLabel = state.adventure?.floors?.find(f => f.id === state.currentFloor)?.label

  return (
    <div className="screen">
      <TimerBanner />

      <div className="header">
        <h1>{state.adventure?.title ?? 'Turm des Magiers'}</h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {floorLabel ?? 'Warte auf den DM…'}
        </span>
      </div>

      {state.adventure && (
        <div style={{ padding: '8px 16px', background: 'var(--bg-mid)', borderBottom: '1px solid var(--border-dim)' }}>
          <FloorProgress />
        </div>
      )}

      <div className="scroll-area" style={{ display: 'flex', flexDirection: 'column' }}>
        <Stage mode={mode} payload={state.stage?.payload} />
      </div>
    </div>
  )
}

function Stage({ mode, payload }) {
  if (mode === 'puzzle')   return <div style={wrap}><PuzzleView /></div>
  if (mode === 'narration') return <Narration payload={payload} />
  if (mode === 'crystals') return <div style={wrap}><CrystalGallery /></div>
  if (mode === 'image')    return <DisplayImage payload={payload} />
  return <Cover />
}

const wrap = { width: '100%', maxWidth: 760, margin: '0 auto' }

// ── Cover / Ruhezustand ─────────────────────────────────────────────────────────
function Cover() {
  const { state } = useGame()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 18, padding: '40px 24px' }}>
      <div style={{ fontSize: '3rem' }}>🗼</div>
      <div style={{ fontSize: '2rem', color: 'var(--gold)', letterSpacing: '0.06em' }}>
        {state.adventure?.title ?? 'Turm des Magiers'}
      </div>
      {state.adventure?.description && (
        <div style={{ maxWidth: 620, color: 'var(--text-dim)', fontSize: '1.05rem', lineHeight: 1.7 }}>
          {state.adventure.description}
        </div>
      )}
    </div>
  )
}

// ── Erzähltext / Vision groß ─────────────────────────────────────────────────────
function Narration({ payload }) {
  const text = payload?.text ?? ''
  const type = payload?.type ?? 'narrative'
  const label = payload?.label
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <div className={`message ${type}`} style={{
        ...wrap, fontSize: '1.4rem', lineHeight: 1.8, padding: '32px 36px',
        borderLeftWidth: 5, whiteSpace: 'pre-wrap',
      }}>
        {label && (
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 14 }}>
            {label}
          </div>
        )}
        {text}
      </div>
    </div>
  )
}

// ── Bild / Karte großflächig ─────────────────────────────────────────────────────
function DisplayImage({ payload }) {
  const url = payload?.url
  if (!url) {
    return <div className="empty-state" style={{ margin: 'auto' }}>Kein Bild ausgewählt.</div>
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 8, minHeight: 0 }}>
      <img
        src={url}
        alt={payload?.label ?? 'Karte'}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
      />
      {payload?.label && (
        <div style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>{payload.label}</div>
      )}
    </div>
  )
}

// ── Etagen-Fortschritt (wiederverwendete Logik aus der alten PlayerView) ──────────
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
