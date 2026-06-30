import { useState, useEffect } from 'react'
import { useGame } from '../../context/GameContext'

export default function TimerBanner() {
  const { state } = useGame()
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (!state.timer.running) { setRemaining(0); return }
    const update = () => setRemaining(Math.max(0, Math.floor((state.timer.endTime - Date.now()) / 1000)))
    update()
    const id = setInterval(update, 500)
    return () => clearInterval(id)
  }, [state.timer])

  if (!state.timer.running || remaining <= 0) return null

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')

  return (
    <div className="timer-banner" style={{ background: remaining < 10 ? 'var(--red)' : '#7a4a00' }}>
      ⏱ {mins}:{secs}
    </div>
  )
}
