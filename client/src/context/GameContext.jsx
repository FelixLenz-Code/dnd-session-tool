import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import socket from '../socket'

const GameContext = createContext(null)

const initial = {
  joined: false,
  role: null,
  playerName: null,

  adventure: null,
  players: [],
  playerSlots: [],   // [{ code, name, online }]
  currentFloor: null,
  unlockedFloors: [],
  unlockedMaps: [],
  messages: [],
  timer: { running: false, endTime: null, totalSeconds: 0 },
  map: { type: null, marker: null },
  puzzles: {},
  puzzleWrong: null,   // mapId das kurz rot aufleuchtet

  crystal: null,
  inventory: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'JOINED':
      return { ...state, joined: true, role: action.role, playerName: action.name ?? null }
    case 'STATE_SYNC':
      return { ...state, ...action.payload }
    case 'ADVENTURE_LOADED':
      return { ...state, adventure: action.adventure, unlockedFloors: [], currentFloor: null }
    case 'PLAYERS_UPDATE':
      return { ...state, players: action.players }
    case 'SLOTS_UPDATE':
      return { ...state, playerSlots: action.slots }
    case 'FLOOR_UNLOCKED':
      return { ...state, currentFloor: action.currentFloor, unlockedFloors: action.unlockedFloors }
    case 'NEW_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] }
    case 'MESSAGE_HISTORY':
      return { ...state, messages: action.messages }
    case 'TIMER_UPDATE':
      return { ...state, timer: action.timer }
    case 'MAP_UPDATE':
      return { ...state, map: action.map }
    case 'CRYSTAL_ASSIGNED':
      return { ...state, crystal: action.crystal }
    case 'ITEM_RECEIVED':
      return { ...state, inventory: [...state.inventory, action.item] }
    case 'PUZZLE_WRONG':
      return { ...state, puzzleWrong: action.mapId }
    case 'PUZZLE_WRONG_CLEAR':
      return { ...state, puzzleWrong: null }
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    socket.on('state_sync', (payload) => dispatch({ type: 'STATE_SYNC', payload }))
    socket.on('adventure_loaded', (adventure) => dispatch({ type: 'ADVENTURE_LOADED', adventure }))
    socket.on('players_update', (players) => dispatch({ type: 'PLAYERS_UPDATE', players }))
    socket.on('slots_update', (slots) => dispatch({ type: 'SLOTS_UPDATE', slots }))
    socket.on('floor_unlocked', (data) => dispatch({ type: 'FLOOR_UNLOCKED', ...data }))
    socket.on('new_message', (message) => dispatch({ type: 'NEW_MESSAGE', message }))
    socket.on('message_history', (messages) => dispatch({ type: 'MESSAGE_HISTORY', messages }))
    socket.on('timer_update', (timer) => dispatch({ type: 'TIMER_UPDATE', timer }))
    socket.on('map_update', (map) => dispatch({ type: 'MAP_UPDATE', map }))
    socket.on('crystal_assigned', (crystal) => dispatch({ type: 'CRYSTAL_ASSIGNED', crystal }))
    socket.on('item_received', (item) => dispatch({ type: 'ITEM_RECEIVED', item }))
    socket.on('puzzle_wrong', ({ mapId }) => {
      dispatch({ type: 'PUZZLE_WRONG', mapId })
      setTimeout(() => dispatch({ type: 'PUZZLE_WRONG_CLEAR' }), 700)
    })

    return () => socket.removeAllListeners()
  }, [])

  // Actions
  const actions = {
    joinAsPlayer: async (playerCode) => {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerCode }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }
      const { name } = await res.json()
      socket.connect()
      socket.emit('player:join', { playerCode })
      dispatch({ type: 'JOINED', role: 'player', name })
    },

    joinAsDM: async (password) => {
      const res = await fetch('/api/dm/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }
      socket.connect()
      dispatch({ type: 'JOINED', role: 'dm' })
      socket.emit('dm:join')
    },

    loadAdventure: async (adventureJson) => {
      await fetch('/api/adventure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adventureJson),
      })
    },

    unlockFloor: (floorId) => socket.emit('dm:unlock_floor', { floorId }),
    lockFloor: (floorId) => socket.emit('dm:lock_floor', { floorId }),

    sendMessage: (to, message, type) => socket.emit('dm:message', { to, message, type }),

    triggerEvent: (eventId, playerId = null) => socket.emit('dm:trigger_event', { eventId, playerId }),

    startTimer: (seconds) => socket.emit('dm:timer_start', { seconds }),

    stopTimer: () => socket.emit('dm:timer_stop'),

    updateMap: (mapId, marker = null) => socket.emit('dm:map_update', { mapId, marker }),

    assignCrystal: (playerId, crystalId) => socket.emit('dm:assign_crystal', { playerId, crystalId }),

    giveItem: (playerId, item) => socket.emit('dm:give_item', { playerId, item }),

    interactMap: (mapId, elementId) => socket.emit('player:map_interact', { mapId, elementId }),

    resetPuzzle: (mapId) => socket.emit('dm:reset_puzzle', { mapId }),
  }

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
