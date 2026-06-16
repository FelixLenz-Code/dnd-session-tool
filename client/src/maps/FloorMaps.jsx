import { useGame } from '../context/GameContext'

const INK  = '#1a0e06'
const INKM = '#5a3820'
const INKL = '#8a6040'
const GOLD = '#b87a0a'
const RED  = '#8b1a14'
const BLUE = '#3a6080'
const WALL = '#2a1c0e'

function Defs({ p }) {
  return (
    <defs>
      <radialGradient id={`${p}bg`} cx="48%" cy="42%" r="72%">
        <stop offset="0%"   stopColor="#fef6e2"/>
        <stop offset="65%"  stopColor="#efd9b0"/>
        <stop offset="100%" stopColor="#bfa060"/>
      </radialGradient>
    </defs>
  )
}

function Frame({ p, title, children, svgStyle, h = 360 }) {
  return (
    <svg viewBox={`0 0 500 ${h}`} xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={svgStyle ?? { display: 'block', width: '100%' }}>
      <Defs p={p}/>
      <rect width="500" height={h} fill={`url(#${p}bg)`}/>
      <rect x="4" y="4" width="492" height={h-8}  fill="none" stroke={INK}  strokeWidth="2.5" rx="3"/>
      <rect x="8" y="8" width="484" height={h-16} fill="none" stroke={INKM} strokeWidth="0.7"/>
      <circle cx="11"  cy="11"    r="4" fill={INK}/>
      <circle cx="489" cy="11"    r="4" fill={INK}/>
      <circle cx="11"  cy={h-11}  r="4" fill={INK}/>
      <circle cx="489" cy={h-11}  r="4" fill={INK}/>
      <rect x="4" y="4" width="492" height="34" fill={WALL} rx="3"/>
      <text x="250" y="27" textAnchor="middle" fill="#e8c870" fontSize="13"
        fontFamily="Georgia,serif" letterSpacing="3" fontWeight="bold">
        {title.toUpperCase()}
      </text>
      {children}
    </svg>
  )
}

function Lbl({ x, y, text, fs = 9, fill = INK, anchor = 'middle', bold = false }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={fs}
      fontFamily="Georgia,serif" fontWeight={bold ? 'bold' : 'normal'}>
      {text}
    </text>
  )
}

// Beschriftungs-Plakette: cremefarbenes Schild mit Rand — immer lesbar,
// egal auf welchem Untergrund. Das gemeinsame Text-System aller Karten.
function Plaque({ cx, cy, text, fs = 9, fill = INK, plate = '#f4ead0' }) {
  const w = text.length * fs * 0.62 + 14
  const h = fs + 9
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h}
        fill={plate} stroke={INKM} strokeWidth="0.9" rx="3"/>
      <text x={cx} y={cy + fs * 0.36} textAnchor="middle" fill={fill} fontSize={fs}
        fontFamily="Georgia,serif" fontWeight="bold">{text}</text>
    </g>
  )
}

function Marker({ x, y, label }) {
  if (!label) return null
  const w = Math.max((label?.length ?? 0) * 5.8 + 10, 34)
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill="none" stroke={RED} strokeWidth="1.5" opacity="0.45">
        <animate attributeName="r"       values="13;21;13"   dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.45;0;0.45" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x} cy={y} r="7" fill={RED} stroke="#fff8ee" strokeWidth="1.5"/>
      <circle cx={x} cy={y} r="3" fill="#fff8ee"/>
      <rect x={x+11} y={y-9} width={w} height="15" fill={RED} rx="3" opacity="0.9"/>
      <text x={x+15} y={y+2} fill="#fff8ee" fontSize="8"
        fontFamily="Arial,sans-serif" fontWeight="bold">{label}</text>
    </g>
  )
}

