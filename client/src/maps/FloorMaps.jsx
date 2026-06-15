// Alle Etagen-Grundrisse als SVG-Komponenten

function FloorShell({ children, title, subtitle }) {
  return (
    <svg viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg" style={{ background: '#0e0c08' }}>
      <rect width="320" height="260" fill="#0e0c08" />
      {/* Raumrahmen */}
      <rect x="20" y="30" width="280" height="200" fill="#12100a" stroke="#3a2c18" strokeWidth="2" rx="4" />
      {/* Titel */}
      <text x="160" y="18" textAnchor="middle" fill="#c8a84b" fontSize="10" fontWeight="bold">{title}</text>
      <text x="160" y="248" textAnchor="middle" fill="#5a4030" fontSize="8" fontStyle="italic">{subtitle}</text>
      {children}
    </svg>
  )
}

function Door({ x, y, dir = 'bottom' }) {
  const w = dir === 'bottom' || dir === 'top' ? 24 : 8
  const h = dir === 'bottom' || dir === 'top' ? 8 : 24
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="#1a1408" stroke="#8b6914" strokeWidth="1.5" rx="1" />
      <circle cx={x + (dir === 'left' ? -4 : dir === 'right' ? 4 : 0)} cy={y} r="1.5" fill="#c8a84b" />
    </g>
  )
}

export function FloorKeller({ marker }) {
  return (
    <FloorShell title="Keller – Die Pforte" subtitle="Welche Jahreszeit kommt zuerst?">
      {/* Wände mit Mauertextur */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={28 + i * 33} y="32" width="28" height="6" fill="#1e1a10" stroke="#2a2218" strokeWidth="0.5" rx="1" />
      ))}

      {/* Die große Tür mit 4 Symbolen */}
      <rect x="120" y="180" width="80" height="48" fill="#1a1408" stroke="#8b6914" strokeWidth="2" rx="3" />
      <text x="160" y="196" textAnchor="middle" fill="#8b6914" fontSize="7">VERSIEGELTE TÜR</text>

      {/* 4 Symbol-Platten */}
      {[
        { x: 131, y: 202, symbol: '❄', label: 'Winter' },
        { x: 149, y: 202, symbol: '🌸', label: 'Frühling' },
        { x: 167, y: 202, symbol: '☀', label: 'Sommer' },
        { x: 185, y: 202, symbol: '🍂', label: 'Herbst' },
      ].map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width="14" height="16" fill="#1e1808" stroke="#5a4020" strokeWidth="1" rx="1" />
          <text x={s.x + 7} y={s.y + 12} textAnchor="middle" fontSize="10">{s.symbol}</text>
        </g>
      ))}

      {/* Gedicht an der Wand */}
      <rect x="35" y="60" width="120" height="80" fill="#161208" stroke="#3a2c18" strokeWidth="1" rx="2" />
      <text x="95" y="75" textAnchor="middle" fill="#6a5030" fontSize="7" fontStyle="italic">Gedicht (in Stein)</text>
      {['Wenn Schnee den letzten', 'Atemzug bedeckt...', '', 'Wenn Blüten neu das', 'Dunkel auferweckt...'].map((line, i) => (
        <text key={i} x="95" y={88 + i * 10} textAnchor="middle" fill="#5a4828" fontSize="6.5" fontStyle="italic">{line}</text>
      ))}

      {/* Treppe nach oben */}
      <rect x="230" y="50" width="50" height="60" fill="#161208" stroke="#3a2c18" strokeWidth="1" rx="2" />
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1="234" y1={58 + i * 10} x2="276" y2={58 + i * 10} stroke="#3a2c18" strokeWidth="1" />
      ))}
      <text x="255" y="120" textAnchor="middle" fill="#4a3a20" fontSize="7">Treppe ↑</text>

      {/* Eingang */}
      <rect x="144" y="30" width="32" height="8" fill="#1a1408" stroke="#5a4020" strokeWidth="1" />
      <text x="160" y="25" textAnchor="middle" fill="#4a3a20" fontSize="7">Eingang</text>

      {marker && <FloorMarker label={marker.label} cx={160} cy={120} />}
    </FloorShell>
  )
}

