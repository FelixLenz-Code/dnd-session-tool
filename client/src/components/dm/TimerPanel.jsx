import { useState, useEffect } from 'react'
import { useGame } from '../../context/GameContext'

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '60s', seconds: 60 },
  { label: '2min', seconds: 120 },
  { label: '5min', seconds: 300 },
]

export default function TimerPanel() {
  const { state, actions } = useGame()
  const [custom, setCustom] = useState('')
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (!state.timer.running) { setRemaining(0); return }
    const update = () => {
      const rem = Math.max(0, Math.floor((state.timer.endTime - Date.now()) / 1000))
      setRemaining(rem)
      if (rem <= 0) actions.stopTimer()
    }
    update()
    const id = setInterval(update, 500)
    return () => clearInterval(id)
  }, [state.timer])

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')

  function start(seconds) {
    actions.startTimer(seconds)
  }

  return (
    <div className="gap-12">
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="section-title">Aktueller Timer</div>
        <div className={`timer-display ${remaining < 10 && remaining > 0 ? 'urgent' : ''}`}>
          {state.timer.running ? `${mins}:${secs}` : '—'}
        </div>
        {state.timer.running && (
          <button className="btn btn-red btn-full" style={{ marginTop: 16 }} onClick={() => actions.stopTimer()}>
            Stopp
          </button>
        )}
      </div>

      <div className="card">
        <div className="section-title">Timer starten</div>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          {PRESETS.map(p => (
            <button key={p.label} className="btn btn-gold" onClick={() => start(p.seconds)}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            type="number"
            placeholder="Sekunden"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            min={1}
          />
          <button className="btn btn-gold" onClick={() => { if (custom > 0) start(Number(custom)) }}>
            Start
          </button>
        </div>
      </div>
    </div>
  )
}