function StairRect({ x, y, w = 78, h = 56 }) {
  return (
    <g>
      <rect x={x}    y={y}    width={w}    height={h}    fill="#b09038" stroke={INK}  strokeWidth="1.5" rx="1"/>
      <rect x={x+7}  y={y+7}  width={w-14} height={h-14} fill="#a08028" stroke={INKM} strokeWidth="0.8"/>
      <rect x={x+14} y={y+14} width={w-28} height={h-28} fill="#907018"/>
      {w > 50 && <rect x={x+21} y={y+21} width={w-42} height={h-42} fill="#806008"/>}
    </g>
  )
}

function FooterEntrance({ y = 316, totalH = 360 }) {
  return (
    <>
      <rect x="4" y={y} width="492" height={totalH - y - 4} fill={WALL}/>
      <path d={`M 222 ${y+14} L 222 ${y} Q 250 ${y-11} 278 ${y} L 278 ${y+14}`}
        fill="#c8a850" stroke={INK} strokeWidth="1.5"/>
      <text x="250" y={y+11} textAnchor="middle" fill="#e8c870" fontSize="9"
        fontFamily="Georgia,serif" fontWeight="bold">▼ Eingang</text>
    </>
  )
}

// ── Keller – interaktiv (Jahreszeiten-Puzzle) ─────────────────────────────────

const KELLER_SEASONS = [
  { id: 'winter',    sym: '❄', label: 'Winter',   cx: 232, cy:  98 },
  { id: 'fruehling', sym: '🌸', label: 'Frühling', cx: 455, cy:  98 },
  { id: 'herbst',    sym: '🍂', label: 'Herbst',   cx: 232, cy: 228 },
  { id: 'sommer',    sym: '☀', label: 'Sommer',   cx: 455, cy: 228 },
]

