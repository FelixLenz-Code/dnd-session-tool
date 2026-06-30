import { useState, useRef } from 'react'
import { useGame } from '../../context/GameContext'
import { PUZZLE_BY_FLOOR } from '../../puzzles'

// Steuert, was auf dem geteilten Spieler-Display zu sehen ist (die „Bühne").
export default function StagePanel() {
  const { state, actions } = useGame()
  const mode = state.stage?.mode ?? 'cover'
  const hasPuzzle = !!PUZZLE_BY_FLOOR[state.currentFloor]
  const hasCrystals = (state.adventure?.crystals ?? []).length > 0
  const hasQuestions = (state.adventure?.aldricQuestions ?? []).length > 0
  const currentUrl = state.stage?.payload?.url

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
    <div className="gap-12">
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="player-dot" style={{ background: state.displayOnline ? 'var(--green)' : 'var(--text-muted)', boxShadow: state.displayOnline ? '0 0 4px var(--green)' : 'none' }} />
        <span style={{ color: state.displayOnline ? 'var(--text)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
          {state.displayOnline ? 'Spieler-Display verbunden' : 'Spieler-Display nicht verbunden'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Code: <strong style={{ color: 'var(--gold)', letterSpacing: '0.12em' }}>{state.code ?? '—'}</strong>
        </span>
      </div>

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
      </div>

      <ImageManager mode={mode} currentUrl={currentUrl} />

      <FindsManager />

      {mode === 'narration' && (
        <div className="card" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Aktuell wird ein Erzähltext angezeigt. Über den „Titelbild"-Knopf zurück zur Ruheansicht.
        </div>
      )}
    </div>
  )
}

// Geteilte Funde der Gruppe ein-/ausblenden (erscheinen als Leiste am Display).
function FindsManager() {
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
function ImageManager({ mode, currentUrl }) {
  const { state, actions } = useGame()
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
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
      const meta = await actions.uploadImage(file.name.replace(/\.[^.]+$/, ''), dataUrl)
      show(meta)
    } catch (err) {
      setError(err.message || 'Upload fehlgeschlagen')
    } finally {
      setBusy(false)
    }
  }

  function showUrl() {
    const u = url.trim()
    if (!u) return
    actions.setStage('image', { url: u, label: 'Karte' })
    setUrl('')
  }

  return (
    <div className="card gap-12">
      <div className="section-title">Karte / Bild zeigen</div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
        <button className="btn btn-gold" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? 'Lädt…' : '⬆ Bild hochladen'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" placeholder="…oder Bild-URL einfügen" value={url}
          onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && showUrl()} />
        <button className="btn" disabled={!url.trim()} onClick={showUrl}>Zeigen</button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }}>
          {images.map(img => {
            const active = mode === 'image' && currentUrl === img.url
            return (
              <button key={img.id} onClick={() => show(img)} title={img.name}
                style={{
                  padding: 4, borderRadius: 'var(--radius)', cursor: 'pointer',
                  background: 'var(--bg-mid)',
                  border: `2px solid ${active ? 'var(--gold)' : 'var(--border-dim)'}`,
                }}>
                <img src={img.url} alt={img.name}
                  style={{ width: '100%', height: 64, objectFit: 'cover', borderRadius: 4, display: 'block' }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {img.name}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
