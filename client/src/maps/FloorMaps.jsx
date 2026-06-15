// Etagen-Grundrisse – vollständige Neuzeichnung

function Shell({ title, subtitle, children }) {
  return (
    <svg viewBox="0 0 420 330" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
      <defs>
        {/* Steinboden-Kacheln */}
        <pattern id="fFloor" x="0" y="0" width="28" height="18" patternUnits="userSpaceOnUse">
          <rect width="28" height="18" fill="#14100a"/>
          <rect x="0"  y="0"  width="27" height="8.5" fill="#181408" stroke="#201a0e" strokeWidth="0.7"/>
          <rect x="14" y="9"  width="27" height="8.5" fill="#161208" stroke="#1e180c" strokeWidth="0.7"/>
          <rect x="2"  y="1"  width="23" height="6"   fill="#1c1810" opacity="0.3"/>
        </pattern>
        {/* Mauerwerk */}
        <pattern id="fWall" x="0" y="0" width="22" height="14" patternUnits="userSpaceOnUse">
          <rect width="22" height="14" fill="#1e1a0e"/>
          <rect x="0"  y="0"  width="21" height="6.5" fill="#221e10" stroke="#2e2818" strokeWidth="0.6"/>
          <rect x="11" y="7"  width="21" height="6.5" fill="#201c0e" stroke="#2a2416" strokeWidth="0.6"/>
        </pattern>
        {/* Glüh-Filter */}
        <filter id="fGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="fGlowStrong" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="fSoftBlur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="22"/>
        </filter>
      </defs>

      {/* Schwarzer Hintergrund */}
      <rect width="420" height="330" fill="#070604"/>

      {/* Mauerwerk-Ring */}
      <rect x="14" y="24" width="392" height="284" fill="url(#fWall)" rx="3"/>

      {/* Steinboden Innenraum */}
      <rect x="32" y="42" width="356" height="250" fill="url(#fFloor)"/>

      {/* Fackelschimmer in den 4 Ecken */}
      {[{cx:42,cy:52},{cx:378,cy:52},{cx:42,cy:282},{cx:378,cy:282}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="130" fill="#c8a84b" opacity="0.09" filter="url(#fSoftBlur)"/>
      ))}

      {/* Innenwand-Linie */}
      <rect x="32" y="42" width="356" height="250" fill="none" stroke="#3a2c14" strokeWidth="2.5"/>

      {/* Fackeln (kleine Icons an Ecken) */}
      {[[42,52],[378,52],[42,282],[378,282]].map(([cx,cy],i) => (
        <g key={i}>
          <rect x={cx-3} y={cy+3} width="5" height="12" fill="#3a2410" rx="1"/>
          <ellipse cx={cx} cy={cy+2} rx="5" ry="6" fill="#c8a84b" opacity="0.7" filter="url(#fGlow)"/>
          <ellipse cx={cx} cy={cy}   rx="3" ry="4" fill="#ffe480" opacity="0.9"/>
          <ellipse cx={cx} cy={cy-1} rx="1.5" ry="2" fill="#fff" opacity="0.6"/>
        </g>
      ))}

      {/* Äußerer Rahmen (dekorativ) */}
      <rect x="8"  y="18" width="404" height="296" fill="none" stroke="#6a4a1a" strokeWidth="1.5" rx="4"/>
      <rect x="11" y="21" width="398" height="290" fill="none" stroke="#3a2a10" strokeWidth="0.7" rx="3"/>
      {/* Eck-Ornamente */}
      {[[14,24],[406,24],[14,314],[406,314]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="#100e08" stroke="#7a5818" strokeWidth="1.2"/>
          <circle cx={x} cy={y} r="2" fill="#c8a84b" opacity="0.7"/>
        </g>
      ))}

      {/* Titelbalken */}
      <rect x="0" y="0" width="420" height="22" fill="#070604"/>
      <line x1="14" y1="22" x2="406" y2="22" stroke="#3a2a10" strokeWidth="1.5"/>
      <text x="210" y="15" textAnchor="middle" fill="#c8a84b" fontSize="11"
        fontWeight="bold" letterSpacing="1" filter="url(#fGlow)">{title}</text>

      {/* Untertitel */}
      <rect x="0" y="302" width="420" height="28" fill="#070604"/>
      <line x1="14" y1="303" x2="406" y2="303" stroke="#3a2a10" strokeWidth="1"/>
      <text x="210" y="320" textAnchor="middle" fill="#6a4a28" fontSize="7.5" fontStyle="italic">{subtitle}</text>

      {children}
    </svg>
  )
}

