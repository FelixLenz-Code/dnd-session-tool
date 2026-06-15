import { useState } from 'react'
import { useGame } from '../context/GameContext'

export default function JoinView() {
  const { actions } = useGame()
  const [tab, setTab] = useState('player')
  const [playerCode, setPlayerCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePlayerJoin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await actions.joinAsPlayer(playerCode.trim())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDMJoin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await actions.joinAsDM(password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen-center">
      <div className="card join-card">
        <div className="join-title">⚔ DnD Session Tool</div>
        <div className="join-subtitle">Verbinde dich mit deiner Session</div>

        <div className="tabs" style={{ marginBottom: 20, borderRadius: 'var(--radius)' }}>
          <button className={`tab ${tab === 'player' ? 'active' : ''}`}
            onClick={() => { setTab('player'); setError('') }}>Spieler</button>
          <button className={`tab ${tab === 'dm' ? 'active' : ''}`}
            onClick={() => { setTab('dm'); setError('') }}>Dungeon Master</button>
        </div>

        {tab === 'player' && (
          <form onSubmit={handlePlayerJoin} className="gap-12">
            <div className="form-group">
              <label className="form-label">Dein persönlicher Code</label>
              <input
                className="input code-input"
                value={playerCode}
                onChange={e => setPlayerCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="XXXXXX"
                autoFocus
                autoComplete="off"
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Den Code bekommst du vom DM
              </div>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn btn-gold btn-full"
              disabled={loading || playerCode.length < 4}>
              {loading ? 'Verbinde…' : 'Beitreten'}
            </button>
          </form>
        )}

        {tab === 'dm' && (
          <form onSubmit={handleDMJoin} className="gap-12">
            <div className="form-group">
              <label className="form-label">DM-Passwort</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Passwort"
                autoFocus
              />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn btn-gold btn-full" disabled={loading || !password}>
              {loading ? 'Prüfe…' : 'Als DM einloggen'}
            </button>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Standard-Passwort: <code style={{ color: 'var(--gold)' }}>dm</code>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
