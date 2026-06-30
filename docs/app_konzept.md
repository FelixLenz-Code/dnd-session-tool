# PWA Konzept – Turm des Magiers

> Progressive Web App für DM und Spieler.
> Technologie-Empfehlung: React + Vite PWA, WebSockets für Echtzeit, lokaler Host im Heimnetz.
> Kein Cloud-Hosting nötig — DM läuft den Server vom Laptop, alle im gleichen WLAN.

> **Hinweis (nachträglich):** Dieses Dokument beschreibt das ursprüngliche Konzept mit
> mehreren Spieler-Handys. Die Umsetzung wurde inzwischen auf ein **Zwei-iPad-Modell**
> umgestellt (ein DM-Gerät + ein geteiltes Spieler-Display). Siehe `dnd-session-tool/CLAUDE.md`.

---

## Kernprinzip

Der DM hat eine **Steuerkonsole** (Tablet oder Laptop).
Jeder Spieler hat ein **Spieler-Interface** (Handy, Browser).
Verbindung läuft über einen einfachen Code (wie Kahoot) — kein Account nötig.

---

## DM-Interface

### Screen 1: Session Dashboard

```
┌─────────────────────────────────────────────────┐
│  VELMOOR – Session läuft   🟢  6/6 Spieler      │
│                                                   │
│  FORTSCHRITT                                      │
│  [✓] Keller    [✓] Bibliothek   [→] Labor        │
│  [ ] Spiegel   [ ] Archiv       [ ] Sanctum      │
│                                                   │
│  Aktuelle Etage: LABOR                           │
│  Zeit seit Start: 01:24:33                       │
│                                                   │
│  [Nächste Etage freischalten]                    │
└─────────────────────────────────────────────────┘
```

Der Fortschrittsbalken spiegelt sich auf allen Spieler-Handys.
„Nächste Etage freischalten" = ein Knopf, kein Menü.

---

### Screen 2: Ereignis-Panel

Alle vorbereiteten Ereignisse als Buttons. DM drückt → Effekt erscheint bei Spielern.

```
┌─────────────────────────────────────────────────┐
│  EREIGNISSE                                       │
│                                                   │
│  [KELLER]                                        │
│  ▶ Tür öffnet sich (Sound + Text)               │
│                                                   │
│  [LABOR]                                         │
│  ▶ Vision abspielen (Bild an alle)              │
│  ▶ Experiment explodiert (Knallsound + Text)    │
│                                                   │
│  [SPIEGELKAMMER]                                 │
│  ▶ Spiegel 7 aktivieren                         │
│  ▶ ⏱ 60s Timer starten     [TIMER LÄUFT: 0:47] │
│                                                   │
│  [SANCTUM]                                       │
│  ▶ Aldric spricht (Text erscheint)              │
│  ▶ Aegisstein erhalten (alle Spieler)           │
└─────────────────────────────────────────────────┘
```

Jedes Ereignis kann nur einmal ausgelöst werden (grau danach), außer Timer.

---

### Screen 3: Spieler-Übersicht

```
┌─────────────────────────────────────────────────┐
│  SPIELER (6 verbunden)                            │
│                                                   │
│  Finn      🟢  Kristall: Orange   [Nachricht]   │
│  Lea       🟢  Kristall: Weiß     [Nachricht]   │
│  Max       🟢  Kristall: Violett  [Nachricht]   │
│  Sara      🟢  Kristall: Schwarz  [Nachricht]   │
│  Tom       🟢  Kristall: Blau     [Nachricht]   │
│  Yuki      🟢  Kristall: Rot      [Nachricht]   │
│                                                   │
│  [Nachricht an alle senden]                      │
└─────────────────────────────────────────────────┘
```

Kristalle werden hier vom DM zugewiesen (Drag-and-drop oder Dropdown).
„Nachricht" öffnet ein Textfeld → private Nachricht an diesen Spieler.

---

### Screen 4: Nachrichten-Composer

```
┌─────────────────────────────────────────────────┐
│  NACHRICHT SENDEN                                 │
│                                                   │
│  An:  ○ Alle   ● Einzeln: [Sara ▼]              │
│                                                   │
│  Typ: ○ Text   ○ Bild   ○ Geheimhinweis         │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │ Du bemerkst, dass die letzte Seite des  │    │
│  │ Tagebuchs herausgerissen wurde...       │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  [Vorschau]    [Senden]                          │
└─────────────────────────────────────────────────┘
```

Vorbereitete Texte für jede Etage sind als Templates hinterlegt.
DM kann aber auch frei schreiben.

---

### Screen 5: Timer

```
┌─────────────────────────────────────────────────┐
│  TIMER                                            │
│                                                   │
│         0 : 4 7                                  │
│                                                   │
│  Sichtbar für:  ● Alle Spieler   ○ Nur DM       │
│                                                   │
│  [Pause]   [Reset: 60s]   [Stopp]               │
└─────────────────────────────────────────────────┘
```

Wenn Timer für alle sichtbar: erscheint oben auf jedem Spieler-Handy als Band.

---

### Screen 6: Konfrontations-Panel (Finale)

Extra-Screen für die Mira-Konfrontation nach dem Turm.

```
┌─────────────────────────────────────────────────┐
│  KONFRONTATION – MIRA VAEL                        │
│                                                   │
│  Phase: [1 – Kontrolle ▼]                       │
│                                                   │
│  ▶ Mira wartet vor dem Turm (Text an alle)      │
│  ▶ Mira bietet Belohnung an                     │
│  ▶ Mira wird nervös (Phase 2)                   │
│  ▶ Mira macht Angebot (Phase 4A)                │
│  ▶ Mira flieht (Phase 4B)                       │
│                                                   │
│  ENDE AUSLÖSEN:                                  │
│  [Ende 1] [Ende 2] [Ende 3] [Ende 4]            │
│  → Belohnungen werden automatisch verteilt       │
└─────────────────────────────────────────────────┘
```