function Marker({ label, cx, cy }) {
  return (
    <g filter="url(#fGlowStrong)">
      <circle cx={cx} cy={cy} r="20" fill="none" stroke="#4a90d0" strokeWidth="1.5" opacity="0.3">
        <animate attributeName="r" values="12;22;12" dur="2.2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0.05;0.5" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx} cy={cy} r="8" fill="#162840" stroke="#4a90d0" strokeWidth="2" opacity="0.97"/>
      <circle cx={cx} cy={cy} r="3.5" fill="#70b0ff"/>
      <circle cx={cx-2} cy={cy-2} r="1.2" fill="#fff" opacity="0.8"/>
      <rect x={cx-36} y={cy-30} width="72" height="17" fill="#0c1a2e" stroke="#4a90d0" strokeWidth="1.2" rx="4" opacity="0.96"/>
      <text x={cx} y={cy-18} textAnchor="middle" fill="#90c8ff" fontSize="8.5" fontWeight="bold">{label}</text>
    </g>
  )
}

// ─── Keller ────────────────────────────────────────────────────────────────────
export function FloorKeller({ marker }) {
  return (
    <Shell title="KELLER – DIE PFORTE" subtitle="Welche Jahreszeit kommt zuerst?">
      {/* Eingang oben (Öffnung in der Nordwand) */}
      <rect x="186" y="32" width="48" height="12" fill="url(#fFloor)"/>
      <line x1="186" y1="32" x2="186" y2="44" stroke="#3a2c14" strokeWidth="2.5"/>
      <line x1="234" y1="32" x2="234" y2="44" stroke="#3a2c14" strokeWidth="2.5"/>
      <text x="210" y="28" textAnchor="middle" fill="#5a4028" fontSize="6.5">Eingang</text>

      {/* Steintafel mit Gedicht (links) */}
      <rect x="44" y="56" width="148" height="130" fill="#161208" stroke="#4a3818" strokeWidth="2" rx="3"/>
      <rect x="50" y="62" width="136" height="118" fill="#12100a" stroke="#2a2010" strokeWidth="1" rx="1"/>
      {/* Mosaik-Rahmen */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={i} x={51+i*17} y="63" width="14" height="4" fill="#1e1a0e" stroke="#2a2416" strokeWidth="0.5" rx="0.5"/>
      ))}
      <text x="118" y="80" textAnchor="middle" fill="#7a6030" fontSize="8" fontWeight="bold" letterSpacing="0.5">Gedicht in Stein</text>
      <line x1="58" y1="84" x2="178" y2="84" stroke="#3a2c14" strokeWidth="0.8"/>
      {[
        'Wenn Schnee den letzten',
        'Atemzug bedeckt,',
        '',
        'Wenn Blüten neu das',
        'Dunkel auferweckt,',
        '',
        'Wenn Wärme ihren',
        'höchsten Bogen zieht,',
        '',
        'Wenn buntes Laub',
        'im Wind Abschied sieht –',
      ].map((l, i) => (
        <text key={i} x="118" y={94+i*10} textAnchor="middle" fill="#5a4828" fontSize="6.5" fontStyle="italic">{l}</text>
      ))}

      {/* Versiegelte Tür (rechts-mitte) */}
      <rect x="228" y="108" width="148" height="166" fill="#1a1408" stroke="#8b6914" strokeWidth="2.5" rx="4"/>
      <rect x="234" y="114" width="136" height="154" fill="#141008" stroke="#5a4010" strokeWidth="1" rx="2"/>
      {/* Tür-Ornament */}
      <rect x="240" y="120" width="124" height="10" fill="#1e1808" stroke="#6a5010" strokeWidth="0.8" rx="1"/>
      <text x="302" y="128" textAnchor="middle" fill="#8b6914" fontSize="8.5" fontWeight="bold" letterSpacing="1" filter="url(#fGlow)">VERSIEGELTE TÜR</text>
      <line x1="240" y1="132" x2="364" y2="132" stroke="#4a3810" strokeWidth="0.8"/>

      {/* 4 Jahreszeiten-Symbole */}
      {[
        { x: 244, sym: '❄', col: '#88aaff', name: 'Winter'   },
        { x: 278, sym: '✿', col: '#88ff88', name: 'Frühling' },
        { x: 312, sym: '☀', col: '#ffee44', name: 'Sommer'   },
        { x: 346, sym: '🍂', col: '#ff8844', name: 'Herbst'   },
      ].map((s, i) => (
        <g key={i}>
          <rect x={s.x-10} y="140" width="28" height="40" fill="#181208" stroke={s.col} strokeWidth="1.5" rx="3" opacity="0.85"/>
          <text x={s.x+4} y="162" textAnchor="middle" fontSize="16">{s.sym}</text>
          <text x={s.x+4} y="177" textAnchor="middle" fill={s.col} fontSize="6" opacity="0.8">{s.name}</text>
        </g>
      ))}
      <text x="302" y="198" textAnchor="middle" fill="#6a5020" fontSize="7" fontStyle="italic">Reihenfolge = Lösung</text>

      {/* Schloss-Symbol in Mitte der Tür */}
      <rect x="288" y="214" width="28" height="22" fill="#0e0c08" stroke="#8b6914" strokeWidth="1.5" rx="2"/>
      <rect x="292" y="206" width="20" height="14" fill="none" stroke="#8b6914" strokeWidth="1.5" rx="5"/>
      <circle cx="302" cy="222" r="3" fill="#8b6914"/>
      <line x1="302" y1="222" x2="302" y2="228" stroke="#8b6914" strokeWidth="1.5"/>
      <text x="302" y="248" textAnchor="middle" fill="#5a4020" fontSize="7">verschlossen</text>

      {/* Treppe nach oben (oben-rechts) */}
      <rect x="322" y="54" width="64" height="48" fill="#141008" stroke="#3a2c14" strokeWidth="1.5" rx="2"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={326} y={58+i*8} width={56-i*6} height="7" fill="#181408" stroke="#2a2010" strokeWidth="0.8" rx="0.5"/>
      ))}
      <text x="354" y="112" textAnchor="middle" fill="#4a3820" fontSize="7">Treppe ↑</text>

      {marker && <Marker label={marker.label} cx={155} cy={210}/>}
    </Shell>
  )
}

