import { useState } from 'react'
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