export function FloorKeller({ marker, interactive = false, puzzleState, puzzleWrong, svgStyle }) {
  const { actions } = useGame()
  const progress = puzzleState?.progress ?? []
  const solved   = puzzleState?.solved   ?? false

  function getSeasonFill(id) {
    if (solved)                return '#b8f0a0'
    if (puzzleWrong)           return '#f08080'
    if (progress.includes(id)) return '#c8e890'
    return '#e6dab5'
  }

  function handleClick(id) {
    if (!interactive || solved) return
    actions.interactMap('floor-keller', id)
  }

  return (
    <Frame p="fk" title="Keller – Die Pforte" svgStyle={svgStyle}>
      {/* Linkes Panel: Stein */}
      <rect x="14" y="43" width="176" height="265" fill="#c0b8a8" stroke={INK} strokeWidth="1.5"/>
      <rect x="20" y="49" width="164" height="253" fill="#c8c0b0"/>

      {/* Gedicht-Tafel */}
      <rect x="30" y="60" width="148" height="142" fill="#d4c8a8" stroke={INK} strokeWidth="2" rx="2"/>
      <rect x="38" y="68" width="132" height="126" fill="#dcd0b4" stroke={INKM} strokeWidth="0.8"/>
      {[100,114,128,142,156,170].map((lineY, i) => (
        <line key={i} x1={46} y1={lineY} x2={162} y2={lineY}
          stroke={INKM} strokeWidth="0.8" opacity="0.5"/>
      ))}
      <Lbl x="104" y="188" text="(In Stein gemeißelt)" fs={8} fill={INKL}/>
      <Plaque cx={104} cy={82} text="Gedicht-Tafel" fs={9.5}/>

      {/* Treppe (links unten) */}
      <StairRect x="34" y="226" w="148" h="64"/>
      <Plaque cx={108} cy={300} text="▲ Treppe" fs={9}/>

      {/* Rechtes Panel: Gold */}
      <rect x="192" y="43" width="294" height="265" fill="#d4c070" stroke={INK} strokeWidth="1.5"/>
      <rect x="198" y="49" width="282" height="253" fill="#dcca7a"/>

      {/* Versiegelte Tür – Steinrahmen */}
      <rect x="292" y="58" width="106" height="196" fill="#5a4010" stroke={INK} strokeWidth="2.5" rx="1"/>
      <rect x="300" y="66" width="90" height="182" fill="#c09030" stroke={INKM} strokeWidth="1.2"/>
      {[90,110,130,150,170,190,210,230].map(lineY => (
        <line key={lineY} x1={302} y1={lineY} x2={388} y2={lineY}
          stroke="#8a6010" strokeWidth="0.8" opacity="0.7"/>
      ))}
      <path d="M 300 86 Q 345 56 390 86" fill="#5a4010" stroke={INK} strokeWidth="2"/>
      <path d="M 306 90 Q 345 64 384 90" fill="#d09040" stroke={INKM} strokeWidth="1"/>
      <rect x="326" y="134" width="44" height="28" fill="#9a8030" stroke={INK} strokeWidth="1.2" rx="2"/>
      <rect x="330" y="138" width="36" height="20" fill="#b09840" rx="1"/>
      <circle cx="380" cy="153" r="7" fill={GOLD} stroke={INK} strokeWidth="1.3"/>
      <circle cx="380" cy="153" r="4" fill="#e0b030"/>
      {[[296,78],[296,148],[388,78],[388,148]].map(([bx,by],i) => (
        <rect key={i} x={bx} y={by} width="6" height="50" fill="#5a5040" stroke={INK} strokeWidth="0.7" rx="1"/>
      ))}
      <Plaque cx={345} cy={272} text="Versiegelte Pforte" fs={9}/>
      {interactive && !solved && (
        <Lbl x="345" y="292" text="Symbole in richtiger Reihenfolge wählen" fs={7.5} fill={INKM}/>
      )}

      {/* Jahreszeiten-Kreise (klickbar) */}
      {KELLER_SEASONS.map(({ id, sym, label, cx, cy }) => (
        <g key={id}
          onClick={() => handleClick(id)}
          style={{ cursor: interactive && !solved ? 'pointer' : 'default' }}>
          <circle cx={cx} cy={cy} r="26"
            fill={getSeasonFill(id)}
            stroke={progress.includes(id) && !puzzleWrong ? '#5a8a30' : puzzleWrong ? RED : INKM}
            strokeWidth={progress.includes(id) || puzzleWrong ? 2.5 : 1.8}/>
          {progress.includes(id) && !puzzleWrong && (
            <circle cx={cx} cy={cy} r="28" fill="none" stroke="#5a8a30" strokeWidth="1.5" opacity="0.3"/>
          )}
          <text x={cx} y={cy+8} textAnchor="middle" fontSize="20">{sym}</text>
          <Plaque cx={cx} cy={cy+40} text={label} fs={8.5}/>
        </g>
      ))}

      {/* Gelöst-Overlay */}
      {solved && (
        <>
          <rect x="300" y="66" width="90" height="182" fill="#d4f0a0" opacity="0.6"/>
          <Lbl x="345" y="163" text="OFFEN" fs={16} bold fill="#3a7a14"/>
        </>
      )}

      <FooterEntrance y={316} totalH={360}/>
      {marker && <Marker x={345} y={160} label={marker.label}/>}
    </Frame>
  )
}

// ── Bibliothek ────────────────────────────────────────────────────────────────

const BOOK_COLS = ['#8a3010','#2a4870','#2a5820','#5a2870','#b86010','#3a5060','#4a6030','#7a4020']

