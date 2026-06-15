// Etagen-Grundrisse — Pergament-Stil

const INK  = '#1a0e06'
const INKM = '#5a3820'
const INKL = '#8a6040'
const GOLD = '#b87a0a'
const RED  = '#8b1a14'
const BLUE = '#3a6080'
const WALL = '#2a1c0e'

// ── Wiederverwendbare Teile ──────────────────────────────────────────────────

function Defs({ p }) {
  return (
    <defs>
      <radialGradient id={`${p}bg`} cx="50%" cy="45%" r="72%">
        <stop offset="0%"   stopColor="#fdf5e0"/>
        <stop offset="55%"  stopColor="#f0e0b8"/>
        <stop offset="100%" stopColor="#c8a870"/>
      </radialGradient>
      <filter id={`${p}gf`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  )
}

function Frame({ p, title, children }) {
  return (
    <svg viewBox="0 0 420 330" xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%' }}>
      <Defs p={p}/>
      <rect width="420" height="330" fill={WALL}/>
      <rect x="10" y="10" width="400" height="310" fill={`url(#${p}bg)`}/>
      <rect x="10" y="10" width="400" height="310" fill="none" stroke={INK}  strokeWidth="2.5"/>
      <rect x="15" y="15" width="390" height="300" fill="none" stroke={INKM} strokeWidth="0.8"/>
      {/* Eckornamente */}
      {[[16,16],[404,16],[16,314],[404,314]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="none" stroke={INK} strokeWidth="1.2"/>
          <circle cx={cx} cy={cy} r="2" fill={INK}/>
        </g>
      ))}
      <line x1="28" y1="40" x2="392" y2="40" stroke={INK} strokeWidth="1"/>
      <text x="210" y="34" textAnchor="middle" fill={INK} fontSize="11"
        fontFamily="Georgia,serif" letterSpacing="2" fontWeight="bold">
        {title.toUpperCase()}
      </text>
      {children}
    </svg>
  )
}

function Label({ x, y, text, fs = 8, fill = INK, anchor = 'middle', bold = false }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={fs}
      fontFamily="Georgia,serif" fontWeight={bold ? 'bold' : 'normal'}>
      {text}
    </text>
  )
}

function Marker({ x, y, label }) {
  if (!label) return null
  const w = Math.max(label.length * 5.5 + 10, 32)
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill="none" stroke={RED} strokeWidth="1.5" opacity="0.45">
        <animate attributeName="r"       values="13;21;13" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.45;0;0.45" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x} cy={y} r="7" fill={RED} stroke="#fff8ee" strokeWidth="1.5"/>
      <circle cx={x} cy={y} r="3" fill="#fff8ee"/>
      <rect x={x + 11} y={y - 9} width={w} height="14" fill={RED} rx="3" opacity="0.9"/>
      <text x={x + 15} y={y + 1} fill="#fff8ee" fontSize="7.5"
        fontFamily="Arial,sans-serif" fontWeight="bold">{label}</text>
    </g>
  )
}

function StairsIcon({ x, y, w = 62, h = 44 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#e0cfa0" stroke={INK} strokeWidth="1.2" rx="1"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={x + i * (w/5)} y={y + i * (h/5)}
          width={w - i*(w/5)} height={h/5}
          fill="none" stroke={INKM} strokeWidth="0.6"/>
      ))}
      <Label x={x + w/2} y={y + h/2 + 4} text="Treppe" fs={7}/>
    </g>
  )
}

// ── Etage: Keller ────────────────────────────────────────────────────────────

