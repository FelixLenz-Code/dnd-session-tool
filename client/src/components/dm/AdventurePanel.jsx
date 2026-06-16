import { useRef } from 'react'
import { useGame } from '../../context/GameContext'

export default function AdventurePanel() {
  const { state, actions } = useGame()
  const fileRef = useRef()
  const adventure = state.adventure
  const floors = adventure?.floors ?? []

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        actions.loadAdventure(JSON.parse(ev.target.result))
      } catch {
        alert('Ungültige JSON-Datei')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="gap-12">
      <div className="card">
        <div className="section-title">Adventure</div>
        {adventure ? (
          <>
            <div style={{ fontSize: '1.2rem', color: 'var(--gold)', marginBottom: 6 }}>{adventure.title}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 14 }}>
              {adventure.description}
            </div>
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

      {adventure && floors.length > 0 && (
        <div className="card">
          <div className="section-title">Etagen ({floors.length})</div>
          <div className="gap-8">
            {floors.map((f, i) => (
              <div key={f.id} style={{
                display: 'flex', gap: 10, padding: '8px 10px',
                background: 'var(--bg-mid)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius)',
              }}>
                <span style={{ color: 'var(--gold-dim)', fontSize: '0.85rem', flexShrink: 0 }}>{i}</span>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{f.label}</div>
                  {f.description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{f.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
