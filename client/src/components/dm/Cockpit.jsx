import { useGame } from '../../context/GameContext'
import Dashboard from './Dashboard'
import EventPanel from './EventPanel'
import MessageComposer from './MessageComposer'
import TimerPanel from './TimerPanel'
import DirectorPanel from './DirectorPanel'
import { SceneControls, ImageManager, SoundManager, FindsManager } from './StagePanel'

// Lesbarer Name dessen, was das Display gerade zeigt.
function sceneLabel(state) {
  const s = state.stage ?? {}
  const floor = state.adventure?.floors?.find(f => f.id === state.currentFloor)
  switch (s.mode) {
    case 'puzzle':    return `Rätsel${floor ? ' – ' + floor.label : ''}`
    case 'narration': return 'Vision / Text'
    case 'crystals':  return 'Kristall-Galerie'
    case 'questions': return 'Aldrics Fragen'
    case 'image':     return `Karte: ${s.payload?.label ?? 'Bild'}`
    default:          return 'Titelbild'
  }
}

// Ein benannter Block im Cockpit-Board.
function Block({ title, children }) {
  return (
    <div>
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

// Eine feste Spalte — vertikaler Stapel, Inhalte bleiben an ihrem Platz.
function Column({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
      {children}
    </div>
  )
}

export default function Cockpit() {
  const { state, actions } = useGame()
  const online = state.displayOnline

  return (
    <div>
      {/* Live-Status: was läuft gerade auf dem Display? */}
      <div className="card" style={{
        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 16,
      }}>
        <span className="player-dot" style={{
          background: online ? 'var(--green)' : 'var(--text-muted)',
          boxShadow: online ? '0 0 4px var(--green)' : 'none', flexShrink: 0,
        }} />
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            Display zeigt
          </div>
          <div style={{ fontSize: '1.05rem', color: 'var(--gold)', fontWeight: 'bold' }}>
            {online ? sceneLabel(state) : 'Display nicht verbunden'}
          </div>
        </div>

        {state.timer?.running && (
          <span className="badge badge-red" style={{ flexShrink: 0 }}>⏱ Timer läuft</span>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Code: <strong style={{ color: 'var(--gold)', letterSpacing: '0.12em' }}>{state.code ?? '—'}</strong>
          </span>
          <button className="btn btn-sm" disabled={state.stage?.mode === 'cover'}
            onClick={() => actions.setStage('cover')} title="Display auf Titelbild zurücksetzen">
            🗼 Titelbild
          </button>
        </div>
      </div>

      {/* Regie: was sage/erzähle ich bei diesem Schritt? Immer prominent oben. */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--gold-dim)', margin: '0 0 8px 2px',
        }}>
          Regie – Was erzähle ich hier?
        </div>
        <DirectorPanel />
      </div>

      {/* Festes Spalten-Board: jede Karte hat ihren festen Platz, kein Umfließen.
          Spalten klappen auf schmalen Geräten untereinander, Inhalte bleiben gruppiert. */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
        gap: 16, alignItems: 'start',
      }}>
        {/* Spalte 1 — Display steuern */}
        <Column>
          <Block title="Bühne"><SceneControls /></Block>
          <Block title="Karten"><ImageManager /></Block>
          <Block title="Audio"><SoundManager /></Block>
        </Column>

        {/* Spalte 2 — Spielverlauf */}
        <Column>
          <Block title="Etagen & Rätsel"><Dashboard /></Block>
          <Block title="Ereignisse"><EventPanel /></Block>
        </Column>

        {/* Spalte 3 — Kommunikation */}
        <Column>
          <Block title="Nachrichten"><MessageComposer /></Block>
          <Block title="Funde der Gruppe"><FindsManager /></Block>
          <Block title="Timer"><TimerPanel /></Block>
        </Column>
      </div>
    </div>
  )
}
