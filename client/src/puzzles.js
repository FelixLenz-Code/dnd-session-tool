// Client-seitige Rätsel-Metadaten (nur Anzeige & Steuerung).
// Die maßgebliche Logik/Lösung liegt im Server (server/index.js → PUZZLES);
// hier gespiegelt für die Spieler-UI und die DM-Fortschritts-Übersicht.

export const SEASONS = [
  { id: 'winter',    sym: '❄', label: 'Winter'   },
  { id: 'fruehling', sym: '🌸', label: 'Frühling' },
  { id: 'herbst',    sym: '🍂', label: 'Herbst'   },
  { id: 'sommer',    sym: '☀', label: 'Sommer'   },
]
export const SEASON_BY_ID = Object.fromEntries(SEASONS.map(s => [s.id, s]))

// Alle interaktiven Rätsel der Kampagne.
// id          = mapId für interactMap / Server-Schlüssel (Keller hat historisch 'floor-keller')
// floorId     = Etage, auf der das Rätsel aktiv ist (steuert Sichtbarkeit des Tabs)
// type        = 'sequence' (Symbole in Reihenfolge) | 'password' (Wort eingeben)
export const PUZZLES = [
  {
    id: 'floor-keller', floorId: 'keller', type: 'sequence',
    label: 'Versiegelte Pforte', floorLabel: 'Keller',
    options: SEASONS,
    solution: ['winter', 'fruehling', 'sommer', 'herbst'],
  },
  {
    id: 'floor-1', floorId: 'floor-1', type: 'password',
    label: 'Der Bann über der Treppe', floorLabel: 'Bibliothek',
    prompt: 'Nenne das Buch, das hier fehlt.',
    placeholder: 'Titel des fehlenden Buches…',
  },
]

export const PUZZLE_BY_FLOOR = Object.fromEntries(PUZZLES.map(p => [p.floorId, p]))
export const PUZZLE_BY_ID    = Object.fromEntries(PUZZLES.map(p => [p.id, p]))
