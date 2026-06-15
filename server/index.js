const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const path = require('path')
const { createSession } = require('./session')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

app.use(express.json({ limit: '10mb' }))
app.use(express.static(path.join(__dirname, '../client/dist')))

let session = createSession()

// ── REST ──────────────────────────────────────────────────────────────────────

app.get('/api/code', (_, res) => res.json({ code: session.code }))

// Spieler mit persönlichem Code beitreten
app.post('/api/join', (req, res) => {
  const { playerCode } = req.body
  const code = playerCode?.toUpperCase()
  const slot = session.playerSlots[code]
  if (!slot) return res.status(401).json({ error: 'Ungültiger Spieler-Code' })
  if (slot.socketId) return res.status(409).json({ error: 'Dieser Code ist bereits aktiv' })
  res.json({ ok: true, name: slot.name })
})

// DM legt Spieler-Slot an
app.post('/api/dm/create-player', (req, res) => {
  const { name } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Name fehlt' })
  const code = generatePlayerCode()
  session.playerSlots[code] = { name: name.trim(), socketId: null }
  io.emit('slots_update', slotsPublic(session))
  res.json({ ok: true, code, name: name.trim() })
})

// DM löscht Spieler-Slot
app.delete('/api/dm/player/:code', (req, res) => {
  const code = req.params.code.toUpperCase()
  delete session.playerSlots[code]
  io.emit('slots_update', slotsPublic(session))
  res.json({ ok: true })
})

app.post('/api/dm/auth', (req, res) => {
  const { password } = req.body
  const correct = session.adventure?.dmPassword ?? 'dm'
  if (password !== correct) return res.status(401).json({ error: 'Falsches Passwort' })
  res.json({ token: session.dmToken })
})