export function FloorBibliothek({ marker, svgStyle }) {
  return (
    <Frame p="fb" title="Bibliothek" svgStyle={svgStyle}>
      <rect x="14" y="43" width="472" height="265" fill="#d8c880" stroke={INK} strokeWidth="1.5"/>
      <rect x="24" y="53" width="452" height="255" fill="#e4d090"/>

      {/* NORDWAND – Vollregal mit Lücke */}
      <rect x="24" y="53" width="452" height="36" fill="#8a5c20" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length: 26}, (_, i) => {
        if (i >= 12 && i <= 13) return null
        return <rect key={i} x={28+i*17} y="55" width="15" height="32"
          fill={BOOK_COLS[i % 8]} stroke={INKM} strokeWidth="0.5"/>
      })}
      <rect x="236" y="53" width="34" height="36" fill="#f0d840" stroke={GOLD} strokeWidth="2.5"/>
      <Lbl x="253" y="75" text="LÜCKE" fs={8} bold fill={WALL}/>

      {/* WESTWAND – Regal */}
      <rect x="24" y="89" width="32" height="180" fill="#8a5c20" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length: 9}, (_, i) => (
        <line key={i} x1="24" y1={91+i*19} x2="56" y2={91+i*19} stroke={INKM} strokeWidth="0.6"/>
      ))}

      {/* OSTWAND – Regal + Tagebuch */}
      <rect x="444" y="89" width="32" height="124" fill="#8a5c20" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length: 7}, (_, i) => (
        <line key={i} x1="444" y1={91+i*18} x2="476" y2={91+i*18} stroke={INKM} strokeWidth="0.6"/>
      ))}
      <rect x="444" y="216" width="32" height="56" fill={RED} stroke={INK} strokeWidth="1.8"/>
      <rect x="448" y="220" width="24" height="48" fill="#9a1818"/>
      <rect x="449" y="240" width="22" height="4" fill={GOLD} stroke={INK} strokeWidth="0.6"/>
      {/* Tagebuch-Label mit Pfeil */}
      <line x1="440" y1="113" x2="458" y2="220" stroke={RED} strokeWidth="1" strokeDasharray="3,2"/>
      <Plaque cx={413} cy={103} text="Tagebuch" fs={8.5} fill={RED} plate="#fff0e0"/>

      {/* LESETISCH */}
      <rect x="88" y="106" width="252" height="96" fill="#c09040" stroke={INK} strokeWidth="2" rx="2"/>
      <rect x="95" y="113" width="238" height="82"  fill="#ccaa48" stroke={INKM} strokeWidth="0.9" rx="1"/>
      <rect x="102" y="118" width="28" height="36" fill="#6a2010" stroke={INK} strokeWidth="0.7" rx="1"/>
      <rect x="106" y="122" width="20" height="28" fill="#7a2818" rx="1"/>
      <rect x="148" y="120" width="58" height="34" fill="#d8c870" stroke={INK} strokeWidth="0.8" rx="1"/>
      {/* Kerze */}
      <rect x="300" y="114" width="8" height="20" fill="#f0e8c0" stroke={INKM} strokeWidth="0.7"/>
      <ellipse cx="304" cy="111" rx="5" ry="3.5" fill="#f0c020" opacity="0.85"/>
      <ellipse cx="304" cy="109" rx="3" ry="5"   fill="#ff9010" opacity="0.7"/>
      <Plaque cx={214} cy={178} text="Lesetisch" fs={10}/>

      {/* TREPPE */}
      <StairRect x="36" y="228" w="80" h="58"/>
      <Plaque cx={76} cy={300} text="▲ Treppe" fs={9}/>

      {/* ALDRICS NOTIZEN (Schriftrolle) */}
      <rect x="332" y="226" width="106" height="74" fill="#e0cf9a" stroke={INK} strokeWidth="1.5" rx="4"/>
      <rect x="338" y="232" width="94"  height="62" fill="#e8d8a8" stroke={INKM} strokeWidth="0.7" rx="2"/>
      <ellipse cx="338" cy="263" rx="7" ry="31" fill="#d8c888" stroke={INKM} strokeWidth="0.7"/>
      <ellipse cx="438" cy="263" rx="7" ry="31" fill="#d8c888" stroke={INKM} strokeWidth="0.7"/>
      <Lbl x="388" y="252" text="Aldrics" fs={10} bold fill={INK}/>
      <Lbl x="388" y="266" text="Notizen" fs={9}  fill={INKM}/>
      <line x1="352" y1="278" x2="424" y2="278" stroke={INKM} strokeWidth="0.7" opacity="0.6"/>
      <line x1="352" y1="288" x2="410" y2="288" stroke={INKM} strokeWidth="0.7" opacity="0.6"/>

      <FooterEntrance y={316} totalH={360}/>
      {marker && <Marker x={214} y={150} label={marker.label}/>}
    </Frame>
  )
}