export function FloorKeller({ marker }) {
  const p = 'fk'
  return (
    <Frame p={p} title="Keller – Die Pforte">
      {/* Bodenplan-Umriss */}
      <rect x="28" y="48" width="364" height="256" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>
      <rect x="28" y="48" width="364" height="256" fill="none" stroke={INKM} strokeWidth="0.7" strokeDasharray="4,3" opacity="0.5"/>

      {/* Gedicht-Tafel links */}
      <rect x="40" y="62" width="148" height="130" fill="#d8c890" stroke={INK} strokeWidth="1.8" rx="2"/>
      <rect x="46" y="68" width="136" height="118" fill="none" stroke={INKM} strokeWidth="0.8"/>
      <Label x="114" y="80" text="In Stein gemeißelt:" fs={7} fill={INKM}/>
      <Label x="52" y="96"  text={'"Wenn Schnee den letzten Atemzug'} fs={6.5} fill={INK} anchor="start"/>
      <Label x="52" y="108" text="bedeckt, wenn Blüten neu" fs={6.5} fill={INK} anchor="start"/>
      <Label x="52" y="120" text="das Dunkel auferweckt," fs={6.5} fill={INK} anchor="start"/>
      <Label x="52" y="132" text="Wenn Wärme ihren höchsten" fs={6.5} fill={INK} anchor="start"/>
      <Label x="52" y="144" text='Bogen zieht, wenn buntes Laub' fs={6.5} fill={INK} anchor="start"/>
      <Label x="52" y="157" text={'im Wind den Abschied sieht..."'} fs={6.5} fill={INK} anchor="start"/>
      <Label x="114" y="180" text="— Gedicht-Tafel —" fs={7} fill={INKM} bold/>

      {/* Versiegelte Tür rechts */}
      <rect x="236" y="62" width="144" height="152" fill="#c8b888" stroke={INK} strokeWidth="1.8" rx="2"/>
      <rect x="246" y="72" width="124" height="132" fill="#d0c090" stroke={INKM} strokeWidth="1"/>
      <Label x="308" y="68" text="Versiegelte Tür" fs={7} fill={INKM} bold/>
      {/* Jahreszeiten Symbole im Kreis */}
      {[
        { label: '❄', cx: 308, cy: 110 },  // Winter oben
        { label: '🌸', cx: 350, cy: 148 }, // Frühling rechts
        { label: '☀', cx: 308, cy: 186 }, // Sommer unten
        { label: '🍂', cx: 266, cy: 148 }, // Herbst links
      ].map(({ label, cx, cy }) => (
        <g key={label}>
          <circle cx={cx} cy={cy} r="14" fill="#e8d4a0" stroke={INK} strokeWidth="1.2"/>
          <text x={cx} y={cy+5} textAnchor="middle" fontSize="14">{label}</text>
        </g>
      ))}
      {/* Türknauf */}
      <circle cx="308" cy="148" r="6" fill="#b87a0a" stroke={INK} strokeWidth="1.2"/>
      <Label x="308" y="210" text="Jahreszeiten-Symbole" fs={7} fill={INKM}/>

      {/* Treppe rechts oben */}
      <StairsIcon x="236" y="224" w="70" h="46"/>

      {/* Eingangstor unten */}
      <path d="M 172 304 L 172 282 Q 210 268 248 282 L 248 304" fill="#c8b480" stroke={INK} strokeWidth="2"/>
      <Label x="210" y="294" text="Eingang" fs={7}/>

      {marker && <Marker x={100} y={148} label={marker.label}/>}
    </Frame>
  )
}

// ── Etage 1: Bibliothek ──────────────────────────────────────────────────────

