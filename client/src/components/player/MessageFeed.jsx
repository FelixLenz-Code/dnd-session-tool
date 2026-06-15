import { useGame } from '../../context/GameContext'

export default function MessageFeed() {
  const { state } = useGame()

  if (state.messages.length === 0) {
    return (
      <div className="empty-state">
        Warte auf den DM…<br />
        <span style={{ fontSize: '0.8rem', marginTop: 8, display: 'block' }}>Nachrichten erscheinen hier</span>
      </div>
    )
  }

  return (
    <div className="message-list">
      {[...state.messages].reverse().map(msg => (
        <div key={msg.id} className={`message ${msg.type ?? 'narrative'}`}>
          <div className="message-header">
            <span style={{ textTransform: 'capitalize' }}>{labelForType(msg.type)}</span>
            <span>{new Date(msg.ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="message-text">{msg.message}</div>
          {msg.item && (
            <div style={{ marginTop: 8, padding: '6px 10px', background: 'var(--bg-mid)', borderRadius: 4, fontSize: '0.82rem', color: 'var(--gold)' }}>
              ✦ Item erhalten: {msg.item.name}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function labelForType(type) {
  const labels = { narrative: 'Erzählung', vision: 'Vision', secret: 'Geheimnis', event: 'Ereignis', reward: 'Belohnung', item: 'Item', system: 'System' }
  return labels[type] ?? type ?? 'Nachricht'
}
