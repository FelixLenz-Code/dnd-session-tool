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

function FooterEntrance({ y = 322, totalH = 360 }) {
  return (
    <>
      <rect x="4" y={y} width="492" height={totalH - y - 4} fill={WALL}/>
      <path d={`M 218 ${y+16} L 218 ${y} Q 250 ${y-12} 282 ${y} L 282 ${y+16}`}
        fill="#c8a850" stroke={INK} strokeWidth="1.5"/>
      <text x="250" y={y+12} textAnchor="middle" fill="#e8c870" fontSize="9"
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
      <rect x="14" y="43" width="176" height="271" fill="#c0b8a8" stroke={INK} strokeWidth="1.5"/>
      <rect x="20" y="49" width="164" height="259" fill="#c8c0b0"/>

      {/* Gedicht-Tafel */}
      <rect x="30" y="62" width="148" height="148" fill="#d4c8a8" stroke={INK} strokeWidth="2" rx="2"/>
      <rect x="38" y="70" width="132" height="132" fill="#dcd0b4" stroke={INKM} strokeWidth="0.8"/>
      <Lbl x="104" y="88" text="Gedicht-Tafel" fs={10} bold fill={INK}/>
      {[106,120,134,148,162,176].map((lineY, i) => (
        <line key={i} x1={46} y1={lineY} x2={162} y2={lineY}
          stroke={INKM} strokeWidth="0.8" opacity="0.5"/>
      ))}
      <Lbl x="104" y="196" text="(In Stein gemeißelt)" fs={8} fill={INKL}/>

      {/* Treppe (links unten) */}
      <StairRect x="34" y="230" w="148" h="68"/>
      <Lbl x="108" y="312" text="▲ Treppe" fs={9.5} bold fill={INK}/>

      {/* Rechtes Panel: Gold */}
      <rect x="192" y="43" width="294" height="271" fill="#d4c070" stroke={INK} strokeWidth="1.5"/>
      <rect x="198" y="49" width="282" height="259" fill="#dcca7a"/>

      {/* Versiegelte Tür – Steinrahmen */}
      <rect x="292" y="60" width="106" height="196" fill="#5a4010" stroke={INK} strokeWidth="2.5" rx="1"/>
      {/* Holzoberfläche */}
      <rect x="300" y="68" width="90" height="182" fill="#c09030" stroke={INKM} strokeWidth="1.2"/>
      {/* Holzplanken */}
      {[92,112,132,152,172,192,212,232].map(lineY => (
        <line key={lineY} x1={302} y1={lineY} x2={388} y2={lineY}
          stroke="#8a6010" strokeWidth="0.8" opacity="0.7"/>
      ))}
      {/* Bogen */}
      <path d="M 300 88 Q 345 58 390 88" fill="#5a4010" stroke={INK} strokeWidth="2"/>
      <path d="M 306 92 Q 345 66 384 92" fill="#d09040" stroke={INKM} strokeWidth="1"/>
      {/* Schloss */}
      <rect x="326" y="136" width="44" height="28" fill="#9a8030" stroke={INK} strokeWidth="1.2" rx="2"/>
      <rect x="330" y="140" width="36" height="20" fill="#b09840" rx="1"/>
      {/* Knauf */}
      <circle cx="380" cy="155" r="7" fill={GOLD} stroke={INK} strokeWidth="1.3"/>
      <circle cx="380" cy="155" r="4" fill="#e0b030"/>
      {/* Eisenbeschläge */}
      {[[296,80],[296,150],[388,80],[388,150]].map(([bx,by],i) => (
        <rect key={i} x={bx} y={by} width="6" height="50" fill="#5a5040" stroke={INK} strokeWidth="0.7" rx="1"/>
      ))}
      <Lbl x="345" y="274" text="Versiegelte Pforte" fs={9} bold fill={INK}/>
      {interactive && !solved && (
        <Lbl x="345" y="286" text="Symbole in richtiger Reihenfolge wählen" fs={7} fill={INKM}/>
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
          <Lbl x={cx} y={cy+42} text={label} fs={9} fill={INKM}/>
        </g>
      ))}

      {/* Gelöst-Overlay */}
      {solved && (
        <>
          <rect x="300" y="68" width="90" height="182" fill="#d4f0a0" opacity="0.6"/>
          <Lbl x="345" y="165" text="OFFEN" fs={16} bold fill="#3a7a14"/>
        </>
      )}

      <FooterEntrance y={322} totalH={360}/>
      {marker && <Marker x={345} y={162} label={marker.label}/>}
    </Frame>
  )
}