export function FloorBibliothek({ marker }) {
  const p = 'fb'
  return (
    <Frame p={p} title="Etage 1 – Bibliothek">
      <rect x="28" y="48" width="364" height="256" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {/* Nordwand-Regal (oben, ganzer Raum) */}
      <rect x="28" y="48" width="364" height="28" fill="#c0a860" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length: 22}, (_, i) => (
        <line key={i} x1={28 + i*16.5} y1={48} x2={28 + i*16.5} y2={76} stroke={INKM} strokeWidth="0.6"/>
      ))}
      {/* Bücherbuchrücken (einige hervorgehoben) */}
      {[0,2,4,7,9,12,14,17,19].map(i => (
        <rect key={i} x={32 + i*16.5} y={50} width={14} height={24}
          fill={i===11 ? GOLD : '#9a7040'} stroke={INKM} strokeWidth="0.5"/>
      ))}
      {/* Lücke im Regal – Highlight */}
      <rect x="211" y="48" width="30" height="28" fill="#f0d870" stroke={GOLD} strokeWidth="2"/>
      <Label x="226" y="65" text="LÜCKE" fs={7} fill={GOLD} bold/>

      {/* Westwand-Regal (links) */}
      <rect x="28" y="76" width="26" height="158" fill="#c0a860" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length: 9}, (_, i) => (
        <line key={i} x1={28} y1={76 + i*17.5} x2={54} y2={76 + i*17.5} stroke={INKM} strokeWidth="0.6"/>
      ))}

      {/* Ostwand-Regal (rechts, oben) */}
      <rect x="366" y="76" width="26" height="110" fill="#c0a860" stroke={INK} strokeWidth="1.5"/>
      {Array.from({length: 6}, (_, i) => (
        <line key={i} x1={366} y1={76 + i*18.3} x2={392} y2={76 + i*18.3} stroke={INKM} strokeWidth="0.6"/>
      ))}
      {/* Rotes Tagebuch – Highlight */}
      <rect x="366" y="190" width="26" height="44" fill="#8b1a14" stroke={INK} strokeWidth="1.5"/>
      <Label x="379" y="215" text="Tagebuch" fs={6} fill="#fff8ee"/>

      {/* Lesetisch in der Mitte */}
      <rect x="96" y="102" width="210" height="88" fill="#d4b878" stroke={INK} strokeWidth="1.5" rx="2"/>
      <rect x="106" y="110" width="190" height="72" fill="#dcc890" stroke={INKM} strokeWidth="0.7" rx="1"/>
      <Label x="201" y="140" text="Lesetisch" fs={8} fill={INK} bold/>
      {/* Bücher auf dem Tisch */}
      {[0,1,2].map(i => (
        <rect key={i} x={120 + i*28} y={148} width={22} height={16}
          fill={['#8a4020','#2a5080','#3a6020'][i]} stroke={INK} strokeWidth="0.8"/>
      ))}

      {/* Treppe links unten */}
      <StairsIcon x="60" y="224" w="64" h="44"/>

      {/* Schlüsselrohr rechts unten */}
      <rect x="292" y="222" width="74" height="40" fill="#d0c080" stroke={INK} strokeWidth="1.5" rx="3"/>
      <Label x="329" y="238" text="Schloss-" fs={7} fill={INK}/>
      <Label x="329" y="252" text="röhre" fs={7} fill={INK}/>
      <circle cx="362" cy="242" r="8" fill="none" stroke={INK} strokeWidth="1.2"/>

      {marker && <Marker x="210" y="148" label={marker.label}/>}
    </Frame>
  )
}

// ── Etage 2: Labor ───────────────────────────────────────────────────────────