// ─── Bibliothek ────────────────────────────────────────────────────────────────
export function FloorBibliothek({ marker }) {
  const bookColors = ['#2a1404','#0e1e06','#1a1206','#081428','#1e0a1e','#1a1e06','#1e0808','#0a1a18']
  return (
    <Shell title="ETAGE 1 – BIBLIOTHEK" subtitle="Ein Buch fehlt. Sein Titel ist das Passwort.">
      {/* Nördliches Regal (obere Wand) */}
      <rect x="36"  y="44" width="348" height="30" fill="#201408" stroke="#5a3c18" strokeWidth="1.5"/>
      {Array.from({length:16}).map((_,i) => (
        <rect key={i} x={40+i*21} y="47" width="18" height="24"
          fill={i===7 ? '#0a0806' : bookColors[i%8]}
          stroke={i===7 ? '#c8a84b' : '#3a2810'}
          strokeWidth={i===7 ? 1.5 : 0.7} rx="0.5"
          strokeDasharray={i===7 ? '3,2' : 'none'}/>
      ))}
      {/* Lücke-Label */}
      <text x="188" y="43" textAnchor="middle" fill="#c8a84b" fontSize="6.5" filter="url(#fGlow)">← Lücke</text>

      {/* Westliches Regal */}
      <rect x="36" y="74" width="28" height="160" fill="#201408" stroke="#5a3c18" strokeWidth="1.5"/>
      {Array.from({length:7}).map((_,i) => (
        <rect key={i} x="39" y={78+i*22} width="22" height="19" fill={bookColors[i%8]} stroke="#3a2810" strokeWidth="0.7" rx="0.5"/>
      ))}

      {/* Östliches Regal (Tagebuch rot) */}
      <rect x="356" y="74" width="28" height="160" fill="#201408" stroke="#5a3c18" strokeWidth="1.5"/>
      {Array.from({length:7}).map((_,i) => (
        <rect key={i} x="359" y={78+i*22} width="22" height="19"
          fill={i<3 ? '#3a0808' : bookColors[i%8]}
          stroke={i<3 ? '#8b1e1e' : '#3a2810'}
          strokeWidth={i<3 ? 1.2 : 0.7} rx="0.5"/>
      ))}
      <text x="370" y="244" textAnchor="middle" fill="#8b3030" fontSize="6.5">Tagebuch</text>
      <text x="370" y="253" textAnchor="middle" fill="#5a2020" fontSize="6">(3 Bände)</text>

      {/* Lesetisch (Mitte) */}
      <rect x="110" y="118" width="200" height="90" fill="#1e1608" stroke="#6a4820" strokeWidth="2" rx="4"/>
      <rect x="116" y="124" width="188" height="78" fill="#1a1408" stroke="#3a2c10" strokeWidth="1" rx="2"/>
      {/* Kerzen auf dem Tisch */}
      {[[128,118],[284,118]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x-2} y={y-14} width="4" height="14" fill="#5a4020" rx="1"/>
          <ellipse cx={x} cy={y-15} rx="4" ry="5" fill="#c8a84b" opacity="0.6" filter="url(#fGlow)"/>
          <ellipse cx={x} cy={y-17} rx="2" ry="3" fill="#ffe480" opacity="0.8"/>
        </g>
      ))}
      <text x="210" y="160" textAnchor="middle" fill="#7a5830" fontSize="9" fontWeight="bold">Lesetisch</text>
      <text x="210" y="174" textAnchor="middle" fill="#5a4028" fontSize="7" fontStyle="italic">Bücher & Notizen</text>
      {/* Aufgeschlagenes Buch auf Tisch */}
      <ellipse cx="210" cy="188" rx="38" ry="18" fill="#1c1408" stroke="#4a3410" strokeWidth="1"/>
      <line x1="210" y1="170" x2="210" y2="206" stroke="#3a2c10" strokeWidth="0.8"/>
      {[174,183,192,201].map(y => <line key={y} x1="174" y1={y} x2="208" y2={y} stroke="#2a2010" strokeWidth="0.5"/>)}
      {[214,223,232,201].map(y => <line key={y} x1="212" y1={y} x2="244" y2={y} stroke="#2a2010" strokeWidth="0.5"/>)}

      {/* Treppe (unten-links) – KEIN Overlap mit Westregal */}
      <rect x="72" y="220" width="70" height="42" fill="#141008" stroke="#3a2c14" strokeWidth="1.5" rx="2"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={76} y={224+i*8} width={62-i*8} height="7" fill="#181408" stroke="#2a2010" strokeWidth="0.8" rx="0.5"/>
      ))}
      <text x="107" y="272" textAnchor="middle" fill="#4a3820" fontSize="7">↑ E2 / ↓ Keller</text>

      {/* Passwort-Rohr (unten-rechts) */}
      <rect x="290" y="232" width="66" height="20" fill="#2a1e08" stroke="#c8a84b" strokeWidth="1.5" rx="4"/>
      <rect x="294" y="236" width="58" height="12" fill="#1e1608" stroke="#8b6914" strokeWidth="0.8" rx="2"/>
      <text x="323" y="246" textAnchor="middle" fill="#c8a84b" fontSize="7" fontWeight="bold" filter="url(#fGlow)">≡ Passwort-Rohr</text>

      {marker && <Marker label={marker.label} cx={210} cy={88}/>}
    </Shell>
  )
}

