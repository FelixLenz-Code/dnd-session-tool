import { useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'
import { PUZZLES, SEASON_BY_ID } from '../../puzzles'

export default function Dashboard() {
  const { state, actions } = useGame()
  const fileRef = useRef()
  const [lockConfirm, setLockConfirm] = useState(null)
  const [resetConfirm, setResetConfirm] = useState(null)

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result)
        actions.loadAdventure(json)
      } catch {
        alert('Ungültige JSON-Datei')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const adventure = state.adventure
  const floors = adventure?.floors ?? []
  const currentFloor = floors.find(f => f.id === state.currentFloor)

  return (
    <div className="gap-12">

      {/* Adventure laden */}
      <div className="card">
        <div className="section-title">Adventure</div>
        {adventure ? (
          <>
            <div style={{ fontSize: '1.1rem', color: 'var(--gold)', marginBottom: 4 }}>{adventure.title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: 12 }}>{adventure.description}</div>
            <button className="btn btn-sm" onClick={() => fileRef.current.click()}>Adventure wechseln</button>
          </>
        ) : (
          <>
            <div className="empty-state" style={{ padding: '20px 0' }}>Kein Adventure geladen</div>
            <button className="btn btn-gold btn-full" onClick={() => fileRef.current.click()}>Adventure-JSON laden</button>
          </>
        )}
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
      </div>

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
              const isSeq     = pz.type === 'sequence'
              const total     = isSeq ? pz.solution.length : 1
              const done      = st.solved ? total : (isSeq ? (st.progress?.length ?? 0) : 0)
              const touched   = st.solved || done > 0
              const confirming = resetConfirm === pz.id

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
                    <span style={{ fontSize: '0.78rem', fontWeight: 'bold',
                      color: st.solved ? 'var(--gold)' : 'var(--text-muted)' }}>
                      {st.solved ? '✓ gelöst' : isSeq ? `${done} / ${total}` : 'offen'}
                    </span>
                  </div>

                  {isSeq ? (
                    /* Schritt-Sequenz: gelöste Schritte mit Symbol, offene als ○ */
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {pz.solution.map((sid, i) => {
                        const isDone = i < done
                        const s = SEASON_BY_ID[sid] ?? { sym: '?', label: sid }
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
                                <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{s.sym}</span>
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
                    /* Passwort-Rätsel: kein Schritt-Fortschritt */
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Passwort-Eingabe — {pz.prompt}
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
