import { useState } from 'react'
import { useGame } from '../../context/GameContext'

const MESSAGE_TYPES = [
  { id: 'narrative', label: 'Erzählung' },
  { id: 'vision',    label: 'Vision' },
  { id: 'secret',    label: 'Geheimnis' },
  { id: 'event',     label: 'Ereignis' },
]

export default function MessageComposer() {
  const { state, actions } = useGame()
  const [message, setMessage] = useState('')
  const [type, setType] = useState('narrative')
  const [sent, setSent] = useState(false)

  function send(showOnStage) {
    if (!message.trim()) return
    actions.sendMessage(message.trim(), type, showOnStage)
    setSent(true)
    setMessage('')
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <div className="gap-12">
      <div className="card">
        <div className="section-title">Nachricht an die Gruppe</div>

        <div className="form-group">
          <label className="form-label">Typ</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {MESSAGE_TYPES.map(t => (
              <button
                key={t.id}
                className={`btn btn-sm ${type === t.id ? 'btn-gold' : ''}`}
                onClick={() => setType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nachricht</label>
          <textarea
            className="input"
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Was sollen die Spieler sehen?"
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn btn-full ${sent ? 'btn-green' : ''}`} onClick={() => send(false)} disabled={!message.trim()}
            title="Nur in den Verlauf (nicht groß aufs Display)">
            {sent ? '✓ Gesendet' : 'In den Verlauf'}
          </button>
          <button className="btn btn-full btn-gold" onClick={() => send(true)} disabled={!message.trim()}
            title="Groß auf dem Spieler-Display anzeigen">
            Aufs Display
          </button>
        </div>
      </div>

      {/* Nachrichten-Verlauf für DM */}
      <div className="card">
        <div className="section-title">Verlauf ({state.messages.length})</div>
        {state.messages.length === 0
          ? <div className="empty-state" style={{ padding: '12px 0' }}>Noch keine Nachrichten</div>
          : [...state.messages].reverse().slice(0, 20).map(msg => (
              <div key={msg.id} className={`message ${msg.type}`} style={{ marginBottom: 8 }}>
                <div className="message-header">
                  <span>{msg.from}</span>
                  <span>{new Date(msg.ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="message-text" style={{ fontSize: '0.85rem' }}>{msg.message}</div>
              </div>
            ))
        }
      </div>
    </div>
  )
}