// ── Labor ─────────────────────────────────────────────────────────────────────

export function FloorLabor({ marker, svgStyle }) {
  return (
    <Frame p="fl" title="Labor" svgStyle={svgStyle}>
      <rect x="14" y="43" width="472" height="265" fill="#d0c076" stroke={INK} strokeWidth="1.5"/>
      <rect x="24" y="53" width="452" height="255" fill="#dac880"/>

      {/* 3 WERKBÄNKE oben */}
      {[
        { x:28,  label:'Tisch 1',         active:false },
        { x:182, label:'Tisch 2',         active:false },
        { x:336, label:'Tisch 3 (aktiv)', active:true  },
      ].map(({ x, label, active }) => (
        <g key={label}>
          <rect x={x} y="57" width="134" height="50"
            fill={active ? '#c8b840' : '#a89030'}
            stroke={active ? GOLD : INK} strokeWidth={active ? 2.5 : 1.5} rx="1"/>
          {active && (
            <rect x={x} y="57" width="134" height="50"
              fill="none" stroke={GOLD} strokeWidth="2" opacity="0.5"/>
          )}
          {[0,1,2,3].map(i => (
            <g key={i}>
              <rect x={x+12+i*28} y="61" width="10" height="26" rx="1"
                fill={active ? ['#a0c8d8','#d07838','#60a060','#c8a030'][i] : '#b0a060'}
                stroke={INK} strokeWidth="0.7"/>
              <ellipse cx={x+17+i*28} cy="61" rx="5" ry="2.5"
                fill={active ? '#e0f0f8' : '#c0b080'} stroke={INK} strokeWidth="0.5"/>
            </g>
          ))}
          <Plaque cx={x+67} cy={active ? 122 : 120} text={label} fs={9}
            fill={active ? '#7a5008' : INKM}/>
        </g>
      ))}

      {/* KESSEL (rechts, groß) */}
      <ellipse cx="400" cy="216" rx="58" ry="54" fill="#9a8828" stroke={INK} strokeWidth="2"/>
      <ellipse cx="400" cy="216" rx="48" ry="44" fill="#b0a030" stroke={GOLD} strokeWidth="1.5"/>
      <ellipse cx="400" cy="205" rx="33" ry="15" fill="#6098b8" stroke={BLUE} strokeWidth="1.2"/>
      <ellipse cx="400" cy="205" rx="25" ry="9" fill="#80b8d8" opacity="0.6"/>
      <path d="M 342 212 Q 328 212 328 200 Q 328 188 342 188" fill="none" stroke={INK} strokeWidth="3"/>
      <path d="M 458 188 Q 472 188 472 200 Q 472 212 458 212" fill="none" stroke={INK} strokeWidth="3"/>
      <Plaque cx={400} cy={242} text="Kessel" fs={9.5}/>

      {/* ZUTATENTISCH */}
      <rect x="28" y="150" width="200" height="76" fill="#b09028" stroke={INK} strokeWidth="1.5" rx="2"/>
      <rect x="34" y="156" width="188" height="64" fill="#bca030" rx="1"/>
      {[0,1,2].map(i => (
        <circle key={i} cx={60+i*64} cy="200" r="17"
          fill={['#b8c0a0','#98b0c0','#a8c098'][i]} stroke={INK} strokeWidth="1.2"/>
      ))}
      <Plaque cx={128} cy={170} text="Zutatentisch" fs={9.5}/>

      {/* REZEPT-NOTIZ */}
      <rect x="28" y="240" width="148" height="50" fill="#ddd0a0" stroke={INK} strokeWidth="1.2" rx="2"/>
      <rect x="33" y="245" width="138" height="40" fill="#e4d8a8" rx="1"/>
      <Lbl x="102" y="262" text="Rezept-Notiz" fs={9.5} bold fill={INK}/>
      <Lbl x="102" y="277" text="(vergilbt, kaum lesbar)" fs={7.5} fill={INKL}/>

      {/* TREPPE */}
      <StairRect x="238" y="240" w="76" h="50"/>
      <Plaque cx={276} cy={277} text="▲ Treppe" fs={9}/>

      <FooterEntrance y={316} totalH={360}/>
      {marker && <Marker x={210} y={216} label={marker.label}/>}
    </Frame>
  )
}

