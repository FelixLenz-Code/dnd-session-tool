import { useGame } from '../context/GameContext'

const FLOORS = [
  { id: 'floor-5', label: 'Sanctum',             sub: 'Das Erbe',          icon: '✦', y: 32  },
  { id: 'floor-4', label: 'Archiv der Stimmen',  sub: 'Die Kristalle',     icon: '◈', y: 108 },
  { id: 'floor-3', label: 'Spiegelkammer',        sub: 'Die Vergangenheit', icon: '◇', y: 184 },
  { id: 'floor-2', label: 'Labor',                sub: 'Die Formel',        icon: '⚗', y: 260 },
  { id: 'floor-1', label: 'Bibliothek',           sub: 'Das fehlende Buch', icon: '📖', y: 336 },
  { id: 'keller',  label: 'Keller',               sub: 'Die Pforte',        icon: '⚷', y: 412 },
]

export default function TowerMap({ marker }) {
  const { state } = useGame()
  const currentFloor = state?.currentFloor
  const unlocked    = state?.unlockedFloors ?? []

  return (
    <svg viewBox="0 0 340 580" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
      <defs>
        <radialGradient id="tSky" cx="50%" cy="20%" r="80%">
          <stop offset="0%"   stopColor="#0a0c18"/>
          <stop offset="100%" stopColor="#040408"/>
        </radialGradient>
        <linearGradient id="tWallL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#0e0c08"/>
          <stop offset="30%"  stopColor="#1a1610"/>
          <stop offset="70%"  stopColor="#1a1610"/>
          <stop offset="100%" stopColor="#0e0c08"/>
        </linearGradient>
        <linearGradient id="tFloorActive" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#1e1404"/>
          <stop offset="50%"  stopColor="#2e2008"/>
          <stop offset="100%" stopColor="#1e1404"/>
        </linearGradient>
        <linearGradient id="tFloorUnlocked" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#161208"/>
          <stop offset="50%"  stopColor="#201a0a"/>
          <stop offset="100%" stopColor="#161208"/>
        </linearGradient>
        <pattern id="tBrick" x="0" y="0" width="36" height="18" patternUnits="userSpaceOnUse">
          <rect width="36" height="18" fill="#141008"/>
          <rect x="0"  y="0"  width="35" height="8"  fill="#181408" stroke="#201a0c" strokeWidth="0.6"/>
          <rect x="18" y="9"  width="35" height="8"  fill="#161208" stroke="#1e180c" strokeWidth="0.6"/>
        </pattern>
        <filter id="tGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="tGlowStrong" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Nachthimmel */}
      <rect width="340" height="580" fill="url(#tSky)"/>
      {[
        [18,18],[45,8],[72,24],[12,48],[38,38],[60,14],[82,42],[25,62],[55,56],
        [305,12],[295,28],[318,42],[308,6],[285,18],[322,22],[298,50],[312,38],
        [22,90],[50,80],[8,108],[30,100],[15,130],[48,120],[62,95],
        [290,80],[310,65],[285,100],[320,90],[298,110],[305,125],[275,72],
      ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%3===0?1.2:0.7} fill="#c0c8e8" opacity={0.3+Math.sin(i)*0.25}/>
      ))}

      {/* Turm-Silhouette */}
      <path d="M 88 540 L 88 56 L 100 30 L 170 12 L 240 30 L 252 56 L 252 540 Z"
        fill="url(#tWallL)" stroke="#2a2010" strokeWidth="1.5"/>

      {/* Mauerwerk über ClipPath */}
      <clipPath id="tClip">
        <path d="M 88 540 L 88 56 L 100 30 L 170 12 L 240 30 L 252 56 L 252 540 Z"/>
      </clipPath>
      <rect x="88" y="12" width="164" height="528" fill="url(#tBrick)" clipPath="url(#tClip)" opacity="0.6"/>

      {/* Zinnen */}
      {[92,103,114,125,136,147,158,169,180,191,202,213,224,235,246].map((x,i) => (
        <rect key={i} x={x} y={i%2===0 ? 10 : 20} width="8" height={i%2===0?24:14}
          fill="#161208" stroke="#2e2414" strokeWidth="0.8"/>
      ))}
      <polygon points="170,2 88,26 252,26" fill="#1a1508" stroke="#4a3818" strokeWidth="2"/>
      {/* Flagge */}
      <line x1="170" y1="16" x2="170" y2="2" stroke="#6a4a18" strokeWidth="1.5"/>
      <polygon points="170,4 196,10 170,16" fill="#8b6914" opacity="0.7"/>

      {/* Etagen */}
      {FLOORS.map((floor) => {
        const isCurrent  = currentFloor === floor.id
        const isUnlocked = unlocked.includes(floor.id)
        const isLocked   = !isUnlocked && !isCurrent

        return (
          <g key={floor.id}>
            <line x1="88" y1={floor.y+72} x2="252" y2={floor.y+72} stroke="#2a2010" strokeWidth="1.5"/>

            <rect x="90" y={floor.y+1} width="162" height="70"
              fill={isCurrent ? 'url(#tFloorActive)' : isUnlocked ? 'url(#tFloorUnlocked)' : '#0e0c08'}
              stroke={isCurrent ? '#c8a84b' : isUnlocked ? '#3a2c18' : '#1a1610'}
              strokeWidth={isCurrent ? 2 : 1}/>

            {isCurrent && (
              <rect x="90" y={floor.y+1} width="162" height="70"
                fill="none" stroke="#c8a84b" strokeWidth="2.5" opacity="0.25" filter="url(#tGlowStrong)"/>
            )}

            {!isLocked && (
              <>
                <rect x="100" y={floor.y+14} width="14" height="22"
                  fill={isCurrent ? '#4a3808' : '#0c0a06'}
                  stroke={isCurrent ? '#8b6914' : '#2a2010'} strokeWidth="1"/>
                <path d={`M 100 ${floor.y+14} Q 107 ${floor.y+9} 114 ${floor.y+14}`}
                  fill={isCurrent ? '#3a2c06' : '#0a0806'}
                  stroke={isCurrent ? '#6a5010' : '#1e1a0c'} strokeWidth="0.8"/>
                {isCurrent && (
                  <ellipse cx="107" cy={floor.y+22} rx="5" ry="4" fill="#c8a84b" opacity="0.2" filter="url(#tGlow)"/>
                )}
                <rect x="228" y={floor.y+14} width="14" height="22"
                  fill={isCurrent ? '#4a3808' : '#0c0a06'}
                  stroke={isCurrent ? '#8b6914' : '#2a2010'} strokeWidth="1"/>
                <path d={`M 228 ${floor.y+14} Q 235 ${floor.y+9} 242 ${floor.y+14}`}
                  fill={isCurrent ? '#3a2c06' : '#0a0806'}
                  stroke={isCurrent ? '#6a5010' : '#1e1a0c'} strokeWidth="0.8"/>
                {isCurrent && (
                  <ellipse cx="235" cy={floor.y+22} rx="5" ry="4" fill="#c8a84b" opacity="0.2" filter="url(#tGlow)"/>
                )}
              </>
            )}

            <text x="128" y={floor.y+38} textAnchor="middle"
              fill={isCurrent ? '#c8a84b' : isUnlocked ? '#5a4828' : '#2a2010'} fontSize="17"
              filter={isCurrent ? 'url(#tGlow)' : 'none'}>
              {isLocked ? '🔒' : floor.icon}
            </text>

            <text x="188" y={floor.y+36} textAnchor="middle"
              fill={isCurrent ? '#c8a84b' : isUnlocked ? '#8a7038' : '#3a2c18'}
              fontSize={isCurrent ? '10.5' : '9.5'}
              fontWeight={isCurrent ? 'bold' : 'normal'}
              filter={isCurrent ? 'url(#tGlow)' : 'none'}>
              {floor.label}
            </text>
            <text x="188" y={floor.y+50} textAnchor="middle"
              fill={isCurrent ? '#7a6028' : isLocked ? '#2a2010' : '#5a4828'} fontSize="8">
              {isLocked ? 'gesperrt' : floor.sub}
            </text>

            {!isLocked && (
              <g opacity="0.5">
                {[0,1,2,3].map(i => (
                  <line key={i} x1={246-i*3} y1={floor.y+54+i*4} x2={250} y2={floor.y+54+i*4}
                    stroke="#4a3818" strokeWidth="1.2"/>
                ))}
              </g>
            )}
          </g>
        )
      })}

      {/* Eingangstür */}
      <path d="M 148 540 L 148 516 Q 170 506 192 516 L 192 540 Z"
        fill="#0e0c08" stroke="#6a4818" strokeWidth="2"/>
      <path d="M 148 516 Q 170 498 192 516" fill="none" stroke="#5a3e14" strokeWidth="1.5"/>
      <circle cx="184" cy="528" r="3.5" fill="#8b6914"/>
      {[0,1,2].map(i => (
        <rect key={i} x={148-i*6} y={540+i*5} width={44+i*12} height="5"
          fill="#161208" stroke="#2a2010" strokeWidth="0.8"/>
      ))}

      {/* Marker */}
      {marker && currentFloor && (() => {
        const f = FLOORS.find(fl => fl.id === currentFloor)
        if (!f) return null
        return (
          <g filter="url(#tGlowStrong)">
            <circle cx="272" cy={f.y+36} r="9" fill="#162840" stroke="#4a90d0" strokeWidth="2" opacity="0.97"/>
            <circle cx="272" cy={f.y+36} r="4" fill="#70b0ff"/>
            <rect x="284" y={f.y+26} width="48" height="20" fill="#0c1a2e" stroke="#4a90d0" strokeWidth="1.2" rx="4" opacity="0.95"/>
            <text x="308" y={f.y+39} textAnchor="middle" fill="#90c8ff" fontSize="8" fontWeight="bold">{marker.label}</text>
          </g>
        )
      })()}

      <text x="170" y="575" textAnchor="middle" fill="#2a2010" fontSize="7.5" letterSpacing="1">TURM DES MAGIERS</text>
    </svg>
  )
}
