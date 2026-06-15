import { useGame } from '../context/GameContext'

const FLOORS = [
  { id: 'floor-5', label: 'Sanctum',            sub: 'Das Erbe',           icon: '✦', color: '#c8a84b' },
  { id: 'floor-4', label: 'Archiv',             sub: 'Die Kristalle',      icon: '◈', color: '#9a78c0' },
  { id: 'floor-3', label: 'Spiegelkammer',      sub: 'Die Vergangenheit',  icon: '◇', color: '#78a0c0' },
  { id: 'floor-2', label: 'Labor',              sub: 'Die Formel',         icon: '⚗', color: '#78a848' },
  { id: 'floor-1', label: 'Bibliothek',         sub: 'Das fehlende Buch',  icon: '📖', color: '#c87848' },
  { id: 'keller',  label: 'Keller',             sub: 'Die Pforte',         icon: '⚷', color: '#7888a8' },
]

// Each floor occupies 66px of the 500px height. Layout:
// Tower body: y=42 to y=464. 6 floors stacked, each 66px tall.
// Floor y positions (top of floor box):
const FLOOR_Y = [44, 110, 176, 242, 308, 374]

export default function TowerMap({ marker }) {
  const { state } = useGame()
  const currentFloor = state?.currentFloor
  const unlocked = state?.unlockedFloors ?? []

  return (
    <svg viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
      <defs>
        {/* Backgrounds */}
        <radialGradient id="tBg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1c1608" />
          <stop offset="100%" stopColor="#080604" />
        </radialGradient>
        {/* Stone brick pattern */}
        <pattern id="tBrick" x="0" y="0" width="36" height="18" patternUnits="userSpaceOnUse">
          <rect width="36" height="18" fill="none" />
          <rect x="0.5" y="0.5" width="34" height="8" fill="none" stroke="#1c1808" strokeWidth="0.6" opacity="0.6" />
          <rect x="18.5" y="9.5" width="34" height="8" fill="none" stroke="#1c1808" strokeWidth="0.6" opacity="0.6" />
        </pattern>
        {/* Active floor gradient */}
        <linearGradient id="tActiveFloor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a1e04" />
          <stop offset="50%" stopColor="#321f04" />
          <stop offset="100%" stopColor="#2a1e04" />
        </linearGradient>
        {/* Filters */}
        <filter id="tGoldGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="tWindowGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="tMarkerGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Sky gradient for atmosphere */}
        <linearGradient id="tSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#050608" />
          <stop offset="100%" stopColor="#0a0804" />
        </linearGradient>
        {/* Mist at top */}
        <radialGradient id="tMist" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#1a1818" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="300" height="500" fill="url(#tBg)" />

      {/* ── Stars / night sky backdrop ── */}
      {[
        [20,18],[45,25],[70,14],[95,30],[115,20],[140,12],[165,22],[190,16],[215,28],[240,18],[265,24],[285,15],
        [15,45],[38,55],[60,42],[80,58],[100,48],[120,60],[135,52],[155,40],[175,55],[195,46],[220,62],[250,50],
        [30,75],[55,80],[75,68],[100,82],[120,75],[145,88],[165,72],[185,84],[210,78],[235,90],[260,80],[280,70]
      ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%3===0?0.9:0.5} fill="#c8d0b0" opacity={0.2+Math.sin(i)*0.15} />
      ))}

      {/* ── Tower exterior silhouette ── */}
      {/* Thick outer walls */}
      <path d="M 75 468 L 75 72 L 86 48 L 150 26 L 214 48 L 225 72 L 225 468 Z"
        fill="#0e0c06" stroke="#2a2010" strokeWidth="1" />

      {/* Stone texture on walls */}
      <rect x="75" y="46" width="150" height="422" fill="url(#tBrick)" opacity="0.5" />

      {/* Left wall stone detail */}
      {Array.from({length:28}).map((_,i) => (
        <rect key={`ls${i}`}
          x={76} y={50+i*15} width={i%2===0?10:14} height={13}
          fill="#0e0c06" stroke="#181408" strokeWidth="0.6" opacity="0.7" />
      ))}
      {/* Right wall stone detail */}
      {Array.from({length:28}).map((_,i) => (
        <rect key={`rs${i}`}
          x={i%2===0?214:210} y={50+i*15} width={i%2===0?10:14} height={13}
          fill="#0e0c06" stroke="#181408" strokeWidth="0.6" opacity="0.7" />
      ))}

      {/* ── Roof / top ── */}
      <polygon points="150,10 75,50 225,50" fill="#181408" stroke="#5a4018" strokeWidth="2" />
      <polygon points="150,10 75,50 225,50" fill="none" stroke="#3a2c10" strokeWidth="0.5"
        transform="translate(2,2)" opacity="0.4" />
      {/* Battlements */}
      {[77,89,101,113,125,137,149,161,173,185,197,209,221].map((x,i) => (
        <rect key={i} x={x} y={i%2===0?32:38} width="10" height={i%2===0?20:14}
          fill="#141008" stroke="#3a2a0e" strokeWidth="0.8" />
      ))}
      {/* Flag at top */}
      <line x1="150" y1="10" x2="150" y2="-4" stroke="#5a4018" strokeWidth="1.5" />
      <polygon points="150,-4 164,-1 150,4" fill="#8b2020" opacity="0.7" />

      {/* ── Floor sections ── */}
      {FLOORS.map((floor, idx) => {
        const fy = FLOOR_Y[idx]
        const isCurrent = currentFloor === floor.id
        const isUnlocked = unlocked.includes(floor.id)
        const isLocked = !isUnlocked && !isCurrent

        return (
          <g key={floor.id}>
            {/* Floor divider line */}
            <line x1="76" y1={fy + 64} x2="224" y2={fy + 64}
              stroke="#2a2010" strokeWidth="2" />
            <line x1="76" y1={fy + 64} x2="224" y2={fy + 64}
              stroke="#1a1408" strokeWidth="0.8" opacity="0.5" transform="translate(0,1)" />

            {/* Floor interior fill */}
            <rect x="77" y={fy + 1} width="146" height="63"
              fill={isCurrent ? 'url(#tActiveFloor)' : isUnlocked ? '#14100a' : '#0c0a06'} />

            {/* Active floor glow overlay */}
            {isCurrent && (
              <rect x="77" y={fy + 1} width="146" height="63"
                fill="none" stroke="#c8a84b" strokeWidth="1.5"
                opacity="0.4" filter="url(#tGoldGlow)" />
            )}

            {/* Windows (arched) */}
            {!isLocked && (
              <>
                {/* Left window */}
                <rect x="84" y={fy + 14} width="12" height="20"
                  fill={isCurrent ? '#4a3010' : '#080806'}
                  stroke={isCurrent ? '#9a7020' : '#1e1a0c'} strokeWidth="1" />
                <path d={`M 84 ${fy+14} Q 90 ${fy+10} 96 ${fy+14}`}
                  fill={isCurrent ? '#3a2808' : '#080806'}
                  stroke={isCurrent ? '#8b6914' : '#161208'} strokeWidth="0.8" />
                {/* Window light effect */}
                {isCurrent && (
                  <rect x="85" y={fy+15} width="10" height="18"
                    fill="#c8a84b" opacity="0.12" filter="url(#tWindowGlow)" />
                )}

                {/* Right window */}
                <rect x="204" y={fy + 14} width="12" height="20"
                  fill={isCurrent ? '#4a3010' : '#080806'}
                  stroke={isCurrent ? '#9a7020' : '#1e1a0c'} strokeWidth="1" />
                <path d={`M 204 ${fy+14} Q 210 ${fy+10} 216 ${fy+14}`}
                  fill={isCurrent ? '#3a2808' : '#080806'}
                  stroke={isCurrent ? '#8b6914' : '#161208'} strokeWidth="0.8" />
                {isCurrent && (
                  <rect x="205" y={fy+15} width="10" height="18"
                    fill="#c8a84b" opacity="0.12" filter="url(#tWindowGlow)" />
                )}
              </>
            )}

            {/* Floor icon */}
            {isLocked ? (
              <text x="116" y={fy + 38} textAnchor="middle" fontSize="18" opacity="0.35">🔒</text>
            ) : (
              <text x="116" y={fy + 38} textAnchor="middle"
                fill={isCurrent ? floor.color : '#4a3a20'} fontSize="16"
                filter={isCurrent ? 'url(#tGoldGlow)' : undefined}>
                {floor.icon}
              </text>
            )}

            {/* Floor label */}
            <text x="166" y={fy + 28} textAnchor="middle"
              fill={isCurrent ? '#e8c870' : isUnlocked ? '#a08040' : '#3a2c18'}
              fontSize={isCurrent ? '10.5' : '9.5'}
              fontWeight={isCurrent ? 'bold' : 'normal'}
              fontFamily="serif"
              filter={isCurrent ? 'url(#tGoldGlow)' : undefined}>
              {floor.label}
            </text>
            <text x="166" y={fy + 42} textAnchor="middle"
              fill={isCurrent ? '#9a7830' : isLocked ? '#2a2010' : '#6a5428'}
              fontSize="8"
              fontFamily="serif" fontStyle={isLocked ? 'normal' : 'italic'}>
              {isLocked ? 'versiegelt' : floor.sub}
            </text>

            {/* Staircase marks on right side */}
            {!isLocked && (
              <g opacity="0.45">
                {[0,1,2,3,4].map(i => (
                  <line key={i} x1={215-i*2} y1={fy+50+i*3} x2={222} y2={fy+50+i*3}
                    stroke="#5a4818" strokeWidth="1" />
                ))}
              </g>
            )}

            {/* Marker for current floor */}
            {isCurrent && marker && (
              <g filter="url(#tMarkerGlow)">
                <circle cx="242" cy={fy + 32} r="8" fill="#1a3060" stroke="#4a90d0" strokeWidth="1.5" opacity="0.95" />
                <circle cx="242" cy={fy + 32} r="3.5" fill="#6aabff" />
                <circle cx="240" cy={fy + 30} r="1.2" fill="#fff" opacity="0.6" />
                <rect x="252" y={fy + 23} width="44" height="18" fill="#0e1a2e" stroke="#4a90d0"
                  strokeWidth="1" rx="3" opacity="0.95" />
                <text x="274" y={fy + 35} textAnchor="middle" fill="#90c8ff" fontSize="7.5"
                  fontFamily="serif">{marker.label}</text>
              </g>
            )}
          </g>
        )
      })}

      {/* ── Base / door ── */}
      <rect x="76" y="464" width="148" height="8" fill="#0e0c06" stroke="#2a1e0c" strokeWidth="1" />
      {/* Arch door */}
      <rect x="130" y="435" width="40" height="36" fill="#0c0a04" stroke="#7a5018" strokeWidth="2" />
      <path d="M 130 435 Q 150 420 170 435" fill="#100e06" stroke="#7a5018" strokeWidth="2" />
      <circle cx="162" cy="455" r="3" fill="#a07828" />
      {/* Door steps */}
      <rect x="125" y="466" width="50" height="4" fill="#141008" stroke="#2a1e0c" strokeWidth="0.8" />
      <rect x="128" y="470" width="44" height="3" fill="#121008" stroke="#2a1e0c" strokeWidth="0.8" />

      {/* ── Mist overlay at top ── */}
      <rect width="300" height="80" fill="url(#tMist)" />

      {/* ── Ornate border ── */}
      <rect x="2" y="2" width="296" height="496" fill="none" stroke="#5a4018" strokeWidth="1.5" rx="2" />
      <rect x="5" y="5" width="290" height="490" fill="none" stroke="#3a2810" strokeWidth="0.5" rx="1" />

      {/* ── Title at bottom ── */}
      <text x="150" y="492" textAnchor="middle" fill="#5a4018" fontSize="8" letterSpacing="2"
        fontFamily="serif">TURM DES MAGIERS</text>
    </svg>
  )
}
