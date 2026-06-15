// Etagen-Grundrisse — Pergament-Stil, spoilerfrei, interaktiv

import { useGame } from '../context/GameContext'

const INK  = '#1a0e06'
const INKM = '#5a3820'
const INKL = '#8a6040'
const GOLD = '#b87a0a'
const RED  = '#8b1a14'
const BLUE = '#3a6080'
const WALL = '#2a1c0e'

// ── Gemeinsame Teile ─────────────────────────────────────────────────────────

function Defs({ p }) {
  return (
    <defs>
      <radialGradient id={`${p}bg`} cx="50%" cy="45%" r="72%">
        <stop offset="0%"   stopColor="#fdf5e0"/>
        <stop offset="55%"  stopColor="#f0e0b8"/>
        <stop offset="100%" stopColor="#c8a870"/>
      </radialGradient>
      <filter id={`${p}glow`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  )
}

function Frame({ p, title, children, svgStyle }) {
  return (
    <svg viewBox="0 0 420 330" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={svgStyle ?? { display: 'block', width: '100%' }}>
      <Defs p={p}/>
      <rect width="420" height="330" fill={WALL}/>
      <rect x="10" y="10" width="400" height="310" fill={`url(#${p}bg)`}/>
      <rect x="10" y="10" width="400" height="310" fill="none" stroke={INK}  strokeWidth="2.5"/>
      <rect x="15" y="15" width="390" height="300" fill="none" stroke={INKM} strokeWidth="0.8"/>
      {[[16,16],[404,16],[16,314],[404,314]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="none" stroke={INK} strokeWidth="1.2"/>
          <circle cx={cx} cy={cy} r="2" fill={INK}/>
        </g>
      ))}
      <line x1="28" y1="42" x2="392" y2="42" stroke={INK} strokeWidth="1"/>
      <text x="210" y="35" textAnchor="middle" fill={INK} fontSize="12"
        fontFamily="Georgia,serif" letterSpacing="2" fontWeight="bold">
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
  const w = Math.max(label.length * 5.8 + 10, 34)
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

function StairsIcon({ x, y, w = 62, h = 44 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#e0cfa0" stroke={INK} strokeWidth="1.5" rx="1"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={x+i*(w/5)} y={y+i*(h/5)}
          width={w-i*(w/5)} height={h/5}
          fill="none" stroke={INKM} strokeWidth="0.7"/>
      ))}
      <Lbl x={x+w/2} y={y+h/2+4} text="Treppe" fs={8} fill={INK} bold/>
    </g>
  )
}

// ── Keller – interaktiv ───────────────────────────────────────────────────────

const SEASONS = [
  { id: 'winter',    sym: '❄', label: 'Winter',   cx: 302, cy: 112 },
  { id: 'fruehling', sym: '🌸', label: 'Frühling', cx: 356, cy: 152 },
  { id: 'sommer',    sym: '☀', label: 'Sommer',   cx: 302, cy: 192 },
  { id: 'herbst',    sym: '🍂', label: 'Herbst',   cx: 248, cy: 152 },
]

