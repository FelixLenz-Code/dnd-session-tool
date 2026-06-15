import { useGame } from '../context/GameContext'

const FLOORS = [
  { id: 'floor-5', label: 'Sanctum',            sub: 'Das Erbe',          y: 36  },
  { id: 'floor-4', label: 'Archiv der Stimmen', sub: 'Die Kristalle',     y: 108 },
  { id: 'floor-3', label: 'Spiegelkammer',      sub: 'Die Vergangenheit', y: 180 },
  { id: 'floor-2', label: 'Labor',              sub: 'Die Formel',        y: 252 },
  { id: 'floor-1', label: 'Bibliothek',         sub: 'Das fehlende Buch', y: 324 },
  { id: 'keller',  label: 'Keller',             sub: 'Die Pforte',        y: 396 },
]

const INK   = '#1a0e06'
const INKM  = '#5a3820'
const INKL  = '#8a6040'
const GOLD  = '#b87a0a'
const GOLDD = '#7a5008'
const RED   = '#8b1a14'
const WALL  = '#2a1c0e'

export default function TowerMap({ marker }) {
  const { state } = useGame()
  const current  = state?.currentFloor
  const unlocked = state?.unlockedFloors ?? []

  return (
    <svg viewBox="0 0 340 580" xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%' }}>
      <defs>
        <radialGradient id="tmBg" cx="50%" cy="40%" r="70%">
          <stop offset="0%"   stopColor="#fdf5e0"/>
          <stop offset="60%"  stopColor="#f0e0b8"/>
          <stop offset="100%" stopColor="#c8a870"/>
        </radialGradient>
        <filter id="tmGf" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="tmGold" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Hintergrund */}
      <rect width="340" height="580" fill={WALL}/>
      <rect x="10" y="10" width="320" height="560" fill="url(#tmBg)"/>
      <rect x="10" y="10" width="320" height="560" fill="none" stroke={INK} strokeWidth="2.5"/>
      <rect x="14" y="14" width="312" height="552" fill="none" stroke={INKM} strokeWidth="0.8"/>
      {/* Eckornamente */}
      {[[16,16],[324,16],[16,564],[324,564]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="none" stroke={INK} strokeWidth="1.2"/>
          <circle cx={cx} cy={cy} r="2" fill={INK}/>
        </g>
      ))}

      {/* Turm-Silhouette */}
      {/* Dach (Dreieck) */}
      <polygon points="170,28 88,72 252,72" fill="#c8b880" stroke={INK} strokeWidth="2"/>
      {/* Flagge */}
      <line x1="170" y1="28" x2="170" y2="14" stroke={INKM} strokeWidth="1.5"/>
      <polygon points="170,16 195,22 170,28" fill={GOLD} opacity="0.8"/>
      {/* Zinnen */}
      {[94,106,118,130,142,154,166,178,190,202,214,226,238,250].map((x,i) => (
        <rect key={i} x={x} y={i%2===0 ? 58 : 64} width={9} height={i%2===0 ? 20:14}
          fill="#c0a870" stroke={INKM} strokeWidth="0.8"/>
      ))}

      {/* Turm-Seitenwände */}
      <rect x="88" y="72" width="164" height="430" fill="#d4c090" stroke={INK} strokeWidth="2"/>
      {/* Mauerwerk-Muster (horizontale Fugen) */}
      {Array.from({length: 25}, (_, i) => (
        <line key={i} x1="88" y1={90 + i*17} x2="252" y2={90 + i*17}
          stroke={INKM} strokeWidth="0.5" opacity="0.4"/>
      ))}
      {/* vertikale Fugen versetzt */}
      {Array.from({length: 25}, (_, i) =>
        Array.from({length: 3}, (_, j) => (
          <line key={`${i}-${j}`}
            x1={88 + (j*54) + (i%2===0 ? 27 : 0)} y1={90 + i*17}
            x2={88 + (j*54) + (i%2===0 ? 27 : 0)} y2={90 + (i+1)*17}
            stroke={INKM} strokeWidth="0.5" opacity="0.4"/>
        ))
      )}

      {/* Etagen-Linien und Beschriftungen */}
      {FLOORS.map((floor) => {
        const isCurrent  = current === floor.id
        const isUnlocked = unlocked.includes(floor.id)
        const isLocked   = !isUnlocked && !isCurrent

        return (
          <g key={floor.id}>
            {/* Etagenboden-Linie */}
            <line x1="88" y1={floor.y + 68} x2="252" y2={floor.y + 68}
              stroke={isCurrent ? GOLD : INKM} strokeWidth={isCurrent ? 2 : 1}/>

            {/* Etagen-Hintergrund */}
            <rect x="89" y={floor.y + 1} width="162" height="67"
              fill={isCurrent ? '#f0e8c0' : isUnlocked ? '#ede0b8' : '#c8b878'}
              opacity={isLocked ? 0.5 : 1}/>

            {/* Aktiver Glow */}
            {isCurrent && (
              <rect x="89" y={floor.y + 1} width="162" height="67"
                fill="none" stroke={GOLD} strokeWidth="2.5" filter="url(#tmGold)" opacity="0.6"/>
            )}

            {/* Fenster-Bogen */}
            {!isLocked && (
              <>
                <rect x="102" y={floor.y + 18} width="14" height="24"
                  fill={isCurrent ? '#d4e8f0' : '#c8c0a0'} stroke={INKM} strokeWidth="1"/>
                <path d={`M 102 ${floor.y+18} Q 109 ${floor.y+11} 116 ${floor.y+18}`}
                  fill={isCurrent ? '#b8d8f0' : '#b8b090'} stroke={INKM} strokeWidth="0.8"/>
                <rect x="228" y={floor.y + 18} width="14" height="24"
                  fill={isCurrent ? '#d4e8f0' : '#c8c0a0'} stroke={INKM} strokeWidth="1"/>
                <path d={`M 228 ${floor.y+18} Q 235 ${floor.y+11} 242 ${floor.y+18}`}
                  fill={isCurrent ? '#b8d8f0' : '#b8b090'} stroke={INKM} strokeWidth="0.8"/>
              </>
            )}

            {/* Beschriftung */}
            <text x="170" y={floor.y + 32} textAnchor="middle" fill={isCurrent ? GOLDD : isLocked ? INKL : INKM}
              fontSize={isCurrent ? '11' : '10'} fontFamily="Georgia,serif"
              fontWeight={isCurrent ? 'bold' : 'normal'}
              filter={isCurrent ? 'url(#tmGold)' : 'none'}>
              {isLocked ? '🔒 ' : ''}{floor.label}
            </text>
            <text x="170" y={floor.y + 47} textAnchor="middle"
              fill={isCurrent ? INKM : isLocked ? '#c0b090' : INKL} fontSize="8" fontFamily="Georgia,serif">
              {isLocked ? 'gesperrt' : floor.sub}
            </text>
            {isCurrent && (
              <text x="170" y={floor.y + 62} textAnchor="middle"
                fill={GOLD} fontSize="8.5" fontFamily="Georgia,serif" fontWeight="bold"
                filter="url(#tmGold)">
                ▶ Aktuelle Etage
              </text>
            )}
          </g>
        )
      })}

      {/* Eingangsportal */}
      <path d="M 144 502 L 144 476 Q 170 462 196 476 L 196 502 Z"
        fill="#c8a860" stroke={INK} strokeWidth="2"/>
      <path d="M 144 476 Q 170 458 196 476" fill="none" stroke={INKM} strokeWidth="1.5"/>
      <circle cx="189" cy="489" r="3.5" fill={GOLD} stroke={INK} strokeWidth="1"/>
      {/* Treppe / Stufen */}
      {[0,1,2].map(i => (
        <rect key={i} x={144 - i*8} y={502 + i*6} width={52 + i*16} height={6}
          fill="#c8b080" stroke={INKM} strokeWidth="0.8"/>
      ))}

      {/* Marker */}
      {marker && current && (() => {
        const f = FLOORS.find(fl => fl.id === current)
        if (!f) return null
        const my = f.y + 36
        const w  = Math.max((marker.label?.length ?? 0) * 5.5 + 10, 36)
        return (
          <g>
            <circle cx="266" cy={my} r="12" fill="none" stroke={RED} strokeWidth="1.5" opacity="0.45">
              <animate attributeName="r"       values="12;19;12"   dur="2.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.45;0;0.45" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="266" cy={my} r="7" fill={RED} stroke="#fff8ee" strokeWidth="1.5"/>
            <circle cx="266" cy={my} r="3" fill="#fff8ee"/>
            <rect x="276" y={my-9} width={w} height="14" fill={RED} rx="3" opacity="0.9"/>
            <text x="280" y={my+1} fill="#fff8ee" fontSize="7.5"
              fontFamily="Arial,sans-serif" fontWeight="bold">{marker.label}</text>
          </g>
        )
      })()}

      {/* Titel */}
      <text x="170" y="572" textAnchor="middle" fill={INKM} fontSize="9"
        fontFamily="Georgia,serif" letterSpacing="2">
        TURM DES MAGIERS
      </text>
    </svg>
  )
}
