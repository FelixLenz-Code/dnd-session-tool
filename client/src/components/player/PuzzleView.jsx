import { useState, useRef } from 'react'
import { useGame } from '../../context/GameContext'
import { PUZZLE_BY_FLOOR } from '../../puzzles'

// Dispatcher: zeigt das interaktive Element der aktuellen Etage.
export default function PuzzleView() {
  const { state } = useGame()
  const pz = PUZZLE_BY_FLOOR[state.currentFloor]

  if (!pz) {
    return <div className="empty-state">Auf dieser Etage gibt es gerade kein Rätsel.</div>
  }
  if (pz.type === 'sequence') return <SequencePuzzle pz={pz} />
  if (pz.type === 'password') return <PasswordPuzzle pz={pz} />
  if (pz.type === 'mix')      return <MixPuzzle pz={pz} />
  if (pz.type === 'choice')   return <ChoicePuzzle pz={pz} />
  return null
}

// ── Sequenz-Rätsel (Keller: Jahreszeiten in richtiger Reihenfolge) ──────────────
function SequencePuzzle({ pz }) {
  const { state, actions } = useGame()
  const st    = state.puzzles?.[pz.id] ?? { progress: [], solved: false }
  const wrong = state.puzzleWrong === pz.id
  const { progress, solved } = st
  const total = pz.options.length

  return (
    <div className="gap-12">
      <div className="card">
        <div className="section-title">{pz.label}</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
          Vier Jahreszeiten zieren die Pforte. Berührt ihre Symbole in der{' '}
          <strong>richtigen Reihenfolge</strong>, um das Siegel zu brechen.
          Ein falsches Symbol löscht die Spur.
        </p>
      </div>

      <div className="card">
        {solved ? (
          <div style={{ textAlign: 'center', color: '#7bdc4e', fontWeight: 'bold', marginBottom: 14 }}>
            ✨ Die versiegelte Pforte öffnet sich.
          </div>
        ) : (
          <div style={{
            textAlign: 'center', marginBottom: 14, fontSize: '0.85rem',
            color: wrong ? '#e0635a' : 'var(--text-muted)',
          }}>
            {wrong ? 'Falsch — die Symbole erlöschen…' : `${progress.length} / ${total} Symbolen richtig`}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {pz.options.map(({ id, sym, label }) => {
            const idx = progress.indexOf(id)
            const sel = idx !== -1
            return (
              <button
                key={id}
                onClick={() => { if (!solved) actions.interactMap(pz.id, id) }}
                disabled={solved}
                style={{
                  position: 'relative', padding: '20px 8px', borderRadius: 'var(--radius)',
                  border: `2px solid ${solved ? '#3f7a26' : sel ? '#5a8a30' : wrong ? '#8b1a14' : 'var(--border-dim)'}`,
                  background: solved ? '#1d3312' : sel ? '#243f17' : wrong ? '#33150f' : 'var(--bg-mid)',
                  color: 'var(--text)', cursor: solved ? 'default' : 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  transition: 'background .15s, border-color .15s',
                }}
              >
                <span style={{ fontSize: '2.1rem', lineHeight: 1 }}>{sym}</span>
                <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{label}</span>
                {sel && !solved && (
                  <span style={{
                    position: 'absolute', top: 8, right: 10, width: 20, height: 20, borderRadius: '50%',
                    background: '#5a8a30', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{idx + 1}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Passwort-Rätsel (Bibliothek: Titel des fehlenden Buches) ────────────────────
function PasswordPuzzle({ pz }) {
  const { state, actions } = useGame()
  const [value, setValue] = useState('')
  const st     = state.puzzles?.[pz.id] ?? { solved: false }
  const wrong  = state.puzzleWrong === pz.id
  const solved = st.solved

  function submit(e) {
    e.preventDefault()
    const v = value.trim()
    if (!v || solved) return
    actions.interactMap(pz.id, v)
  }

  return (
    <div className="gap-12">
      <div className="card">
        <div className="section-title">{pz.label}</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
          Ein Bann verschließt die Treppe nach oben. Eine Messingplatte verlangt ein Wort:
          den <strong>Titel des Buches, das hier fehlt</strong>. Findet ihn — und sprecht ihn aus.
        </p>
      </div>

      <div className="card">
        {solved ? (
          <div style={{ textAlign: 'center', color: '#7bdc4e', fontWeight: 'bold' }}>
            ✓ Der Bann ist gebrochen — die Treppe liegt frei.
          </div>
        ) : (
          <form onSubmit={submit} className="gap-12">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">{pz.prompt}</label>
              <input
                className="input"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={pz.placeholder}
                autoComplete="off"
                style={wrong ? { borderColor: '#8b1a14' } : undefined}
              />
              {wrong && (
                <div style={{ fontSize: '0.82rem', color: '#e0635a', marginTop: 6 }}>
                  Das Wort verhallt — nichts geschieht.
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-gold btn-full" disabled={!value.trim()}>
              Aussprechen
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Misch-Rätsel (Labor: Zutaten in den Kessel ziehen — Maus & Touch) ───────────
function MixPuzzle({ pz }) {
  const { state, actions } = useGame()
  const st       = state.puzzles?.[pz.id] ?? { progress: [], solved: false }
  const wrong    = state.puzzleWrong === pz.id
  const solved   = st.solved
  const progress = st.progress ?? []
  const optById  = Object.fromEntries(pz.options.map(o => [o.id, o]))

  const cauldronRef = useRef(null)
  const [drag, setDrag] = useState(null)   // { id, x, y, over }

  function pointInCauldron(x, y) {
    const r = cauldronRef.current?.getBoundingClientRect()
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
  }
  function onDown(e, id) {
    if (solved) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDrag({ id, x: e.clientX, y: e.clientY, over: false })
  }
  function onMove(e) {
    if (!drag) return
    setDrag(d => ({ ...d, x: e.clientX, y: e.clientY, over: pointInCauldron(e.clientX, e.clientY) }))
  }
  function onUp(e) {
    if (!drag) return
    const over = pointInCauldron(e.clientX, e.clientY)
    const id = drag.id
    setDrag(null)
    if (over) actions.interactMap(pz.id, id)
  }

  return (
    <div className="gap-12">
      <div className="card">
        <div className="section-title">{pz.label}</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
          Braut die Essenz: zieht die Zutaten <strong>in der richtigen Reihenfolge</strong> in den
          Kessel. Eine falsche Zutat lässt den Sud verderben.
        </p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Kessel (Drop-Ziel) */}
        <div
          ref={cauldronRef}
          style={{
            width: 180, height: 130, borderRadius: '0 0 90px 90px',
            border: `3px solid ${solved ? '#5a8a30' : wrong ? '#8b1a14' : drag?.over ? 'var(--gold)' : 'var(--gold-dim)'}`,
            borderTopLeftRadius: 16, borderTopRightRadius: 16,
            background: solved ? 'radial-gradient(ellipse at 50% 30%, #2a4a18, #14100c)'
              : wrong ? 'radial-gradient(ellipse at 50% 30%, #3a1410, #14100c)'
              : 'radial-gradient(ellipse at 50% 30%, #241c10, #14100c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
            gap: 6, padding: 14, transition: 'border-color .15s',
            boxShadow: drag?.over ? '0 0 18px rgba(184,122,10,0.5)' : 'none',
          }}
        >
          {solved ? (
            <span style={{ color: '#7bdc4e', fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' }}>
              ✨ Die Essenz<br />leuchtet silbern.
            </span>
          ) : progress.length === 0 ? (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center' }}>
              {wrong ? 'Der Sud verdirbt…' : 'Zutaten hierher ziehen'}
            </span>
          ) : (
            progress.map((id, i) => (
              <span key={i} title={optById[id]?.label} style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: optById[id]?.color ?? '#888',
                border: '2px solid rgba(0,0,0,0.35)',
              }} />
            ))
          )}
        </div>

        {!solved && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {progress.length} Zutat{progress.length === 1 ? '' : 'en'} im Kessel
          </div>
        )}

        {/* Zutaten-Regal */}
        {!solved && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {pz.options.map(opt => (
              <div
                key={opt.id}
                onPointerDown={e => onDown(e, opt.id)}
                onPointerMove={onMove}
                onPointerUp={onUp}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '10px 12px', borderRadius: 'var(--radius)', minWidth: 84,
                  background: 'var(--bg-mid)', border: '1px solid var(--border-dim)',
                  cursor: 'grab', touchAction: 'none', userSelect: 'none',
                  opacity: drag?.id === opt.id ? 0.4 : 1,
                }}
              >
                <span style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: opt.color, border: '2px solid rgba(0,0,0,0.35)',
                }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text)' }}>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schwebende Zutat während des Ziehens */}
      {drag && (
        <div style={{
          position: 'fixed', left: drag.x, top: drag.y, transform: 'translate(-50%, -50%)',
          width: 30, height: 30, borderRadius: '50%', pointerEvents: 'none', zIndex: 100,
          background: optById[drag.id]?.color ?? '#888',
          border: '2px solid rgba(0,0,0,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }} />
      )}
    </div>
  )
}

// ── Auswahl-Rätsel (Spiegelkammer: den wahren Spiegel finden) ───────────────────
function ChoicePuzzle({ pz }) {
  const { state, actions } = useGame()
  const st        = state.puzzles?.[pz.id] ?? { solved: false }
  const solved    = st.solved
  const correctId = pz.solution[0]
  const [pick, setPick] = useState(null)

  function choose(id) {
    if (solved) return
    setPick(id)
    actions.interactMap(pz.id, id)
  }

  const shownId  = solved ? correctId : pick
  const shownOpt = pz.options.find(o => o.id === shownId)

  return (
    <div className="gap-12">
      <div className="card">
        <div className="section-title">{pz.label}</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
          Acht Spiegel. Sieben zeigen Trug – <strong>einer zeigt, was geschah</strong>.
          Tretet vor sie und schaut hinein.
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {pz.options.map((o, i) => {
            const isCorrect = solved && o.id === correctId
            const dim = solved && o.id !== correctId
            return (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                disabled={solved}
                title={o.label}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: 6, borderRadius: 'var(--radius)', cursor: solved ? 'default' : 'pointer',
                  background: 'transparent', border: 'none', opacity: dim ? 0.4 : 1,
                  transition: 'opacity .2s',
                }}
              >
                <span style={{
                  width: '100%', aspectRatio: '0.62', borderRadius: 6,
                  background: isCorrect
                    ? 'linear-gradient(160deg, #3a6a4a, #14241a)'
                    : pick === o.id
                    ? 'linear-gradient(160deg, #5a4a2a, #1a140a)'
                    : 'linear-gradient(160deg, #6a7a86, #1a2026)',
                  border: `2px solid ${isCorrect ? '#5a8a30' : 'var(--gold-dim)'}`,
                  boxShadow: isCorrect ? '0 0 14px rgba(90,138,48,0.6)' : 'inset 0 0 12px rgba(255,255,255,0.12)',
                }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{i + 1}</span>
              </button>
            )
          })}
        </div>

        {shownOpt && (
          <div style={{
            marginTop: 14, padding: '10px 12px', borderRadius: 'var(--radius)',
            background: solved ? '#16240f' : 'var(--bg-mid)',
            border: `1px solid ${solved ? '#5a8a30' : 'var(--gold-dim)'}`,
            fontSize: '0.86rem', lineHeight: 1.6, color: 'var(--text)',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
              {shownOpt.label}
            </div>
            {solved ? '✨ ' : ''}{shownOpt.reflection}
          </div>
        )}
      </div>
    </div>
  )
}