export function FloorLabor({ marker }) {
  const p = 'fl'
  return (
    <Frame p={p} title="Etage 2 – Labor">
      <rect x="28" y="48" width="364" height="256" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {/* Werkbänke oben */}
      {[
        { x: 36,  label: 'Tisch 1', active: false },
        { x: 154, label: 'Tisch 2', active: false },
        { x: 272, label: 'Tisch 3', active: true  },
      ].map(({ x, label, active }) => (
        <g key={x}>
          <rect x={x} y={58} width={100} height={40}
            fill={active ? '#d4c860' : '#c8b880'}
            stroke={active ? GOLD : INK} strokeWidth={active ? 2 : 1.5} rx={1}/>
          {/* Reagenzgläser */}
          {[0,1,2].map(i => (
            <g key={i}>
              <rect x={x+14+i*24} y={64} width={8} height={20}
                fill={active ? ['#8ab4c8','#c88040','#4a8a4a'][i] : '#a0906a'}
                stroke={INK} strokeWidth="0.7" rx="1"/>
              <ellipse cx={x+18+i*24} cy={64} rx={4} ry={2} fill="none" stroke={INK} strokeWidth="0.7"/>
            </g>
          ))}
          <Label x={x+50} y={104} text={label} fs={7.5} fill={active ? GOLD : INKM} bold={active}/>
        </g>
      ))}

      {/* Kessel (aktiver Tisch 3, rechts) */}
      <ellipse cx="324" cy="166" rx="44" ry="44" fill="#c8b880" stroke={INK} strokeWidth="1.8"/>
      <ellipse cx="324" cy="166" rx="36" ry="36" fill="#d4c060" stroke={GOLD} strokeWidth="1.5"/>
      <ellipse cx="324" cy="158" rx="26" ry="14" fill="#7ab0c8" stroke={BLUE} strokeWidth="1"/>
      <Label x="324" y="170" text="Kessel" fs={8} fill={INK} bold/>
      {/* Dampf-Linien */}
      {[[-8, -10], [0, -14], [8, -10]].map(([dx, dy], i) => (
        <path key={i}
          d={`M ${324+dx} ${166+dy} Q ${324+dx-4} ${166+dy-12} ${324+dx+2} ${166+dy-22}`}
          fill="none" stroke="#888" strokeWidth="1.2" opacity="0.5" strokeDasharray="3,2"/>
      ))}

      {/* Zutatentisch (Mitte links) */}
      <rect x="36" y="148" width="176" height="64" fill="#d4b878" stroke={INK} strokeWidth="1.5" rx="2"/>
      <Label x="124" y="170" text="Zutatentisch" fs={8} fill={INK} bold/>
      {/* 3 Zutaten-Slots */}
      {[0,1,2].map(i => (
        <g key={i}>
          <circle cx={68 + i * 52} cy="192" r="14"
            fill={['#c0b840','#a0b8c0','#b8c0a0'][i]}
            stroke={INK} strokeWidth="1"/>
          <Label x={68 + i * 52} y="196"
            text={['Kristall','Nebel','Kristall'][i]}
            fs={5.5} fill={INK}/>
        </g>
      ))}

      {/* Rezept-Notiz */}
      <rect x="36" y="230" width="138" height="44" fill="#e0cfa0" stroke={INK} strokeWidth="1.2" rx="2">
        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite"/>
      </rect>
      <Label x="46" y="244" text="Formel-Notiz:" fs={7} fill={INK} bold anchor="start"/>
      <Label x="46" y="256" text="Kristall + Nebel + Kristall" fs={6.5} fill={INKM} anchor="start"/>
      <Label x="46" y="266" text='"Vergib mir, Mira."' fs={6.5} fill={RED} anchor="start"/>

      {/* Treppe */}
      <StairsIcon x="310" y="234" w="64" h="44"/>

      {marker && <Marker x="210" y="166" label={marker.label}/>}
    </Frame>
  )
}

// ── Etage 3: Spiegelkammer ────────────────────────────────────────────────────

