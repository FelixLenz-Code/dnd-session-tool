import { GameProvider, useGame } from './context/GameContext'
import JoinView from './views/JoinView'
import DMView from './views/DMView'
import PlayerView from './views/PlayerView'

function AppContent() {
  const { state } = useGame()
  if (!state.joined) return <JoinView />
  if (state.role === 'dm') return <DMView />
  return <PlayerView />
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