export function FloorKeller({ marker, interactive = false, puzzleState, puzzleWrong, svgStyle }) {
  const { actions } = useGame()
  const progress = puzzleState?.progress ?? []
  const solved   = puzzleState?.solved   ?? false

  function getSeasonFill(id) {
    if (solved)               return '#b8f0a0'
    if (puzzleWrong)          return '#f08080'
    if (progress.includes(id)) return '#c8e890'
    return '#e8d4a0'
  }

  function handleClick(id) {
    if (!interactive || solved) return
    actions.interactMap('floor-keller', id)
  }

  return (
    <Frame p="fk" title="Keller – Die Pforte" svgStyle={svgStyle}>
      {/* Bodenplan */}
      <rect x="28" y="48" width="364" height="258" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {/* Gedicht-Tafel (links) */}
      <rect x="40" y="62" width="148" height="130" fill="#d8c890" stroke={INK} strokeWidth="2" rx="2"/>
      <rect x="48" y="70" width="132" height="114" fill="none" stroke={INKM} strokeWidth="0.8"/>
      <Lbl x="114" y="84" text="Gedicht-Tafel" fs={10} bold fill={INK}/>
      {/* Dekorative Linien als Platzhalter für Inschrift */}
      {[100,113,126,139,152,165].map((y,i) => (
        <line key={i} x1={56} y1={y} x2={172} y2={y} stroke={INKM} strokeWidth="0.8" opacity="0.5"/>
      ))}
      <Lbl x="114" y="183" text="(In Stein gemeißelt)" fs={8} fill={INKL}/>

      {/* Versiegelte Tür (rechts) */}
      <rect x="230" y="62" width="150" height="166" fill="#c8b888" stroke={INK} strokeWidth="2" rx="2"/>
      <rect x="240" y="72" width="130" height="146" fill="#d0c090" stroke={INKM} strokeWidth="1"/>
      <Lbl x="305" y="88" text="Versiegelte Pforte" fs={9} bold fill={INK}/>

      {/* Jahreszeiten-Symbole — klickbar */}
      {SEASONS.map(({ id, sym, label, cx, cy }) => (
        <g key={id}
          onClick={() => handleClick(id)}
          style={{ cursor: interactive && !solved ? 'pointer' : 'default' }}>
          <circle cx={cx} cy={cy} r="22"
            fill={getSeasonFill(id)}
            stroke={progress.includes(id) ? '#6a9a40' : puzzleWrong ? RED : INK}
            strokeWidth={progress.includes(id) || puzzleWrong ? 2.5 : 1.5}/>
          {progress.includes(id) && !puzzleWrong && (
            <circle cx={cx} cy={cy} r="22" fill="none" stroke="#6a9a40" strokeWidth="2.5" opacity="0.4" filter={`url(#fkglow)`}/>
          )}
          <text x={cx} y={cy+6} textAnchor="middle" fontSize="18">{sym}</text>
          <Lbl x={cx} y={cy+36} text={label} fs={8} fill={INKM}/>
        </g>
      ))}

      {/* Türknauf */}
      <circle cx="305" cy="152" r="8" fill={GOLD} stroke={INK} strokeWidth="1.5"/>

      {/* Gelöst-Overlay */}
      {solved && (
        <g>
          <rect x="240" y="72" width="130" height="146" fill="#d4f0a0" opacity="0.5"/>
          <Lbl x="305" y="148" text="OFFEN" fs={14} bold fill="#3a7a14"/>
        </g>
      )}

      {/* Hinweis für Spieler */}
      {interactive && !solved && (
        <Lbl x="305" y="246" text="Symbole in richtiger Reihenfolge drücken"
          fs={8} fill={INKM}/>
      )}

      {/* Treppe */}
      <StairsIcon x="242" y="232" w="68" h="42"/>

      {/* Eingang */}
      <path d="M 148 306 L 148 284 Q 178 270 208 284 L 208 306"
        fill="#c8b480" stroke={INK} strokeWidth="2"/>
      <Lbl x="178" y="297" text="Eingang" fs={8}/>

      {marker && <Marker x={114} y={152} label={marker.label}/>}
    </Frame>
  )
}

// ── Bibliothek ────────────────────────────────────────────────────────────────

