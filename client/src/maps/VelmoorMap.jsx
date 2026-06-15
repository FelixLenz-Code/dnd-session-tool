import { useGame } from '../context/GameContext'

const INK   = '#1a0e06'
const INKM  = '#5a3820'
const INKL  = '#8a6040'
const GOLD  = '#b87a0a'
const RED   = '#8b1a14'
const BLUE  = '#4a7a9a'
const GREEN = '#5a7a3a'
const WALL  = '#2a1c0e'

export default function VelmoorMap({ marker, svgStyle }) {
  const { state } = useGame()

  return (
    <svg viewBox="0 0 520 400" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={svgStyle ?? { display: 'block', width: '100%' }}>
      <defs>
        <radialGradient id="vmBg" cx="50%" cy="50%" r="75%">
          <stop offset="0%"   stopColor="#fdf5e0"/>
          <stop offset="55%"  stopColor="#f0e0b8"/>
          <stop offset="100%" stopColor="#c0a060"/>
        </radialGradient>
        <filter id="vmGold" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Hintergrund und Rahmen */}
      <rect width="520" height="400" fill={WALL}/>
      <rect x="10" y="10" width="500" height="380" fill="url(#vmBg)"/>
      <rect x="10" y="10" width="500" height="380" fill="none" stroke={INK} strokeWidth="2.5"/>
      <rect x="14" y="14" width="492" height="372" fill="none" stroke={INKM} strokeWidth="0.8"/>
      {/* Eckornamente */}
      {[[16,16],[504,16],[16,384],[504,384]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="6" fill="none" stroke={INK} strokeWidth="1.5"/>
          <circle cx={cx} cy={cy} r="2.5" fill={INK}/>
        </g>
      ))}

      {/* Titel */}
      <text x="260" y="36" textAnchor="middle" fill={INK} fontSize="14"
        fontFamily="Georgia,serif" letterSpacing="3" fontWeight="bold">
        VELMOOR
      </text>
      <line x1="28" y1="42" x2="492" y2="42" stroke={INK} strokeWidth="1"/>

      {/* Hügelgelände (Norden/Osten, Hintergrund) */}
      <ellipse cx="380" cy="90"  rx="80" ry="50" fill="#c8b870" opacity="0.35"/>
      <ellipse cx="440" cy="120" rx="60" ry="40" fill="#b8a860" opacity="0.3"/>
      <ellipse cx="340" cy="130" rx="50" ry="32" fill="#c0b068" opacity="0.28"/>

      {/* Fluss (West nach Süd) */}
      <path d="M 48 210 Q 80 200 110 220 Q 140 240 160 280 Q 175 310 180 370"
        fill="none" stroke={BLUE} strokeWidth="22" opacity="0.55"/>
      <path d="M 48 210 Q 80 200 110 220 Q 140 240 160 280 Q 175 310 180 370"
        fill="none" stroke="#6a9ac0" strokeWidth="14" opacity="0.4"/>
      <text x="78" y="230" fill={BLUE} fontSize="8" fontFamily="Georgia,serif"
        transform="rotate(-30,78,230)">Fluss Velm</text>

      {/* Stadtmauer (Hauptring) */}
      <ellipse cx="300" cy="220" rx="195" ry="155" fill="none" stroke={INK} strokeWidth="3.5"/>
      <ellipse cx="300" cy="220" rx="188" ry="148" fill="none" stroke={INKM} strokeWidth="1.2"/>
      {/* Mauertürme an 8 Stellen */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle-90)*Math.PI/180
        const tx  = 300 + 195 * Math.cos(rad)
        const ty  = 220 + 155 * Math.sin(rad)
        return (
          <polygon key={i}
            points={`${tx},${ty-8} ${tx+6},${ty} ${tx},${ty+8} ${tx-6},${ty}`}
            fill="#c8b070" stroke={INK} strokeWidth="1.2"/>
        )
      })}

      {/* Stadttor (Süden) */}
      <path d="M 271 373 L 271 362 Q 300 354 329 362 L 329 373"
        fill="#c8a860" stroke={INK} strokeWidth="2"/>
      <text x="300" y="370" textAnchor="middle" fill={INK} fontSize="7" fontFamily="Georgia,serif">Stadttor</text>

      {/* ALTSTADT – Mitte */}
      <ellipse cx="300" cy="200" rx="95" ry="80" fill="#ddd0a0" stroke={INKM} strokeWidth="1.5" opacity="0.7"/>
      <text x="300" y="186" textAnchor="middle" fill={INK} fontSize="8.5"
        fontFamily="Georgia,serif" fontWeight="bold">Altstadt</text>
      {/* Gebäude-Cluster */}
      {[
        [252,196],[270,196],[288,196],[306,196],[324,196],
        [252,210],[270,210],[288,210],[306,210],[324,210],
        [260,224],[278,224],[296,224],[314,224],
      ].map(([bx,by],i) => (
        <rect key={i} x={bx} y={by} width={12} height={10}
          fill="#b8a060" stroke={INKM} strokeWidth="0.6" rx="0.5"/>
      ))}
      {/* Rathaus */}
      <rect x="272" y="160" width="56" height="26" fill="#c8a860" stroke={INK} strokeWidth="1.5" rx="1"/>
      <path d="M 272 160 L 300 148 L 328 160" fill="#b89850" stroke={INK} strokeWidth="1.2"/>
      <text x="300" y="176" textAnchor="middle" fill={INK} fontSize="7"
        fontFamily="Georgia,serif" fontWeight="bold">Rathaus</text>
      {/* Kirche */}
      <rect x="292" y="232" width="16" height="24" fill="#c0b080" stroke={INK} strokeWidth="1.2"/>
      <polygon points="300,224 292,238 308,238" fill="#b0a070" stroke={INK} strokeWidth="1.2"/>
      <line x1="300" y1="222" x2="300" y2="216" stroke={INK} strokeWidth="1.5"/>
      <line x1="296" y1="219" x2="304" y2="219" stroke={INK} strokeWidth="1.2"/>
      <text x="300" y="264" textAnchor="middle" fill={INK} fontSize="7" fontFamily="Georgia,serif">Kirche</text>

      {/* HÄNDLERVIERTEL – Westen */}
      <ellipse cx="175" cy="210" rx="70" ry="60" fill="#d4e8c8" stroke={INKM} strokeWidth="1.2" opacity="0.65"/>
      <text x="175" y="194" textAnchor="middle" fill={GREEN} fontSize="8"
        fontFamily="Georgia,serif" fontWeight="bold">Händler-</text>
      <text x="175" y="204" textAnchor="middle" fill={GREEN} fontSize="8"
        fontFamily="Georgia,serif" fontWeight="bold">viertel</text>
      {/* Läden */}
      {[
        [145,210],[161,210],[177,210],[193,210],
        [148,224],[164,224],[180,224],
      ].map(([bx,by],i) => (
        <rect key={i} x={bx} y={by} width={12} height={10}
          fill="#a8c090" stroke={GREEN} strokeWidth="0.7" rx="0.5"/>
      ))}
      {/* Marktplatz */}
      <rect x="148" y="236" width="54" height="22" fill="#c8d8a0" stroke={GREEN} strokeWidth="1.2" rx="1"/>
      <text x="175" y="251" textAnchor="middle" fill={GREEN} fontSize="7" fontFamily="Georgia,serif">Marktplatz</text>

      {/* HAFENVIERTEL – Süden */}
      <ellipse cx="270" cy="310" rx="65" ry="45" fill="#c8dce8" stroke={BLUE} strokeWidth="1.2" opacity="0.65"/>
      <text x="270" y="298" textAnchor="middle" fill={BLUE} fontSize="8"
        fontFamily="Georgia,serif" fontWeight="bold">Hafenviertel</text>
      {/* Kai und Schiff */}
      <rect x="228" y="308" width="84" height="10" fill="#b0a870" stroke={INKM} strokeWidth="1"/>
      {[238,256,274,292].map(x => (
        <line key={x} x1={x} y1={308} x2={x} y2={318} stroke={INKM} strokeWidth="0.8"/>
      ))}
      <path d="M 244 328 Q 262 322 280 328 L 276 338 Q 262 334 248 338 Z"
        fill="#c8b070" stroke={INK} strokeWidth="1"/>
      <line x1="262" y1="322" x2="262" y2="312" stroke={INK} strokeWidth="1.2"/>

      {/* AUSSENBEZIRK – Norden/Osten */}
      <text x="390" y="172" textAnchor="middle" fill={INKM} fontSize="8"
        fontFamily="Georgia,serif" fontWeight="bold">Außen-</text>
      <text x="390" y="182" textAnchor="middle" fill={INKM} fontSize="8"
        fontFamily="Georgia,serif" fontWeight="bold">bezirk</text>
      {[
        [360,188],[378,188],[396,188],[412,188],
        [366,202],[384,202],[402,202],
      ].map(([bx,by],i) => (
        <rect key={i} x={bx} y={by} width={11} height={9}
          fill="#c8b880" stroke={INKM} strokeWidth="0.6"/>
      ))}
      {/* Heiler */}
      <rect x="416" y="202" width="14" height="14" fill="#d0e8d0" stroke={GREEN} strokeWidth="1.2"/>
      <line x1="423" y1="204" x2="423" y2="214" stroke={GREEN} strokeWidth="1.8"/>
      <line x1="418" y1="209" x2="428" y2="209" stroke={GREEN} strokeWidth="1.8"/>

      {/* TURM DES MAGIERS – Nordwesten */}
      <rect x="52" y="90" width="24" height="40" fill="#b89860" stroke={INK} strokeWidth="1.8" rx="1"/>
      <polygon points="64,76 52,96 76,96" fill="#a88850" stroke={INK} strokeWidth="1.5"/>
      <rect x="62" y="112" width="5" height="9" fill="#c0d0e8" stroke={INKM} strokeWidth="0.8"/>
      <line x1="64" y1="76" x2="64" y2="68" stroke={INK} strokeWidth="1.5"/>
      <polygon points="64,70 76,74 64,78" fill={GOLD} opacity="0.8"/>
      <text x="64" y="144" textAnchor="middle" fill={INK} fontSize="7.5"
        fontFamily="Georgia,serif" fontWeight="bold">Turm des</text>
      <text x="64" y="155" textAnchor="middle" fill={INK} fontSize="7.5"
        fontFamily="Georgia,serif" fontWeight="bold">Magiers</text>
      {/* Weg zur Stadt */}
      <path d="M 76 118 Q 120 118 150 170"
        fill="none" stroke={INKL} strokeWidth="1.5" strokeDasharray="5,4"/>

      {/* Kompassrose – rechts unten */}
      {(() => {
        const kx = 466, ky = 350, kr = 28
        return (
          <g>
            <circle cx={kx} cy={ky} r={kr} fill="#e8d8a8" stroke={INK} strokeWidth="1.5"/>
            <circle cx={kx} cy={ky} r={kr-4} fill="none" stroke={INKM} strokeWidth="0.6"/>
            <polygon points={`${kx},${ky-kr+4} ${kx-5},${ky-8} ${kx+5},${ky-8}`} fill={INK}/>
            <polygon points={`${kx},${ky+kr-4} ${kx-5},${ky+8} ${kx+5},${ky+8}`} fill={INKL}/>
            <polygon points={`${kx-kr+4},${ky} ${kx-8},${ky-5} ${kx-8},${ky+5}`} fill={INKL}/>
            <polygon points={`${kx+kr-4},${ky} ${kx+8},${ky-5} ${kx+8},${ky+5}`} fill={INKL}/>
            <circle cx={kx} cy={ky} r="4" fill="#e8d8a8" stroke={INK} strokeWidth="1"/>
            <text x={kx}    y={ky-kr+12}   textAnchor="middle" fill={INK}  fontSize="9" fontFamily="Georgia,serif" fontWeight="bold">N</text>
            <text x={kx}    y={ky+kr-2}    textAnchor="middle" fill={INKM} fontSize="7.5" fontFamily="Georgia,serif">S</text>
            <text x={kx-kr+6} y={ky+3}     textAnchor="middle" fill={INKM} fontSize="7.5" fontFamily="Georgia,serif">W</text>
            <text x={kx+kr-6} y={ky+3}     textAnchor="middle" fill={INKM} fontSize="7.5" fontFamily="Georgia,serif">O</text>
          </g>
        )
      })()}

      {/* Legende */}
      <rect x="18" y="334" width="130" height="52" fill="#e8d8a8" stroke={INKM} strokeWidth="1.2" rx="2"/>
      <text x="83" y="348" textAnchor="middle" fill={INK} fontSize="8"
        fontFamily="Georgia,serif" fontWeight="bold">Legende</text>
      {[
        { color:'#b8a060', label:'Altstadt'       },
        { color:'#a8c090', label:'Händlerviertel'  },
        { color:'#88a8c0', label:'Hafenviertel'   },
        { color:'#c8b880', label:'Außenbezirk'    },
      ].map(({ color, label }, i) => (
        <g key={i}>
          <rect x={24} y={354 + i*7} width={8} height={6}
            fill={color} stroke={INKM} strokeWidth="0.6"/>
          <text x={36} y={360 + i*7} fill={INK} fontSize="7" fontFamily="Georgia,serif">{label}</text>
        </g>
      ))}

      {/* Marker */}
      {marker && (() => {
        const w = Math.max((marker.label?.length ?? 0) * 5.5 + 10, 36)
        return (
          <g>
            <circle cx="170" cy="175" r="12" fill="none" stroke={RED} strokeWidth="1.5" opacity="0.45">
              <animate attributeName="r"       values="12;20;12"   dur="2.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.45;0;0.45" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="170" cy="175" r="7" fill={RED} stroke="#fff8ee" strokeWidth="1.5"/>
            <circle cx="170" cy="175" r="3" fill="#fff8ee"/>
            <rect x="181" y="166" width={w} height="14" fill={RED} rx="3" opacity="0.9"/>
            <text x="185" y="176" fill="#fff8ee" fontSize="7.5"
              fontFamily="Arial,sans-serif" fontWeight="bold">{marker.label}</text>
          </g>
        )
      })()}
    </svg>
  )
}
