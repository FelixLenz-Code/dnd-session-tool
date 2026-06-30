import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import socket from '../socket'
import { playUrl, unlockAudio } from '../sounds'

const GameContext = createContext(null)

const initial = {
  joined: false,
  role: null,

  code: null,
  adventure: null,
  displayOnline: false,
  images: [],
  sounds: [],
  finds: [],
  currentFloor: null,
  unlockedFloors: [],
  messages: [],
  timer: { running: false, endTime: null, totalSeconds: 0 },
  stage: { mode: 'cover', payload: null },   // was das Display gerade zeigt
  puzzles: {},
  puzzleWrong: null,   // mapId das kurz rot aufleuchtet
}

function reducer(state, action) {
  switch (action.type) {
    case 'JOINED':
      return { ...state, joined: true, role: action.role }
    case 'STATE_SYNC':
      return { ...state, ...action.payload }
    case 'ADVENTURE_LOADED':
      return { ...state, adventure: action.adventure, unlockedFloors: [], currentFloor: null }
    case 'FLOOR_UNLOCKED':
      return { ...state, currentFloor: action.currentFloor, unlockedFloors: action.unlockedFloors }
    case 'NEW_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] }
    case 'MESSAGE_HISTORY':
      return { ...state, messages: action.messages }
    case 'TIMER_UPDATE':
      return { ...state, timer: action.timer }
    case 'STAGE_UPDATE':
      return { ...state, stage: action.stage }
    case 'IMAGES_UPDATE':
      return { ...state, images: action.images }
    case 'SOUNDS_UPDATE':
      return { ...state, sounds: action.sounds }
    case 'FINDS_UPDATE':
      return { ...state, finds: action.finds }
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
    socket.on('floor_unlocked', (data) => dispatch({ type: 'FLOOR_UNLOCKED', ...data }))
    socket.on('new_message', (message) => dispatch({ type: 'NEW_MESSAGE', message }))
    socket.on('message_history', (messages) => dispatch({ type: 'MESSAGE_HISTORY', messages }))
    socket.on('timer_update', (timer) => dispatch({ type: 'TIMER_UPDATE', timer }))
    socket.on('stage_update', (stage) => dispatch({ type: 'STAGE_UPDATE', stage }))
    socket.on('images_update', (images) => dispatch({ type: 'IMAGES_UPDATE', images }))
    socket.on('finds_update', (finds) => dispatch({ type: 'FINDS_UPDATE', finds }))
    socket.on('sounds_update', (sounds) => dispatch({ type: 'SOUNDS_UPDATE', sounds }))
    socket.on('play_sound', ({ url }) => playUrl(url))
    socket.on('puzzle_wrong', ({ mapId }) => {
      dispatch({ type: 'PUZZLE_WRONG', mapId })
      setTimeout(() => dispatch({ type: 'PUZZLE_WRONG_CLEAR' }), 700)
    })

    return () => socket.removeAllListeners()
  }, [])

  // Actions
  const actions = {
    joinAsDisplay: async (code) => {
      unlockAudio()   // innerhalb der Klick-Geste: Audio fürs Display freischalten
      const res = await fetch('/api/display/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }
      socket.connect()
      socket.emit('display:join', { code })
      dispatch({ type: 'JOINED', role: 'display' })
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

    uploadImage: async (name, dataUrl) => {
      const res = await fetch('/api/dm/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dataUrl }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }
      return res.json()   // { id, name, url }
    },
    renameImage: (id, name) => socket.emit('dm:rename_image', { id, name }),
    removeImage: (id) => socket.emit('dm:remove_image', { id }),

    loadAdventure: async (adventureJson) => {
      await fetch('/api/adventure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adventureJson),
      })
    },

    unlockFloor: (floorId) => socket.emit('dm:unlock_floor', { floorId }),
    lockFloor: (floorId) => socket.emit('dm:lock_floor', { floorId }),

    sendMessage: (message, type, showOnStage = false) => socket.emit('dm:message', { message, type, showOnStage }),

    triggerEvent: (eventId, showOnStage = false) => socket.emit('dm:trigger_event', { eventId, showOnStage }),

    startTimer: (seconds) => socket.emit('dm:timer_start', { seconds }),

    stopTimer: () => socket.emit('dm:timer_stop'),

    setStage: (mode, payload = null) => socket.emit('dm:set_stage', { mode, payload }),

    addFind: (find) => socket.emit('dm:add_find', find),
    removeFind: (id) => socket.emit('dm:remove_find', { id }),

    uploadSound: async (name, dataUrl) => {
      const res = await fetch('/api/dm/sound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dataUrl }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }
      return res.json()   // { id, name, url }
    },
    playSound: (id) => socket.emit('dm:play_sound', { id }),
    renameSound: (id, name) => socket.emit('dm:rename_sound', { id, name }),
    removeSound: (id) => socket.emit('dm:remove_sound', { id }),

    interactMap: (mapId, elementId) => socket.emit('display:interact', { mapId, elementId }),

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
