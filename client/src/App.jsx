import { GameProvider, useGame } from './context/GameContext'
import JoinView from './views/JoinView'
import DMView from './views/DMView'
import DisplayView from './views/DisplayView'

function AppContent() {
  const { state } = useGame()
  if (!state.joined) return <JoinView />
  if (state.role === 'dm') return <DMView />
  return <DisplayView />
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
