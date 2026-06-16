import { useGame } from '../../context/GameContext'
import { SEASONS } from '../../puzzles'

// Keller – Jahreszeiten-Rätsel. Anzeige-Reihenfolge wie auf der alten Karte
// (Winter, Frühling / Herbst, Sommer), damit die Lösung nicht trivial ist.
const TOTAL = SEASONS.length

export default function PuzzleView() {
  const { state, actions } = useGame()
  const pz    = state.puzzles?.['floor-keller'] ?? { progress: [], solved: false }
  const wrong = state.puzzleWrong === 'floor-keller'
  const { progress, solved } = pz

  function pick(id) {
    if (solved) return
    actions.interactMap('floor-keller', id)
  }

  return (
    <div className="gap-12">
      <div className="card">
        <div className="section-title">Versiegelte Pforte</div>
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
            {wrong ? 'Falsch — die Symbole erlöschen…' : `${progress.length} / ${TOTAL} Symbolen richtig`}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {SEASONS.map(({ id, sym, label }) => {
            const idx = progress.indexOf(id)
            const sel = idx !== -1
            return (
              <button
                key={id}
                onClick={() => pick(id)}
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
