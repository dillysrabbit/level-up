# Skill-Check — rabbit r1 Creation

Eine eigenständige **Creation** für den [rabbit r1](https://www.rabbit.tech/), abgeleitet aus
der WebApp **LevelUp**. Sie bringt das Herzstück der App — den **Kompetenz-Check** — auf das
240 × 282-px-Display des r1, bedienbar mit nur zwei Eingaben: **Scrollrad** und **Taste**.

Gestaltet im mitgelieferten Design-System **„r1 Creations · Papier“** (im Geist von Dieter Rams
und der BRAUN-Formensprache): warmes Grau, eine einzige Akzentfarbe `#D75A1E`, IBM Plex Mono für
Werte, Helvetica für Sprache. *Weniger, aber besser.*

## Was sie tut

1. **Start** — Katalog wählen: *Fachkraft* (QS 3) oder *Hilfskraft*.
2. **Bewerten** — eine Kompetenz pro Screen. Das **Scrollrad** stellt die Entwicklungsstufe
   **1–5**, die **Taste** bestätigt und blättert zur nächsten Kompetenz.
   Die Skala ist 1:1 die Entwicklungsskala der WebApp (1 = *Einarbeitung* … 5 = *Vorbild*) —
   eine Entwicklungs-, keine Schulnote.
3. **Ergebnis** — die **Skill-Matrix in Kleinform**: Durchschnitt je Kompetenz-Dimension plus
   Gesamtschnitt. Taste startet eine neue Visite.

Kompetenzkatalog und Bewertungsskala stammen unverändert aus
`src/data/competencyFramework.ts` der WebApp, damit r1 und Tablet/Handy dieselbe Sprache sprechen.

## Bedienung

| Eingabe | r1-Hardware | Desktop-Vorschau |
| --- | --- | --- |
| Wert / Auswahl ändern | Scrollrad | Mausrad · ↑ ↓ ← → |
| Bestätigen / Weiter | Seitentaste | Enter · Leertaste · Klick |

## Lokal ansehen

Es ist eine einzelne, abhängigkeitsfreie HTML-Datei — einfach im Browser öffnen:

```bash
# z.B.
xdg-open creations/skill-check-r1/index.html
# oder über einen kleinen Server
python3 -m http.server -d creations/skill-check-r1 8080
```

Das Fenster zeigt das Gerät mit Rad und Taste. Auf dem r1 selbst (schmaler Viewport) füllt der
Screen automatisch das ganze Display.

## Auf den r1 bringen

Die Creation hört auf die r1-Hardware-Events `scrollUp`, `scrollDown` und `sideClick`
(`longPressEnd` löst ebenfalls die Taste aus). Über das rabbithole/Creations-Portal lässt sich
`index.html` als Creation veröffentlichen; lokal dient die Datei zugleich als Vorschau.

## Technik

Reines HTML/CSS/JS, kein Build, keine Laufzeit-Abhängigkeit (nur IBM Plex Mono per Webfont).
Die WebApp selbst (`/src`, React + Vite) bleibt davon unberührt — diese Creation lebt
eigenständig unter `creations/`.