// ── Bibliothek ────────────────────────────────────────────────────────────────

const BOOK_COLS = ['#8a3010','#2a4870','#2a5820','#5a2870','#b86010','#3a5060','#4a6030','#7a4020']

export function FloorBibliothek({ marker, svgStyle }) {
  return (
    <Frame p="fb" title="Bibliothek" svgStyle={svgStyle}>
      <rect x="14" y="43" width="472" height="271" fill="#d8c880" stroke={INK} strokeWidth="1.5"/>
      <rect x="24" y="53" width="452" height="261" fill="#e4d090"/>

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
      <rect x="24" y="89" width="32" height="193" fill="#8a5c20" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length: 10}, (_, i) => (
        <line key={i} x1="24" y1={91+i*19} x2="56" y2={91+i*19} stroke={INKM} strokeWidth="0.6"/>
      ))}

      {/* OSTWAND – Regal + Tagebuch */}
      <rect x="444" y="89" width="32" height="130" fill="#8a5c20" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length: 7}, (_, i) => (
        <line key={i} x1="444" y1={91+i*19} x2="476" y2={91+i*19} stroke={INKM} strokeWidth="0.6"/>
      ))}
      <rect x="444" y="222" width="32" height="60" fill={RED} stroke={INK} strokeWidth="1.8"/>
      <rect x="448" y="226" width="24" height="52" fill="#9a1818"/>
      <rect x="449" y="248" width="22" height="4" fill={GOLD} stroke={INK} strokeWidth="0.6"/>
      {/* Tagebuch-Label mit Pfeil */}
      <rect x="386" y="92" width="56" height="20" fill="#fff0e0" stroke={RED} strokeWidth="1" rx="2"/>
      <Lbl x="414" y="106" text="Tagebuch" fs={8.5} bold fill={RED}/>
      <line x1="440" y1="112" x2="458" y2="228" stroke={RED} strokeWidth="1" strokeDasharray="3,2"/>

      {/* LESETISCH */}
      <rect x="88" y="108" width="252" height="100" fill="#c09040" stroke={INK} strokeWidth="2" rx="2"/>
      <rect x="95" y="115" width="238" height="86"  fill="#ccaa48" stroke={INKM} strokeWidth="0.9" rx="1"/>
      <rect x="102" y="120" width="28" height="38" fill="#6a2010" stroke={INK} strokeWidth="0.7" rx="1"/>
      <rect x="106" y="124" width="20" height="30" fill="#7a2818" rx="1"/>
      <rect x="148" y="122" width="60" height="36" fill="#d8c870" stroke={INK} strokeWidth="0.8" rx="1"/>
      {/* Kerze */}
      <rect x="300" y="116" width="8" height="20" fill="#f0e8c0" stroke={INKM} strokeWidth="0.7"/>
      <ellipse cx="304" cy="113" rx="5" ry="3.5" fill="#f0c020" opacity="0.85"/>
      <ellipse cx="304" cy="111" rx="3" ry="5"   fill="#ff9010" opacity="0.7"/>
      <Lbl x="214" y="165" text="Lesetisch" fs={11} bold fill={INK}/>

      {/* TREPPE */}
      <StairRect x="36" y="236" w="80" h="60"/>
      <Lbl x="76" y="310" text="▲ Treppe" fs={9.5} bold fill={INK}/>

      {/* ALDRICS NOTIZEN (Schriftrolle) */}
      <rect x="332" y="234" width="106" height="76" fill="#e0cf9a" stroke={INK} strokeWidth="1.5" rx="4"/>
      <rect x="338" y="240" width="94"  height="64" fill="#e8d8a8" stroke={INKM} strokeWidth="0.7" rx="2"/>
      <ellipse cx="338" cy="272" rx="7" ry="32" fill="#d8c888" stroke={INKM} strokeWidth="0.7"/>
      <ellipse cx="438" cy="272" rx="7" ry="32" fill="#d8c888" stroke={INKM} strokeWidth="0.7"/>
      <Lbl x="388" y="260" text="Aldrics" fs={10} bold fill={INK}/>
      <Lbl x="388" y="274" text="Notizen" fs={9}  fill={INKM}/>
      <line x1="352" y1="286" x2="424" y2="286" stroke={INKM} strokeWidth="0.7" opacity="0.6"/>
      <line x1="352" y1="296" x2="410" y2="296" stroke={INKM} strokeWidth="0.7" opacity="0.6"/>

      <FooterEntrance y={322} totalH={360}/>
      {marker && <Marker x={214} y={152} label={marker.label}/>}
    </Frame>
  )
}

