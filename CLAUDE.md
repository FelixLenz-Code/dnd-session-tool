# CLAUDE.md – DnD Session Tool ("Turm des Magiers")

Stand: v0.16.0. Web-Tool, mit dem ein DM eine Rätsel-Oneshot leitet. **Zwei-iPad-Modell**:
ein **DM-Gerät** (Steuerkonsole) und ein **geteiltes Spieler-Display** (den Spielern zugewandt).
Der DM bespielt das Display über eine zentrale **Bühne** (`stage`). Echtzeit über Socket.io.

## Stack & Struktur
- **Monorepo** (npm workspaces) unter `app/`. Git-Root ist `app/`.
- **client/** – React 18 + Vite. Wird statisch vom Server ausgeliefert (`client/dist`).
- **server/** – Node + Express + Socket.io (`server/index.js`, Session in `server/session.js`).
- **adventures/** – Adventure-Inhalt als JSON (`turm-des-magiers.json`).

### Wichtige Dateien
- `server/index.js` – Socket-Events, `PUZZLES`-Definitionen (Lösungen!), Bild-Upload (`/api/dm/image`, `/api/image/:id`, `imageStore`), Auto-Load des Adventures, statisches Ausliefern von `client/dist`.
- `server/session.js` – `createSession()` inkl. `stage`, `displaySocketId`, `images`.
- `client/src/context/GameContext.jsx` – globaler State + `actions` (Socket-Emits). `useGame()`. Rollen: `dm` und `display`.
- `client/src/puzzles.js` – **gemeinsame Rätsel-Metadaten** (Display-UI + DM-Übersicht). Spiegelt die Server-Lösungen.
- `client/src/views/DMView.jsx` – DM-Ansicht, Tabs: **Leitung** (Masonry: Übersicht/Ereignisse/Nachrichten/Timer), **Anzeige** (Bühnensteuerung), **Finale** (nur wenn Adventure einen `konfrontation`-Floor hat), **Adventure**.
- `client/src/components/dm/ConfrontationPanel.jsx` – dediziertes Finale-Panel: Mira-Events nach Phase gruppiert (Label-Präfix `P1`–`P4`), jede Zeile lesbar + „Aufs Display"; 4 Ende-Buttons (`ende-*`).
- `client/src/views/DisplayView.jsx` – das geteilte Spieler-Display. Rendert nur die aktuelle **Bühne** (`stage.mode`): `cover` / `puzzle` / `narration` / `crystals` / `image`. Timer-Band oben.
- `client/src/components/dm/StagePanel.jsx` – DM steuert die Bühne (Titelbild/Rätsel/Galerie) + **Bild-Manager** (Upload/URL, Session-Galerie). Zeigt Display-Status + Session-Code.
- `client/src/components/display/CrystalGallery.jsx` – Kristall-Galerie (Etage 4), alle `adventure.crystals` als anklickbare Kacheln.
- `client/src/components/player/PuzzleView.jsx` – **Dispatcher** für das interaktive Element der aktuellen Etage (wird vom Display genutzt; tippt → `display:interact`).
- `client/src/components/player/TimerBanner.jsx` – Timer-Band (Display).
- `client/src/components/dm/Dashboard.jsx` – Fortschritt (Etagen freischalten/sperren), **Rätsel-Fortschritt** (Lösungs-Info + Zurücksetzen), Display-Status.
- `client/src/components/dm/EventPanel.jsx` – Ereignisse der aktuellen Etage (+ „Allgemein"), Option **„groß aufs Display"**.
- `client/src/components/dm/MessageComposer.jsx` – Nachricht an die Gruppe; Knöpfe „In den Verlauf" / „Aufs Display".
- `client/src/components/dm/AdventurePanel.jsx` – Adventure laden/wechseln + Etagen-Übersicht.

## Wie laufen lassen
- Dev: `npm run dev` (root) – startet Server + Vite.
- Prod-artig: `npm run build` (baut `client/dist`) → `npm start` (Server auf **Port 3001**, liefert `dist`).
- Der Server **lädt `adventures/turm-des-magiers.json` beim Start automatisch** (DM kann im Adventure-Tab überschreiben). JSON-Änderung → Server neu starten.
- DM-Login Passwort kommt aus `adventure.dmPassword` (Turm des Magiers: `aldric`; Fallback `dm`).
- **Spieler-Display** verbindet sich mit dem 4-Zeichen **Session-Code** (`session.code`, im DM-Tab „Anzeige" sichtbar). Nur **ein** Display pro Session.
- Nach Client-Build im Browser **Strg+Shift+R** (Hash-Bundles, sonst alter Tab-Stand).

## Zwei-iPad-Modell & Bühne (wichtig)
- Rollen: `dm` (Steuerung) und `display` (geteilter Bildschirm). Kein Pro-Spieler-Account mehr.
- Zentral: `session.stage = { mode, payload }`. DM schaltet via `dm:set_stage`; Server broadcastet `stage_update`. Modi: `cover`, `puzzle`, `narration`, `crystals`, `questions` (Aldrics Fragen), `image`.
- Rätsel sind **gemischt**: am Display tippbar (`display:interact` → Server-Validierung wie früher). Beim Lösen setzt der Server die Bühne automatisch auf `narration` mit der Erfolgs-Nachricht.
- Nachrichten/Ereignisse gehen an **alle** (ein Display); `showOnStage`-Flag zeigt den Text zusätzlich groß (`narration`).
- **Bilder/Karten**: DM lädt ein Bild hoch (`POST /api/dm/image`, data-URL) oder gibt eine URL an. Rohdaten in `imageStore` (Speicher), Metadaten in `session.images` (broadcast `images_update`), Anzeige über `/api/image/:id`. Bühne `image` mit `payload.url`.
- **Gruppen-Funde**: geteilte Fund-Leiste, dauerhaft unten am Display (`FindsBar` in `DisplayView`). DM blendet ein/aus via `dm:add_find`/`dm:remove_find` (`session.finds`, broadcast `finds_update`). Schnell-Auswahl aus `adventure.items` (kuratierte Liste) oder Freitext im `FindsManager` (StagePanel).
- **Sound-Events**: DM lädt eigene **Sounddateien hoch** und benennt sie (`POST /api/dm/sound`, data-URL → `soundStore`, Metadaten `session.sounds`, broadcast `sounds_update`, Auslieferung `/api/sound/:id`). `SoundManager` (StagePanel): Upload + Liste mit Abspielen/Umbenennen (`dm:rename_sound`)/Entfernen (`dm:remove_sound`). `dm:play_sound {id}` → Server sendet `play_sound {url}` **nur ans Display**. `client/src/sounds.js` dekodiert+spielt die URL (Web Audio); `unlockAudio()` für iOS-Freigabe beim Join + erster Berührung.

## Rätsel-Architektur (wichtig)
Jede Etage hat ihr **interaktives Element**, gesteuert über `currentFloor`. Auf dem Display
erscheint es, wenn der DM die Bühne `puzzle` schaltet; die Gruppe tippt direkt.

- `client/src/puzzles.js` → `PUZZLES[]` mit `id` (= mapId/Server-Schlüssel), `floorId`, `type`, plus Anzeige-Daten. `PUZZLE_BY_FLOOR` / `PUZZLE_BY_ID`.
- **Rätseltypen** (client `type` steuert UI, server `type` steuert Validierung – unabhängig):
  - `sequence` – Symbole in Reihenfolge anklicken (Keller: Jahreszeiten).
  - `password` – Wort eingeben (Bibliothek: Buchtitel). Server: `answers[]` normalisiert (lowercase/trim).
  - `mix` – Zutaten per Drag (Maus+Touch) in den Kessel ziehen, Reihenfolge zählt (Labor). Server prüft als `sequence`.
  - `choice` – aus mehreren Optionen die richtige wählen (Spiegelkammer: Spiegel 7). Server prüft als `sequence` der Länge 1; falsche Picks zeigen harmlose Bilder.
- Server `PUZZLES[mapId]`: `{ type, solution|answers, reward, successMessage }`. Lösen → `reward`-Etage freischalten + `currentFloor` setzen + Erfolgs-Nachricht in den Feed.
- Wichtige Konvention: Keller hat mapId **`floor-keller`** (floorId `keller`); andere Etagen mapId == floorId.
- DM-Übersicht (`Dashboard`) rendert geordnete Rätsel (sequence/mix) als Schritt-Chips (Symbol oder Farbpunkt aus `pz.options`), Passwort als Status. **Info-Button (i)** blendet die Lösung ein.

## Story / Verzweigungen
- Story läuft über `events[]` im Adventure-JSON: `{ id, label, floorId, type, message }`. Typen: `narrative|vision|secret|event|reward` (farbcodiert).
- Der DM löst Events situativ aus (an die Gruppe; optional zusätzlich groß aufs Display). „Ausführlich mit Verzweigungen" = mehrere Events pro Etage (Ankunft, Hinweise/Geheimnisse, Fehlversuch-Reaktion, optionale Funde).

## Fortschritt Etage für Etage
Geschichte: Mordfall um Magier **Aldric Vorn**; seine Ex-Schülerin **Mira Vael** wollte den **Aegisstein**. Aufstieg Etage für Etage, Hinweise → Kristall-Erinnerungen → Konfrontation.

- ✅ **Keller** – Jahreszeiten-Sequenz (Winter→Frühling→Sommer→Herbst). Events ausgebaut.
- ✅ **Etage 1 – Bibliothek** – Passwort: Buchtitel **„Das Binden des Aegis"** (auch „Aegis"). Events: Ankunft/Bann, Lücke, Zettelkasten (Titel), Ausleih-Buch (Spur „M. V."), Fehlversuch.
- ✅ **Etage 2 – Labor** – Mix: **Kristallstaub → Nebelsuppe → Kristallstaub** (Decoys: Aschewurz, Mondtau, Drachengalle). Events: Ankunft, Rezept-Notiz, Tische, Fehlversuch.
- ✅ **Etage 3 – Spiegelkammer** – `choice`: den wahren Spiegel (Nr. 7) wählen, der den Mord zeigt. Events: Ankunft, Inschrift-Hinweis (»Einer zeigt, was war«), Vision.
- ✅ **Etage 4 – Archiv der Stimmen** – 8 Kristalle = 8 Erinnerungen als **Galerie** auf dem Display (`CrystalGallery`); die Gruppe tippt sich durch. DM schaltet Bühne `crystals`.
- ✅ **Etage 5 – Sanctum** – Aegisstein-Fund + Aldrics Aufzeichnung. Bühne `questions` (`AldricQuestions`, aus `adventure.aldricQuestions`); reines Roleplay. Events: `aldric-erwacht`, `aldric-fragen`, `aegisstein-erhalten`.
- ✅ **Finale – Konfrontation mit Mira** (Floor `konfrontation`) – kein Rätsel, reines Roleplay als Events: Phasen P1–P4 (`konf-*`) + 4 Enden (`ende-1…4`, type `reward`). Eigenes **Finale-Tab** (`ConfrontationPanel`) gruppiert sie nach Phase; DM liest vor / zeigt sie groß. Vorlage: `konfrontation_mira.md`.

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
Alle Etagen + Finale + Gruppen-Funde + Sound-Upload sind da. Mögliche Ausbauten:
- Karten-/Bild-Material für das Adventure hinterlegen (Velmoor-Stadtplan etc.) statt nur Upload.
- Timer prominenter/auffälliger aufs Display.
- Sound an Ereignisse koppeln (Event löst optional einen hochgeladenen Ton mit aus).
