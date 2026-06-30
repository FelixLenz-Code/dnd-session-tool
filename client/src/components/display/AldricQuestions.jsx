import { useState } from 'react'
import { useGame } from '../../context/GameContext'

// Sanctum (Etage 5): Aldrics Aufzeichnung stellt Fragen. Reines Roleplay –
// der Aegisstein leuchtet bei ehrlichen Antworten. Fragen aus adventure.aldricQuestions.
export default function AldricQuestions() {
  const { state } = useGame()
  const questions = state.adventure?.aldricQuestions ?? []
  const [active, setActive] = useState(null)

  return (
    <div style={{ width: '100%', maxWidth: 820, margin: '0 auto' }} className="gap-12">
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 84, height: 84, margin: '0 auto 16px', borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 32%, #7db4ff, #2a5cc0 55%, #10204a)',
            boxShadow: '0 0 42px #3a6ed0, inset 0 0 18px rgba(255,255,255,0.35)',
          }}
        />
        <div style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: 8 }}>Aldrics Fragen</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 620, margin: '0 auto' }}>
          »Antwortet ehrlich – der Stein weiß den Unterschied.«<br />
          Der Aegisstein leuchtet heller bei ehrlichen Antworten, kalt bei Ausweichen.
        </div>
      </div>

      <div className="gap-8">
        {questions.map((q, i) => {
          const isActive = active === i
          return (
            <button
              key={i}
              onClick={() => setActive(isActive ? null : i)}
              style={{
                textAlign: 'left', width: '100%', cursor: 'pointer', fontFamily: 'inherit',
                padding: isActive ? '20px 22px' : '14px 18px', borderRadius: 'var(--radius)',
                background: isActive ? '#16223f' : 'var(--bg-mid)',
                border: `2px solid ${isActive ? '#4a80c0' : 'var(--border-dim)'}`,
                color: 'var(--text)', transition: 'all .2s',
                fontSize: isActive ? '1.5rem' : '1.05rem', lineHeight: 1.5,
                boxShadow: isActive ? '0 0 24px rgba(74,128,192,0.35)' : 'none',
              }}
            >
              <span style={{ color: 'var(--text-muted)', marginRight: 10, fontSize: '0.9em' }}>{i + 1}.</span>
              {q}
            </button>
          )
        })}
      </div>
    </div>
  )
}
