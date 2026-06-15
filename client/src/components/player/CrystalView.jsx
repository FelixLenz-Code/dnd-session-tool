import { useGame } from '../../context/GameContext'

export default function CrystalView() {
  const { state } = useGame()
  const crystal = state.crystal

  if (!crystal) {
    return (
      <div className="empty-state">
        Du hast noch keinen Kristall<br />
        <span style={{ fontSize: '0.8rem', marginTop: 8, display: 'block' }}>
          Der DM weist dir einen zu, wenn ihr das Archiv der Stimmen erreicht
        </span>
      </div>
    )
  }

  return (
    <div className="gap-12">
      <div className="card crystal-card" style={{ '--glow': crystal.glowColor ?? crystal.color }}>
        <div className="crystal-gem" style={{ background: crystal.color, boxShadow: `0 0 32px ${crystal.glowColor ?? crystal.color}` }} />
        <div style={{ fontSize: '1rem', color: crystal.color, marginBottom: 16, fontWeight: 'bold' }}>
          {crystal.label}
        </div>
        <div style={{ fontSize: '0.9rem', lineHeight: 1.7, textAlign: 'left', whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
          {crystal.content}
        </div>
      </div>
      <div className="card" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        Nur du siehst diese Aufzeichnung. Erzähle den anderen was du gehört hast.
      </div>
    </div>
  )
}