export function FloorSpiegel({ marker }) {
  const p = 'fs'
  const mirrors = [
    { id:'S1', x:36,  y:52,  w:72,  h:64, special:false },
    { id:'S2', x:122, y:52,  w:62,  h:58, special:false },
    { id:'S3', x:198, y:52,  w:62,  h:58, special:false },
    { id:'S4', x:274, y:52,  w:84,  h:64, special:false },
    { id:'S5', x:36,  y:132, w:52,  h:82, special:false },
    { id:'S7', x:108, y:128, w:170, h:90, special:true  },
    { id:'S6', x:330, y:132, w:52,  h:82, special:false },
    { id:'S8', x:36,  y:232, w:100, h:52, special:false },
  ]
  return (
    <Frame p={p} title="Etage 3 – Spiegelkammer">
      <rect x="28" y="48" width="364" height="256" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {mirrors.map(({ id, x, y, w, h, special }) => (
        <g key={id}>
          <rect x={x} y={y} width={w} height={h}
            fill={special ? '#c8d8e8' : '#d0cca8'}
            stroke={special ? BLUE : INK}
            strokeWidth={special ? 2.5 : 1.5} rx={1}/>
          {/* Spiegelrahmen Innen */}
          <rect x={x+4} y={y+4} width={w-8} height={h-8}
            fill={special ? '#b8cce0' : '#d8d4b0'}
            stroke={special ? '#6090b8' : INKM}
            strokeWidth={special ? 1.2 : 0.7}/>
          {/* Spiegelfläche – schimmern */}
          {special && (
            <rect x={x+8} y={y+8} width={w-16} height={h-16}
              fill="#d0e8f0" stroke="#9ab8d0" strokeWidth="0.5" opacity="0.7"/>
          )}
          <Label x={x+w/2} y={y+h/2+4} text={id} fs={special ? 10 : 8}
            fill={special ? BLUE : INKM} bold={special}/>
          {special && (
            <Label x={x+w/2} y={y+h/2+18} text="★ Die Vision" fs={7.5} fill={BLUE}/>
          )}
        </g>
      ))}

      {/* Truhe */}
      <rect x="254" y="232" width="88" height="52" fill="#c8a860" stroke={INK} strokeWidth="1.5" rx="1"/>
      <rect x="254" y="232" width="88" height="20" fill="#b89848" stroke={INK} strokeWidth="1"/>
      <circle cx="298" cy="258" r="5" fill="#b87a0a" stroke={INK} strokeWidth="1.2"/>
      <Label x="298" y="272" text="Truhe" fs={7} fill={INK} bold/>

      {/* Treppe */}
      <StairsIcon x="160" y="232" w="68" h="52"/>

      {marker && <Marker x="193" y="173" label={marker.label}/>}
    </Frame>
  )
}

// ── Etage 4: Archiv der Stimmen ──────────────────────────────────────────────

export function FloorArchiv({ marker }) {
  const p = 'fa'
  const cx = 210, cy = 162, r = 80
  const CRYSTAL_COLORS = ['#e8e8ff','#88aaff','#88ffaa','#ffee88','#ffaa44','#ff6666','#cc88ff','#aaaaaa']
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]

  return (
    <Frame p={p} title="Etage 4 – Archiv der Stimmen">
      <rect x="28" y="48" width="364" height="256" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {/* Kreisförmige Führungslinie */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INKM} strokeWidth="0.8" strokeDasharray="5,4" opacity="0.5"/>

      {/* 8 Kristall-Sockel */}
      {angles.map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180
        const px  = cx + r * Math.cos(rad)
        const py  = cy + r * Math.sin(rad)
        return (
          <g key={i}>
            {/* Sockel */}
            <polygon
              points={`${px},${py-13} ${px+11},${py} ${px},${py+13} ${px-11},${py}`}
              fill={CRYSTAL_COLORS[i]} stroke={INK} strokeWidth="1.2" opacity="0.85"/>
            <polygon
              points={`${px},${py-8} ${px+7},${py} ${px},${py+8} ${px-7},${py}`}
              fill="#fff8ee" opacity="0.5"/>
            {/* Verbindungslinie zum Zentrum */}
            <line x1={px} y1={py} x2={cx} y2={cy} stroke={CRYSTAL_COLORS[i]} strokeWidth="0.5" opacity="0.3"/>
          </g>
        )
      })}

      {/* Zentrum-Altar */}
      <circle cx={cx} cy={cy} r="28" fill="#d4b878" stroke={INK} strokeWidth="2"/>
      <circle cx={cx} cy={cy} r="20" fill="#dcc890" stroke={INKM} strokeWidth="1"/>
      <circle cx={cx} cy={cy} r="10" fill={GOLD} stroke={INK} strokeWidth="1.2" opacity="0.8"/>
      <Label x={cx} y={cy+4} text="Altar" fs={8} fill={INK} bold/>

      {/* Tür zum Sanctum oben */}
      <rect x="184" y="48" width="52" height="20" fill="#c8a860" stroke={INK} strokeWidth="1.5" rx="1"/>
      <Label x="210" y="62" text="▲ Sanctum" fs={7} fill={INK} bold/>

      {/* Treppe unten */}
      <StairsIcon x="184" y="274" w="52" h="22"/>

      {marker && <Marker x={cx} y={cy} label={marker.label}/>}
    </Frame>
  )
}

