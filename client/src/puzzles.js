// Client-seitige Rätsel-Metadaten (nur Anzeige).
// Die maßgebliche Logik/Lösung liegt im Server (server/index.js → PUZZLES);
// hier gespiegelt für die Spieler-UI und die DM-Fortschritts-Übersicht.

export const SEASONS = [
  { id: 'winter',    sym: '❄', label: 'Winter'   },
  { id: 'fruehling', sym: '🌸', label: 'Frühling' },
  { id: 'herbst',    sym: '🍂', label: 'Herbst'   },
  { id: 'sommer',    sym: '☀', label: 'Sommer'   },
]

export const SEASON_BY_ID = Object.fromEntries(SEASONS.map(s => [s.id, s]))

// Alle interaktiven Rätsel der Kampagne (aktuell eines).
export const PUZZLES = [
  {
    id: 'floor-keller',
    label: 'Versiegelte Pforte',
    floorLabel: 'Keller',
    options: SEASONS,                                   // Anzeige-Reihenfolge der Symbole
    solution: ['winter', 'fruehling', 'sommer', 'herbst'], // gespiegelt aus dem Server
  },
]
