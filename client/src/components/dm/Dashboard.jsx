import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { PUZZLES } from '../../puzzles'

export default function Dashboard() {
  const { state, actions } = useGame()
  const [lockConfirm, setLockConfirm] = useState(null)
  const [resetConfirm, setResetConfirm] = useState(null)
  const [infoOpen, setInfoOpen] = useState(null)

  const adventure = state.adventure
  const floors = adventure?.floors ?? []
  const currentFloor = floors.find(f => f.id === state.currentFloor)

  return (
    <div className="gap-12">

      {/* Fortschritt */}
      {adventure && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 14 }}>
            Fortschritt — {currentFloor?.label ?? 'noch nicht gestartet'}
          </div>

          <div className="gap-8">
            {floors.map(f => {
              const isUnlocked = state.unlockedFloors.includes(f.id)
              const isCurrent = state.currentFloor === f.id
              const isLocking = lockConfirm === f.id

              return (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px',
                  background: isCurrent ? '#2a1e08' : isUnlocked ? '#1e1a10' : 'var(--bg-mid)',
                  border: `1px solid ${isCurrent ? 'var(--gold)' : isUnlocked ? 'var(--gold-dim)' : 'var(--border-dim)'}`,
                  borderRadius: 'var(--radius)',
                }}>
                  {/* Status-Icon */}
                  <span style={{ fontSize: '0.9rem', width: 20, textAlign: 'center', flexShrink: 0,
                    color: isCurrent ? 'var(--gold)' : isUnlocked ? 'var(--gold-dim)' : 'var(--text-muted)' }}>
                    {isCurrent ? '▶' : isUnlocked ? '✓' : '○'}
                  </span>

                  {/* Label */}
                  <span style={{ flex: 1, fontSize: '0.88rem',
                    color: isCurrent ? 'var(--gold)' : isUnlocked ? 'var(--text)' : 'var(--text-muted)' }}>
                    {f.label}
                  </span>

                  {/* Aktionen */}
                  {isLocking ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>Sperren?</span>
                      <button className="btn btn-sm btn-red" onClick={() => { actions.lockFloor(f.id); setLockConfirm(null) }}>Ja</button>
                      <button className="btn btn-sm" onClick={() => setLockConfirm(null)}>Nein</button>
                    </div>
                  ) : isUnlocked || isCurrent ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!isCurrent && (
                        <button className="btn btn-sm btn-gold" onClick={() => actions.unlockFloor(f.id)}>
                          Wechseln
                        </button>
                      )}
                      <button className="btn btn-sm" style={{ color: 'var(--text-muted)' }}
                        onClick={() => setLockConfirm(f.id)} title="Etage sperren">
                        🔒
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-sm btn-gold" onClick={() => actions.unlockFloor(f.id)}>
                      Freischalten
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Rätsel-Fortschritt */}
      {adventure && PUZZLES.length > 0 && (
        <div className="card">
          <div className="section-title">Rätsel-Fortschritt</div>
          <div className="gap-8">
            {PUZZLES.map(pz => {
              const st        = state.puzzles?.[pz.id] ?? { progress: [], solved: false }
              const isOrdered = pz.type === 'sequence' || pz.type === 'mix'
              const optById   = Object.fromEntries((pz.options ?? []).map(o => [o.id, o]))
              const total     = isOrdered ? pz.solution.length : 1
              const done      = st.solved ? total : (isOrdered ? (st.progress?.length ?? 0) : 0)
              const touched   = st.solved || done > 0
              const confirming = resetConfirm === pz.id
              const showInfo  = infoOpen === pz.id
              const solutionText = isOrdered
                ? pz.solution.map(id => optById[id]?.label ?? id).join(' → ')
                : pz.type === 'choice'
                ? (optById[pz.solution?.[0]]?.label ?? pz.solution?.[0])
                : pz.answer

              return (
                <div key={pz.id} style={{
                  padding: 12, background: 'var(--bg-mid)',
                  border: `1px solid ${st.solved ? 'var(--gold-dim)' : 'var(--border-dim)'}`,
                  borderRadius: 'var(--radius)',
                }}>
                  {/* Kopf */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text)' }}>
                      {pz.label} <span style={{ color: 'var(--text-muted)' }}>({pz.floorLabel})</span>
                    </span>
                    <button
                      onClick={() => setInfoOpen(showInfo ? null : pz.id)}
                      title="Lösung anzeigen"
                      style={{
                        flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                        border: `1px solid ${showInfo ? 'var(--gold)' : 'var(--border-dim)'}`,
                        background: showInfo ? 'var(--gold)' : 'transparent',
                        color: showInfo ? '#1a0e06' : 'var(--text-muted)',
                        fontSize: '0.8rem', fontStyle: 'italic', fontWeight: 'bold',
                        cursor: 'pointer', lineHeight: 1,
                      }}>
                      i
                    </button>
                    <span style={{ fontSize: '0.78rem', fontWeight: 'bold',
                      color: st.solved ? 'var(--gold)' : 'var(--text-muted)' }}>
                      {st.solved ? '✓ gelöst' : isOrdered ? `${done} / ${total}` : 'offen'}
                    </span>
                  </div>

                  {/* Lösung (nur DM, auf Knopfdruck) */}
                  {showInfo && (
                    <div style={{
                      marginBottom: 10, padding: '8px 10px', borderRadius: 'var(--radius)',
                      background: '#1a1408', border: '1px solid var(--gold-dim)',
                      fontSize: '0.82rem', color: 'var(--gold)',
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Lösung: </span>{solutionText}
                    </div>
                  )}

                  {isOrdered ? (
                    /* Geordnete Schritte: gelöste mit Symbol/Farbe, offene als ○ */
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {pz.solution.map((sid, i) => {
                        const isDone = i < done
                        const s = optById[sid] ?? { label: sid }
                        return (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 9px',
                            borderRadius: 'var(--radius)',
                            background: isDone ? '#243f17' : 'transparent',
                            border: `1px solid ${isDone ? '#5a8a30' : 'var(--border-dim)'}`,
                            opacity: isDone ? 1 : 0.55,
                          }}>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{i + 1}</span>
                            {isDone ? (
                              <>
                                {s.sym
                                  ? <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{s.sym}</span>
                                  : <span style={{ width: 14, height: 14, borderRadius: '50%', background: s.color ?? '#888', border: '1px solid rgba(0,0,0,0.3)' }} />}
                                <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>{s.label}</span>
                                <span style={{ color: '#7bdc4e', fontSize: '0.8rem' }}>✓</span>
                              </>
                            ) : (
                              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>○</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    /* Passwort-/Auswahl-Rätsel: kein Schritt-Fortschritt */
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {pz.type === 'choice' ? 'Auswahl' : 'Passwort-Eingabe'} — {pz.prompt}
                    </div>
                  )}

                  {/* Zurücksetzen */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    {confirming ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>Zurücksetzen?</span>
                        <button className="btn btn-sm btn-red"
                          onClick={() => { actions.resetPuzzle(pz.id); setResetConfirm(null) }}>Ja</button>
                        <button className="btn btn-sm" onClick={() => setResetConfirm(null)}>Nein</button>
                      </div>
                    ) : (
                      <button className="btn btn-sm" disabled={!touched}
                        style={{ opacity: touched ? 1 : 0.4, cursor: touched ? 'pointer' : 'not-allowed' }}
                        onClick={() => setResetConfirm(pz.id)}>
                        Zurücksetzen
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Spieler online */}
      <div className="card">
        <div className="section-title">Verbundene Spieler ({state.players.length})</div>
        {state.players.length === 0
          ? <div className="empty-state" style={{ padding: '12px 0' }}>Noch niemand verbunden</div>
          : state.players.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-dim)' }}>
              <span className="player-dot" />
              <span>{p.name}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