// ── Spiegelkammer ─────────────────────────────────────────────────────────────

const SPIEGEL_MIRRORS = [
  {id:'S1', x:30,  y:54,  w:100, h:72},
  {id:'S2', x:138, y:54,  w:100, h:72},
  {id:'S3', x:262, y:54,  w:100, h:72},
  {id:'S4', x:370, y:54,  w:100, h:72},
  {id:'S5', x:30,  y:140, w:80,  h:80},
  {id:'S6', x:30,  y:232, w:80,  h:56},
  {id:'S7', x:390, y:140, w:80,  h:80},
  {id:'S8', x:390, y:232, w:80,  h:56},
]

export function FloorSpiegel({ marker, svgStyle }) {
  return (
    <Frame p="fsp" title="Spiegelkammer" svgStyle={svgStyle}>
      {/* Boden mit Fliesenmuster */}
      <rect x="14" y="43" width="472" height="265" fill="#c8c0a0" stroke={INK} strokeWidth="1.5"/>
      <rect x="24" y="53" width="452" height="255" fill="#d4cca8"/>
      {Array.from({length: 8},  (_, i) => (
        <line key={`h${i}`} x1="24" y1={53+i*32} x2="476" y2={53+i*32}
          stroke="#beb898" strokeWidth="0.6" opacity="0.6"/>
      ))}
      {Array.from({length: 14}, (_, i) => (
        <line key={`v${i}`} x1={24+i*33} y1="53" x2={24+i*33} y2="308"
          stroke="#beb898" strokeWidth="0.6" opacity="0.6"/>
      ))}

      {/* 8 SPIEGEL – Label als Plakette IM Glas (keine Kollision) */}
      {SPIEGEL_MIRRORS.map(({ id, x, y, w, h }) => (
        <g key={id}>
          <rect x={x}   y={y}   width={w}    height={h}    fill="#8a7040" stroke={INK}  strokeWidth="2" rx="1"/>
          <rect x={x+5} y={y+5} width={w-10} height={h-10} fill="#9a8050" stroke={INKM} strokeWidth="0.8"/>
          <rect x={x+9} y={y+9} width={w-18} height={h-18} fill="#c8d0c0" stroke={INKM} strokeWidth="0.5" rx="1"/>
          <line x1={x+14} y1={y+15} x2={x+14+Math.min(20,w-28)} y2={y+15+Math.min(16,h-28)}
            stroke="white" strokeWidth="2.5" opacity="0.5"/>
          <Plaque cx={x+w/2} cy={y+h-13} text={id} fs={9.5} plate="#e8ecd8"/>
        </g>
      ))}

      {/* TRUHE */}
      <rect x="262" y="238" width="106" height="58" fill="#c8a860" stroke={INK} strokeWidth="1.8" rx="1"/>
      <rect x="262" y="238" width="106" height="22" fill="#b89848" stroke={INK} strokeWidth="1"/>
      <rect x="298" y="234" width="34"  height="12" fill="#9a8030" stroke={INK} strokeWidth="1.2" rx="1"/>
      <circle cx="315" cy="270" r="8" fill={GOLD} stroke={INK} strokeWidth="1.3"/>
      <circle cx="315" cy="270" r="4" fill="#e0a030"/>
      <Plaque cx={315} cy={283} text="Truhe" fs={9}/>

      {/* TREPPE */}
      <StairRect x="150" y="238" w="84" h="52"/>
      <Plaque cx={192} cy={283} text="▲ Treppe" fs={9}/>

      <FooterEntrance y={316} totalH={360}/>
      {marker && <Marker x={250} y={190} label={marker.label}/>}
    </Frame>
  )
}

