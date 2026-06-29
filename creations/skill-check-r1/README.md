# Skill-Check — rabbit r1 Creation

Eine eigenständige **Creation** für den [rabbit r1](https://www.rabbit.tech/), abgeleitet aus
der WebApp **LevelUp**. Sie bringt das Herzstück der App — den **Kompetenz-Check** — auf das
240 × 282-px-Display des r1, bedienbar mit nur zwei Eingaben: **Scrollrad** und **Taste**.
**Mitarbeiter:innen, Visiten und ihre Entwicklung werden direkt auf dem Gerät gespeichert**
(`localStorage`) — kein Backend, keine Anmeldung.

Gestaltet im mitgelieferten Design-System **„r1 Creations · Papier“** (im Geist von Dieter Rams
und der BRAUN-Formensprache): warmes Grau, eine einzige Akzentfarbe `#D75A1E`, IBM Plex Mono für
Werte, Helvetica für Sprache. *Weniger, aber besser.*

## Was sie tut

1. **Team** — Liste der Mitarbeiter:innen; pro Person letzter Durchschnitt und Anzahl Visiten.
   Unten **Neue:r Mitarbeiter:in** anlegen.
2. **Name** — Eingabe per **Zeichenstreifen**: Rad wählt den Buchstaben, Taste setzt ihn,
   `✓` schließt ab (am Desktop/an einer Tastatur kann auch direkt getippt werden). Danach
   **Katalog** wählen: *Fachkraft* (QS 3) oder *Hilfskraft*.
3. **Profil** — letzter Stand mit Δ zur Vorvisite, **Neue Visite**, **Entwicklung** und der
   **Verlauf** aller bisherigen Visiten (zum Öffnen).
4. **Bewerten** — eine Kompetenz pro Screen. Das **Scrollrad** stellt die Entwicklungsstufe
   **1–5**, die **Taste** bestätigt und blättert weiter. Eine Folge­visite startet auf den
   **Vorwerten** der letzten Visite — man justiert also nur die Veränderung.
   Skala 1:1 aus der WebApp (1 = *Einarbeitung* … 5 = *Vorbild*) — eine Entwicklungs-, keine Schulnote.
5. **Ergebnis** — die **Skill-Matrix in Kleinform**: Ø je Kompetenz-Dimension, Gesamtschnitt und
   **Δ gegenüber der letzten Visite**. Wird automatisch gespeichert.
6. **Entwicklung** — Trend über alle Visiten: Gesamtverlauf als Balkenreihe plus **Δ je Dimension**
   seit der ersten Visite.

Kompetenzkatalog und Bewertungsskala stammen unverändert aus
`src/data/competencyFramework.ts` der WebApp, damit r1 und Tablet/Handy dieselbe Sprache sprechen.

## Daten

Alles bleibt **lokal auf dem Gerät** im `localStorage`-Schlüssel `r1.skillcheck.v1` — pro Browser/
Gerät ein eigener Bestand, keine Übertragung nach außen. (Ein Sync mit der LevelUp-Supabase wäre
später ergänzbar, ist hier aber bewusst nicht enthalten.)

## Bedienung

| Eingabe | r1-Hardware | Desktop-Vorschau |
| --- | --- | --- |
| Bewegen / Wert ändern | Scrollrad | Mausrad · ↑ ↓ ← → |
| Wählen / Bestätigen | Seitentaste (Tippen) | Enter · Leertaste · Klick |
| Zurück | Seitentaste **halten** | Esc · Backspace |

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
