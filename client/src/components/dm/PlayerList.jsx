import { useGame } from '../../context/GameContext'

export default function PlayerList() {
  const { state, actions } = useGame()
  const crystals = state.adventure?.crystals ?? []

  if (state.players.length === 0) {
    return <div className="empty-state">Noch keine Spieler verbunden</div>
  }

  return (
    <div className="gap-12">
      {state.players.map(player => (
        <div key={player.id} className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="player-dot" />
              <span style={{ fontWeight: 'bold' }}>{player.name}</span>
            </div>
            <span className="badge badge-green">online</span>
          </div>

          {/* Kristall zuweisen */}
          {crystals.length > 0 && (
            <div className="form-group">
              <label className="form-label">Kristall (Archiv der Stimmen)</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {crystals.map(c => {
                  const assigned = player.crystal === c.id
                  return (
                    <button
                      key={c.id}
                      className="btn btn-sm"
                      style={{
                        borderColor: assigned ? c.color : 'var(--border)',
                        background: assigned ? `${c.color}22` : 'var(--bg-mid)',
                        color: assigned ? c.color : 'var(--text-dim)',
                      }}
                      onClick={() => actions.assignCrystal(player.id, c.id)}
                    >
                      ● {c.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Item geben */}
          <GiveItemForm playerId={player.id} playerName={player.name} />
        </div>
      ))}
    </div>
  )
}

function GiveItemForm({ playerId, playerName }) {
  const { actions } = useGame()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  function send() {
    if (!name.trim()) return
    actions.giveItem(playerId, { name: name.trim(), description: desc.trim() || name.trim() })
    setName('')
    setDesc('')
  }

  return (
    <div>
      <div className="section-title" style={{ marginTop: 12 }}>Item geben</div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input className="input" style={{ flex: 1 }} placeholder="Name des Items" value={name} onChange={e => setName(e.target.value)} />
        <button className="btn btn-green btn-sm" onClick={send} disabled={!name.trim()}>Geben</button>
      </div>
    </div>
  )
}

// useState needs to be imported
import { useState } from 'react'