// ─── Labor ─────────────────────────────────────────────────────────────────────
export function FloorLabor({ marker }) {
  return (
    <Shell title="ETAGE 2 – LABOR" subtitle="Die richtige Kombination löst eine Vision aus">
      {/* Symboltafel Nordwand */}
      <rect x="88" y="48" width="244" height="66" fill="#1a1a0a" stroke="#5a5020" strokeWidth="2" rx="3"/>
      <rect x="94" y="54" width="232" height="54" fill="#16160a" stroke="#3a3818" strokeWidth="1" rx="1"/>
      <text x="210" y="68" textAnchor="middle" fill="#8a7a30" fontSize="8.5" fontWeight="bold" letterSpacing="1">SYMBOLTAFEL</text>
      <line x1="98" y1="72" x2="322" y2="72" stroke="#3a3818" strokeWidth="0.8"/>
      {/* Gitter */}
      {[126,156,186,216,246,276,306].map(x => <line key={x} x1={x} y1="72" x2={x} y2="104" stroke="#3a3818" strokeWidth="0.5"/>)}
      {[72,88,104].map(y => <line key={y} x1="98" y1={y} x2="322" y2={y} stroke="#3a3818" strokeWidth="0.5"/>)}
      {/* Symbole */}
      {['🌙','🔥','💎','🌫','🌸','🩸','⭐'].map((s,i) => (
        <text key={i} x={111+i*30} y="96" textAnchor="middle" fontSize="13">{s}</text>
      ))}

      {/* Tisch 1 – links, kalt */}
      <rect x="38" y="128" width="100" height="70" fill="#181606" stroke="#2e2e18" strokeWidth="1.5" rx="3"/>
      <rect x="44" y="134" width="88" height="58" fill="#141406" stroke="#282814" strokeWidth="0.8" rx="1"/>
      <text x="88" y="150" textAnchor="middle" fill="#5a5828" fontSize="8">Tisch 1</text>
      <text x="88" y="162" textAnchor="middle" fill="#3a3820" fontSize="6.5" fontStyle="italic">abgebrochen</text>
      {/* Erloschene Kessel */}
      <ellipse cx="68" cy="180" rx="16" ry="10" fill="#101006" stroke="#2a2818" strokeWidth="1.2"/>
      <ellipse cx="68" cy="177" rx="10" ry="6" fill="#0e0e06" opacity="0.8"/>
      <ellipse cx="108" cy="182" rx="12" ry="8" fill="#101006" stroke="#2a2818" strokeWidth="1.2"/>

      {/* Tisch 2 – Mitte, AKTIV (leuchtet grün) */}
      <rect x="158" y="122" width="104" height="80" fill="#141c0a" stroke="#4a7020" strokeWidth="2" rx="3"/>
      <rect x="164" y="128" width="92" height="68" fill="#101606" stroke="#2a4814" strokeWidth="1" rx="1"/>
      {/* Aktiv-Glow */}
      <rect x="158" y="122" width="104" height="80" fill="none" stroke="#4a9020" strokeWidth="1" opacity="0.5" filter="url(#fGlow)"/>
      <text x="210" y="142" textAnchor="middle" fill="#6a9030" fontSize="8" fontWeight="bold" filter="url(#fGlow)">AKTIV</text>
      {/* Brodelnder Kessel */}
      <ellipse cx="192" cy="170" rx="22" ry="16" fill="#0e1c0a" stroke="#4a8028" strokeWidth="2"/>
      <ellipse cx="192" cy="166" rx="16" ry="10" fill="#1a3010" opacity="0.9"/>
      <ellipse cx="192" cy="163" rx="10" ry="6" fill="#2a5018" opacity="0.7"/>
      {/* Dampf */}
      {[-4,0,4].map((dx,i) => (
        <path key={i} d={`M ${192+dx} 154 Q ${190+dx} 148 ${192+dx} 142`}
          fill="none" stroke="#4a7030" strokeWidth="1.5" opacity={0.4+i*0.1} strokeLinecap="round"/>
      ))}
      <text x="192" y="192" textAnchor="middle" fill="#4a6820" fontSize="6.5" fontStyle="italic">brodelt</text>
      {/* 3 Zutaten-Slots */}
      {[218,232,246].map((x,i) => (
        <g key={i}>
          <rect x={x} y="148" width="14" height="24" fill="#0c0e08" stroke="#3a5820" strokeWidth="1.2" rx="2"/>
          <text x={x+7} y="162" textAnchor="middle" fill="#2a4018" fontSize="7">S{i+1}</text>
        </g>
      ))}
      <text x="232" y="185" textAnchor="middle" fill="#3a5020" fontSize="6">3 Slots</text>

      {/* Tisch 3 – rechts, kalt */}
      <rect x="282" y="128" width="100" height="70" fill="#181606" stroke="#2e2e18" strokeWidth="1.5" rx="3"/>
      <rect x="288" y="134" width="88" height="58" fill="#141406" stroke="#282814" strokeWidth="0.8" rx="1"/>
      <text x="332" y="150" textAnchor="middle" fill="#5a5828" fontSize="8">Tisch 3</text>
      <text x="332" y="162" textAnchor="middle" fill="#3a3820" fontSize="6.5" fontStyle="italic">abgebrochen</text>

      {/* Notiz unter Tisch 2 */}
      <rect x="160" y="210" width="100" height="24" fill="#1c1c0a" stroke="#5a5820" strokeWidth="1" rx="2"/>
      <text x="210" y="222" textAnchor="middle" fill="#7a7028" fontSize="6.5" fontStyle="italic">"…braucht Wiederholung"</text>
      <text x="210" y="231" textAnchor="middle" fill="#5a5020" fontSize="6" fontStyle="italic">— Aldrics Notiz</text>

      {/* Treppe (unten-rechts) */}
      <rect x="310" y="240" width="68" height="42" fill="#141008" stroke="#3a2c14" strokeWidth="1.5" rx="2"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={314} y={244+i*8} width={60-i*7} height="7" fill="#181408" stroke="#2a2010" strokeWidth="0.8" rx="0.5"/>
      ))}
      <text x="344" y="292" textAnchor="middle" fill="#4a3820" fontSize="7">↑ E3 / ↓ E1</text>

      {marker && <Marker label={marker.label} cx={210} cy={92}/>}
    </Shell>
  )
}

