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
    playerSlots: {},   // playerCode → { name, socketId: null }
    players: {},       // socketId → { id, name, crystal, playerCode }
    messages: [],
    unlockedFloors: [],
    unlockedMaps: [],    // nur wachsend — bleibt unlocked auch wenn Floor gesperrt
    currentFloor: null,
    timer: { running: false, endTime: null, totalSeconds: 0 },
    map: { type: null, marker: null },
  }
}

module.exports = { createSession }
