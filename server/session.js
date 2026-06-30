const { randomBytes } = require('crypto')

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function createSession() {
  return {
    code: generateCode(),
    dmToken: randomBytes(32).toString('hex'),
    adventure: null,
    displaySocketId: null,   // das eine geteilte Spieler-iPad
    images: [],              // hochgeladene Bilder/Karten: [{ id, name, url }]
    sounds: [],              // hochgeladene Sounddateien: [{ id, name, url }]
    finds: [],               // Funde der Gruppe (geteilt): [{ id, label, icon }]
    messages: [],
    unlockedFloors: [],
    currentFloor: null,
    timer: { running: false, endTime: null, totalSeconds: 0 },
    stage: { mode: 'cover', payload: null },   // was das Display gerade zeigt
    puzzles: {},   // mapId → { progress: [], solved: false }
  }
}

module.exports = { createSession }