// ── Labor ─────────────────────────────────────────────────────────────────────

export function FloorLabor({ marker, svgStyle }) {
  return (
    <Frame p="fl" title="Labor" svgStyle={svgStyle}>
      <rect x="14" y="43" width="472" height="271" fill="#d0c076" stroke={INK} strokeWidth="1.5"/>
      <rect x="24" y="53" width="452" height="261" fill="#dac880"/>

      {/* 3 WERKBÄNKE oben */}
      {[
        { x:28,  label:'Tisch 1', active:false },
        { x:182, label:'Tisch 2', active:false },
        { x:336, label:'Tisch 3', active:true  },
      ].map(({ x, label, active }) => (
        <g key={label}>
          <rect x={x} y="57" width="134" height="52"
            fill={active ? '#c8b840' : '#a89030'}
            stroke={active ? GOLD : INK} strokeWidth={active ? 2.5 : 1.5} rx="1"/>
          {active && (
            <rect x={x} y="57" width="134" height="52"
              fill="none" stroke={GOLD} strokeWidth="2" opacity="0.5"/>
          )}
          {[0,1,2,3].map(i => (
            <g key={i}>
              <rect x={x+12+i*28} y="62" width="10" height="28" rx="1"
                fill={active ? ['#a0c8d8','#d07838','#60a060','#c8a030'][i] : '#b0a060'}
                stroke={INK} strokeWidth="0.7"/>
              <ellipse cx={x+17+i*28} cy="62" rx="5" ry="2.5"
                fill={active ? '#e0f0f8' : '#c0b080'} stroke={INK} strokeWidth="0.5"/>
            </g>
          ))}
          <Lbl x={x+67} y={active ? 126 : 122} text={label} fs={active ? 10.5 : 9.5}
            fill={active ? GOLD : INKM} bold={active}/>
          {active && <Lbl x={x+67} y="138" text="— aktiv —" fs={8.5} fill={GOLD}/>}
        </g>
      ))}

      {/* KESSEL (rechts, groß) */}
      <ellipse cx="400" cy="218" rx="60" ry="56" fill="#9a8828" stroke={INK} strokeWidth="2"/>
      <ellipse cx="400" cy="218" rx="50" ry="46" fill="#b0a030" stroke={GOLD} strokeWidth="1.5"/>
      <ellipse cx="400" cy="206" rx="34" ry="16" fill="#6098b8" stroke={BLUE} strokeWidth="1.2"/>
      <ellipse cx="400" cy="206" rx="26" ry="10" fill="#80b8d8" opacity="0.6"/>
      <path d="M 340 214 Q 326 214 326 202 Q 326 190 340 190" fill="none" stroke={INK} strokeWidth="3"/>
      <path d="M 460 190 Q 474 190 474 202 Q 474 214 460 214" fill="none" stroke={INK} strokeWidth="3"/>
      {[[-12,-10],[0,-14],[12,-10]].map(([dx,dy],i) => (
        <path key={i}
          d={`M ${400+dx} ${162+dy} Q ${400+dx-5} ${152+dy} ${400+dx+4} ${142+dy}`}
          fill="none" stroke="#aaa" strokeWidth="1.5" opacity="0.5" strokeDasharray="3,2"/>
      ))}
      <Lbl x="400" y="226" text="Kessel" fs={10.5} bold fill={INK}/>

      {/* ZUTATENTISCH */}
      <rect x="28" y="152" width="200" height="82" fill="#b09028" stroke={INK} strokeWidth="1.5" rx="2"/>
      <rect x="34" y="158" width="188" height="70" fill="#bca030" rx="1"/>
      <Lbl x="128" y="178" text="Zutatentisch" fs={10} bold fill={INK}/>
      {[0,1,2].map(i => (
        <circle key={i} cx={60+i*64} cy="208" r="18"
          fill={['#b8c0a0','#98b0c0','#a8c098'][i]} stroke={INK} strokeWidth="1.2"/>
      ))}

      {/* REZEPT-NOTIZ */}
      <rect x="28" y="250" width="150" height="52" fill="#ddd0a0" stroke={INK} strokeWidth="1.2" rx="2"/>
      <rect x="33" y="255" width="140" height="42" fill="#e4d8a8" rx="1"/>
      <Lbl x="103" y="272" text="Rezept-Notiz" fs={9.5} bold fill={INK}/>
      <Lbl x="103" y="288" text="(vergilbt, kaum lesbar)" fs={8} fill={INKL}/>

      {/* TREPPE */}
      <StairRect x="196" y="250" w="80" h="52"/>
      <Lbl x="236" y="316" text="▲ Treppe" fs={9.5} bold fill={INK}/>

      <FooterEntrance y={322} totalH={360}/>
      {marker && <Marker x={210} y={218} label={marker.label}/>}
    </Frame>
  )
}