// ── Archiv der Stimmen ────────────────────────────────────────────────────────

const ARCHIV_CRYSTALS = [
  { c:'#e4e0f4', stroke:'#8888aa', n:'Weiß'    },
  { c:'#7090e8', stroke:INK,       n:'Blau'    },
  { c:'#60c878', stroke:INK,       n:'Grün'    },
  { c:'#e8e050', stroke:INK,       n:'Gelb'    },
  { c:'#e89030', stroke:INK,       n:'Orange'  },
  { c:'#e84040', stroke:INK,       n:'Rot'     },
  { c:'#c060f8', stroke:INK,       n:'Violett' },
  { c:'#282820', stroke:INK,       n:'Schwarz' },
]

export function FloorArchiv({ marker, svgStyle }) {
  const CX = 250, CY = 186, R = 100, DH = 24, DW = 16

  return (
    <Frame p="fa" title="Archiv der Stimmen" svgStyle={svgStyle} h={380}>
      <rect x="14" y="43" width="472" height="293" fill="#c4b870" stroke={INK} strokeWidth="1.5"/>
      <rect x="24" y="53" width="452" height="283" fill="#d0c278"/>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={INKM} strokeWidth="1.2" strokeDasharray="8,5" opacity="0.5"/>

      {/* 8 KRISTALLE – Namen als Plaketten radial nach außen */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180
        const ux  = Math.cos(rad), uy = Math.sin(rad)
        const px  = CX + R * ux
        const py  = CY + R * uy
        const { c, stroke, n } = ARCHIV_CRYSTALS[i]
        const lx = px + ux * 40
        const ly = py + uy * 40 + 3
        return (
          <g key={i}>
            <rect x={px-13} y={py+DH} width="26" height="10" fill="#9a8830" stroke={INK} strokeWidth="1"/>
            <polygon
              points={`${px},${py-DH} ${px+DW},${py} ${px},${py+DH} ${px-DW},${py}`}
              fill={c} stroke={stroke} strokeWidth="1.8" opacity="0.97"/>
            <polygon
              points={`${px},${py-DH+7} ${px+DW-8},${py} ${px},${py-7} ${px-DW+10},${py-9}`}
              fill="white" opacity="0.25"/>
            <Plaque cx={lx} cy={ly} text={n} fs={8.5}/>
          </g>
        )
      })}

      {/* ZENTRUM-ALTAR */}
      <circle cx={CX} cy={CY} r="36" fill="#c4a840" stroke={INK} strokeWidth="2.5"/>
      <circle cx={CX} cy={CY} r="27" fill="#d4b848" stroke={INKM} strokeWidth="1.2"/>
      <circle cx={CX} cy={CY} r="13" fill={GOLD}    stroke={INK}  strokeWidth="1.5" opacity="0.9"/>
      <Lbl x={CX} y={CY+4} text="Altar" fs={10} bold fill={INK}/>

      {/* Sanctum-Hinweis */}
      <rect x="400" y="56" width="72" height="22" fill="#c8a860" stroke={INK} strokeWidth="1.2" rx="2"/>
      <Lbl x="436" y="71" text="↑ Sanctum" fs={9} bold fill={INK}/>

      {/* Treppe */}
      <StairRect x="30" y="290" w="68" h="38"/>
      <Plaque cx={64} cy={318} text="▲ Treppe" fs={8.5}/>

      <FooterEntrance y={340} totalH={380}/>
      {marker && <Marker x={CX} y={CY} label={marker.label}/>}
    </Frame>
  )
}

// ── Sanctum ───────────────────────────────────────────────────────────────────

