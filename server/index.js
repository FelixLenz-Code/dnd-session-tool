const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const path = require('path')
const fs = require('fs')
const { createSession } = require('./session')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

app.use(express.json({ limit: '25mb' }))
app.use(express.static(path.join(__dirname, '../client/dist')))

let session = createSession()

// Hochgeladene Bilder (Karten/Handouts/Visionen) — Rohdaten im Speicher,
// Metadaten in session.images. Reicht für eine lokale Oneshot-Session.
const imageStore = new Map()   // id → { buffer, contentType }
// Hochgeladene Sounddateien — gleiches Prinzip, Metadaten in session.sounds.
const soundStore = new Map()   // id → { buffer, contentType }

// Standard-Adventure beim Start laden (der DM kann es jederzeit überschreiben).
try {
  const advPath = path.join(__dirname, '../adventures/turm-des-magiers.json')
  session.adventure = JSON.parse(fs.readFileSync(advPath, 'utf-8'))
  console.log(`📖 Standard-Adventure geladen: ${session.adventure.title}`)
} catch (err) {
  console.warn('⚠ Kein Standard-Adventure geladen:', err.message)
}

// ── REST ──────────────────────────────────────────────────────────────────────

app.get('/api/code', (_, res) => res.json({ code: session.code }))

// Das geteilte Spieler-Display verbindet sich mit dem Session-Code
app.post('/api/display/join', (req, res) => {
  const { code } = req.body
  if (code?.toUpperCase() !== session.code) {
    return res.status(401).json({ error: 'Ungültiger Session-Code' })
  }
  res.json({ ok: true })
})

// DM lädt ein Bild hoch (als data-URL) → wird unter /api/image/:id ausgeliefert
app.post('/api/dm/image', (req, res) => {
  const { name, dataUrl } = req.body
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl ?? '')
  if (!m) return res.status(400).json({ error: 'Ungültiges Bild' })
  const id = randomImageId()
  imageStore.set(id, { buffer: Buffer.from(m[2], 'base64'), contentType: m[1] })
  const meta = { id, name: name?.trim() || 'Bild', url: `/api/image/${id}` }
  session.images.push(meta)
  io.emit('images_update', session.images)
  res.json(meta)
})

app.get('/api/image/:id', (req, res) => {
  const img = imageStore.get(req.params.id)
  if (!img) return res.status(404).end()
  res.set('Content-Type', img.contentType)
  res.set('Cache-Control', 'public, max-age=3600')
  res.send(img.buffer)
})

// DM lädt eine Sounddatei hoch (als data-URL) → wird unter /api/sound/:id ausgeliefert
app.post('/api/dm/sound', (req, res) => {
  const { name, dataUrl } = req.body
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl ?? '')
  if (!m) return res.status(400).json({ error: 'Ungültige Audiodatei' })
  const id = randomImageId()
  soundStore.set(id, { buffer: Buffer.from(m[2], 'base64'), contentType: m[1] })
  const meta = { id, name: name?.trim() || 'Sound', url: `/api/sound/${id}` }
  session.sounds.push(meta)
  io.emit('sounds_update', session.sounds)
  res.json(meta)
})

app.get('/api/sound/:id', (req, res) => {
  const snd = soundStore.get(req.params.id)
  if (!snd) return res.status(404).end()
  res.set('Content-Type', snd.contentType)
  res.set('Cache-Control', 'public, max-age=3600')
  res.send(snd.buffer)
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
  session.currentFloor = null
  session.stage = { mode: 'cover', payload: null }
  session.finds = []
  session.puzzles = {}
  io.emit('adventure_loaded', adventure)
  io.emit('state_sync', publicState(session))
  console.log(`Adventure geladen: ${adventure.title}`)
  res.json({ ok: true })
})

// ── Puzzle-Definitionen ───────────────────────────────────────────────────────