export function FloorBibliothek({ marker }) {
  return (
    <FloorShell title="Etage 1 – Bibliothek" subtitle="Ein Buch fehlt. Welches?">
      {/* Regale an Wänden */}
      {/* Obere Regalreihe */}
      <rect x="28" y="40" width="264" height="22" fill="#1e1408" stroke="#4a3018" strokeWidth="1" rx="1" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={32 + i * 22} y="42" width="18" height="18" fill={['#2a1808', '#1a2008', '#201808', '#081820'][i % 4]} stroke="#3a2818" strokeWidth="0.5" rx="0.5" />
      ))}

      {/* Linke Regalreihe */}
      <rect x="28" y="62" width="22" height="130" fill="#1e1408" stroke="#4a3018" strokeWidth="1" rx="1" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x="30" y={66 + i * 21} width="18" height="17" fill={['#2a1808', '#1a2008', '#201808'][i % 3]} stroke="#3a2818" strokeWidth="0.5" rx="0.5" />
      ))}

      {/* Rechte Regalreihe */}
      <rect x="270" y="62" width="22" height="130" fill="#1e1408" stroke="#4a3018" strokeWidth="1" rx="1" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x="272" y={66 + i * 21} width="18" height="17" fill={['#1a2008', '#201808', '#2a1808'][i % 3]} stroke="#3a2818" strokeWidth="0.5" rx="0.5" />
      ))}

      {/* Mittlerer Tisch */}
      <rect x="100" y="110" width="120" height="60" fill="#1e1408" stroke="#4a3018" strokeWidth="1.5" rx="3" />
      <text x="160" y="136" textAnchor="middle" fill="#6a4a28" fontSize="8">Lesetisch</text>

      {/* Lücke im Regal (markiert) */}
      <rect x="130" y="42" width="18" height="18" fill="#0e0c08" stroke="#c8a84b" strokeWidth="1" strokeDasharray="3,2" rx="0.5" />
      <text x="139" y="36" textAnchor="middle" fill="#c8a84b" fontSize="6">← Lücke</text>

      {/* Rote Bücher (Tagebuch) */}
      <rect x="272" y="66" width="18" height="17" fill="#3a0808" stroke="#8b2020" strokeWidth="1" rx="0.5" />
      <rect x="272" y="87" width="18" height="17" fill="#3a0808" stroke="#8b2020" strokeWidth="1" rx="0.5" />
      <text x="281" y="110" textAnchor="middle" fill="#8b3030" fontSize="6">↑ Rot</text>

      {/* Treppe */}
      <rect x="56" y="170" width="40" height="18" fill="#161208" stroke="#3a2c18" strokeWidth="1" rx="1" />
      <text x="76" y="182" textAnchor="middle" fill="#4a3a20" fontSize="7">↑ E2 / ↓ Keller</text>

      {/* Messingrohr */}
      <rect x="230" y="185" width="30" height="12" fill="#2a1e08" stroke="#8b6914" strokeWidth="1" rx="2" />
      <text x="245" y="194" textAnchor="middle" fill="#8b6914" fontSize="6">≡ Rohr</text>

      {marker && <FloorMarker label={marker.label} cx={160} cy={160} />}
    </FloorShell>
  )
}