// ─── Spiegelkammer ─────────────────────────────────────────────────────────────
export function FloorSpiegel({ marker }) {
  // Alle Spiegel-Koordinaten ohne Überlappung
  const mirrors = [
    // Obere Reihe (y=52–120)
    { x:38,  y:52,  w:62, h:68, id:'S1', special:false },
    { x:114, y:48,  w:54, h:58, id:'S2', special:false },
    { x:182, y:48,  w:54, h:58, id:'S3', special:false },
    { x:248, y:52,  w:116,h:68, id:'S4', special:false }, // Eck-Spiegel, breiter
    // Seitenspiegel (y=132–210)
    { x:34,  y:132, w:48, h:78, id:'S5', special:false },
    { x:338, y:132, w:48, h:78, id:'S6', special:false },
    // Besonderer Spiegel Mitte-links (y=128–210)
    { x:96,  y:128, w:120,h:84, id:'S7 ★', special:true },
    // Untere Reihe (y=222–272)
    { x:38,  y:222, w:100,h:52, id:'S8', special:false },
  ]

  return (
    <Shell title="ETAGE 3 – SPIEGELKAMMER" subtitle="Spiegel 7 zeigt den Tag des Mordes">
      {mirrors.map((m, i) => (
        <g key={i}>
          {/* Rahmen */}
          <rect x={m.x-4} y={m.y-4} width={m.w+8} height={m.h+8}
            fill="#1e1808" stroke={m.special ? '#6a9040' : '#2a2a40'} strokeWidth={m.special ? 2.5 : 1.5} rx="4"/>
          {/* Spiegelfläche */}
          <rect x={m.x} y={m.y} width={m.w} height={m.h}
            fill={m.special ? '#081408' : '#08080e'}
            stroke={m.special ? '#4a7030' : '#222236'} strokeWidth="1" rx="1"/>
          {/* Glow bei S7 */}
          {m.special && (
            <rect x={m.x} y={m.y} width={m.w} height={m.h}
              fill="none" stroke="#4a8030" strokeWidth="1.5" rx="1" opacity="0.5" filter="url(#fGlow)"/>
          )}
          {/* Reflexions-Linien */}
          <line x1={m.x+5} y1={m.y+5} x2={m.x+m.w-5} y2={m.y+5} stroke={m.special?'#2a4a20':'#141420'} strokeWidth="0.7" opacity="0.7"/>
          <line x1={m.x+5} y1={m.y+5} x2={m.x+5}      y2={m.y+m.h-5} stroke={m.special?'#2a4a20':'#141420'} strokeWidth="0.7" opacity="0.7"/>
          {/* Diagonale Reflexion */}
          <line x1={m.x+8} y1={m.y+8} x2={m.x+m.w-8} y2={m.y+m.h-8} stroke={m.special?'#1a3018':'#10101a'} strokeWidth="0.5" opacity="0.5"/>
          {/* Label */}
          <text x={m.x+m.w/2} y={m.y-7} textAnchor="middle"
            fill={m.special?'#6a9050':'#3a3a58'} fontSize="8" fontWeight={m.special?'bold':'normal'}>
            {m.id}
          </text>
          {/* Spiegel-7 Text */}
          {m.special && (
            <text x={m.x+m.w/2} y={m.y+m.h/2+5} textAnchor="middle"
              fill="#4a7030" fontSize="7.5" fontStyle="italic" filter="url(#fGlow)">Vergangenheit</text>
          )}
        </g>
      ))}

      {/* Truhe (rechts unten, klar getrennt von S8 und S6) */}
      <rect x="232" y="226" width="80" height="54" fill="#1e1408" stroke="#c8a84b" strokeWidth="2" rx="3"/>
      <rect x="232" y="226" width="80" height="18" fill="#281808" stroke="#8b6914" strokeWidth="1.5" rx="3 3 0 0"/>
      <circle cx="272" cy="235" r="4" fill="#c8a84b" opacity="0.9" filter="url(#fGlow)"/>
      <rect x="268" y="232" width="8" height="6" fill="#0e0c08" stroke="#8b6914" strokeWidth="0.8" rx="1"/>
      <text x="272" y="258" textAnchor="middle" fill="#c8a84b" fontSize="8" fontWeight="bold">Truhe</text>
      <text x="272" y="270" textAnchor="middle" fill="#6a4818" fontSize="6.5">verschlossen</text>

      {/* Treppe (zwischen S8 und Truhe) */}
      <rect x="150" y="232" width="72" height="48" fill="#141008" stroke="#3a2c14" strokeWidth="1.5" rx="2"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={154} y={236+i*9} width={64-i*8} height="8" fill="#181408" stroke="#2a2010" strokeWidth="0.8" rx="0.5"/>
      ))}
      <text x="186" y="290" textAnchor="middle" fill="#4a3820" fontSize="7">↑ E4 / ↓ E2</text>

      {marker && <Marker label={marker.label} cx={210} cy={96}/>}
    </Shell>
  )
}

