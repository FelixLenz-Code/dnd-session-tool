import { useGame } from '../context/GameContext'

const INK   = '#1a0e06'
const INKM  = '#5a3820'
const INKL  = '#8a6040'
const GOLD  = '#b87a0a'
const RED   = '#8b1a14'
const BLUE  = '#3a6a8a'
const GREEN = '#3f5f28'
const WALL  = '#2a1c0e'

// Beschriftungs-Plakette — cremefarbenes Schild, immer lesbar
function Plaque({ cx, cy, text, fs = 8, fill = INK, plate = '#f4ead0' }) {
  const w = text.length * fs * 0.6 + 12
  const h = fs + 8
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h}
        fill={plate} stroke={INKM} strokeWidth="0.9" rx="3"/>
      <text x={cx} y={cy + fs * 0.35} textAnchor="middle" fill={fill} fontSize={fs}
        fontFamily="Georgia,serif" fontWeight="bold">{text}</text>
    </g>
  )
}

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
      </defs>

      {/* Hintergrund und Rahmen */}
      <rect width="520" height="400" fill={WALL}/>
      <rect x="10" y="10" width="500" height="380" fill="url(#vmBg)"/>
      <rect x="10" y="10" width="500" height="380" fill="none" stroke={INK} strokeWidth="2.5"/>
      <rect x="14" y="14" width="492" height="372" fill="none" stroke={INKM} strokeWidth="0.7"/>
      {[[17,17],[503,17],[17,383],[503,383]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill={INK}/>
      ))}

      {/* Titelbalken */}
      <rect x="10" y="10" width="500" height="32" fill={WALL}/>
      <text x="260" y="32" textAnchor="middle" fill="#e8c870" fontSize="15"
        fontFamily="Georgia,serif" letterSpacing="3" fontWeight="bold">VELMOOR</text>

      {/* Hügelgelände (Nordosten) */}
      <ellipse cx="430" cy="78"  rx="70" ry="38" fill="#c8b870" opacity="0.3"/>
      <ellipse cx="470" cy="105" rx="50" ry="30" fill="#b8a860" opacity="0.28"/>

      {/* Fluss (West) */}
      <path d="M 40 150 Q 70 180 78 230 Q 84 270 70 320 Q 62 350 60 378"
        fill="none" stroke={BLUE} strokeWidth="20" opacity="0.5"/>
      <path d="M 40 150 Q 70 180 78 230 Q 84 270 70 320 Q 62 350 60 378"
        fill="none" stroke="#7aa8c8" strokeWidth="12" opacity="0.4"/>
      <Plaque cx={104} cy={306} text="Fluss Velm" fs={7.5} fill={BLUE}/>

      {/* Stadtmauer (Hauptring) */}
      <ellipse cx="292" cy="224" rx="200" ry="150" fill="none" stroke={INK}  strokeWidth="3.5"/>
      <ellipse cx="292" cy="224" rx="193" ry="143" fill="none" stroke={INKM} strokeWidth="1.2"/>
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle-90)*Math.PI/180
        const tx  = 292 + 200 * Math.cos(rad)
        const ty  = 224 + 150 * Math.sin(rad)
        return (
          <polygon key={i}
            points={`${tx},${ty-8} ${tx+6},${ty} ${tx},${ty+8} ${tx-6},${ty}`}
            fill="#c8b070" stroke={INK} strokeWidth="1.2"/>
        )
      })}

      {/* Bezirks-Flächen (klar getrennt) */}
      <ellipse cx="296" cy="180" rx="78" ry="56" fill="#e0d2a4" stroke={INKM}  strokeWidth="1.2" opacity="0.85"/>
      <ellipse cx="160" cy="232" rx="60" ry="50" fill="#cfe4c2" stroke={GREEN} strokeWidth="1.1" opacity="0.7"/>
      <ellipse cx="300" cy="322" rx="70" ry="40" fill="#bcd6e6" stroke={BLUE}  strokeWidth="1.1" opacity="0.7"/>
      <ellipse cx="416" cy="206" rx="52" ry="64" fill="#dcd0b0" stroke={INKM}  strokeWidth="1.1" opacity="0.75"/>

      {/* ALTSTADT */}
      <rect x="272" y="158" width="48" height="22" fill="#c8a860" stroke={INK} strokeWidth="1.4" rx="1"/>
      <polygon points="272,158 296,148 320,158" fill="#b89850" stroke={INK} strokeWidth="1.2"/>
      <text x="296" y="173" textAnchor="middle" fill={INK} fontSize="6.5" fontFamily="Georgia,serif" fontWeight="bold">Rathaus</text>
      {[[252,188],[266,188],[316,188],[330,188],[258,200],[272,200],[320,200],[334,200]].map(([bx,by],i) => (
        <rect key={i} x={bx} y={by} width="11" height="9" fill="#b8a060" stroke={INKM} strokeWidth="0.6" rx="0.5"/>
      ))}
      {/* Kirche */}
      <rect x="290" y="196" width="14" height="20" fill="#c0b080" stroke={INK} strokeWidth="1.1"/>
      <polygon points="297,188 290,198 304,198" fill="#b0a070" stroke={INK} strokeWidth="1.1"/>
      <line x1="297" y1="186" x2="297" y2="181" stroke={INK} strokeWidth="1.3"/>
      <line x1="294" y1="183" x2="300" y2="183" stroke={INK} strokeWidth="1.1"/>
      <Plaque cx={296} cy={138} text="Altstadt" fs={9}/>
      <Plaque cx={331} cy={224} text="Kirche" fs={7.5}/>

      {/* AUSSENBEZIRK */}
      {[[392,184],[406,184],[420,184],[398,196],[412,196]].map(([bx,by],i) => (
        <rect key={i} x={bx} y={by} width="11" height="9" fill="#c8b880" stroke={INKM} strokeWidth="0.6"/>
      ))}
      <rect x="404" y="214" width="14" height="14" fill="#d0e8d0" stroke={GREEN} strokeWidth="1.2"/>
      <line x1="411" y1="216" x2="411" y2="226" stroke={GREEN} strokeWidth="1.6"/>
      <line x1="406" y1="221" x2="416" y2="221" stroke={GREEN} strokeWidth="1.6"/>
      <Plaque cx={416} cy={160} text="Außenbezirk" fs={8}/>
      <Plaque cx={411} cy={240} text="Heiler" fs={7} fill={GREEN}/>

      {/* HÄNDLERVIERTEL */}
      {[[134,220],[148,220],[162,220],[176,220],[140,232],[154,232],[168,232]].map(([bx,by],i) => (
        <rect key={i} x={bx} y={by} width="11" height="9" fill="#a8c090" stroke={GREEN} strokeWidth="0.7" rx="0.5"/>
      ))}
      <rect x="132" y="246" width="56" height="18" fill="#c8d8a0" stroke={GREEN} strokeWidth="1.1" rx="1"/>
      <text x="160" y="258" textAnchor="middle" fill={GREEN} fontSize="7" fontFamily="Georgia,serif">Marktplatz</text>
      <Plaque cx={160} cy={200} text="Händlerviertel" fs={8} fill={GREEN}/>

      {/* HAFENVIERTEL */}
      <rect x="258" y="326" width="84" height="9" fill="#b0a870" stroke={INKM} strokeWidth="1"/>
      {[268,286,304,322].map(x => (
        <line key={x} x1={x} y1="326" x2={x} y2="335" stroke={INKM} strokeWidth="0.8"/>
      ))}
      <path d="M 282 348 Q 300 342 318 348 L 314 357 Q 300 353 286 357 Z"
        fill="#c8b070" stroke={INK} strokeWidth="1"/>
      <line x1="300" y1="342" x2="300" y2="332" stroke={INK} strokeWidth="1.2"/>
      <Plaque cx={300} cy={300} text="Hafenviertel" fs={8} fill={BLUE}/>

      {/* Stadttor */}
      <path d="M 263 375 L 263 364 Q 292 356 321 364 L 321 375"
        fill="#c8a860" stroke={INK} strokeWidth="2"/>
      <Plaque cx={292} cy={382} text="Stadttor" fs={7}/>

      {/* Turm des Magiers (Nordwesten) */}
      <rect x="50" y="92" width="22" height="36" fill="#b89860" stroke={INK} strokeWidth="1.6" rx="1"/>
      <polygon points="61,80 50,96 72,96" fill="#a88850" stroke={INK} strokeWidth="1.4"/>
      <rect x="58" y="110" width="5" height="8" fill="#c0d0e8" stroke={INKM} strokeWidth="0.7"/>
      <line x1="61" y1="80" x2="61" y2="72" stroke={INK} strokeWidth="1.4"/>
      <polygon points="61,74 72,77 61,80" fill={GOLD} opacity="0.8"/>
      <path d="M 72 116 Q 130 120 175 158" fill="none" stroke={INKL} strokeWidth="1.4" strokeDasharray="5,4"/>
      <Plaque cx={61} cy={148} text="Turm des Magiers" fs={7.5}/>

      {/* Kompassrose (Südosten) */}
      <circle cx="466" cy="350" r="26" fill="#e8d8a8" stroke={INK} strokeWidth="1.5"/>
      <circle cx="466" cy="350" r="22" fill="none" stroke={INKM} strokeWidth="0.6"/>
      <polygon points="466,328 461,344 471,344" fill={INK}/>
      <polygon points="466,372 461,356 471,356" fill={INKL}/>
      <polygon points="444,350 460,345 460,355" fill={INKL}/>
      <polygon points="488,350 472,345 472,355" fill={INKL}/>
      <circle cx="466" cy="350" r="3.5" fill="#e8d8a8" stroke={INK} strokeWidth="1"/>
      <text x="466" y="336" textAnchor="middle" fill={INK} fontSize="8.5" fontFamily="Georgia,serif" fontWeight="bold">N</text>

      {/* Legende */}
      <rect x="20" y="332" width="118" height="50" fill="#f4ead0" stroke={INKM} strokeWidth="1.1" rx="3"/>
      <text x="79" y="345" textAnchor="middle" fill={INK} fontSize="8" fontFamily="Georgia,serif" fontWeight="bold">Legende</text>
      {[
        { color:'#e0d2a4', label:'Altstadt'       },
        { color:'#cfe4c2', label:'Händlerviertel'  },
        { color:'#bcd6e6', label:'Hafenviertel'   },
        { color:'#dcd0b0', label:'Außenbezirk'    },
      ].map(({ color, label }, i) => (
        <g key={i}>
          <rect x={26} y={351 + i*7.5} width={9} height={6.5} fill={color} stroke={INKM} strokeWidth="0.6"/>
          <text x={40} y={357 + i*7.5} fill={INK} fontSize="7" fontFamily="Georgia,serif">{label}</text>
        </g>
      ))}

      {/* Marker */}
      {marker && (() => {
        const w = Math.max((marker.label?.length ?? 0) * 5.5 + 10, 36)
        return (
          <g>
            <circle cx="61" cy="110" r="12" fill="none" stroke={RED} strokeWidth="1.5" opacity="0.45">
              <animate attributeName="r"       values="12;20;12"   dur="2.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.45;0;0.45" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="61" cy="110" r="7" fill={RED} stroke="#fff8ee" strokeWidth="1.5"/>
            <circle cx="61" cy="110" r="3" fill="#fff8ee"/>
            <rect x="72" y="101" width={w} height="14" fill={RED} rx="3" opacity="0.9"/>
            <text x="76" y="111" fill="#fff8ee" fontSize="7.5"
              fontFamily="Arial,sans-serif" fontWeight="bold">{marker.label}</text>
          </g>
        )
      })()}
    </svg>
  )
}
