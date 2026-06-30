import { useState } from 'react'
import { useGame } from '../../context/GameContext'

// „Regie": zeigt dem DM zur aktuellen Etage, was er sagen/erzählen kann,
// das Ziel, Welt-Details zum Ausspielen und (ausklappbar) die Lösung.
export default function DirectorPanel() {
  const { state } = useGame()
  const [open, setOpen] = useState(false)

  const floor = state.adventure?.floors?.find(f => f.id === state.currentFloor)
  const g = floor?.dmGuide

  if (!floor || !g) {
    return (
      <div className="card" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
        <div className="section-title" style={{ fontStyle: 'normal' }}>Regie</div>
        Schalte unten bei „Etagen & Rätsel" eine Etage frei – dann erscheinen hier die
        Erzähl-Hinweise für diesen Schritt.
      </div>
    )
  }

  return (
    <div className="card gap-12" style={{ borderColor: 'var(--gold-dim)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span className="section-title" style={{ margin: 0 }}>Regie</span>
        <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{floor.label}</span>
      </div>

      {/* Aufhänger – was der DM sagen kann */}
      {g.say && (
        <div style={{
          borderLeft: '3px solid var(--gold)', paddingLeft: 14, fontSize: '1.05rem',
          lineHeight: 1.7, color: 'var(--text)', fontStyle: 'italic',
        }}>
          {g.say}
        </div>
      )}

      {/* Szene / Atmosphäre */}
      {g.scene && (
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {g.scene}
        </p>
      )}

      {/* Ziel */}
      {g.goal && (
        <div style={{
          padding: '8px 12px', borderRadius: 'var(--radius)', background: 'var(--bg-mid)',
          border: '1px solid var(--border-dim)', fontSize: '0.9rem',
        }}>
          <span style={{ color: 'var(--gold-dim)', fontWeight: 'bold' }}>Ziel: </span>
          {g.goal}
        </div>
      )}

      {/* Welt-Details & Lösung ausklappbar */}
      {(g.details?.length > 0 || g.solution) && (
        <div>
          <button className="btn btn-sm" onClick={() => setOpen(o => !o)} style={{ width: '100%' }}>
            {open ? '▲ Welt-Details & Lösung ausblenden' : '▼ Welt-Details & Lösung'}
          </button>

          {open && (
            <div className="gap-8" style={{ marginTop: 10 }}>
              {g.details?.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {g.details.map((dt, i) => <li key={i} style={{ marginBottom: 4 }}>{dt}</li>)}
                </ul>
              )}
              {g.solution && (
                <div style={{
                  padding: '8px 10px', borderRadius: 'var(--radius)',
                  background: '#1a1408', border: '1px solid var(--gold-dim)',
                  fontSize: '0.85rem', color: 'var(--gold)',
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Lösung: </span>{g.solution}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