export function FloorBibliothek({ marker, svgStyle }) {
  return (
    <Frame p="fb" title="Etage 1 – Bibliothek" svgStyle={svgStyle}>
      <rect x="28" y="48" width="364" height="258" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {/* Nordwand-Regal (vollständig) */}
      <rect x="28" y="48" width="364" height="30" fill="#c0a860" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length:22}, (_,i) => (
        <line key={i} x1={28+i*16.5} y1={48} x2={28+i*16.5} y2={78}
          stroke={INKM} strokeWidth="0.6"/>
      ))}
      {/* Bücherbuchrücken */}
      {[0,2,5,8,10,13,16,18].map(i => (
        <rect key={i} x={32+i*16.5} y={50} width={14} height={26}
          fill={['#8a4020','#2a5080','#3a6020','#6a3080','#c89040','#506080','#4a7040','#8a5030'][i % 8]}
          stroke={INKM} strokeWidth="0.5"/>
      ))}

      {/* Lücke im Regal – hervorgehoben */}
      <rect x="210" y="48" width="32" height="30" fill="#f0d870" stroke={GOLD} strokeWidth="2.5"/>
      <Lbl x="226" y="67" text="LÜCKE" fs={8} fill={GOLD} bold/>

      {/* Westwand-Regal */}
      <rect x="28" y="78" width="28" height="164" fill="#c0a860" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length:9}, (_,i) => (
        <line key={i} x1={28} y1={78+i*18.2} x2={56} y2={78+i*18.2}
          stroke={INKM} strokeWidth="0.6"/>
      ))}

      {/* Ostwand-Regal (oben) */}
      <rect x="364" y="78" width="28" height="116" fill="#c0a860" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length:6}, (_,i) => (
        <line key={i} x1={364} y1={78+i*19.3} x2={392} y2={78+i*19.3}
          stroke={INKM} strokeWidth="0.6"/>
      ))}

      {/* Rotes Tagebuch (unten Ostwand) */}
      <rect x="364" y="198" width="28" height="44" fill={RED} stroke={INK} strokeWidth="1.5"/>
      <Lbl x="378" y="216" text="Tage-" fs={7} fill="#fff8ee"/>
      <Lbl x="378" y="228" text="buch"  fs={7} fill="#fff8ee"/>

      {/* Lesetisch */}
      <rect x="96" y="102" width="214" height="90" fill="#d4b878" stroke={INK} strokeWidth="2" rx="2"/>
      <rect x="106" y="110" width="194" height="74" fill="#dcc890" stroke={INKM} strokeWidth="0.8" rx="1"/>
      <Lbl x="203" y="150" text="Lesetisch" fs={10} bold fill={INK}/>

      {/* Treppe */}
      <StairsIcon x="62" y="222" w="66" h="46"/>

      {/* Notizen-Rolle */}
      <rect x="290" y="222" width="80" height="46" fill="#e0cfa0" stroke={INK} strokeWidth="1.5" rx="4"/>
      <Lbl x="330" y="242" text="Aldrics"  fs={9} fill={INK}/>
      <Lbl x="330" y="256" text="Notizen" fs={8} fill={INKL}/>

      {marker && <Marker x={203} y={150} label={marker.label}/>}
    </Frame>
  )
}

// ── Labor ─────────────────────────────────────────────────────────────────────