export function FloorLabor({ marker }) {
  return (
    <FloorShell title="Etage 2 – Labor" subtitle="Die richtige Kombination löst eine Vision aus">
      {/* Symboltafel an Nordwand */}
      <rect x="80" y="38" width="160" height="50" fill="#1a1808" stroke="#4a4020" strokeWidth="1.5" rx="2" />
      <text x="160" y="52" textAnchor="middle" fill="#7a6a30" fontSize="7" fontWeight="bold">SYMBOLTAFEL</text>
      <text x="160" y="64" textAnchor="middle" fill="#5a5030" fontSize="6">Zutaten × Effekte</text>
      {/* Tabellengitter */}
      {[0,1,2,3].map(i => <line key={i} x1={100 + i * 30} y1="55" x2={100 + i * 30} y2="85" stroke="#3a3018" strokeWidth="0.5" />)}
      {[55, 68, 81].map((y, i) => <line key={i} x1="86" y1={y} x2="234" y2={y} stroke="#3a3018" strokeWidth="0.5" />)}

      {/* Tisch 1 (links, kalt) */}
      <rect x="35" y="100" width="70" height="50" fill="#1a1808" stroke="#3a3018" strokeWidth="1" rx="2" />
      <text x="70" y="118" textAnchor="middle" fill="#5a5030" fontSize="7">Tisch 1</text>
      <text x="70" y="130" textAnchor="middle" fill="#3a3020" fontSize="6">abgebrochen</text>
      <circle cx="52" cy="138" r="5" fill="#1e1c10" stroke="#4a4020" strokeWidth="1" />
      <circle cx="70" cy="140" r="4" fill="#1e1c10" stroke="#4a4020" strokeWidth="1" />

      {/* Tisch 2 (Mitte, aktiv – leuchtet) */}
      <rect x="120" y="100" width="80" height="55" fill="#1a1c10" stroke="#4a6020" strokeWidth="1.5" rx="2" />
      <text x="160" y="118" textAnchor="middle" fill="#6a8030" fontSize="7" fontWeight="bold">Tisch 2 (aktiv)</text>
      <circle cx="145" cy="135" r="7" fill="#0e1808" stroke="#4a8030" strokeWidth="1" />
      <circle cx="145" cy="135" r="4" fill="#2a5020" opacity="0.8" />
      <text x="145" y="156" textAnchor="middle" fill="#4a6020" fontSize="6">brodelt</text>
      {/* Zutaten-Slots */}
      {[165, 177, 189].map((x, i) => (
        <rect key={i} x={x} y="128" width="10" height="16" fill="#0e1008" stroke="#3a5020" strokeWidth="1" rx="1" />
      ))}
      <text x="177" y="153" textAnchor="middle" fill="#3a5020" fontSize="6">3 Slots</text>

      {/* Tisch 3 (rechts, kalt) */}
      <rect x="215" y="100" width="70" height="50" fill="#1a1808" stroke="#3a3018" strokeWidth="1" rx="2" />
      <text x="250" y="118" textAnchor="middle" fill="#5a5030" fontSize="7">Tisch 3</text>
      <text x="250" y="130" textAnchor="middle" fill="#3a3020" fontSize="6">abgebrochen</text>

      {/* Notiz auf Tisch 2 */}
      <rect x="122" y="168" width="76" height="20" fill="#1e1c0a" stroke="#5a5020" strokeWidth="1" rx="1" />
      <text x="160" y="180" textAnchor="middle" fill="#6a6028" fontSize="6" fontStyle="italic">„…braucht Wiederholung"</text>

      {/* Treppe */}
      <rect x="240" y="195" width="50" height="15" fill="#161208" stroke="#3a2c18" strokeWidth="1" rx="1" />
      <text x="265" y="206" textAnchor="middle" fill="#4a3a20" fontSize="7">↑ E3 / ↓ E1</text>

      {marker && <FloorMarker label={marker.label} cx={160} cy={165} />}
    </FloorShell>
  )
}