// ── Spiegelkammer ─────────────────────────────────────────────────────────────

const SPIEGEL_MIRRORS = [
  {id:'S1', x:30,  y:56,  w:100, h:72},
  {id:'S2', x:138, y:56,  w:100, h:72},
  {id:'S3', x:262, y:56,  w:100, h:72},
  {id:'S4', x:370, y:56,  w:100, h:72},
  {id:'S5', x:30,  y:140, w:80,  h:86},
  {id:'S6', x:30,  y:234, w:80,  h:60},
  {id:'S7', x:390, y:140, w:80,  h:86},
  {id:'S8', x:390, y:234, w:80,  h:60},
]

export function FloorSpiegel({ marker, svgStyle }) {
  return (
    <Frame p="fsp" title="Spiegelkammer" svgStyle={svgStyle}>
      {/* Boden mit Fliesenmuster */}
      <rect x="14" y="43" width="472" height="271" fill="#c8c0a0" stroke={INK} strokeWidth="1.5"/>
      <rect x="24" y="53" width="452" height="261" fill="#d4cca8"/>
      {Array.from({length: 8},  (_, i) => (
        <line key={`h${i}`} x1="24" y1={53+i*33} x2="476" y2={53+i*33}
          stroke="#beb898" strokeWidth="0.6" opacity="0.7"/>
      ))}
      {Array.from({length: 14}, (_, i) => (
        <line key={`v${i}`} x1={24+i*33} y1="53" x2={24+i*33} y2="314"
          stroke="#beb898" strokeWidth="0.6" opacity="0.7"/>
      ))}

      {/* 8 SPIEGEL */}
      {SPIEGEL_MIRRORS.map(({ id, x, y, w, h }) => (
        <g key={id}>
          <rect x={x}   y={y}   width={w}    height={h}    fill="#8a7040" stroke={INK}  strokeWidth="2" rx="1"/>
          <rect x={x+5} y={y+5} width={w-10} height={h-10} fill="#9a8050" stroke={INKM} strokeWidth="0.8"/>
          <rect x={x+9} y={y+9} width={w-18} height={h-18} fill="#c8d0c0" stroke={INKM} strokeWidth="0.5" rx="1"/>
          <line x1={x+13} y1={y+13} x2={x+13+Math.min(22,w-24)} y2={y+13+Math.min(18,h-24)}
            stroke="white" strokeWidth="2.5" opacity="0.55"/>
          <line x1={x+13} y1={y+23} x2={x+13+Math.min(14,w-24)} y2={y+23+Math.min(10,h-36)}
            stroke="white" strokeWidth="1.5" opacity="0.3"/>
          <Lbl x={x+w/2} y={y+h+15} text={id} fs={9.5} fill={INKM} bold/>
        </g>
      ))}

      {/* TRUHE */}
      <rect x="258" y="240" width="110" height="62" fill="#c8a860" stroke={INK} strokeWidth="1.8" rx="1"/>
      <rect x="258" y="240" width="110" height="24" fill="#b89848" stroke={INK} strokeWidth="1"/>
      <rect x="296" y="236" width="34"  height="12" fill="#9a8030" stroke={INK} strokeWidth="1.2" rx="1"/>
      <circle cx="313" cy="272" r="8" fill={GOLD} stroke={INK} strokeWidth="1.3"/>
      <circle cx="313" cy="272" r="4" fill="#e0a030"/>
      <Lbl x="313" y="316" text="Truhe" fs={9.5} bold fill={INK}/>

      {/* TREPPE */}
      <StairRect x="140" y="240" w="84" h="58"/>
      <Lbl x="182" y="314" text="▲ Treppe" fs={9.5} bold fill={INK}/>

      <FooterEntrance y={322} totalH={360}/>
      {marker && <Marker x={250} y={194} label={marker.label}/>}
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
  const CX = 250, CY = 190, R = 112, DH = 28, DW = 18

  return (
    <Frame p="fa" title="Archiv der Stimmen" svgStyle={svgStyle} h={380}>
      <rect x="14" y="43" width="472" height="299" fill="#c4b870" stroke={INK} strokeWidth="1.5"/>
      <rect x="24" y="53" width="452" height="289" fill="#d0c278"/>
      <circle cx={CX} cy={CY} r={R}    fill="none" stroke={INKM} strokeWidth="1.2" strokeDasharray="8,5" opacity="0.5"/>
      <circle cx={CX} cy={CY} r={R+22} fill="none" stroke={INKM} strokeWidth="0.5" opacity="0.3"/>

      {/* 8 KRISTALLE */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180
        const px  = CX + R * Math.cos(rad)
        const py  = CY + R * Math.sin(rad)
        const { c, stroke, n } = ARCHIV_CRYSTALS[i]
        const lx = px + (px < CX - 20 ? -38 : px > CX + 20 ? 38 : 0)
        const ly = py + (py < CY - 20 ? -14 : py > CY + 20 ? 16 : 4)
        const la = px < CX - 20 ? 'end' : px > CX + 20 ? 'start' : 'middle'
        return (
          <g key={i}>
            <rect x={px-14} y={py+DH} width="28" height="11" fill="#9a8830" stroke={INK} strokeWidth="1"/>
            <polygon
              points={`${px},${py-DH} ${px+DW},${py} ${px},${py+DH} ${px-DW},${py}`}
              fill={c} stroke={stroke} strokeWidth="1.8" opacity="0.97"/>
            <polygon
              points={`${px},${py-DH+8} ${px+DW-9},${py} ${px},${py-8} ${px-DW+11},${py-10}`}
              fill="white" opacity="0.25"/>
            <text x={lx} y={ly} textAnchor={la} fill={INK} fontSize="8.5"
              fontFamily="Georgia,serif" fontWeight="bold">{n}</text>
          </g>
        )
      })}

      {/* ZENTRUM-ALTAR */}
      <circle cx={CX} cy={CY} r="40" fill="#c4a840" stroke={INK} strokeWidth="2.5"/>
      <circle cx={CX} cy={CY} r="30" fill="#d4b848" stroke={INKM} strokeWidth="1.2"/>
      <circle cx={CX} cy={CY} r="14" fill={GOLD}    stroke={INK}  strokeWidth="1.5" opacity="0.9"/>
      <Lbl x={CX} y={CY+5} text="Altar" fs={11} bold fill={INK}/>

      {/* Sanctum-Hinweis */}
      <rect x="400" y="55" width="70" height="22" fill="#c8a860" stroke={INK} strokeWidth="1.2" rx="1"/>
      <Lbl x="435" y="70" text="↑ Sanctum" fs={9} bold fill={INK}/>

      {/* Treppe */}
      <StairRect x="30" y="278" w="70" h="42"/>
      <Lbl x="65" y="334" text="▲ Treppe" fs={9} bold fill={INK}/>

      <FooterEntrance y={342} totalH={380}/>
      {marker && <Marker x={CX} y={CY} label={marker.label}/>}
    </Frame>
  )
}

