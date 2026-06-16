# CLAUDE.md – DnD Session Tool ("Turm des Magiers")

Stand: v0.9.0. Web-Tool, mit dem ein DM eine Rätsel-Oneshot leitet und Spieler
(per Code) an ihren Geräten mitspielen. Echtzeit über Socket.io.

## Stack & Struktur
- **Monorepo** (npm workspaces) unter `app/`. Git-Root ist `app/`.
- **client/** – React 18 + Vite. Wird statisch vom Server ausgeliefert (`client/dist`).
- **server/** – Node + Express + Socket.io (`server/index.js`, Session in `server/session.js`).
- **adventures/** – Adventure-Inhalt als JSON (`turm-des-magiers.json`).

### Wichtige Dateien
- `server/index.js` – Socket-Events, `PUZZLES`-Definitionen (Lösungen!), Auto-Load des Adventures beim Start, statisches Ausliefern von `client/dist`.
- `server/session.js` – `createSession()` (Sessionstruktur).
- `client/src/context/GameContext.jsx` – globaler State + `actions` (Socket-Emits). `useGame()`.
- `client/src/puzzles.js` – **gemeinsame Rätsel-Metadaten** (Spieler-UI + DM-Übersicht). Spiegelt die Server-Lösungen.
- `client/src/views/DMView.jsx` – DM-Ansicht, Tabs: **Leitung** (mehrspaltiges Masonry: Übersicht/Ereignisse/Nachrichten/Timer), **Spieler**, **Adventure**.
- `client/src/views/PlayerView.jsx` – Spieler-Ansicht, Tabs: Feed, (Rätsel), (Kristall), Inventar. Dauerhafte Etagen-Fortschrittsleiste oben.
- `client/src/components/player/PuzzleView.jsx` – **Dispatcher** für das interaktive Element der aktuellen Etage.
- `client/src/components/dm/Dashboard.jsx` – Fortschritt (Etagen freischalten/sperren), **Rätsel-Fortschritt** (mit Lösungs-Info-Button + Zurücksetzen), verbundene Spieler.
- `client/src/components/dm/EventPanel.jsx` – Ereignisse, **nur die aktuelle Etage** (+ „Allgemein").
- `client/src/components/dm/AdventurePanel.jsx` – Adventure laden/wechseln + Etagen-Übersicht.

## Wie laufen lassen
- Dev: `npm run dev` (root) – startet Server + Vite.
- Prod-artig: `npm run build` (baut `client/dist`) → `npm start` (Server auf **Port 3001**, liefert `dist`).
- Der Server **lädt `adventures/turm-des-magiers.json` beim Start automatisch** (DM kann im Adventure-Tab überschreiben). JSON-Änderung → Server neu starten.
- DM-Login Passwort: `dm`. Spieler brauchen einen Code (DM-seitig sichtbar).
- Nach Client-Build im Browser **Strg+Shift+R** (Hash-Bundles, sonst alter Tab-Stand).

## Rätsel-Architektur (wichtig)
Karten wurden entfernt (v0.7.0). Jede Etage hat ihr **interaktives Element im „Rätsel"-Tab**, gesteuert über `currentFloor`.

- `client/src/puzzles.js` → `PUZZLES[]` mit `id` (= mapId/Server-Schlüssel), `floorId`, `type`, plus Anzeige-Daten. `PUZZLE_BY_FLOOR` / `PUZZLE_BY_ID`.
- **Rätseltypen** (client `type` steuert UI, server `type` steuert Validierung – unabhängig):
  - `sequence` – Symbole in Reihenfolge anklicken (Keller: Jahreszeiten).
  - `password` – Wort eingeben (Bibliothek: Buchtitel). Server: `answers[]` normalisiert (lowercase/trim).
  - `mix` – Zutaten per Drag (Maus+Touch) in den Kessel ziehen, Reihenfolge zählt (Labor). Server prüft als `sequence`.
- Server `PUZZLES[mapId]`: `{ type, solution|answers, reward, successMessage }`. Lösen → `reward`-Etage freischalten + `currentFloor` setzen + Erfolgs-Nachricht in den Feed.
- Wichtige Konvention: Keller hat mapId **`floor-keller`** (floorId `keller`); andere Etagen mapId == floorId.
- DM-Übersicht (`Dashboard`) rendert geordnete Rätsel (sequence/mix) als Schritt-Chips (Symbol oder Farbpunkt aus `pz.options`), Passwort als Status. **Info-Button (i)** blendet die Lösung ein.

## Story / Verzweigungen
- Story läuft über `events[]` im Adventure-JSON: `{ id, label, floorId, type, message }`. Typen: `narrative|vision|secret|event|reward` (farbcodiert).
- Der DM löst Events situativ aus (alle/einzelne Spieler). „Ausführlich mit Verzweigungen" = mehrere Events pro Etage (Ankunft, Hinweise/Geheimnisse, Fehlversuch-Reaktion, optionale Funde).

## Fortschritt Etage für Etage
Geschichte: Mordfall um Magier **Aldric Vorn**; seine Ex-Schülerin **Mira Vael** wollte den **Aegisstein**. Aufstieg Etage für Etage, Hinweise → Kristall-Erinnerungen → Konfrontation.

- ✅ **Keller** – Jahreszeiten-Sequenz (Winter→Frühling→Sommer→Herbst). Events ausgebaut.
- ✅ **Etage 1 – Bibliothek** – Passwort: Buchtitel **„Das Binden des Aegis"** (auch „Aegis"). Events: Ankunft/Bann, Lücke, Zettelkasten (Titel), Ausleih-Buch (Spur „M. V."), Fehlversuch.
- ✅ **Etage 2 – Labor** – Mix: **Kristallstaub → Nebelsuppe → Kristallstaub** (Decoys: Aschewurz, Mondtau, Drachengalle). Events: Ankunft, Rezept-Notiz, Tische, Fehlversuch.
- ⬜ **Etage 3 – Spiegelkammer** – Idee: richtigen Spiegel wählen (Nr. 7 zeigt den Mord, `spiegel7-vision`).
- 🟡 **Etage 4 – Archiv der Stimmen** – 8 Kristalle = 8 Erinnerungen. DM weist Kristalle zu (CrystalView, passive Anzeige). Interaktion ggf. ausbauen.
- ⬜ **Etage 5 – Sanctum** – Aegisstein, Mira-Konfrontation, `aldricQuestions`. Finale Entscheidung/Abstimmung.

## Arbeitsweise / Konventionen
- **Visuelle Verifikation vor dem Ausliefern.** Komponenten werden isoliert in echtem Chromium gerendert und per Screenshot geprüft (siehe unten). Iterieren bis es gut ist.
- **Release pro Schritt:** Commit auf `main` mit `vX.Y.Z:`-Message + passendem Git-Tag + GitHub-Release (`gh release create`). Versionsschema bisher: Feature/Etage → Minor, Politur/Fix → Patch.
- Commit-Messages enden mit `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`; Release-Bodies mit dem Claude-Code-Hinweis.
- `client/dist/` ist **gitignored** – Build läuft lokal/auf jeder Maschine.

### Headless-Screenshot-Rezept (Verifikation ohne Join-Flow)
Komponente isoliert bauen + rendern; `useGame` per Vite-Alias auf einen Mock biegen:
1. Mock `/tmp/mock/mockGame.jsx` exportiert `useGame()` (gibt `{state, actions}`) und Passthrough-`GameProvider`.
2. `client/verify.html` + `client/src/verify.jsx` rendern die Zielkomponente.
3. `client/vite.verify.config.mjs`: alias **beide** Pfade `../context/GameContext` und `../../context/GameContext` → Mock; `build.outDir=/tmp/vbuild`, `rollupOptions.input=verify.html`.
4. `npx vite build --config vite.verify.config.mjs`.
5. Server **aus `/tmp/vbuild`** starten: `cd /tmp/vbuild && python3 -m http.server 8099` (Stolperfalle: nicht aus `client/` servern – sonst Dev-`/src/verify.jsx`, MIME-Fehler, leere Seite).
6. Screenshot: `flatpak run --filesystem=/tmp/shots org.chromium.Chromium --headless=new --disable-gpu --no-sandbox --virtual-time-budget=5000 --screenshot=/tmp/shots/x.png http://localhost:8099/verify.html` (Flatpak-Chromium schreibt nur in via `--filesystem` freigegebene Hostpfade).
7. **Verify-Dateien danach wieder löschen** (`verify.html`, `src/verify.jsx`, `vite.verify.config.mjs`), damit `git status` sauber bleibt.

### Umgebung
- Render-Tools: `cairosvg` (Python), **Flatpak Chromium** (`org.chromium.Chromium`), ImageMagick (`convert`/`montage`). Kein Puppeteer/Playwright installiert.
- `pkill -f …` bricht hier teils die Shell ab (Exit 144) – stattdessen PID via `ss -ltnp | grep :PORT` ermitteln und gezielt `kill`.
- Server läuft als Hintergrund-Task; nach Code-Änderung an `server/` oder am Adventure-JSON **neu starten**. Client-Änderungen nur neu **bauen** (Server liefert `dist` von Platte).

## Nächster Schritt
Etage 3 – Spiegelkammer als nächstes (Spiegel-Auswahl-Rätsel), mit derselben Vorlage:
(1) Story-Events mit Verzweigungen → (2) interaktives Element im Rätsel-Tab + Server-Logik → (3) DM-Übersicht/Lösung.
