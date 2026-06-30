import { useState, useRef } from 'react'
import { useGame } from '../../context/GameContext'
import { PUZZLE_BY_FLOOR } from '../../puzzles'

// Bühnen-Umschaltung: was zeigt das geteilte Spieler-Display gerade?
export function SceneControls() {
  const { state, actions } = useGame()
  const mode = state.stage?.mode ?? 'cover'
  const hasPuzzle = !!PUZZLE_BY_FLOOR[state.currentFloor]
  const hasCrystals = (state.adventure?.crystals ?? []).length > 0
  const hasQuestions = (state.adventure?.aldricQuestions ?? []).length > 0

  const SceneButton = ({ active, disabled, onClick, icon, label, hint }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
        padding: '14px 16px', borderRadius: 'var(--radius)', width: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
        background: active ? '#2a1e08' : 'var(--bg-mid)',
        border: `2px solid ${active ? 'var(--gold)' : 'var(--border-dim)'}`,
        color: 'var(--text)', fontFamily: 'inherit',
      }}
    >
      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontWeight: 'bold', color: active ? 'var(--gold)' : 'var(--text)' }}>{label}</span>
        {hint && <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{hint}</span>}
      </span>
      {active && <span style={{ fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>aktiv</span>}
    </button>
  )

  return (
    <div className="card gap-8">
      <div className="section-title">Was zeigt das Display?</div>

      <SceneButton active={mode === 'cover'} onClick={() => actions.setStage('cover')}
        icon="🗼" label="Titelbild" hint="Ruhezustand zwischen den Szenen" />

      <SceneButton active={mode === 'puzzle'} disabled={!hasPuzzle}
        onClick={() => actions.setStage('puzzle')}
        icon="🧩" label="Rätsel der aktuellen Etage"
        hint={hasPuzzle ? 'Die Gruppe tippt direkt am Display' : 'Diese Etage hat kein Rätsel'} />

      <SceneButton active={mode === 'crystals'} disabled={!hasCrystals}
        onClick={() => actions.setStage('crystals')}
        icon="🔮" label="Kristall-Galerie" hint="Archiv der Stimmen (Etage 4)" />

      <SceneButton active={mode === 'questions'} disabled={!hasQuestions}
        onClick={() => actions.setStage('questions')}
        icon="🔵" label="Aldrics Fragen" hint="Sanctum (Etage 5) – Roleplay-Fragen" />

      {mode === 'narration' && (
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
          Aktuell läuft ein Erzähltext/Vision. „Titelbild" bringt das Display zur Ruhe zurück.
        </div>
      )}
    </div>
  )
}