// ─── Archiv der Stimmen ────────────────────────────────────────────────────────
export function FloorArchiv({ marker }) {
  const crystalData = [
    { id:'W', col:'#d0d0ff', label:'Weiß'   },
    { id:'B', col:'#6699ff', label:'Blau'   },
    { id:'G', col:'#66ff88', label:'Grün'   },
    { id:'Y', col:'#ffee44', label:'Gelb'   },
    { id:'O', col:'#ff8833', label:'Orange' },
    { id:'R', col:'#ff4444', label:'Rot'    },
    { id:'V', col:'#cc66ff', label:'Violett'},
    { id:'S', col:'#aaaaaa', label:'Schwarz'},
  ]

  const cx = 210, cy = 162, r = 92
  const positions = crystalData.map((_, i) => {
    const angle = (i * 45 - 90) * Math.PI / 180
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r }
  })

  return (
    <Shell title="ETAGE 4 – ARCHIV DER STIMMEN" subtitle="Jeder hört eine andere Aufzeichnung">
      {/* Verbindungslinien zum Zentrum */}
      {positions.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
          stroke="#2a2010" strokeWidth="0.8" opacity="0.5" strokeDasharray="4,3"/>
      ))}

      {/* Äußerer Kreis-Pfad */}
      <circle cx={cx} cy={cy} r={r+18} fill="none" stroke="#2a2010" strokeWidth="1" strokeDasharray="6,5" opacity="0.5"/>

      {/* Kristall-Sockel und Kristalle */}
      {positions.map((p, i) => {
        const c = crystalData[i]
        return (
          <g key={i}>
            {/* Sockel */}
            <ellipse cx={p.x} cy={p.y+2} rx="16" ry="10" fill="#1a1408" stroke="#3a2c14" strokeWidth="1.5"/>
            {/* Kristall-Körper (Hexagon-Form) */}
            <polygon
              points={[0,1,2,3,4,5].map(j => {
                const a = (j*60-90)*Math.PI/180
                return `${p.x+Math.cos(a)*10},${p.y-8+Math.sin(a)*10}`
              }).join(' ')}
              fill={c.col} opacity="0.75" stroke={c.col} strokeWidth="0.5"/>
            {/* Kristall-Glanz */}
            <ellipse cx={p.x-2} cy={p.y-12} rx="3" ry="4" fill="#fff" opacity="0.3"/>
            {/* Glow-Halo */}
            <circle cx={p.x} cy={p.y-8} r="13" fill={c.col} opacity="0.12" filter="url(#fGlowStrong)"/>
            {/* Label */}
            <text x={p.x} y={p.y+22} textAnchor="middle" fill={c.col} fontSize="6.5" opacity="0.9">{c.label}</text>
          </g>
        )
      })}

      {/* Zentraler Altar */}
      <ellipse cx={cx} cy={cy} rx="28" ry="22" fill="#1a1408" stroke="#8b6914" strokeWidth="2.5"/>
      <ellipse cx={cx} cy={cy} rx="20" ry="15" fill="#14100a" stroke="#5a4010" strokeWidth="1"/>
      <ellipse cx={cx} cy={cy} rx="10" ry="8" fill="#201808" stroke="#c8a84b" strokeWidth="1" opacity="0.6" filter="url(#fGlow)"/>

      {/* Tür zum Sanctum (oben) */}
      <rect x="192" y="32" width="36" height="12" fill="url(#fFloor)"/>
      <line x1="192" y1="32" x2="192" y2="44" stroke="#c8a84b" strokeWidth="2"/>
      <line x1="228" y1="32" x2="228" y2="44" stroke="#c8a84b" strokeWidth="2"/>
      <text x="210" y="28" textAnchor="middle" fill="#c8a84b" fontSize="7" filter="url(#fGlow)">↑ Sanctum</text>

      {/* Treppe runter (unten) */}
      <rect x="176" y="272" width="68" height="22" fill="#141008" stroke="#3a2c14" strokeWidth="1.5" rx="2"/>
      {[0,1,2].map(i => (
        <rect key={i} x={180+i*6} y={275+i*5} width={60-i*12} height="4" fill="#181408" stroke="#2a2010" strokeWidth="0.8" rx="0.5"/>
      ))}
      <text x="210" y="305" textAnchor="middle" fill="#4a3820" fontSize="7">↓ E3</text>

      {marker && <Marker label={marker.label} cx={cx} cy={cy}/>}
    </Shell>
  )
}