---

## Spieler-Interface

### Screen 1: Verbindungsscreen

```
┌─────────────────────────────────────┐
│                                     │
│      TURM DES MAGIERS               │
│                                     │
│   Session-Code eingeben:            │
│   [  _  _  _  _  ]                 │
│                                     │
│   Dein Name:                        │
│   [________________]               │
│                                     │
│          [Beitreten]                │
└─────────────────────────────────────┘
```

---

### Screen 2: Hauptscreen (während der Session)

```
┌─────────────────────────────────────┐
│  🗼 Turm des Magiers    Finn  🟢   │
├─────────────────────────────────────┤
│  FORTSCHRITT                        │
│  ████████░░░░░░░  Etage 2/5        │
│                                     │
│  Aktuelle Etage: Das Laboratorium  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  NEUE NACHRICHT                     │
│  ┌───────────────────────────────┐ │
│  │ [DM] Du siehst eine Vision:  │ │
│  │ Aldric streitet mit einer    │ │
│  │ Frau in rotem Umhang...      │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Alle Nachrichten]  [Inventar]    │
└─────────────────────────────────────┘
```

Push-Notification wenn neue Nachricht eintrifft (auch wenn App im Hintergrund).

---

### Screen 3: Nachrichten

```
┌─────────────────────────────────────┐
│  ← Nachrichten                      │
│                                     │
│  [Alle]  [Privat]                  │
│                                     │
│  ● [DM – alle] Vision im Labor     │
│    Vor 3 Min                        │
│                                     │
│  ● [DM – privat] Geheimhinweis:    │
│    Die letzte Seite fehlt...        │
│    Vor 12 Min                       │
│                                     │
│  ● [System] Bibliothek abgeschl.   │
│    Vor 18 Min                       │
└─────────────────────────────────────┘
```

Private Nachrichten sind optisch anders markiert als öffentliche.

---

### Screen 4: Inventar / Belohnungen

```
┌─────────────────────────────────────┐
│  ← Dein Inventar                    │
│                                     │
│  GEFUNDEN                           │
│  📖 Teil 1 des Tagebuchs           │
│  🔵 Kristall: Violett              │
│                                     │
│  BELOHNUNGEN                        │
│  (noch gesperrt – Sanctum löst auf)│
│  🔒 Persönliche Notiz von Aldric   │
│  🔒 Aldrics Erbe                   │
│                                     │
└─────────────────────────────────────┘
```

Belohnungen erscheinen mit Animation wenn der DM sie freischaltet.

---

### Screen 5: Kristall-Aufzeichnung (Archiv der Stimmen)

Erscheint automatisch wenn DM die Archiv-Phase startet und Kristalle zugewiesen sind.

```
┌─────────────────────────────────────┐
│  🔮 Dein Kristall: VIOLETT         │
│                                     │
│  Du hörst eine erschöpfte Stimme:  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ „Wer auch immer das hier     │ │
│  │ findet — ich vertraue euch.  │ │
│  │ Der Stein schützt Velmoor.   │ │
│  │ Lasst ihn das tun."          │ │
│  └───────────────────────────────┘ │
│                                     │
│  Nur du kannst das lesen.          │
│  Teile es mit deiner Gruppe.       │
└─────────────────────────────────────┘
```

---

## Technische Umsetzung (Empfehlung)

### Stack
- **Frontend:** React + Vite, als PWA (Manifest + Service Worker)
- **Backend:** Node.js + Express + Socket.io (Echtzeit-Events)
- **Hosting:** Lokal im Heimnetz (DM-Laptop als Server) — kein Internet nötig
- **Daten:** Keine Datenbank nötig für ein Oneshot — alles im Memory des Servers

### Verbindung
- DM startet Server → bekommt QR-Code oder 4-stelligen Code
- Spieler öffnen Browser auf Handy, geben Code ein
- Alle verbunden via WebSocket

### PWA-Features die relevant sind
- Push Notifications (Spieler bemerkt neue Nachricht auch wenn Handy schläft)
- Offline-fähig (falls WLAN kurz abbricht, bleibt letzter Stand sichtbar)
- Homescreen-Installation (einmal tippen, danach wie eine App)

### Dateistruktur (grob)
```
/app
  /client         ← React Frontend
    /dm           ← DM-Interface (passwortgeschützt)
    /player       ← Spieler-Interface
  /server         ← Node.js Backend
    events.js     ← Alle auslösbare Ereignisse
    session.js    ← Session-Verwaltung
    socket.js     ← WebSocket-Logik
```

### Skalierung für später
- Mehrere Abenteuer in der App (Dropdown bei Session-Start: „Welches Abenteuer?")
- Spieler-Profile mit Charakterbögen
- Export der Session als PDF (Zusammenfassung was passiert ist)

---

## Priorisierung für den ersten Build

**Phase 1 (Minimum für Spielabend):**
1. Spieler verbinden sich mit Code
2. DM kann Etagen freischalten (Fortschrittsbalken)
3. DM kann Text-Nachrichten an alle oder einzelne senden
4. Timer (sichtbar für alle)

**Phase 2 (komfortabel):**
5. Ereignis-Buttons (vorgefertigte Events pro Etage)
6. Inventar / Belohnungen
7. Kristall-Aufzeichnungen (privater Text pro Spieler)

**Phase 3 (nice to have):**
8. Bilder/Visionen pushen
9. Sound-Events
10. Konfrontations-Panel für Mira
11. Export / Zusammenfassung

*Erstellt: 2026-06-15*