export function FloorLabor({ marker, svgStyle }) {
  return (
    <Frame p="fl" title="Etage 2 – Labor" svgStyle={svgStyle}>
      <rect x="28" y="48" width="364" height="258" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {/* 3 Werkbänke oben */}
      {[
        { x:36,  label:'Tisch 1', active:false },
        { x:154, label:'Tisch 2', active:false },
        { x:272, label:'Tisch 3', active:true  },
      ].map(({ x, label, active }) => (
        <g key={x}>
          <rect x={x} y={58} width={100} height={44}
            fill={active ? '#d4c860' : '#c8b880'}
            stroke={active ? GOLD : INK}
            strokeWidth={active ? 2 : 1.5} rx="1"/>
          {/* Reagenzgläser */}
          {[0,1,2].map(i => (
            <g key={i}>
              <rect x={x+14+i*26} y={62} width={10} height={24}
                fill={active
                  ? ['#a0c8d8','#c87040','#60a060'][i]
                  : '#b0a078'}
                stroke={INK} strokeWidth="0.8" rx="1"/>
              <ellipse cx={x+19+i*26} cy={62} rx={5} ry={2.5}
                fill="none" stroke={INK} strokeWidth="0.7"/>
            </g>
          ))}
          <Lbl x={x+50} y={108} text={label} fs={9} fill={active ? GOLD : INKM} bold={active}/>
          {active && <Lbl x={x+50} y={120} text="(aktiv)" fs={8} fill={GOLD}/>}
        </g>
      ))}

      {/* Kessel (rechts, unter Tisch 3) */}
      <ellipse cx="322" cy="168" rx="46" ry="44" fill="#c8b880" stroke={INK} strokeWidth="2"/>
      <ellipse cx="322" cy="168" rx="36" ry="34" fill="#d4c060" stroke={GOLD} strokeWidth="1.5"/>
      <ellipse cx="322" cy="159" rx="24" ry="12" fill="#7ab0c8" stroke={BLUE} strokeWidth="1"/>
      <Lbl x="322" y="172" text="Kessel" fs={9} bold fill={INK}/>
      {/* Dampf */}
      {[[-8,-14],[0,-18],[8,-14]].map(([dx,dy],i) => (
        <path key={i}
          d={`M ${322+dx} ${168+dy} Q ${322+dx-5} ${168+dy-14} ${322+dx+3} ${168+dy-26}`}
          fill="none" stroke="#999" strokeWidth="1.2" opacity="0.5" strokeDasharray="3,2"/>
      ))}

      {/* Zutatentisch (Mitte links) */}
      <rect x="36" y="148" width="178" height="68" fill="#d4b878" stroke={INK} strokeWidth="1.5" rx="2"/>
      <Lbl x="125" y="172" text="Zutatentisch" fs={9} bold fill={INK}/>
      {/* 3 Zutaten-Slots – generisch, kein Spoiler */}
      {[0,1,2].map(i => (
        <circle key={i} cx={68+i*52} cy={196} r="14"
          fill={['#c0c0a0','#a0b0c0','#b0c0a0'][i]}
          stroke={INK} strokeWidth="1"/>
      ))}
      <Lbl x="125" y="213" text="3 Zutatenstellen" fs={8} fill={INKM}/>

      {/* Notiz-Zettel */}
      <rect x="36" y="232" width="130" height="42" fill="#e0cfa0" stroke={INK} strokeWidth="1.2" rx="2"/>
      <Lbl x="46" y="248" text="Rezept-Notiz" fs={9} bold fill={INK} anchor="start"/>
      <Lbl x="46" y="263" text="(vergilbt, kaum lesbar)" fs={8} fill={INKL} anchor="start"/>

      {/* Treppe */}
      <StairsIcon x="310" y="236" w="64" h="44"/>

      {marker && <Marker x={210} y={168} label={marker.label}/>}
    </Frame>
  )
}

// ── Spiegelkammer ─────────────────────────────────────────────────────────────

