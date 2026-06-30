// Spielt vom DM hochgeladene Sounddateien auf dem Spieler-Display ab.
// Web Audio API: einmal entsperren (iOS-Geste), dann URLs dekodieren & abspielen.

let ctx = null
const cache = new Map()   // url → AudioBuffer

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

// iOS/Safari geben Audio erst nach einer Nutzergeste frei. Beim Beitreten +
// bei der ersten Berührung des Displays aufrufen.
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

export async function playUrl(url) {
  const c = getCtx()
  if (!c || !url) return
  if (c.state === 'suspended') await c.resume()
  try {
    let buf = cache.get(url)
    if (!buf) {
      const res = await fetch(url)
      const arr = await res.arrayBuffer()
      buf = await c.decodeAudioData(arr)
      cache.set(url, buf)
    }
    const src = c.createBufferSource()
    src.buffer = buf
    src.connect(c.destination)
    src.start(0)
  } catch {
    // Fallback: einfaches HTMLAudio (falls Dekodierung scheitert)
    try { new Audio(url).play() } catch { /* ignore */ }
  }
}