const PUZZLES = {
  'floor-keller': {
    type: 'sequence',
    solution: ['winter', 'fruehling', 'sommer', 'herbst'],
    reward: 'floor-1',
    successMessage: '✨ Eines nach dem anderen sinken die vier Reliefs in den Stein. Wärme breitet sich aus, ein feiner Riss läuft durch die Pforte – und mit einem Laut wie ein endlich ausgeatmeter Atemzug teilt sie sich. Staub rieselt herab. Dahinter windet sich eine schmale Treppe hinauf ins Dunkel, der Bibliothek entgegen. Auf der ersten Stufe liegt, vom Zug hergeweht, ein einzelnes vertrocknetes Ahornblatt.',
  },
  'floor-1': {
    type: 'password',
    answers: ['das binden des aegis', 'binden des aegis', 'aegis', 'der aegis'],
    reward: 'floor-2',
    successMessage: 'Kaum ist der Titel gesprochen, glüht die Messingplatte warm auf und der Bann über der Treppe zerfasert wie Rauch. »Das Binden des Aegis« – das Buch, das beschreibt, wie man den Schutzstein aus seinem Siegel löst. Wer es nahm, wollte den Aegisstein. Frei liegt nun die Treppe hinauf ins Labor.',
  },
  'floor-2': {
    type: 'sequence',
    solution: ['kristallstaub', 'nebelsuppe', 'kristallstaub'],
    reward: 'floor-3',
    successMessage: 'Die letzte Prise Kristallstaub sinkt in die Nebelsuppe – und der Sud beginnt silbern zu leuchten. Ihr gebt die Essenz dem kleinen Kristall auf dem Tisch. Er erwärmt sich, ein Flüstern erfüllt den Raum … und über der Treppe verblasst der Widerstand. Der Weg in die Spiegelkammer ist frei.',
  },
  'floor-3': {
    type: 'sequence',
    solution: ['spiegel-7'],
    reward: 'floor-4',
    successMessage: 'Spiegel 7 hält die Wahrheit fest: Aldric, kniend; hinter ihm Mira Vael, die Hand erhoben. Im Glas wechselt ein blauer Stein den Besitzer. Dann verblasst das Bild – und neben dem Spiegel springt eine schmale Tür auf. Der Weg zum Archiv der Stimmen liegt frei.',
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function randomImageId() {
  return Math.random().toString(36).slice(2, 10)
}

function publicState(s) {
  return {
    code: s.code,
    adventure: s.adventure,
    displayOnline: !!s.displaySocketId,
    images: s.images,
    sounds: s.sounds,
    finds: s.finds,
    currentFloor: s.currentFloor,
    unlockedFloors: s.unlockedFloors,
    timer: s.timer,
    stage: s.stage,
    puzzles: s.puzzles,
  }
}

// ── Socket.io ─────────────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  // Das geteilte Spieler-Display verbindet sich mit dem Session-Code
  socket.on('display:join', ({ code }) => {
    if (code?.toUpperCase() !== session.code) { socket.emit('error', 'Ungültiger Code'); return }
    session.displaySocketId = socket.id
    io.emit('state_sync', publicState(session))
    socket.emit('message_history', session.messages)
  })

  socket.on('disconnect', () => {
    if (session.displaySocketId === socket.id) {
      session.displaySocketId = null
      io.emit('state_sync', publicState(session))
    }
  })

  // DM: state sync on connect
  socket.on('dm:join', () => {
    socket.emit('state_sync', publicState(session))
    socket.emit('message_history', session.messages)
  })

  // DM: Bühne des Displays umschalten
  socket.on('dm:set_stage', ({ mode, payload }) => {
    session.stage = { mode: mode ?? 'cover', payload: payload ?? null }
    io.emit('stage_update', session.stage)
  })

  // DM: Fund der Gruppe einblenden / entfernen (geteilte Funde-Leiste am Display)
  socket.on('dm:add_find', ({ id, label, icon }) => {
    const text = String(label ?? '').trim()
    if (!text) return
    const findId = id ?? `find-${Date.now()}`
    if (session.finds.some(f => f.id === findId)) return
    session.finds.push({ id: findId, label: text, icon: icon ?? '✦' })
    io.emit('finds_update', session.finds)
  })

  socket.on('dm:remove_find', ({ id }) => {
    session.finds = session.finds.filter(f => f.id !== id)
    io.emit('finds_update', session.finds)
  })

  // DM: hochgeladene Karte/Bild umbenennen / entfernen
  socket.on('dm:rename_image', ({ id, name }) => {
    const img = session.images.find(i => i.id === id)
    if (img) { img.name = String(name ?? '').trim() || img.name; io.emit('images_update', session.images) }
  })

  socket.on('dm:remove_image', ({ id }) => {
    const removed = session.images.find(i => i.id === id)
    session.images = session.images.filter(i => i.id !== id)
    imageStore.delete(id)
    io.emit('images_update', session.images)
    // Falls genau diese Karte gerade auf der Bühne lag: zurück zum Titelbild
    if (removed && session.stage?.mode === 'image' && session.stage.payload?.url === removed.url) {
      session.stage = { mode: 'cover', payload: null }
      io.emit('stage_update', session.stage)
    }
  })

  // DM: hochgeladenen Sound auf dem Display abspielen (transient)
  socket.on('dm:play_sound', ({ id }) => {
    const snd = session.sounds.find(s => s.id === id)
    if (snd && session.displaySocketId) io.to(session.displaySocketId).emit('play_sound', { url: snd.url })
  })

  socket.on('dm:rename_sound', ({ id, name }) => {
    const snd = session.sounds.find(s => s.id === id)
    if (snd) { snd.name = String(name ?? '').trim() || snd.name; io.emit('sounds_update', session.sounds) }
  })

  socket.on('dm:remove_sound', ({ id }) => {
    session.sounds = session.sounds.filter(s => s.id !== id)
    soundStore.delete(id)
    io.emit('sounds_update', session.sounds)
  })

  // DM: floor management
  socket.on('dm:unlock_floor', ({ floorId }) => {
    if (!session.unlockedFloors.includes(floorId)) {
      session.unlockedFloors.push(floorId)
    }
    session.currentFloor = floorId
    io.emit('state_sync', publicState(session))
  })

  socket.on('dm:lock_floor', ({ floorId }) => {
    session.unlockedFloors = session.unlockedFloors.filter(id => id !== floorId)
    if (session.currentFloor === floorId) {
      session.currentFloor = session.unlockedFloors[session.unlockedFloors.length - 1] ?? null
    }
    io.emit('state_sync', publicState(session))
  })

  // DM: Nachricht an alle (ein geteiltes Display)
  socket.on('dm:message', ({ message, type, showOnStage }) => {
    const msg = { id: Date.now(), from: 'DM', to: null, message, type: type ?? 'narrative', ts: Date.now() }
    session.messages.push(msg)
    io.emit('new_message', msg)
    if (showOnStage) {
      session.stage = { mode: 'narration', payload: { text: message, type: msg.type } }
      io.emit('stage_update', session.stage)
    }
  })

  // DM: Ereignis auslösen — landet im Feed, optional groß auf der Bühne
  socket.on('dm:trigger_event', ({ eventId, showOnStage }) => {
    const event = session.adventure?.events?.find(e => e.id === eventId)
    if (!event) return
    const msg = { id: Date.now(), from: 'System', to: null, message: event.message, type: event.type ?? 'event', ts: Date.now() }
    session.messages.push(msg)
    io.emit('new_message', msg)
    if (showOnStage) {
      session.stage = { mode: 'narration', payload: { text: event.message, type: msg.type, label: event.label } }
      io.emit('stage_update', session.stage)
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

  // Display: Rätsel-Interaktion (die Gruppe tippt am geteilten iPad)
  socket.on('display:interact', ({ mapId, elementId }) => {
    const def = PUZZLES[mapId]
    if (!def) return
    if (!session.puzzles[mapId]) session.puzzles[mapId] = { progress: [], solved: false }
    const pz = session.puzzles[mapId]
    if (pz.solved) return

    const type = def.type ?? 'sequence'
    let solvedNow = false
    let wrong = false

    if (type === 'password') {
      const norm = s => String(s).toLowerCase().trim().replace(/\s+/g, ' ')
      if (def.answers.some(a => norm(a) === norm(elementId))) {
        pz.progress = [elementId]
        solvedNow = true
      } else {
        wrong = true
      }
    } else {
      const expected = def.solution[pz.progress.length]
      if (elementId === expected) {
        pz.progress.push(elementId)
        if (pz.progress.length === def.solution.length) solvedNow = true
      } else {
        pz.progress = []
        wrong = true
      }
    }

    if (solvedNow) {
      pz.solved = true
      const floorId = def.reward
      if (!session.unlockedFloors.includes(floorId)) session.unlockedFloors.push(floorId)
      session.currentFloor = floorId
      const msg = { id: Date.now(), from: 'System', to: null, message: def.successMessage, type: 'event', ts: Date.now() }
      session.messages.push(msg)
      io.emit('new_message', msg)
      // Erfolg groß auf der Bühne zeigen
      session.stage = { mode: 'narration', payload: { text: def.successMessage, type: 'event' } }
      io.emit('stage_update', session.stage)
    } else if (wrong) {
      io.emit('puzzle_wrong', { mapId })
    }
    io.emit('state_sync', publicState(session))
  })

  // DM: Rätsel zurücksetzen
  socket.on('dm:reset_puzzle', ({ mapId }) => {
    if (session.puzzles[mapId]) {
      session.puzzles[mapId] = { progress: [], solved: false }
      io.emit('state_sync', publicState(session))
    }
  })
})

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT ?? 3001
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎲 DnD Session Tool läuft auf Port ${PORT}`)
  console.log(`📱 Session-Code: ${session.code}`)
  console.log(`🖥  DM-Interface: http://localhost:${PORT}\n`)
})