export function FloorSpiegel({ marker, svgStyle }) {
  const MIRRORS = [
    { id:'S1', x:36,  y:52,  w:80, h:64 },
    { id:'S2', x:122, y:52,  w:80, h:64 },
    { id:'S3', x:208, y:52,  w:80, h:64 },
    { id:'S4', x:294, y:52,  w:80, h:64 },
    { id:'S5', x:36,  y:126, w:80, h:64 },
    { id:'S6', x:122, y:126, w:80, h:64 },
    { id:'S7', x:208, y:126, w:80, h:64 },
    { id:'S8', x:294, y:126, w:80, h:64 },
  ]

  return (
    <Frame p="fsp" title="Etage 3 – Spiegelkammer" svgStyle={svgStyle}>
      <rect x="28" y="48" width="364" height="258" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {MIRRORS.map(({ id, x, y, w, h }) => (
        <g key={id}>
          <rect x={x} y={y} width={w} height={h}
            fill="#d4d0b0" stroke={INK} strokeWidth="1.5" rx="1"/>
          <rect x={x+5} y={y+5} width={w-10} height={h-10}
            fill="#c8ceb8" stroke={INKM} strokeWidth="0.8"/>
          {/* Spiegelglanz */}
          <line x1={x+8} y1={y+8} x2={x+8+Math.min(18,w-16)} y2={y+8+Math.min(14,h-16)}
            stroke="white" strokeWidth="2" opacity="0.4"/>
          <Lbl x={x+w/2} y={y+h/2+4} text={id} fs={9} fill={INKM} bold/>
        </g>
      ))}

      {/* Truhe */}
      <rect x="286" y="208" width="88" height="50" fill="#c8a860" stroke={INK} strokeWidth="1.5" rx="1"/>
      <rect x="286" y="208" width="88" height="20" fill="#b89848" stroke={INK} strokeWidth="1"/>
      <circle cx="330" cy="234" r="6" fill={GOLD} stroke={INK} strokeWidth="1.2"/>
      <Lbl x="330" y="248" text="Truhe" fs={9} bold fill={INK}/>

      {/* Treppe */}
      <StairsIcon x="36" y="210" w="68" h="46"/>

      {marker && <Marker x={193} y={172} label={marker.label}/>}
    </Frame>
  )
}

// ── Archiv der Stimmen ────────────────────────────────────────────────────────

export function FloorArchiv({ marker, svgStyle }) {
  const CX = 210, CY = 178, R = 90
  const DH = 22, DW = 16
  const CRYSTALS = [
    '#e8e4f4', '#88aaee', '#70cc90', '#eee060',
    '#ee9944', '#ee5555', '#cc77ff', '#b0b0b0',
  ]
  const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

  return (
    <Frame p="fa" title="Etage 4 – Archiv der Stimmen" svgStyle={svgStyle}>
      <rect x="28" y="48" width="364" height="258" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {/* Führungskreis */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={INKM}
        strokeWidth="1" strokeDasharray="6,4" opacity="0.4"/>

      {/* 8 Kristall-Sockel */}
      {ANGLES.map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180
        const px  = CX + R * Math.cos(rad)
        const py  = CY + R * Math.sin(rad)
        return (
          <g key={i}>
            {/* Sockel */}
            <rect x={px - 12} y={py + DH - 2} width={24} height={9}
              fill="#c0a870" stroke={INK} strokeWidth="1"/>
            {/* Kristall-Diamant */}
            <polygon
              points={`${px},${py - DH} ${px + DW},${py} ${px},${py + DH} ${px - DW},${py}`}
              fill={CRYSTALS[i]} stroke={INK} strokeWidth="1.5" opacity="0.92"/>
            {/* Glanzpunkt */}
            <polygon
              points={`${px},${py - DH + 7} ${px + DW - 7},${py} ${px},${py - 6} ${px - DW + 9},${py - 9}`}
              fill="white" opacity="0.28"/>
          </g>
        )
      })}

      {/* Zentrum-Altar */}
      <circle cx={CX} cy={CY} r="34" fill="#d4b878" stroke={INK} strokeWidth="2"/>
      <circle cx={CX} cy={CY} r="25" fill="#dcc890" stroke={INKM} strokeWidth="1"/>
      <circle cx={CX} cy={CY} r="11" fill={GOLD} stroke={INK} strokeWidth="1.2" opacity="0.85"/>
      <Lbl x={CX} y={CY + 4} text="Altar" fs={10} bold fill={INK}/>

      {/* Sanctum-Hinweis oben rechts */}
      <rect x="322" y="50" width="62" height="19" fill="#c8a860" stroke={INK} strokeWidth="1.2" rx="1"/>
      <Lbl x="353" y="63" text="↑ Sanctum" fs={8} bold fill={INK}/>

      {/* Treppe unten links */}
      <StairsIcon x="34" y="266" w="60" h="26"/>

      {marker && <Marker x={CX} y={CY} label={marker.label}/>}
    </Frame>
  )
}