// Eigene Sounddateien hochladen, benennen und aufs Spieler-Display abspielen.
export function SoundManager() {
  const { state, actions } = useGame()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const fileRef = useRef(null)
  const sounds = state.sounds ?? []

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(''); setBusy(true)
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result)
        r.onerror = reject
        r.readAsDataURL(file)
      })
      const fallback = file.name.replace(/\.[^.]+$/, '')
      await actions.uploadSound(name.trim() || fallback, dataUrl)
      setName('')
    } catch (err) {
      setError(err.message || 'Upload fehlgeschlagen')
    } finally {
      setBusy(false)
    }
  }

  function saveRename(id) {
    const n = editName.trim()
    if (n) actions.renameSound(id, n)
    setEditing(null)
  }

  return (
    <div className="card gap-12">
      <div className="section-title">Klang</div>

      <input ref={fileRef} type="file" accept="audio/*" onChange={onFile} style={{ display: 'none' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" placeholder="Name (optional)" value={name}
          onChange={e => setName(e.target.value)} />
        <button className="btn btn-gold" disabled={busy} onClick={() => fileRef.current?.click()} style={{ flexShrink: 0 }}>
          {busy ? 'Lädt…' : '⬆ Sound hochladen'}
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {sounds.length === 0 ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Noch keine Sounds. Lade eigene Dateien hoch (z.B. Tür, Knall, Musik).
        </div>
      ) : (
        <div className="gap-8">
          {sounds.map(s => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
              background: 'var(--bg-mid)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius)',
            }}>
              {editing === s.id ? (
                <>
                  <input className="input" style={{ flex: 1, fontSize: '0.85rem' }} value={editName} autoFocus
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveRename(s.id)} />
                  <button className="btn btn-sm btn-gold" onClick={() => saveRename(s.id)}>✓</button>
                  <button className="btn btn-sm" onClick={() => setEditing(null)}>✕</button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontSize: '0.9rem' }}>🔊 {s.name}</span>
                  <button className="btn btn-sm btn-gold" disabled={!state.displayOnline}
                    title={state.displayOnline ? 'Auf dem Display abspielen' : 'Kein Display verbunden'}
                    onClick={() => actions.playSound(s.id)}>▶ Abspielen</button>
                  <button className="btn btn-sm" title="Umbenennen"
                    onClick={() => { setEditing(s.id); setEditName(s.name) }}>✎</button>
                  <button className="btn btn-sm" style={{ color: 'var(--text-muted)' }}
                    title="Entfernen" onClick={() => actions.removeSound(s.id)}>✕</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
        Töne kommen aus dem Spieler-Display. Falls stumm: einmal aufs Display tippen (Audio-Freigabe).
      </div>
    </div>
  )
}

// Geteilte Funde der Gruppe ein-/ausblenden (erscheinen als Leiste am Display).
export function FindsManager() {
  const { state, actions } = useGame()
  const [label, setLabel] = useState('')
  const finds = state.finds ?? []
  const catalog = state.adventure?.items ?? []
  const shownIds = new Set(finds.map(f => f.id))

  function addFree() {
    const text = label.trim()
    if (!text) return
    actions.addFind({ label: text })
    setLabel('')
  }

  return (
    <div className="card gap-12">
      <div className="section-title">Funde der Gruppe</div>

      {catalog.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {catalog.map(item => {
            const active = shownIds.has(item.id)
            return (
              <button key={item.id}
                className={`btn btn-sm ${active ? 'btn-green' : ''}`}
                onClick={() => active ? actions.removeFind(item.id) : actions.addFind(item)}
                title={active ? 'Vom Display entfernen' : 'Aufs Display einblenden'}>
                {item.icon ?? '✦'} {item.label}{active ? ' ✓' : ''}
              </button>
            )
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" placeholder="Eigener Fund…" value={label}
          onChange={e => setLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && addFree()} />
        <button className="btn" disabled={!label.trim()} onClick={addFree}>+ Einblenden</button>
      </div>

      {finds.length > 0 && (
        <div className="gap-8">
          {finds.map(f => (
            <div key={f.id} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
              background: 'var(--bg-mid)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius)',
            }}>
              <span style={{ flexShrink: 0 }}>{f.icon}</span>
              <span style={{ flex: 1, fontSize: '0.88rem' }}>{f.label}</span>
              <button className="btn btn-sm" style={{ color: 'var(--text-muted)' }}
                onClick={() => actions.removeFind(f.id)} title="Vom Display entfernen">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Karten/Handouts/Visionen als Bild aufs Display bringen — Upload oder URL.
export function ImageManager() {
  const { state, actions } = useGame()
  const mode = state.stage?.mode ?? 'cover'
  const currentUrl = state.stage?.payload?.url
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const fileRef = useRef(null)
  const images = state.images ?? []

  function show(img) {
    actions.setStage('image', { url: img.url, label: img.name })
  }

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(''); setBusy(true)
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result)
        r.onerror = reject
        r.readAsDataURL(file)
      })
      const fallback = file.name.replace(/\.[^.]+$/, '')
      await actions.uploadImage(name.trim() || fallback, dataUrl)  // nur in die Galerie, nicht sofort zeigen
      setName('')
    } catch (err) {
      setError(err.message || 'Upload fehlgeschlagen')
    } finally {
      setBusy(false)
    }
  }

  function showUrl() {
    const u = url.trim()
    if (!u) return
    actions.setStage('image', { url: u, label: name.trim() || 'Karte' })
    setUrl('')
  }

  function saveRename(id) {
    const n = editName.trim()
    if (n) actions.renameImage(id, n)
    setEditing(null)
  }

  return (
    <div className="card gap-12">
      <div className="section-title">Karte / Bild zeigen</div>

      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" placeholder="Name (optional)" value={name}
          onChange={e => setName(e.target.value)} />
        <button className="btn btn-gold" disabled={busy} onClick={() => fileRef.current?.click()} style={{ flexShrink: 0 }}>
          {busy ? 'Lädt…' : '⬆ Karte hochladen'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" placeholder="…oder Bild-URL einfügen" value={url}
          onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && showUrl()} />
        <button className="btn" disabled={!url.trim()} onClick={showUrl}>Zeigen</button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {images.length === 0 ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Noch keine Karten. Lade Bilder hoch – sie landen hier und lassen sich per Klick zeigen.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
          {images.map(img => {
            const active = mode === 'image' && currentUrl === img.url
            return (
              <div key={img.id} style={{
                borderRadius: 'var(--radius)', overflow: 'hidden',
                border: `2px solid ${active ? 'var(--gold)' : 'var(--border-dim)'}`, background: 'var(--bg-mid)',
              }}>
                <button onClick={() => show(img)} title="Aufs Display zeigen"
                  style={{ display: 'block', width: '100%', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}>
                  <img src={img.url} alt={img.name}
                    style={{ width: '100%', height: 72, objectFit: 'cover', display: 'block' }} />
                </button>
                {editing === img.id ? (
                  <div style={{ display: 'flex', gap: 4, padding: 4 }}>
                    <input className="input" style={{ flex: 1, fontSize: '0.75rem', padding: '4px 6px' }} value={editName} autoFocus
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveRename(img.id)} />
                    <button className="btn btn-sm btn-gold" onClick={() => saveRename(img.id)}>✓</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '4px 6px' }}>
                    <span style={{ flex: 1, fontSize: '0.72rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={img.name}>
                      {img.name}
                    </span>
                    <button className="btn btn-sm" style={{ padding: '2px 6px' }} title="Umbenennen"
                      onClick={() => { setEditing(img.id); setEditName(img.name) }}>✎</button>
                    <button className="btn btn-sm" style={{ padding: '2px 6px', color: 'var(--text-muted)' }} title="Entfernen"
                      onClick={() => actions.removeImage(img.id)}>✕</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