// ── Sanctum ───────────────────────────────────────────────────────────────────

export function FloorSanctum({ marker, svgStyle }) {
  const CX = 250, CY = 180, RX = 210, RY = 140, CR = 90

  return (
    <Frame p="fn" title="Das Sanctum" svgStyle={svgStyle} h={380}>
      {/* Dunkle Außenwand */}
      <rect x="14" y="43" width="472" height="299" fill={WALL} stroke={INK} strokeWidth="1.5"/>
      {/* Elliptischer Raum */}
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="#d0b860" stroke={INK} strokeWidth="3"/>
      <ellipse cx={CX} cy={CY} rx={RX-6} ry={RY-6} fill="#d8c470"
        stroke={INKM} strokeWidth="0.8" strokeDasharray="5,3"/>
      <ellipse cx={CX} cy={CY} rx={CR+26} ry={CR+18} fill="none"
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
      <ellipse cx={CX} cy={CY} rx="50" ry="36" fill="#c0a040" stroke={INK}  strokeWidth="2.5"/>
      <ellipse cx={CX} cy={CY} rx="38" ry="26" fill="#d0b050" stroke={INKM} strokeWidth="1.2"/>

      {/* AEGISSTEIN */}
      <circle cx={CX} cy={CY} r="18" fill="#2a5070" stroke={INK} strokeWidth="2.2">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={CX} cy={CY} r="13" fill="#3a6888"/>
      <circle cx={CX} cy={CY} r="8"  fill="#6090b8"/>
      <circle cx={CX} cy={CY} r="4"  fill="#90c0e0"/>
      <circle cx={CX-3} cy={CY-3} r="2" fill="white" opacity="0.6"/>
      <Lbl x={CX} y={CY+36} text="Aegisstein" fs={10.5} bold fill={INK}/>

      {/* KRISTALLKUGEL */}
      <circle cx={CX+138} cy={CY}   r="20" fill="#d0e8f8" stroke={BLUE} strokeWidth="1.8" opacity="0.95"/>
      <circle cx={CX+138} cy={CY}   r="14" fill="#b0d0f0" opacity="0.65"/>
      <circle cx={CX+132} cy={CY-6} r="6"  fill="white"  opacity="0.45"/>
      <Lbl x={CX+138} y={CY+30} text="Kristall-" fs={8.5} fill={BLUE}/>
      <Lbl x={CX+138} y={CY+42} text="kugel"     fs={8.5} fill={BLUE}/>

      {/* Eingang (unten in Ellipse) */}
      <path d={`M ${CX-34} ${CY+RY-4} L ${CX-34} ${CY+RY-28} Q ${CX} ${CY+RY-44} ${CX+34} ${CY+RY-28} L ${CX+34} ${CY+RY-4}`}
        fill="#b89030" stroke={INK} strokeWidth="2"/>
      <Lbl x={CX} y={CY+RY+16} text="▼ Eingang" fs={9} bold fill="#e8d070"/>

      {/* Treppe (oben links, außerhalb der Ellipse, auf dunkler Wand) */}
      <StairRect x="38" y="60" w="66" h="50"/>
      <Lbl x="71" y="126" text="▲ Treppe" fs={9} bold fill="#e8d070"/>

      {marker && <Marker x={CX} y={CY} label={marker.label}/>}
    </Frame>
  )
}
