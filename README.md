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

Die Daten liegen **ausschließlich lokal auf dem Gerät** – es gibt keinen Cloud-Sync und kein
Konto. In der iOS-App werden sie als JSON-Datei im App-Dokumentenverzeichnis gespeichert (und
damit vom normalen iPhone-Backup mitgesichert), im Browser im localStorage. Die native App ist
zusätzlich per **Face ID / Geräte-Code** gesperrt (abschaltbar in den Einstellungen). Über
**Einstellungen → Backup** lässt sich der Bestand als JSON exportieren/importieren – das ist auch
der Weg, um Daten auf ein anderes Gerät zu übertragen.

## Entwicklung

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Entwicklungsserver starten (http://localhost:5173)
npm run build    # Produktions-Build (statische Dateien in /dist)
npm run lint     # TypeScript-Typprüfung
```

## iOS-App (Capacitor)

Die Web-App ist per [Capacitor](https://capacitorjs.com) als native iOS-App verpackt
(`ios/`-Ordner, Xcode-Projekt). Auf dem Mac:

```bash
npm install
npm run build
npx cap sync ios     # Web-Build in das iOS-Projekt kopieren
npx cap open ios     # Projekt in Xcode öffnen
```

In Xcode unter *Signing & Capabilities* das eigene Apple-Team wählen, dann auf Simulator oder
iPhone starten. Nach jeder Code-Änderung: `npm run build && npx cap sync ios`.

## Technik

React + TypeScript + Vite + Tailwind CSS + Capacitor. Die Datenschicht ist gekapselt
(`src/store/`), sodass später bei Bedarf ein Backend (z.B. für Mehrgeräte-Sync)
ergänzt werden kann.

```
src/
├── data/competencyFramework.ts   # Pflege-Kompetenzmodell + Bewertungsskala
├── store/                        # lokale Persistenz (Datei/localStorage) + React-Store
├── lib/                          # Formatierung, Auswertungen, PDF, App-Sperre
├── components/                   # wiederverwendbare UI-Bausteine
├── pages/                        # Dashboard, Team, Visite, Einstellungen
ios/                              # natives Xcode-Projekt (Capacitor)
```