export function FloorSpiegel({ marker }) {
  return (
    <FloorShell title="Etage 3 – Spiegelkammer" subtitle="Einer zeigt die Vergangenheit">
      {/* 8 Spiegel an den Wänden */}
      {[
        { x: 50,  y: 50,  w: 40, h: 55, label: 'S1' },
        { x: 110, y: 40,  w: 40, h: 45, label: 'S2' },
        { x: 170, y: 40,  w: 40, h: 45, label: 'S3' },
        { x: 230, y: 50,  w: 40, h: 55, label: 'S4' },
        { x: 40,  y: 140, w: 35, h: 55, label: 'S5' },
        { x: 245, y: 140, w: 35, h: 55, label: 'S6' },
        { x: 70,  y: 185, w: 50, h: 30, label: 'S7 ★', highlight: true },
        { x: 200, y: 185, w: 50, h: 30, label: 'S8' },
      ].map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h}
            fill={s.highlight ? '#0e1a0e' : '#0e0e14'}
            stroke={s.highlight ? '#4a9040' : '#2a2a4a'}
            strokeWidth={s.highlight ? 2 : 1} rx="2" />
          <text x={s.x + s.w / 2} y={s.y + s.h / 2 + 3}
            textAnchor="middle"
            fill={s.highlight ? '#6a9060' : '#3a3a5a'}
            fontSize="8" fontWeight={s.highlight ? 'bold' : 'normal'}>
            {s.label}
          </text>
          {s.highlight && (
            <text x={s.x + s.w / 2} y={s.y + s.h / 2 + 14} textAnchor="middle" fill="#4a6a40" fontSize="6">
              Vergangenheit
            </text>
          )}
        </g>
      ))}

      {/* Truhe in der Ecke */}
      <rect x="245" y="185" width="35" height="25" fill="#1e1408" stroke="#8b6914" strokeWidth="1.5" rx="2" />
      <line x1="245" y1="193" x2="280" y2="193" stroke="#6a4a18" strokeWidth="1" />
      <text x="262" y="208" textAnchor="middle" fill="#8b6914" fontSize="7">Truhe</text>
      <text x="262" y="218" textAnchor="middle" fill="#6a4a18" fontSize="6">verschlossen</text>

      {/* Treppe */}
      <rect x="130" y="195" width="60" height="18" fill="#161208" stroke="#3a2c18" strokeWidth="1" rx="1" />
      <text x="160" y="207" textAnchor="middle" fill="#4a3a20" fontSize="7">↑ E4 / ↓ E2</text>

      {marker && <FloorMarker label={marker.label} cx={160} cy={130} />}
    </FloorShell>
  )
}

export function FloorArchiv({ marker }) {
  const crystalColors = ['#e8e8ff', '#88aaff', '#88ffaa', '#ffee88', '#ffaa44', '#ff6666', '#cc88ff', '#888888']
  const positions = [
    { cx: 160, cy: 80  },
    { cx: 210, cy: 100 },
    { cx: 230, cy: 145 },
    { cx: 210, cy: 190 },
    { cx: 160, cy: 210 },
    { cx: 110, cy: 190 },
    { cx: 90,  cy: 145 },
    { cx: 110, cy: 100 },
  ]

  return (
    <FloorShell title="Etage 4 – Archiv der Stimmen" subtitle="Jeder hört etwas anderes">
      {/* Sockel in der Mitte */}
      <circle cx="160" cy="145" r="35" fill="#100e08" stroke="#3a2c18" strokeWidth="1.5" strokeDasharray="4,3" />
      <circle cx="160" cy="145" r="8" fill="#1e1808" stroke="#5a4020" strokeWidth="1" />

      {/* Halterungen an Wand */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180)
        const x = 160 + Math.cos(angle) * 85
        const y = 145 + Math.sin(angle) * 70
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="10" fill="#12100a" stroke="#3a2c18" strokeWidth="1" />
            <circle cx={x} cy={y} r="7" fill={crystalColors[i]} opacity="0.7" />
            <text x={x} y={y + 3} textAnchor="middle" fill="#000" fontSize="6" opacity="0.5">
              {i + 1}
            </text>
          </g>
        )
      })}

      {/* Wandhalterungen (nummeriert) */}
      {positions.map((pos, i) => (
        <text key={i} x={pos.cx} y={pos.cy + 20} textAnchor="middle" fill="#3a2c18" fontSize="6">
          {['W', 'B', 'G', 'Y', 'O', 'R', 'V', 'S'][i]}
        </text>
      ))}

      {/* Tür zum Sanctum */}
      <rect x="144" y="30" width="32" height="10" fill="#1a1408" stroke="#c8a84b" strokeWidth="1.5" rx="1" />
      <text x="160" y="24" textAnchor="middle" fill="#c8a84b" fontSize="7">↑ Sanctum</text>

      {/* Treppe runter */}
      <rect x="144" y="218" width="32" height="10" fill="#161208" stroke="#3a2c18" strokeWidth="1" rx="1" />
      <text x="160" y="240" textAnchor="middle" fill="#4a3a20" fontSize="7">↓ E3</text>

      {marker && <FloorMarker label={marker.label} cx={160} cy={145} />}
    </FloorShell>
  )
}

