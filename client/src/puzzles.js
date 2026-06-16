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

// Zutaten fürs Labor-Mischrätsel (mit Decoys).
export const INGREDIENTS = [
  { id: 'kristallstaub', label: 'Kristallstaub', color: '#bcd0ee' },
  { id: 'nebelsuppe',    label: 'Nebelsuppe',    color: '#9aa6ae' },
  { id: 'aschewurz',     label: 'Aschewurz',     color: '#7a5a3c' },
  { id: 'mondtau',       label: 'Mondtau',       color: '#6fcfc0' },
  { id: 'drachengalle',  label: 'Drachengalle',  color: '#86b840' },
]

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
    answer: 'Das Binden des Aegis',
  },
  {
    id: 'floor-2', floorId: 'floor-2', type: 'mix',
    label: 'Die Gedächtnis-Essenz', floorLabel: 'Labor',
    options: INGREDIENTS,
    solution: ['kristallstaub', 'nebelsuppe', 'kristallstaub'],
  },
]

export const PUZZLE_BY_FLOOR = Object.fromEntries(PUZZLES.map(p => [p.floorId, p]))
export const PUZZLE_BY_ID    = Object.fromEntries(PUZZLES.map(p => [p.id, p]))
