import { useState } from 'react'
import { useGame } from '../context/GameContext'

export default function JoinView() {
  const { actions } = useGame()
  const [tab, setTab] = useState('display')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDisplayJoin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await actions.joinAsDisplay(code.trim())
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
          <button className={`tab ${tab === 'display' ? 'active' : ''}`}
            onClick={() => { setTab('display'); setError('') }}>Spieler-Display</button>
          <button className={`tab ${tab === 'dm' ? 'active' : ''}`}
            onClick={() => { setTab('dm'); setError('') }}>Dungeon Master</button>
        </div>

        {tab === 'display' && (
          <form onSubmit={handleDisplayJoin} className="gap-12">
            <div className="form-group">
              <label className="form-label">Session-Code</label>
              <input
                className="input code-input"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                maxLength={4}
                placeholder="XXXX"
                autoFocus
                autoComplete="off"
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Den Code zeigt der DM auf seinem Gerät an
              </div>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn btn-gold btn-full"
              disabled={loading || code.length < 4}>
              {loading ? 'Verbinde…' : 'Display verbinden'}
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
              Passwort laut Adventure (Turm des Magiers: <code style={{ color: 'var(--gold)' }}>aldric</code>)
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
