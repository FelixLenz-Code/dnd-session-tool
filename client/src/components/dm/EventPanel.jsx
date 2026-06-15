import { useState } from 'react'
import { useGame } from '../../context/GameContext'

const TYPE_COLORS = {
  narrative: { border: 'var(--gold-dim)',  bg: '#1a1408', label: 'Erzählung' },
  vision:    { border: '#9944cc',          bg: '#140d1a', label: 'Vision'    },
  secret:    { border: '#cc6600',          bg: '#1a1000', label: 'Geheimnis' },
  event:     { border: 'var(--blue)',      bg: '#0d1420', label: 'Ereignis'  },
  reward:    { border: 'var(--green)',     bg: '#0a1a10', label: 'Belohnung' },
}

export default function EventPanel() {
  const { state, actions } = useGame()
  const [expanded, setExpanded] = useState(null)   // eventId currently expanded
  const [confirm, setConfirm]   = useState(null)   // eventId awaiting confirm
  const [triggered, setTriggered] = useState(new Set())

  if (!state.adventure) return <div className="empty-state">Kein Adventure geladen</div>

  const floors = state.adventure.floors ?? []
  const events = state.adventure.events ?? []

  const byFloor = floors.map(f => ({
    floor: f,
    events: events.filter(e => e.floorId === f.id),
  })).filter(g => g.events.length > 0)

  const unassigned = events.filter(e => !e.floorId)

  function handleTrigger(eventId) {
    actions.triggerEvent(eventId)
    setTriggered(prev => new Set([...prev, eventId]))
    setConfirm(null)
    setExpanded(null)
  }

  return (
    <div className="gap-12">
      {/* Bestätigungs-Modal */}
      {confirm && (() => {
        const ev = events.find(e => e.id === confirm)
        if (!ev) return null
        const style = TYPE_COLORS[ev.type] ?? TYPE_COLORS.narrative
        return (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: 20,
          }}>
            <div className="card" style={{ maxWidth: 460, width: '100%', border: `2px solid ${style.border}` }}>
              <div style={{ fontSize: '0.72rem', color: style.border, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                {style.label} — Bestätigen
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--gold)', marginBottom: 12, fontWeight: 'bold' }}>
                {ev.label}
              </div>
              <div style={{
                background: style.bg, border: `1px solid ${style.border}`,
                borderRadius: 'var(--radius)', padding: '12px 14px',
                fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                color: 'var(--text)', marginBottom: 16, maxHeight: 200, overflowY: 'auto',
              }}>
                {ev.message}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => handleTrigger(ev.id)}>
                  ✓ Jetzt auslösen
                </button>
                <button className="btn" style={{ flex: 1 }} onClick={() => setConfirm(null)}>
                  Abbrechen
                </button>
              </div>
              {triggered.has(ev.id) && (
                <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  ⚠ Dieses Ereignis wurde bereits ausgelöst
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {byFloor.map(({ floor, events: evs }) => (
        <div key={floor.id} className="card">
          <div className="section-title">{floor.label}</div>
          <div className="gap-8">
            {evs.map(ev => (
              <EventRow
                key={ev.id}
                event={ev}
                triggered={triggered.has(ev.id)}
                isExpanded={expanded === ev.id}
                onToggle={() => setExpanded(expanded === ev.id ? null : ev.id)}
                onConfirm={() => setConfirm(ev.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {unassigned.length > 0 && (
        <div className="card">
          <div className="section-title">Allgemein</div>
          <div className="gap-8">
            {unassigned.map(ev => (
              <EventRow
                key={ev.id}
                event={ev}
                triggered={triggered.has(ev.id)}
                isExpanded={expanded === ev.id}
                onToggle={() => setExpanded(expanded === ev.id ? null : ev.id)}
                onConfirm={() => setConfirm(ev.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EventRow({ event, triggered, isExpanded, onToggle, onConfirm }) {
  const style = TYPE_COLORS[event.type] ?? TYPE_COLORS.narrative

  return (
    <div style={{
      border: `1px solid ${triggered ? 'var(--border-dim)' : style.border}`,
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      opacity: triggered ? 0.7 : 1,
    }}>
      {/* Header-Zeile */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 12px', background: 'var(--bg-mid)',
      }}>
        {/* Typ-Badge */}
        <span style={{
          fontSize: '0.7rem', fontWeight: 'bold', color: style.border,
          textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0,
        }}>
          {style.label}
        </span>

        {/* Label — klickbar für Detailansicht */}
        <button onClick={onToggle} style={{
          flex: 1, textAlign: 'left', background: 'none', border: 'none',
          color: 'var(--text)', cursor: 'pointer', fontSize: '0.9rem', padding: 0,
          fontFamily: 'inherit',
        }}>
          {event.label}
          <span style={{ marginLeft: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </button>

        {triggered && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>✓ gesendet</span>
        )}

        {/* Auslösen-Button */}
        <button className="btn btn-sm btn-gold" onClick={onConfirm} style={{ flexShrink: 0 }}>
          {triggered ? 'Nochmal' : 'Auslösen'}
        </button>
      </div>

      {/* Detail-Ansicht */}
      {isExpanded && (
        <div style={{
          padding: '12px 14px',
          background: style.bg,
          borderTop: `1px solid ${style.border}`,
          fontSize: '0.86rem', lineHeight: 1.7,
          color: 'var(--text)', whiteSpace: 'pre-wrap',
        }}>
          {event.message}
        </div>
      )}
    </div>
  )
}
