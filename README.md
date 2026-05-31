# LevelUp 📋

Ein Tool für **Mitarbeitervisiten bei Pflegekräften** – und um sie in ihrer Entwicklung zu begleiten.

LevelUp ist eine mobil-optimierte Web-App (Tablet/Handy/Desktop), mit der Pflegedienst- und
Wohnbereichsleitungen strukturierte Visiten durchführen, Stärken und Entwicklungsfelder
dokumentieren, Entwicklungsziele vereinbaren und den Fortschritt über die Zeit nachverfolgen
können.

## Funktionen (MVP)

- **👥 Mitarbeiter-Profile** – Stammdaten je Pflegekraft inkl. gesamter Visiten- und Zielhistorie.
- **📋 Visiten-Formular & Doku** – strukturierter Bogen: Beobachtungen, Stärken, Entwicklungsfelder, Fazit.
- **🎯 Ziele & Maßnahmen** – Entwicklungsziele mit Fristen, Status und Fortschrittsanzeige.
- **📊 Kompetenz-Check / Skill-Matrix** – Standortbestimmung über vier Kompetenzdimensionen, visualisiert.

## Datenschutz

Alle Daten werden **ausschließlich lokal im Browser** gespeichert (kein Server, keine Cloud).
Das ist bei sensiblen Personal- und Gesundheitsdaten (DSGVO) bewusst so gewählt. Über
**Einstellungen → Backup** lassen sich die Daten als JSON exportieren und importieren.

## Entwicklung

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Entwicklungsserver starten (http://localhost:5173)
npm run build    # Produktions-Build (statische Dateien in /dist)
npm run lint     # TypeScript-Typprüfung
```

## Technik

React + TypeScript + Vite + Tailwind CSS. Die Datenschicht ist gekapselt
(`src/store/`), sodass später bei Bedarf ein Backend (z.B. für Mehrgeräte-Sync)
ergänzt werden kann.

```
src/
├── data/competencyFramework.ts   # Pflege-Kompetenzmodell + Bewertungsskala
├── store/                        # lokale Persistenz (localStorage) + React-Store
├── lib/                          # Formatierung & Auswertungen (Skill-Matrix)
├── components/                   # wiederverwendbare UI-Bausteine
└── pages/                        # Dashboard, Team, Visite, Einstellungen
```
