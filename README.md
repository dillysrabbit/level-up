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
- **📝 Notizen** – kurze, mit Zeitstempel versehene Notizen direkt am Mitarbeiterprofil festhalten.

## Daten & Datenschutz

Die Daten werden **geräteübergreifend** in einer Supabase-Postgres-Datenbank in der **EU
(Frankfurt)** gespeichert. Der Zugriff ist nur **nach Anmeldung** möglich und über
**Row-Level-Security (RLS)** abgesichert: Nur authentifizierte Nutzer:innen erreichen die Daten,
anonyme Zugriffe sind vollständig gesperrt. Alle angemeldeten Geräte teilen sich denselben
Datenbestand. Über **Einstellungen → Backup** lässt sich der Bestand als JSON exportieren/importieren.

Der im Client hinterlegte `publishable`-Key ist – wie von Supabase vorgesehen – zur Veröffentlichung
bestimmt; der Schutz erfolgt über RLS, nicht über Geheimhaltung des Keys. Der `service_role`-Key
wird nie im Client verwendet.

### Konfiguration

Standardmäßig sind Projekt-URL und publishable Key in `src/lib/supabase.ts` hinterlegt. Optional
lassen sie sich per Umgebungsvariablen überschreiben (z.B. in `.env` oder bei Vercel):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

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
