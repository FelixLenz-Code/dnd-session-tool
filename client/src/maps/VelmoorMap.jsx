export default function VelmoorMap({ marker }) {
  return (
    <svg viewBox="0 0 520 400" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
      <defs>
        {/* Backgrounds */}
        <radialGradient id="vBg" cx="45%" cy="55%" r="65%">
          <stop offset="0%" stopColor="#1e1808" />
          <stop offset="60%" stopColor="#130f06" />
          <stop offset="100%" stopColor="#080603" />
        </radialGradient>
        <radialGradient id="vGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c8a84b" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#c8a84b" stopOpacity="0" />
        </radialGradient>
        {/* Filters */}
        <filter id="vSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="vGlowMed" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="vDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.7" />
        </filter>
        {/* River gradient */}
        <linearGradient id="vRiver" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a4060" />
          <stop offset="40%" stopColor="#1e5878" />
          <stop offset="100%" stopColor="#162840" />
        </linearGradient>
        {/* District fills */}
        <radialGradient id="vAltstadt" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#2a1e0c" />
          <stop offset="100%" stopColor="#1a1208" />
        </radialGradient>
        <radialGradient id="vHafen" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#0e1e30" />
          <stop offset="100%" stopColor="#081218" />
        </radialGradient>
        <radialGradient id="vHuegel" cx="50%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#1c1a0a" />
          <stop offset="100%" stopColor="#100e06" />
        </radialGradient>
        {/* Stone texture pattern */}
        <pattern id="vStone" x="0" y="0" width="20" height="12" patternUnits="userSpaceOnUse">
          <rect width="20" height="12" fill="none" />
          <rect x="0" y="0" width="19" height="5.5" fill="none" stroke="#1c1608" strokeWidth="0.4" opacity="0.5" />
          <rect x="10" y="6" width="19" height="5.5" fill="none" stroke="#1c1608" strokeWidth="0.4" opacity="0.5" />
        </pattern>
        {/* Marker glow */}
        <filter id="vMarkerGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Base background ── */}
      <rect width="520" height="400" fill="url(#vBg)" />
      <rect width="520" height="400" fill="url(#vGlow)" />

      {/* ── Parchment texture overlay ── */}
      <rect width="520" height="400" fill="url(#vStone)" opacity="0.25" />

      {/* ── Ornate border ── */}
      <rect x="6" y="6" width="508" height="388" fill="none" stroke="#7a5828" strokeWidth="2" rx="2" />
      <rect x="10" y="10" width="500" height="380" fill="none" stroke="#4a3418" strokeWidth="1" rx="1" />
      <rect x="12" y="12" width="496" height="376" fill="none" stroke="#3a2810" strokeWidth="0.5" rx="1" />
      {/* Corner ornaments */}
      {[[14,14],[506,14],[14,386],[506,386]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="#1a1208" stroke="#7a5828" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="2" fill="#c8a84b" opacity="0.6" />
        </g>
      ))}

      {/* ── Map title ── */}
      <text x="260" y="28" textAnchor="middle" fill="#c8a84b" fontSize="15" fontWeight="bold"
        letterSpacing="4" filter="url(#vSoftGlow)" fontFamily="serif">VELMOOR</text>
      <text x="260" y="40" textAnchor="middle" fill="#7a5828" fontSize="7.5" letterSpacing="3"
        fontFamily="serif">HANDELSSTADT AM VELMAAR</text>
      {/* Title underline */}
      <line x1="175" y1="44" x2="345" y2="44" stroke="#4a3418" strokeWidth="0.8" />
      <line x1="185" y1="46" x2="335" y2="46" stroke="#3a2810" strokeWidth="0.4" />

      {/* ── Terrain base (grassy fields) ── */}
      <ellipse cx="250" cy="200" rx="220" ry="165" fill="#111008" opacity="0.6" />

      {/* ── River Velmaar ── */}
      {/* Shadow/depth */}
      <path d="M 438 14 C 428 50 448 90 433 145 C 418 200 438 235 422 290 C 406 345 395 368 374 398"
        fill="none" stroke="#0a1e30" strokeWidth="30" strokeLinecap="round" />
      {/* Main river body */}
      <path d="M 438 14 C 428 50 448 90 433 145 C 418 200 438 235 422 290 C 406 345 395 368 374 398"
        fill="none" stroke="url(#vRiver)" strokeWidth="20" strokeLinecap="round" />
      {/* River highlight/shimmer */}
      <path d="M 435 14 C 425 50 445 90 430 145 C 415 200 435 235 419 290 C 403 345 392 368 371 398"
        fill="none" stroke="#2a6890" strokeWidth="7" strokeLinecap="round" opacity="0.5" />
      <path d="M 432 14 C 422 50 442 90 427 145 C 412 200 432 235 416 290"
        fill="none" stroke="#3a7aa0" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      {/* River label */}
      <text x="455" y="165" fill="#2a5878" fontSize="8.5" fontStyle="italic" fontFamily="serif"
        transform="rotate(14,455,165)">Velmaar</text>

      {/* ── City wall ── */}
      <path d="M 108 108 C 85 138 80 182 85 225 C 90 268 108 298 148 318 C 182 336 235 344 285 338
               C 335 332 375 312 390 276 C 405 240 395 194 380 162 C 362 128 322 106 282 98
               C 242 90 192 88 152 94 Z"
        fill="none" stroke="#6a4a20" strokeWidth="2.5" strokeDasharray="10,6" opacity="0.55" />
      {/* Wall towers */}
      {[
        [108,108],[160,92],[238,90],[320,104],[388,162],[393,240],[374,310],[285,338],[185,342],[110,300],[82,220]
      ].map(([x,y],i) => (
        <rect key={i} x={x-4} y={y-4} width="8" height="8" fill="#1e1608" stroke="#6a4a20" strokeWidth="1.2"
          transform={`rotate(45,${x},${y})`} opacity="0.7" />
      ))}

      {/* ── Hügelweg & Tower Hill ── */}
      {/* Hill shape */}
      <ellipse cx="104" cy="82" rx="68" ry="45" fill="#181508" stroke="#2e2412" strokeWidth="1.5" />
      {/* Hill shading lines */}
      {[0,1,2,3].map(i => (
        <path key={i} d={`M ${58+i*12} ${100+i*2} Q 104 ${62-i*4} ${150-i*12} ${100+i*2}`}
          fill="none" stroke="#24190a" strokeWidth="1.2" opacity={0.35 - i*0.05} />
      ))}
      {/* Road from town to tower */}
      <path d="M 104 104 Q 132 132 162 160"
        fill="none" stroke="#3a2c12" strokeWidth="6" strokeLinecap="round" />
      <path d="M 104 104 Q 132 132 162 160"
        fill="none" stroke="#4a3c1c" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,4" />

      {/* Tower structure */}
      {/* Tower base */}
      <rect x="86" y="70" width="38" height="44" fill="#161208" stroke="#8b6a14" strokeWidth="2" />
      {/* Tower brick texture */}
      {[72,82,92].map(y => [87,95,103,115].map(x => (
        <rect key={`${x}-${y}`} x={x} y={y} width="7" height="9"
          fill="none" stroke="#2a2010" strokeWidth="0.4" opacity="0.5" />
      )))}
      {/* Battlement */}
      <rect x="82" y="62" width="46" height="10" fill="#1e1a0c" stroke="#8b6a14" strokeWidth="1.5" />
      {[83,89,95,101,107,113,119].map(x => (
        <rect key={x} x={x} y="54" width="5" height="9" fill="#1e1a0c" stroke="#8b6a14" strokeWidth="1" />
      ))}
      {/* Tower windows — glowing */}
      <rect x="97" y="76" width="8" height="12" fill="#c8a84b" opacity="0.15" stroke="#6a5010" strokeWidth="1" rx="0" />
      <rect x="97" y="76" width="8" height="6" fill="#c8a84b" opacity="0.25" />
      <path d="M 97 76 Q 101 73 105 76" fill="#1a1408" stroke="#6a5010" strokeWidth="0.8" />
      <rect x="97" y="94" width="8" height="10" fill="#c8a84b" opacity="0.2" stroke="#6a5010" strokeWidth="1" rx="0" />
      <path d="M 97 94 Q 101 91 105 94" fill="#1a1408" stroke="#6a5010" strokeWidth="0.8" />
      {/* Tower pointed roof */}
      <polygon points="101,46 80,64 122,64" fill="#201a08" stroke="#8b6a14" strokeWidth="1.5" />
      {/* Tower glow */}
      <rect x="86" y="54" width="38" height="60" fill="none" stroke="#c8a84b" strokeWidth="1"
        opacity="0.2" filter="url(#vSoftGlow)" />
      {/* Tower labels */}
      <text x="104" y="122" textAnchor="middle" fill="#c8a84b" fontSize="8.5" fontWeight="bold"
        fontFamily="serif" filter="url(#vSoftGlow)">TURM</text>
      <text x="104" y="133" textAnchor="middle" fill="#7a5828" fontSize="6.5"
        fontFamily="serif">Aldric Vorns</text>

      {/* ── Altstadt (Old Town) ── */}
      <polygon points="158,150 232,140 285,148 295,205 278,256 232,270 178,262 150,215"
        fill="url(#vAltstadt)" stroke="#7a5028" strokeWidth="2" />
      {/* Interior texture */}
      {[[162,154],[178,154],[194,154],[210,154],[226,154],[242,154],[258,154],[270,160],
         [164,166],[180,166],[196,166],[212,166],[228,166],[244,166],[260,166],
         [166,178],[182,178],[198,178],[214,178],[230,178],[246,178],[258,178],
         [168,190],[184,190],[200,190],[216,190],[232,190],[248,190],
         [170,202],[186,202],[202,202],[218,202],[234,202],[250,202],
         [172,214],[188,214],[204,214],[220,214],[236,214],
         [174,226],[190,226],[206,226],[222,226],[238,226]
      ].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="10" height="8" fill="#1a1208" stroke="#2a1e0e"
          strokeWidth="0.4" opacity="0.6" rx="0.5" />
      ))}

      {/* Marktplatz */}
      <circle cx="218" cy="200" r="22" fill="#1c1508" stroke="#5a3e18" strokeWidth="1.5" />
      <circle cx="218" cy="200" r="14" fill="#201808" stroke="#4a3414" strokeWidth="1" />
      <circle cx="218" cy="200" r="6" fill="#281e0c" stroke="#3a2c10" strokeWidth="0.8" />
      {/* Market stalls */}
      {[0,45,90,135,180,225,270,315].map((deg,i) => {
        const a = deg * Math.PI / 180
        const x = 218 + Math.cos(a) * 17
        const y = 200 + Math.sin(a) * 17
        return (
          <g key={i} transform={`rotate(${deg},${x},${y})`}>
            <rect x={x-4} y={y-3} width="8" height="6" fill="#2a1e0a" stroke="#6a4818" strokeWidth="0.8" />
            <line x1={x-4} y1={y-3} x2={x+4} y2={y-3} stroke="#4a3010" strokeWidth="0.5" />
          </g>
        )
      })}

      {/* Rathaus */}
      <rect x="188" y="154" width="38" height="30" fill="#1e1408" stroke="#9a7220" strokeWidth="1.8" />
      <polygon points="188,154 207,140 226,154" fill="#271c0c" stroke="#9a7220" strokeWidth="1.5" />
      <rect x="200" y="161" width="9" height="16" fill="#0e0c06" stroke="#6a5010" strokeWidth="1" />
      <rect x="191" y="158" width="6" height="5" fill="#0e0c06" stroke="#5a4010" strokeWidth="0.8" />
      <rect x="221" y="158" width="6" height="5" fill="#0e0c06" stroke="#5a4010" strokeWidth="0.8" />
      <circle cx="207" cy="139" r="2.5" fill="#c8a84b" opacity="0.5" />

      {/* Kirche */}
      <rect x="242" y="162" width="26" height="24" fill="#1a1208" stroke="#5a4018" strokeWidth="1.5" />
      <polygon points="242,162 255,148 268,162" fill="#201808" stroke="#5a4018" strokeWidth="1.5" />
      <line x1="255" y1="143" x2="255" y2="136" stroke="#6a4a18" strokeWidth="2" />
      <line x1="251" y1="139" x2="259" y2="139" stroke="#6a4a18" strokeWidth="1.5" />
      <rect x="250" y="169" width="8" height="12" fill="#0e0c06" stroke="#4a3818" strokeWidth="0.8" rx="4 4 0 0" />

      {/* District label */}
      <text x="218" y="244" textAnchor="middle" fill="#c8a04a" fontSize="9" fontWeight="bold"
        fontFamily="serif" filter="url(#vSoftGlow)">ALTSTADT</text>
      <text x="218" y="256" textAnchor="middle" fill="#5a4028" fontSize="6.5"
        fontFamily="serif">Rathaus · Markt · Kirche</text>

      {/* ── Händlerviertel ── */}
      <polygon points="290,146 362,150 375,196 362,237 298,244 284,202"
        fill="#1c1508" stroke="#5a3c18" strokeWidth="2" />
      {/* Shops grid */}
      {[
        [296,158],[314,158],[332,158],[350,158],[358,164],
        [296,176],[314,176],[332,176],[350,176],
        [296,194],[314,194],[332,194],[350,194],
        [298,210],[316,210],[334,210]
      ].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="14" height="13" fill="#181208" stroke="#3a2c10" strokeWidth="0.7" rx="1" />
          <line x1={x} y1={y+4} x2={x+14} y2={y+4} stroke="#4a3010" strokeWidth="0.5" opacity="0.7" />
        </g>
      ))}
      <text x="330" y="228" textAnchor="middle" fill="#8a6830" fontSize="8.5" fontWeight="bold"
        fontFamily="serif">HÄNDLERVIERTEL</text>

      {/* ── Hafenviertel ── */}
      <polygon points="362,110 420,115 433,152 425,180 372,183 355,155"
        fill="url(#vHafen)" stroke="#2a4870" strokeWidth="2" />
      {/* Dock */}
      <rect x="398" y="150" width="28" height="8" fill="#162038" stroke="#2a4868" strokeWidth="1.5" />
      {[400,407,414,421].map(x => (
        <line key={x} x1={x} y1="158" x2={x} y2="168" stroke="#1a2840" strokeWidth="1.5" />
      ))}
      {/* Water ripples */}
      {[0,1,2].map(i => (
        <ellipse key={i} cx={396+i*8} cy={172+i*2} rx={4+i*2} ry={1.5} fill="none"
          stroke="#2a4868" strokeWidth="0.7" opacity={0.5-i*0.1} />
      ))}
      {/* Boats */}
      <path d="M 362 172 Q 372 178 382 172 L 382 165 Q 372 162 362 165 Z"
        fill="#122030" stroke="#2a4868" strokeWidth="1.5" />
      <line x1="372" y1="162" x2="372" y2="150" stroke="#2a3a50" strokeWidth="1.5" />
      <path d="M 372 150 L 380 157" fill="none" stroke="#1a2840" strokeWidth="0.8" />
      <path d="M 400 175 Q 408 180 416 175 L 416 169 Q 408 166 400 169 Z"
        fill="#122030" stroke="#2a4868" strokeWidth="1.5" />
      <line x1="408" y1="169" x2="408" y2="156" stroke="#2a3a50" strokeWidth="1.5" />
      <text x="388" y="136" textAnchor="middle" fill="#4a7898" fontSize="8.5" fontWeight="bold"
        fontFamily="serif">HAFENVIERTEL</text>

      {/* ── Außenbezirk ── */}
      <polygon points="158,265 234,272 284,265 282,320 248,342 202,346 166,334 150,306"
        fill="#161410" stroke="#3a3018" strokeWidth="2" />
      {/* Poorer houses */}
      {[
        [162,278],[178,278],[194,278],[210,278],[226,278],[242,278],
        [162,296],[178,296],[194,296],[210,296],[226,296],
        [165,312],[180,312],[196,312],[212,312],
        [168,326],[182,326]
      ].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="11" height="11" fill="#121008" stroke="#2a2816"
          strokeWidth="0.5" rx="0.5" />
      ))}
      {/* Healer cross */}
      <rect x="248" y="295" width="26" height="24" fill="#0e120e" stroke="#3a5030" strokeWidth="1.5" rx="2" />
      <line x1="261" y1="299" x2="261" y2="315" stroke="#4a7840" strokeWidth="2.5" />
      <line x1="254" y1="307" x2="268" y2="307" stroke="#4a7840" strokeWidth="2.5" />
      <text x="261" y="327" textAnchor="middle" fill="#4a6030" fontSize="6" fontFamily="serif">Heiler</text>
      <text x="205" y="330" textAnchor="middle" fill="#5a5030" fontSize="8.5" fontWeight="bold"
        fontFamily="serif">AUSSENBEZIRK</text>

      {/* ── Streets between districts ── */}
      <path d="M 285 195 Q 292 192 295 192" stroke="#2e2410" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 220 262 Q 220 265 220 268" stroke="#2e2410" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 358 166 Q 365 166 370 166" stroke="#2e2410" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 355 150 Q 362 150 366 150" stroke="#2e2410" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* ── Compass Rose ── */}
      <g transform="translate(468,350)">
        <circle r="22" fill="#0e0c08" stroke="#6a4a1a" strokeWidth="1.5" />
        <circle r="18" fill="none" stroke="#3a2a10" strokeWidth="0.5" />
        {/* N/S/E/W points */}
        <polygon points="0,-16 4,-6 -4,-6" fill="#c8a84b" filter="url(#vSoftGlow)" />
        <polygon points="0,16 4,6 -4,6" fill="#4a3818" />
        <polygon points="-16,0 -6,-4 -6,4" fill="#4a3818" />
        <polygon points="16,0 6,-4 6,4" fill="#4a3818" />
        {/* Diagonal points */}
        <polygon points="0,-16 2,-10 0,-8 -2,-10" fill="#7a5828" transform="rotate(45)" />
        <polygon points="0,-16 2,-10 0,-8 -2,-10" fill="#7a5828" transform="rotate(135)" />
        <polygon points="0,-16 2,-10 0,-8 -2,-10" fill="#7a5828" transform="rotate(225)" />
        <polygon points="0,-16 2,-10 0,-8 -2,-10" fill="#7a5828" transform="rotate(315)" />
        {/* Center */}
        <circle r="3" fill="#c8a84b" opacity="0.7" />
        <circle r="1.2" fill="#fff" opacity="0.5" />
        {/* Labels */}
        <text y="-19" textAnchor="middle" fill="#c8a84b" fontSize="8" fontWeight="bold" fontFamily="serif">N</text>
        <text y="26" textAnchor="middle" fill="#6a4a1a" fontSize="7" fontFamily="serif">S</text>
        <text x="21" y="3" textAnchor="middle" fill="#6a4a1a" fontSize="7" fontFamily="serif">O</text>
        <text x="-21" y="3" textAnchor="middle" fill="#6a4a1a" fontSize="7" fontFamily="serif">W</text>
      </g>

      {/* ── Legend ornament ── */}
      <rect x="18" y="352" width="120" height="36" fill="#0c0a06" stroke="#4a3418" strokeWidth="1" rx="2" opacity="0.85" />
      <text x="78" y="365" textAnchor="middle" fill="#7a5828" fontSize="7" fontWeight="bold" fontFamily="serif">LEGENDE</text>
      <rect x="24" y="370" width="7" height="7" fill="#1c1408" stroke="#8b6a14" strokeWidth="1" />
      <text x="36" y="378" fill="#6a5028" fontSize="6.5" fontFamily="serif">Gebäude</text>
      <rect x="68" y="370" width="14" height="3" fill="none" stroke="#6a4a20" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x="88" y="378" fill="#6a5028" fontSize="6.5" fontFamily="serif">Stadtmauer</text>

      {/* ── Marker ── */}
      {marker && <VelmoorMarker label={marker.label} />}
    </svg>
  )
}

function VelmoorMarker({ label, cx = 104, cy = 80 }) {
  return (
    <g filter="url(#vMarkerGlow)">
      <circle cx={cx} cy={cy} r="20" fill="none" stroke="#4a90d0" strokeWidth="1.5" opacity="0.2">
        <animate attributeName="r" values="12;22;12" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r="9" fill="#1a3a6a" stroke="#4a90d0" strokeWidth="1.5" opacity="0.95" />
      <circle cx={cx} cy={cy} r="4" fill="#6aabff" />
      <circle cx={cx-2} cy={cy-2} r="1.5" fill="#fff" opacity="0.7" />
      {/* Label box */}
      <rect x={cx - 38} y={cy - 34} width="76" height="18" fill="#0e1a2e" stroke="#4a90d0"
        strokeWidth="1.2" rx="4" opacity="0.95" />
      <text x={cx} y={cy - 22} textAnchor="middle" fill="#90c8ff" fontSize="8.5"
        fontWeight="bold" fontFamily="serif">{label}</text>
    </g>
  )
}