app.post('/api/adventure', (req, res) => {
  const adventure = req.body
  if (!adventure?.id || !adventure?.title) return res.status(400).json({ error: 'Ungültiges Adventure-Format' })
  session.adventure = adventure
  session.unlockedFloors = []
  session.unlockedMaps = []
  session.currentFloor = null
  session.map = { type: adventure.maps?.[0]?.id ?? null, marker: null }
  io.emit('adventure_loaded', adventure)
  io.emit('state_sync', publicState(session))
  console.log(`Adventure geladen: ${adventure.title}`)
  res.json({ ok: true })
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function generatePlayerCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code
  do { code = Array.from({length:6}, () => chars[Math.floor(Math.random()*chars.length)]).join('') }
  while (session.playerSlots[code])
  return code
}

function slotsPublic(s) {
  return Object.entries(s.playerSlots).map(([code, slot]) => ({
    code, name: slot.name, online: !!slot.socketId,
  }))
}

// Gibt die Map-ID für eine Floor-ID zurück (keller → floor-keller, rest identisch)
function floorToMapId(floorId) {
  return floorId === 'keller' ? 'floor-keller' : floorId
}

function publicState(s) {
  return {
    adventure: s.adventure,
    players: Object.values(s.players),
    playerSlots: slotsPublic(s),
    currentFloor: s.currentFloor,
    unlockedFloors: s.unlockedFloors,
    unlockedMaps: s.unlockedMaps,
    timer: s.timer,
    map: s.map,
  }
}

// ── Socket.io ─────────────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  // Player joins mit persönlichem Code
  socket.on('player:join', ({ playerCode }) => {
    const code = playerCode?.toUpperCase()
    const slot = session.playerSlots[code]
    if (!slot) { socket.emit('error', 'Ungültiger Code'); return }
    slot.socketId = socket.id
    session.players[socket.id] = { id: socket.id, name: slot.name, crystal: null, playerCode: code }
    io.emit('players_update', Object.values(session.players))
    io.emit('slots_update', slotsPublic(session))
    socket.emit('state_sync', publicState(session))
    socket.emit('message_history', session.messages.filter(m => !m.to || m.to === socket.id))
  })

  socket.on('disconnect', () => {
    const player = session.players[socket.id]
    if (player?.playerCode && session.playerSlots[player.playerCode]) {
      session.playerSlots[player.playerCode].socketId = null
    }
    delete session.players[socket.id]
    io.emit('players_update', Object.values(session.players))
    io.emit('slots_update', slotsPublic(session))
  })

  // DM: state sync on connect
  socket.on('dm:join', () => {
    socket.emit('state_sync', publicState(session))
    socket.emit('message_history', session.messages)
  })

  // DM: floor management
  socket.on('dm:unlock_floor', ({ floorId }) => {
    if (!session.unlockedFloors.includes(floorId)) {
      session.unlockedFloors.push(floorId)
    }
    const mapId = floorToMapId(floorId)
    if (!session.unlockedMaps.includes(mapId)) {
      session.unlockedMaps.push(mapId)
    }
    session.currentFloor = floorId
    // Automatisch zur Etagen-Karte wechseln wenn Etage freigeschaltet wird
    session.map = { type: mapId, marker: session.map?.marker ?? null }
    io.emit('state_sync', publicState(session))
  })

  socket.on('dm:lock_floor', ({ floorId }) => {
    session.unlockedFloors = session.unlockedFloors.filter(id => id !== floorId)
    if (session.currentFloor === floorId) {
      session.currentFloor = session.unlockedFloors[session.unlockedFloors.length - 1] ?? null
    }
    // unlockedMaps bleibt absichtlich unverändert — Karten bleiben sichtbar
    io.emit('state_sync', publicState(session))
  })

  // DM: send message
  socket.on('dm:message', ({ to, message, type }) => {
    const msg = { id: Date.now(), from: 'DM', to: to ?? null, message, type: type ?? 'narrative', ts: Date.now() }
    session.messages.push(msg)
    if (to) {
      io.to(to).emit('new_message', msg)
      socket.emit('new_message', { ...msg, sentTo: session.players[to]?.name })
    } else {
      io.emit('new_message', msg)
    }
  })

  // DM: trigger event (optional: to specific player socket id)
  socket.on('dm:trigger_event', ({ eventId, playerId }) => {
    const event = session.adventure?.events?.find(e => e.id === eventId)
    if (!event) return
    const to = playerId ?? null
    const msg = { id: Date.now(), from: 'System', to, message: event.message, type: event.type ?? 'event', ts: Date.now() }
    session.messages.push(msg)
    if (to) {
      io.to(to).emit('new_message', msg)
      socket.emit('new_message', { ...msg, sentTo: session.players[to]?.name })
    } else {
      io.emit('new_message', msg)
    }
    io.emit('event_triggered', { eventId, label: event.label })
  })

  // DM: timer
  socket.on('dm:timer_start', ({ seconds }) => {
    session.timer = { running: true, endTime: Date.now() + seconds * 1000, totalSeconds: seconds }
    io.emit('timer_update', session.timer)
  })

  socket.on('dm:timer_stop', () => {
    session.timer = { running: false, endTime: null, totalSeconds: 0 }
    io.emit('timer_update', session.timer)
  })

  // DM: map
  socket.on('dm:map_update', ({ mapId, marker }) => {
    session.map = { type: mapId, marker: marker ?? null }
    io.emit('map_update', session.map)
  })

  // DM: crystal assign
  socket.on('dm:assign_crystal', ({ playerId, crystalId }) => {
    if (session.players[playerId]) {
      session.players[playerId].crystal = crystalId
      io.emit('players_update', Object.values(session.players))
      const crystal = session.adventure?.crystals?.find(c => c.id === crystalId)
      if (crystal) {
        io.to(playerId).emit('crystal_assigned', crystal)
      }
    }
  })

  // DM: unlock inventory item for player
  socket.on('dm:give_item', ({ playerId, item }) => {
    const msg = { id: Date.now(), from: 'System', to: playerId, message: item.description, type: 'item', item, ts: Date.now() }
    session.messages.push(msg)
    io.to(playerId).emit('new_message', msg)
    io.to(playerId).emit('item_received', item)
  })
})

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT ?? 3001
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎲 DnD Session Tool läuft auf Port ${PORT}`)
  console.log(`📱 Session-Code: ${session.code}`)
  console.log(`🖥  DM-Interface: http://localhost:${PORT}\n`)
})
