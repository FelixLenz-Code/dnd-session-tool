import { useState } from 'react'
import { useGame } from '../../context/GameContext'

const FLOOR_ID = 'konfrontation'

const PHASES = [
  { key: 'P1', title: 'Phase 1 – Kontrolle', hint: 'Mira ist freundlich, professionell. Sie will den Stein und ein schnelles Ende.' },
  { key: 'P2', title: 'Phase 2 – Druck', hint: 'Die Helden werden spezifisch (Tagebuch, Vision, Spiegel). Mira wird kühler.' },
  { key: 'P3', title: 'Phase 3 – Risse', hint: 'In die Enge getrieben wird Mira messerscharf – die Freundlichkeit fällt weg.' },
  { key: 'P4', title: 'Phase 4 – Bruchpunkt', hint: 'Mira trifft eine Entscheidung: Geständnis+Angebot (A), Flucht (B) oder Leugnung (C).' },
]

// Ordnet ein Event anhand des Label-Präfix einer Phase zu ("P1 · …", "P4A · …", "Ende 2 · …").
function phaseOf(label) {
  if (/^Ende/i.test(label)) return 'ENDE'
  const m = /^P(\d)/.exec(label)
  return m ? `P${m[1]}` : 'P1'
}
// "P4A · Geständnis + Angebot" → "Geständnis + Angebot"; "Ende 2 · …" → "Ende 2 · …"
function shortLabel(label) {
  return /^Ende/i.test(label) ? label : label.replace(/^P\d[A-C]?\s*·\s*/, '')
}

export default function ConfrontationPanel() {
  const { state, actions } = useGame()
  const [open, setOpen] = useState(null)
  const [shown, setShown] = useState(() => new Set())

  const events = (state.adventure?.events ?? []).filter(e => e.floorId === FLOOR_ID)
  const hasFloor = (state.adventure?.floors ?? []).some(f => f.id === FLOOR_ID)
  if (!hasFloor) return <div className="empty-state">Dieses Adventure hat kein Konfrontations-Finale.</div>

  const onFloor = state.currentFloor === FLOOR_ID
  const endings = events.filter(e => phaseOf(e.label) === 'ENDE')

  function show(ev) {
    actions.triggerEvent(ev.id, true)
    setShown(prev => new Set(prev).add(ev.id))
  }

  return (
    <div className="gap-12">
      <div className="card">
        <div className="section-title">Konfrontation mit Mira Vael</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6, margin: 0 }}>
          Kein Kampf – reines Roleplay. Mira ist vorbereitet, lügt gut, bleibt ruhig. Lies ihre Zeilen
          vor; mit <strong>„Aufs Display"</strong> erscheint ein Moment groß bei den Spielern.
        </p>
        {!onFloor && (
          <button className="btn btn-gold btn-full" style={{ marginTop: 12 }}
            onClick={() => actions.unlockFloor(FLOOR_ID)}>
            → Zur Konfrontation springen
          </button>
        )}
      </div>

      {PHASES.map(phase => {
        const lines = events.filter(e => phaseOf(e.label) === phase.key)
        if (lines.length === 0) return null
        return (
          <div key={phase.key} className="card">
            <div className="section-title" style={{ marginBottom: 4 }}>{phase.title}</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5, margin: '0 0 12px' }}>
              {phase.hint}
            </p>
            <div className="gap-8">
              {lines.map(ev => {
                const isOpen = open === ev.id
                const wasShown = shown.has(ev.id)
                return (
                  <div key={ev.id} style={{
                    border: `1px solid ${wasShown ? 'var(--gold-dim)' : 'var(--border-dim)'}`,
                    borderRadius: 'var(--radius)', overflow: 'hidden',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'var(--bg-mid)' }}>
                      <button onClick={() => setOpen(isOpen ? null : ev.id)}
                        style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '0.9rem', padding: 0, fontFamily: 'inherit' }}>
                        {shortLabel(ev.label)}
                        <span style={{ marginLeft: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {wasShown && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>✓ gezeigt</span>}
                      <button className="btn btn-sm btn-gold" style={{ flexShrink: 0 }} onClick={() => show(ev)}>
                        Aufs Display
                      </button>
                    </div>
                    {isOpen && (
                      <div style={{ padding: '12px 14px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-dim)', fontSize: '0.86rem', lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
                        {ev.message}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {endings.length > 0 && (
        <div className="card">
          <div className="section-title">Ende auslösen</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5, margin: '0 0 12px' }}>
            Bringt den gewählten Abschluss groß aufs Spieler-Display.
          </p>
          <div className="gap-8">
            {endings.map(ev => {
              const wasShown = shown.has(ev.id)
              return (
                <button key={ev.id} className="btn btn-full"
                  style={{
                    justifyContent: 'space-between', textAlign: 'left',
                    borderColor: wasShown ? 'var(--green)' : 'var(--border)',
                    background: wasShown ? '#0a1a10' : 'var(--bg-mid)',
                  }}
                  onClick={() => show(ev)}>
                  <span>{ev.label}</span>
                  <span style={{ fontSize: '0.75rem', color: wasShown ? '#6adc8a' : 'var(--text-muted)' }}>
                    {wasShown ? '✓ gezeigt' : 'auslösen'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
