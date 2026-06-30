import { useState } from 'react'
import { useGame } from '../../context/GameContext'

// Archiv der Stimmen (Etage 4): alle Kristalle als Galerie auf dem geteilten Display.
// Antippen öffnet die jeweilige Erinnerung. Mehrere lassen sich nacheinander öffnen.
export default function CrystalGallery() {
  const { state } = useGame()
  const crystals = state.adventure?.crystals ?? []
  const [openId, setOpened] = useState(null)
  const [seen, setSeen] = useState(() => new Set())

  if (crystals.length === 0) {
    return <div className="empty-state">Dieses Abenteuer hat keine Kristalle.</div>
  }

  const open = crystals.find(c => c.id === openId)

  function pick(id) {
    setOpened(id)
    setSeen(prev => new Set(prev).add(id))
  }

  return (
    <div style={{ width: '100%', maxWidth: 820, margin: '0 auto' }} className="gap-12">
      <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.6 }}>
        <div style={{ fontSize: '1.4rem', color: 'var(--gold)', marginBottom: 6 }}>Archiv der Stimmen</div>
        Berührt einen Kristall, um die Erinnerung zu hören.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 14 }}>
        {crystals.map(c => {
          const active = c.id === openId
          const wasSeen = seen.has(c.id)
          return (
            <button
              key={c.id}
              onClick={() => pick(c.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                padding: '18px 10px', borderRadius: 'var(--radius)', cursor: 'pointer',
                background: active ? 'var(--bg-card)' : 'var(--bg-mid)',
                border: `2px solid ${active ? c.color : 'var(--border-dim)'}`,
                transition: 'border-color .2s, background .2s', color: 'var(--text)',
              }}
            >
              <span style={{
                width: 52, height: 52, borderRadius: '50%', background: c.color,
                boxShadow: `0 0 22px ${c.glowColor ?? c.color}`,
                opacity: wasSeen && !active ? 0.5 : 1,
              }} />
              <span style={{ fontSize: '0.86rem', fontWeight: 'bold', textAlign: 'center' }}>{c.label}</span>
              {wasSeen && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>gehört ✓</span>}
            </button>
          )
        })}
      </div>

      {open && (
        <div className="card crystal-card" style={{ '--glow': open.glowColor ?? open.color, borderColor: open.color }}>
          <div className="crystal-gem" style={{ background: open.color, boxShadow: `0 0 32px ${open.glowColor ?? open.color}` }} />
          <div style={{ fontSize: '1.1rem', color: open.color, marginBottom: 16, fontWeight: 'bold' }}>
            {open.label}
          </div>
          <div style={{ fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'left', whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
            {open.content}
          </div>
        </div>
      )}
    </div>
  )
}