// ─── Sanctum ───────────────────────────────────────────────────────────────────
export function FloorSanctum({ marker }) {
  const cx = 210, cy = 148
  const candleAngles = [0,45,90,135,180,225,270,315]
  const candleR = 98

  return (
    <Shell title="ETAGE 5 – DAS SANCTUM" subtitle="Das letzte Rätsel ist keine Frage der Logik">
      {/* Kreisförmiger Raum */}
      <ellipse cx={cx} cy={cy} rx="162" ry="118" fill="#100e08" stroke="#3a2c14" strokeWidth="2"/>
      <ellipse cx={cx} cy={cy} rx="154" ry="111" fill="none" stroke="#261e0e" strokeWidth="0.8" opacity="0.7"/>

      {/* Runen-Inschriften am Rand (dekorativ) */}
      {candleAngles.map((deg,i) => {
        const a = (deg-90)*Math.PI/180
        const rx2 = cx+Math.cos(a)*140, ry2 = cy+Math.sin(a)*102
        return <text key={i} x={rx2} y={ry2+3} textAnchor="middle" fill="#2a2010" fontSize="8" opacity="0.4">✦</text>
      })}

      {/* Kerzen im Kreis */}
      {candleAngles.map((deg,i) => {
        const a = (deg-90)*Math.PI/180
        const px = cx+Math.cos(a)*candleR, py = cy+Math.sin(a)*candleR
        return (
          <g key={i}>
            <rect x={px-2.5} y={py+4} width="5" height="14" fill="#4a3018" rx="1"/>
            <ellipse cx={px} cy={py+3} rx="5" ry="6" fill="#c8a84b" opacity="0.65" filter="url(#fGlow)"/>
            <ellipse cx={px} cy={py+1} rx="3" ry="4" fill="#ffe480" opacity="0.85"/>
            <ellipse cx={px} cy={py}   rx="1.5" ry="2" fill="#fff" opacity="0.6"/>
          </g>
        )
      })}

      {/* Altar-Sockel */}
      <ellipse cx={cx} cy={cy} rx="44" ry="34" fill="#181408" stroke="#8b6914" strokeWidth="2.5"/>
      <ellipse cx={cx} cy={cy} rx="36" ry="27" fill="#141008" stroke="#5a4010" strokeWidth="1"/>

      {/* AEGISSTEIN */}
      <circle cx={cx} cy={cy-6} r="20" fill="#0e1e3a" stroke="#4a80c0" strokeWidth="2.5" filter="url(#fGlow)"/>
      <circle cx={cx} cy={cy-6} r="14" fill="#1a3a6a" opacity="0.9"/>
      <circle cx={cx} cy={cy-6} r="8"  fill="#3a70b0"/>
      <circle cx={cx} cy={cy-6} r="4"  fill="#6aaaee"/>
      <circle cx={cx} cy={cy-6} r="1.5" fill="#c0e0ff"/>
      {/* Aegisstein Glow */}
      <circle cx={cx} cy={cy-6} r="24" fill="none" stroke="#4a80c0" strokeWidth="1"
        opacity="0.4" filter="url(#fGlowStrong)"/>
      <text x={cx} y={cy+16} textAnchor="middle" fill="#8b6914" fontSize="8" fontWeight="bold" filter="url(#fGlow)">Aegisstein</text>

      {/* Kristallkugel (rechts vom Altar, klar getrennt) */}
      <rect x="264" y="158" width="36" height="22" fill="#1a1408" stroke="#6a4a18" strokeWidth="1.5" rx="3"/>
      <circle cx="282" cy="155" r="16" fill="#1c1a0e" stroke="#8b6914" strokeWidth="2"/>
      <circle cx="282" cy="155" r="10" fill="#241e0c" opacity="0.8"/>
      <circle cx="282" cy="151" r="4"  fill="#c8a84b" opacity="0.3"/>
      <circle cx="278" cy="149" r="1.5" fill="#fff" opacity="0.4"/>
      <text x="282" y="190" textAnchor="middle" fill="#7a5820" fontSize="7">Kristallkugel</text>
      <text x="282" y="199" textAnchor="middle" fill="#5a3818" fontSize="6" fontStyle="italic">Aldrics Abbild</text>

      {/* Treppe runter (unten) */}
      <rect x="178" y="258" width="64" height="32" fill="#141008" stroke="#3a2c14" strokeWidth="1.5" rx="2"/>
      {[0,1,2,3].map(i => (
        <rect key={i} x={182+i*5} y={261+i*6} width={56-i*10} height="5" fill="#181408" stroke="#2a2010" strokeWidth="0.8" rx="0.5"/>
      ))}
      <text x="210" y="300" textAnchor="middle" fill="#4a3820" fontSize="7">↓ E4</text>

      {marker && <Marker label={marker.label} cx={cx} cy={cy-40}/>}
    </Shell>
  )
}
