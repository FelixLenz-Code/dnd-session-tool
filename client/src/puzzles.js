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

// Spiegel der Spiegelkammer. Sieben zeigen Trug, Nr. 7 zeigt den Mord.
export const MIRRORS = [
  { id: 'spiegel-1', label: 'Spiegel 1', reflection: 'Der Raum, wie er jetzt ist – staubig und leer. Euer Atem dampft im kalten Glas.' },
  { id: 'spiegel-2', label: 'Spiegel 2', reflection: 'Eure eigenen Gesichter, doch um Jahre gealtert und müde.' },
  { id: 'spiegel-3', label: 'Spiegel 3', reflection: 'Ein sonniger Garten – und mittendrin steht ihr selbst, lachend. Ein Wunsch, kein Gestern.' },
  { id: 'spiegel-4', label: 'Spiegel 4', reflection: 'Der Turm von außen, schwarze Wolken ziehen auf. Etwas, das erst kommen wird.' },
  { id: 'spiegel-5', label: 'Spiegel 5', reflection: 'Euer Spiegelbild – doch die Augen darin gehören jemand anderem.' },
  { id: 'spiegel-6', label: 'Spiegel 6', reflection: 'Nur Schwärze, in der ein blauer Funke aufglüht und wieder erlischt.' },
  { id: 'spiegel-7', label: 'Spiegel 7', reflection: 'Dieser Raum – vor Jahren. Aldric Vorn kniet, alt und gebeugt. Hinter ihm tritt eine Gestalt aus dem Schatten, die Hand erhoben. Ihr seht den Tag des Mordes.' },
  { id: 'spiegel-8', label: 'Spiegel 8', reflection: 'Euer Spiegelbild blinzelt – einen Lidschlag zu spät.' },
]

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
  {
    id: 'floor-3', floorId: 'floor-3', type: 'choice',
    label: 'Der wahre Spiegel', floorLabel: 'Spiegelkammer',
    prompt: 'Wähle den Spiegel, der die Wahrheit zeigt.',
    options: MIRRORS,
    solution: ['spiegel-7'],
  },
]

export const PUZZLE_BY_FLOOR = Object.fromEntries(PUZZLES.map(p => [p.floorId, p]))
export const PUZZLE_BY_ID    = Object.fromEntries(PUZZLES.map(p => [p.id, p]))
