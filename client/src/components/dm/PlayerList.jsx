import { useState } from 'react'
import { useGame } from '../../context/GameContext'

export default function PlayerList() {
  const { state, actions } = useGame()
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [newSlot, setNewSlot] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const crystals = state.adventure?.crystals ?? []
  const slots = state.playerSlots ?? []

  async function createPlayer() {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/dm/create-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      })
      const data = await res.json()
      if (data.ok) {
        setNewSlot(data)
        setNewName('')
      }
    } finally {
      setCreating(false)
    }
  }

  async function deleteSlot(code) {
    await fetch(`/api/dm/player/${code}`, { method: 'DELETE' })
    if (newSlot?.code === code) setNewSlot(null)
    setDeleteConfirm(null)
  }

  return (
    <div className="gap-12">

      {/* Spieler anlegen */}
      <div className="card">
        <div className="section-title">Spieler anlegen</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: newSlot ? 12 : 0 }}>
          <input
            className="input"
            placeholder="Charaktername"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createPlayer()}
          />
          <button className="btn btn-gold" onClick={createPlayer} disabled={creating || !newName.trim()}>
            {creating ? '…' : '+ Anlegen'}
          </button>
        </div>

        {newSlot && (
          <div style={{
            background: '#0a1a0a', border: '1px solid var(--green)',
            borderRadius: 'var(--radius)', padding: '12px 14px', marginTop: 10,
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--green)', marginBottom: 6 }}>
              ✓ Spieler angelegt — Code für <strong>{newSlot.name}</strong>:
            </div>
            <div style={{
              fontSize: '1.8rem', fontFamily: 'monospace', letterSpacing: '0.25em',
              color: '#c8ffcc', textAlign: 'center', padding: '4px 0',
            }}>
              {newSlot.code}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
              Diesen Code dem Spieler geben
            </div>
          </div>
        )}
      </div>

      {/* Alle Slots */}
      <div className="card">
        <div className="section-title">Alle Spieler ({slots.length})</div>
        {slots.length === 0
          ? <div className="empty-state" style={{ padding: '12px 0' }}>Noch keine Spieler angelegt</div>
          : slots.map(slot => {
              const player = state.players.find(p => p.name === slot.name)
              return (
                <div key={slot.code} style={{
                  padding: '10px 0', borderBottom: '1px solid var(--border-dim)',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: slot.online ? 'var(--green)' : 'var(--text-muted)',
                      boxShadow: slot.online ? '0 0 4px var(--green)' : 'none',
                    }}/>
                    <span style={{ flex: 1, fontWeight: 'bold', color: slot.online ? 'var(--text)' : 'var(--text-dim)' }}>
                      {slot.name}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--gold)', letterSpacing: '0.15em' }}>
                      {slot.code}
                    </span>
                    {deleteConfirm === slot.code ? (
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--red)' }}>Löschen?</span>
                        <button className="btn btn-sm btn-red" onClick={() => deleteSlot(slot.code)}>Ja</button>
                        <button className="btn btn-sm" onClick={() => setDeleteConfirm(null)}>Nein</button>
                      </div>
                    ) : (
                      <button className="btn btn-sm" style={{ color: 'var(--text-muted)' }}
                        onClick={() => setDeleteConfirm(slot.code)}>✕</button>
                    )}
                  </div>

                  {/* Kristall zuweisen (nur wenn online) */}
                  {slot.online && crystals.length > 0 && (
                    <div style={{ paddingLeft: 16 }}>
                      <div className="form-label" style={{ marginBottom: 5 }}>Kristall zuweisen</div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {crystals.map(c => {
                          const assigned = player?.crystal === c.id
                          return (
                            <button key={c.id} className="btn btn-sm" style={{
                              borderColor: assigned ? c.color : 'var(--border)',
                              background: assigned ? `${c.color}22` : 'var(--bg-mid)',
                              color: assigned ? c.color : 'var(--text-dim)',
                            }} onClick={() => actions.assignCrystal(player.id, c.id)}>
                              ● {c.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
        }
      </div>
    </div>
  )
}