export function FloorSanctum({ marker, svgStyle }) {
  const CX = 250, CY = 176, RX = 212, RY = 132, CR = 86

  return (
    <Frame p="fn" title="Das Sanctum" svgStyle={svgStyle} h={380}>
      {/* Dunkle Außenwand */}
      <rect x="14" y="43" width="472" height="293" fill={WALL} stroke={INK} strokeWidth="1.5"/>
      {/* Elliptischer Raum */}
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="#d0b860" stroke={INK} strokeWidth="3"/>
      <ellipse cx={CX} cy={CY} rx={RX-6} ry={RY-6} fill="#d8c470"
        stroke={INKM} strokeWidth="0.8" strokeDasharray="5,3"/>
      <ellipse cx={CX} cy={CY} rx={CR+24} ry={CR+16} fill="none"
        stroke={INKM} strokeWidth="0.8" opacity="0.5"/>

      {/* 8 KERZEN */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180
        const kx  = CX + CR * Math.cos(rad)
        const ky  = CY + CR * Math.sin(rad)
        return (
          <g key={i}>
            <circle cx={kx} cy={ky-14} r="10" fill="#ffcc00" opacity="0.12">
              <animate attributeName="opacity" values="0.12;0.28;0.12"
                dur={`${1.8 + i * 0.25}s`} repeatCount="indefinite"/>
            </circle>
            <rect x={kx-5} y={ky+6}  width="10" height="5"  fill="#7a5028" stroke={INK}  strokeWidth="0.8"/>
            <rect x={kx-4} y={ky-8}  width="8"  height="14" fill="#f0e8d0" stroke="#c8b880" strokeWidth="0.8"/>
            <line x1={kx} y1={ky-8} x2={kx} y2={ky-12} stroke="#333" strokeWidth="1"/>
            <ellipse cx={kx} cy={ky-18} rx="5" ry="8" fill="#ff9010" opacity="0.9"/>
            <ellipse cx={kx} cy={ky-21} rx="3" ry="5" fill="#ffee50" opacity="0.9"/>
          </g>
        )
      })}

      {/* ALTAR */}
      <ellipse cx={CX} cy={CY} rx="48" ry="34" fill="#c0a040" stroke={INK}  strokeWidth="2.5"/>
      <ellipse cx={CX} cy={CY} rx="36" ry="24" fill="#d0b050" stroke={INKM} strokeWidth="1.2"/>

      {/* AEGISSTEIN */}
      <circle cx={CX} cy={CY} r="17" fill="#2a5070" stroke={INK} strokeWidth="2.2">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={CX} cy={CY} r="12" fill="#3a6888"/>
      <circle cx={CX} cy={CY} r="7"  fill="#6090b8"/>
      <circle cx={CX} cy={CY} r="3.5" fill="#90c0e0"/>
      <circle cx={CX-3} cy={CY-3} r="2" fill="white" opacity="0.6"/>
      <Plaque cx={CX} cy={CY+44} text="Aegisstein" fs={9.5}/>

      {/* KRISTALLKUGEL */}
      <circle cx={CX+140} cy={CY-6} r="19" fill="#d0e8f8" stroke={BLUE} strokeWidth="1.8" opacity="0.95"/>
      <circle cx={CX+140} cy={CY-6} r="13" fill="#b0d0f0" opacity="0.65"/>
      <circle cx={CX+134} cy={CY-12} r="5" fill="white" opacity="0.45"/>
      <Plaque cx={CX+140} cy={CY+22} text="Kristallkugel" fs={8} fill={BLUE}/>

      {/* Eingang (unten in Ellipse) */}
      <path d={`M ${CX-32} ${CY+RY-4} L ${CX-32} ${CY+RY-26} Q ${CX} ${CY+RY-40} ${CX+32} ${CY+RY-26} L ${CX+32} ${CY+RY-4}`}
        fill="#b89030" stroke={INK} strokeWidth="2"/>
      <Lbl x={CX} y={CY+RY+18} text="▼ Eingang" fs={9} bold fill="#e8d070"/>

      {/* Treppe (oben links, auf dunkler Wand) */}
      <StairRect x="40" y="300" w="62" h="28"/>
      <Plaque cx={71} cy={322} text="▲ Treppe" fs={8.5}/>

      {marker && <Marker x={CX} y={CY} label={marker.label}/>}
    </Frame>
  )
}