// ── Etage 5: Sanctum ────────────────────────────────────────────────────────

export function FloorSanctum({ marker }) {
  const p = 'fn'
  const cx = 210, cy = 160, rx = 168, ry = 116
  const CANDLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
  const CR = 72  // Kerzen-Radius

  return (
    <Frame p={p} title="Etage 5 – Sanctum">
      <rect x="28" y="48" width="364" height="256" fill="#e8d8a8" stroke={INK} strokeWidth="2"/>

      {/* Elliptischer Raum */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#ddd0a0" stroke={INK} strokeWidth="2.5"/>
      <ellipse cx={cx} cy={cy} rx={rx-6} ry={ry-6} fill="none" stroke={INKM} strokeWidth="0.8" strokeDasharray="4,3"/>

      {/* 8 Kerzen */}
      {CANDLE_ANGLES.map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180
        const kx  = cx + CR * Math.cos(rad)
        const ky  = cy + CR * Math.sin(rad)
        return (
          <g key={i}>
            <rect x={kx-3} y={ky-8} width={6} height={14} fill="#e8d890" stroke={INK} strokeWidth="0.8"/>
            <ellipse cx={kx} cy={ky-8} rx={4} ry={2.5} fill="#ffdd40" opacity="0.8"/>
            <circle cx={kx} cy={ky-8} r="6" fill="#ffcc00" opacity="0.15">
              <animate attributeName="opacity" values="0.15;0.35;0.15" dur={`${1.8+i*0.3}s`} repeatCount="indefinite"/>
            </circle>
          </g>
        )
      })}

      {/* Altar */}
      <ellipse cx={cx} cy={cy} rx={36} ry={28} fill="#c8b070" stroke={INK} strokeWidth="2"/>
      <ellipse cx={cx} cy={cy} rx={26} ry={20} fill="#dcc880" stroke={INKM} strokeWidth="1"/>

      {/* Aegisstein */}
      <circle cx={cx} cy={cy} r="14" fill="#3a6080" stroke={INK} strokeWidth="1.8">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx} cy={cy} r="10" fill="#6090b0" opacity="0.7"/>
      <circle cx={cx} cy={cy} r="5" fill="#b0d0f0" opacity="0.9"/>
      <Label x={cx} y={cy+30} text="Aegisstein" fs={7.5} fill={INK} bold/>

      {/* Kristallkugel – rechts */}
      <circle cx="306" cy="158" r="16" fill="#d0e8f0" stroke={BLUE} strokeWidth="1.5" opacity="0.9"/>
      <circle cx="306" cy="158" r="10" fill="#b0d0e8" opacity="0.6"/>
      <circle cx="302" cy="153" r="4" fill="white" opacity="0.5"/>
      <Label x="306" y="182" text="Kristallkugel" fs={6.5} fill={BLUE}/>

      {/* Eingangstor unten */}
      <path d={`M 186 ${cy+ry-4} L 186 ${cy+ry-22} Q ${cx} ${cy+ry-34} 234 ${cy+ry-22} L 234 ${cy+ry-4}`}
        fill="#c8b070" stroke={INK} strokeWidth="1.8"/>
      <Label x={cx} y={cy+ry-2} text="Eingang" fs={7} fill={INK}/>

      {marker && <Marker x={cx} y={cy} label={marker.label}/>}
    </Frame>
  )
}
