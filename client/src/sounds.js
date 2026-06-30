// Synthetisierte Soundeffekte über die Web Audio API — keine Audio-Dateien nötig,
// funktioniert offline im Heimnetz. Werden auf dem Spieler-Display abgespielt.

let ctx = null
function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

// iOS/Safari geben Audio erst nach einer Nutzergeste frei. Beim Beitreten + bei
// der ersten Berührung des Displays aufrufen.
export function unlockAudio() {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') c.resume()
  const b = c.createBuffer(1, 1, 22050)
  const s = c.createBufferSource()
  s.buffer = b
  s.connect(c.destination)
  s.start(0)
}

function tone(c, t, freq, dur, type = 'sine', peak = 0.3, attack = 0.008) {
  const o = c.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur + 0.05)
  return o
}

function noiseBurst(c, t, dur, cutoff, peak) {
  const n = Math.max(1, Math.floor(c.sampleRate * dur))
  const buf = c.createBuffer(1, n, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = cutoff
  const g = c.createGain()
  g.gain.setValueAtTime(peak, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(lp).connect(g).connect(c.destination)
  src.start(t)
  src.stop(t + dur)
}

const SOUNDS = {
  gong(c, t) {
    const base = 110
    ;[1, 2.76, 5.4, 8.93].forEach((m, i) => tone(c, t, base * m, 2.4 - i * 0.3, 'sine', 0.22 / (i + 1)))
  },
  chime(c, t) {
    tone(c, t, 880, 1.3, 'sine', 0.22)
    tone(c, t + 0.04, 1320, 1.2, 'sine', 0.12)
    tone(c, t + 0.08, 1760, 1.1, 'sine', 0.07)
  },
  boom(c, t) {
    noiseBurst(c, t, 0.7, 600, 0.5)
    tone(c, t, 55, 0.7, 'sine', 0.6)
    tone(c, t, 80, 0.5, 'triangle', 0.3)
  },
  door(c, t) {
    const o = c.createOscillator()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(140, t)
    o.frequency.linearRampToValueAtTime(70, t + 0.7)
    const lfo = c.createOscillator()
    lfo.frequency.value = 18
    const lfoGain = c.createGain()
    lfoGain.gain.value = 8
    lfo.connect(lfoGain).connect(o.frequency)
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 500
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.75)
    o.connect(lp).connect(g).connect(c.destination)
    o.start(t); o.stop(t + 0.8)
    lfo.start(t); lfo.stop(t + 0.8)
    noiseBurst(c, t + 0.7, 0.25, 300, 0.35) // dumpfer Aufschlag am Ende
  },
  success(c, t) {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(c, t + i * 0.12, f, 0.5, 'sine', 0.25))
  },
  tension(c, t) {
    const dur = 3.2
    ;[68, 71].forEach(f => {
      const o = c.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = f
      const lp = c.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 220
      const g = c.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.18, t + 1.2)
      g.gain.setValueAtTime(0.18, t + dur - 0.8)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      o.connect(lp).connect(g).connect(c.destination)
      o.start(t); o.stop(t + dur + 0.05)
    })
  },
}

export const SOUND_LIST = [
  { id: 'gong',     label: 'Gong',    icon: '🔔' },
  { id: 'chime',    label: 'Vision',  icon: '✨' },
  { id: 'boom',     label: 'Knall',   icon: '💥' },
  { id: 'door',     label: 'Tür',     icon: '🚪' },
  { id: 'success',  label: 'Erfolg',  icon: '✅' },
  { id: 'tension',  label: 'Unheil',  icon: '🎻' },
]

export function playSound(name) {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') c.resume()
  const gen = SOUNDS[name] || SOUNDS.chime
  try { gen(c, c.currentTime + 0.02) } catch { /* ignore */ }
}