// ── Sanctum ───────────────────────────────────────────────────────────────────

export function FloorSanctum({ marker, svgStyle }) {
  const CX = 210, CY = 160, RX = 168, RY = 116, CR = 72

  return (
    <Frame p="fn" title="Etage 5 – Sanctum" svgStyle={svgStyle}>
      <rect x="28" y="48" width="364" height="258" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {/* Elliptischer Raum */}
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="#ddd0a0" stroke={INK} strokeWidth="2.5"/>
      <ellipse cx={CX} cy={CY} rx={RX-6} ry={RY-6} fill="none"
        stroke={INKM} strokeWidth="0.8" strokeDasharray="4,3"/>

      {/* 8 Kerzen */}
      {[0,45,90,135,180,225,270,315].map((angle,i) => {
        const rad = (angle-90)*Math.PI/180
        const kx  = CX + CR*Math.cos(rad)
        const ky  = CY + CR*Math.sin(rad)
        return (
          <g key={i}>
            {/* Leuchtschein */}
            <circle cx={kx} cy={ky-14} r="9" fill="#ffcc00" opacity="0.12">
              <animate attributeName="opacity" values="0.12;0.28;0.12"
                dur={`${1.8+i*0.3}s`} repeatCount="indefinite"/>
            </circle>
            {/* Flamme */}
            <ellipse cx={kx} cy={ky-15} rx={3.5} ry={5.5} fill="#ff9910" opacity="0.9"/>
            <ellipse cx={kx} cy={ky-17} rx={2}   ry={3.5} fill="#ffee60" opacity="0.9"/>
            {/* Docht */}
            <line x1={kx} y1={ky-9} x2={kx} y2={ky-11} stroke="#333" strokeWidth="0.9"/>
            {/* Kerzenkörper */}
            <rect x={kx-3} y={ky-8} width={6} height={14}
              fill="#f0ead0" stroke="#c8b880" strokeWidth="0.8"/>
            {/* Kerzenhalter */}
            <rect x={kx-5} y={ky+6} width={10} height={4}
              fill="#806040" stroke={INK} strokeWidth="0.8"/>
          </g>
        )
      })}

      {/* Altar */}
      <ellipse cx={CX} cy={CY} rx={36} ry={28} fill="#c8b070" stroke={INK} strokeWidth="2"/>
      <ellipse cx={CX} cy={CY} rx={26} ry={20} fill="#dcc880" stroke={INKM} strokeWidth="1"/>

      {/* Aegisstein */}
      <circle cx={CX} cy={CY} r="14" fill="#3a6080" stroke={INK} strokeWidth="1.8">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={CX} cy={CY} r="9"  fill="#6090b0" opacity="0.7"/>
      <circle cx={CX} cy={CY} r="5"  fill="#b0d0f0" opacity="0.9"/>
      <Lbl x={CX} y={CY+32} text="Aegisstein" fs={9} bold fill={INK}/>

      {/* Kristallkugel */}
      <circle cx="306" cy="158" r="16" fill="#d0e8f0" stroke={BLUE} strokeWidth="1.5" opacity="0.9"/>
      <circle cx="306" cy="158" r="10" fill="#b0d0e8" opacity="0.6"/>
      <circle cx="302" cy="153" r="4"  fill="white"  opacity="0.5"/>
      <Lbl x="306" y="182" text="Kristallkugel" fs={8} fill={BLUE}/>

      {/* Eingang */}
      <path d={`M 186 ${CY+RY-4} L 186 ${CY+RY-24} Q ${CX} ${CY+RY-36} 234 ${CY+RY-24} L 234 ${CY+RY-4}`}
        fill="#c8b070" stroke={INK} strokeWidth="2"/>
      <Lbl x={CX} y={CY+RY-2} text="Eingang" fs={8}/>

      {marker && <Marker x={CX} y={CY} label={marker.label}/>}
    </Frame>
  )
}