export function FloorSanctum({ marker }) {
  return (
    <FloorShell title="Etage 5 – Das Sanctum" subtitle="Das letzte Rätsel ist keine Frage der Logik">
      {/* Kreisförmiger Raum */}
      <ellipse cx="160" cy="130" rx="110" ry="90" fill="#100e08" stroke="#3a2c18" strokeWidth="1.5" />

      {/* Altar / Sockel in der Mitte */}
      <ellipse cx="160" cy="130" rx="35" ry="28" fill="#14120a" stroke="#8b6914" strokeWidth="2" />
      {/* Aegisstein */}
      <ellipse cx="160" cy="125" rx="14" ry="14" fill="#1a2a4a" stroke="#4a80c0" strokeWidth="1.5" />
      <ellipse cx="160" cy="125" rx="8" ry="8" fill="#4a80c0" opacity="0.8" />
      <ellipse cx="160" cy="125" rx="4" ry="4" fill="#88bbee" />
      <text x="160" y="148" textAnchor="middle" fill="#8b6914" fontSize="7">Aegisstein</text>

      {/* Kristallkugel (Podest) */}
      <rect x="144" y="155" width="32" height="20" fill="#1a1408" stroke="#5a4020" strokeWidth="1" rx="2" />
      <circle cx="160" cy="152" r="10" fill="#1e1c14" stroke="#8b6914" strokeWidth="1.5" />
      <circle cx="160" cy="152" r="6" fill="#2a2820" opacity="0.7" />
      <text x="160" y="185" textAnchor="middle" fill="#6a4a20" fontSize="7">Kristallkugel</text>
      <text x="160" y="194" textAnchor="middle" fill="#4a3a18" fontSize="6">(Aldrics Abbild)</text>

      {/* Kerzen-Symbole im Kreis */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg - 90) * (Math.PI / 180)
        const cx = 160 + Math.cos(rad) * 85
        const cy = 130 + Math.sin(rad) * 68
        return (
          <g key={i}>
            <line x1={cx} y1={cy + 5} x2={cx} y2={cy - 5} stroke="#5a4020" strokeWidth="2" strokeLinecap="round" />
            <circle cx={cx} cy={cy - 7} r="2" fill="#c8a84b" opacity="0.8" />
          </g>
        )
      })}

      {/* Treppe runter */}
      <rect x="144" y="210" width="32" height="10" fill="#161208" stroke="#3a2c18" strokeWidth="1" rx="1" />
      <text x="160" y="232" textAnchor="middle" fill="#4a3a20" fontSize="7">↓ E4</text>

      {marker && <FloorMarker label={marker.label} cx={160} cy={100} />}
    </FloorShell>
  )
}

function FloorMarker({ label, cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill="none" stroke="#4a90d0" strokeWidth="1.5" className="marker-pulse" opacity="0.5" />
      <circle cx={cx} cy={cy} r={6} fill="#4a90d0" opacity="0.9" />
      <circle cx={cx} cy={cy} r={2.5} fill="#fff" />
      <rect x={cx - 28} y={cy - 24} width={56} height={14} fill="#1a2a3a" stroke="#4a90d0" strokeWidth="1" rx="3" opacity="0.92" />
      <text x={cx} y={cy - 13} textAnchor="middle" fill="#e8e8ff" fontSize="7">{label}</text>
    </g>
  )
}
