# Kleurenleer les 1 — reveal.js presentatie

Verbeterde versie van *"Kleurenleer les 1"* (MBO-4 Grafisch Vormgeven, GLR Media Creative)
in **reveal.js**-vorm. Alles werkt **offline**: reveal.js, de fonts (Space Grotesk /
Hanken Grotesk) en alle media (10 afbeeldingen; de les-timers zijn HTML/CSS/JS in plaats
van video's) zitten in deze map. Alleen het samenvattende YouTube-filmpje op slide 8
heeft internet nodig, met een link-fallback erbij.

## Openen

**Makkelijkst (dubbelklik):** open `index.html` in Chrome, Edge of Safari.

**Aanbevolen (i.v.m. fonts):** start een lokaal servertje in deze map:

```bash
python3 -m http.server 8000
# open daarna http://localhost:8000/
```

Presenteren? Zet de browser op volledig scherm (F11 of ⌃⌘F).

## Bediening

| Toets | Functie |
|---|---|
| `→` / `Space` | volgende stap (ook binnen een slide: fragmenten) |
| `←` | vorige stap |
| `S` | **sprekersnotities** in een tweede venster (met klok + notities) |
| `O` of `Esc` | overzicht van alle slides |
| `F` | volledig scherm |
| `Ctrl/⌘ + Shift + F` | zoeken in de presentatie |
| `Alt + klik` | inzoomen op een slide |

Printen naar PDF: open `index.html?print-pdf` in Chrome → Afdrukken → als PDF
(liggend, geen marges, "achtergronden" aan).

## Structuur

```
kleurenleer-reveal/
├── index.html          ← de presentatie (alle 23 slides)
├── css/glr.css         ← huisstijl-thema (kleuren, typografie, layout)
├── js/
│   ├── timer.js        ← offline les-timer (countdown met ring)
│   └── wheel.js        ← tekent de mini-kleurenwielen (svg)
├── fonts/              ← Space Grotesk + Hanken Grotesk (.ttf)
├── media/              ← 10 afbeeldingen (originele + vrije foto's + stills)
└── vendor/reveal/      ← reveal.js 5.2.1 (MIT) + plugins notes/search/zoom
```

## Opbouw van de les (23 slides)

| # | Slide | Didactische functie |
|---|---|---|
| 01 | Titel | — |
| 02 | Kleur is geen decoratie | Gagné 1 · aandacht trekken |
| 03 | Afspraken | klassenmanagement |
| 04 | Programma | verwachtingen kaderen |
| 05 | Leerdoelen P1 | Gagné 2 · doelen communiceren |
| 06 | Lesdoelen Kleurenleer | Gagné 2 · doelen communiceren |
| 07 | Welke kleur hoort bij welk merk? | Gagné 3 · voorkennis activeren |
| 08 | Kleurenleer in het kort (video) | oriëntatie / samenvatting |
| 09 | Kleur bepaalt hoe je ontwerp overkomt | presentatie van de stof |
| 10 | Merken kiezen kleur strategisch | voorbeeld / elaboratie |
| 11 | Voorbeeld · film (beeld + vraag, Wicked) | Gagné 4 · activeren/raden |
| 12 | Film regisseert emotie met een kleurenpalet (Wicked 2024) | voorbeeld (film) |
| 13 | Voorbeeld · film (beeld + vraag, Dune) | Gagné 4 · activeren/raden |
| 14 | Elk genre heeft zijn eigen kleurbeeld (Dune: Part Two 2024) | voorbeeld (film, contrast) |
| 15 | Voorbeeld · game (beeld + vraag, Minecraft) | Gagné 4 · activeren/raden |
| 16 | Games sturen je sfeer met kleur (Minecraft) | voorbeeld (games) |
| 17 | Opdracht 1 + 20-min timer (JS) | Gagné 6 · toepassen/inoefenen |
| 18 | Het kleurenwiel & kleurharmonieën | theorie die de volgende opdracht nodig heeft |
| 19 | Opdracht 2 + 30-min timer (JS) | Gagné 6 · toepassen |
| 20 | Kleuren en emoties | betekenis & beïnvloeding |
| 21 | Opdracht 3 (kleur + vorm als taal) | transfer / creatie |
| 22 | Klaar? (extra uitdaging in code) | differentiatie |
| 23 | Even terugkijken (3 vragen) | Gagné 9 · afsluiten & terugkijken |

Elke slide heeft **sprekersnotities** (toets `S`) met de uitleg die je mondeling geeft —
de slide zelf houdt alleen de kernwoorden (Mayer: redundantieprincipe).

## Ontwerp & toegankelijkheid

- **Huisstijl**: Space Grotesk (display) + Hanken Grotesk (tekst), accent electric-lime `#A6E22E`.
- **Contrast (WCAG 2.1 AA)**: tekst `#111111`/`#424936` op `#FAF9FD`; lime alleen als
  accentvlak met donkere tekst, nooit als tekstkleur op licht. Groen op licht is `#416900`.
- **Media & timers**: alle afbeeldingen hebben beschrijvende `alt`-tekst; de decoratieve
  titelachtergrond heeft `alt=""` + `aria-hidden`. De les-timers op slide 17/19 zijn volledig
  offline (HTML/CSS/JS) en de mini-kleurenwielen op slide 18 zijn zelfgetekende SVG's.
- **Visuele voorbeeldslides** (11, 13, 15): een full-bleed still/screenshot met alleen een
  activerende vraag; de film-/gamennaam staat bewust in de sprekersnotities, zodat studenten
  eerst zelf raden en pas daarna het kleurenpalet (slide 12/14/16) te zien krijgen.
- **Progressive disclosure**: kernlijsten en voorbeelden verschijnen in stappen (fragmenten),
  zodat je publiek niet vooruit leest. Op slide 18 verschijnt per harmonie eerst het kleurenwiel
  en daarna pas de naam + uitleg (14 stappen).

## Herkomst

- Originele inhoud: `Kleurenleer les 1.pptx` (niet gewijzigd). De originele afbeeldingen op
  slide 1 (titelachtergrond), 3, 10 en 20 zijn behouden; slide 5 en 9 gebruiken vrije foto's en
  slides 12, 14 en 16 zijn opnieuw opgebouwd met zelfgetekende kleurvlakken en -wielen.
- Beeld op de visuele voorbeeldslides (11, 13, 15) — echte stills/screenshots voor klassikaal
  gebruik: Wicked (2024) en Dune: Part Two (2024) via de poster-/backdrop-CDN van Letterboxd
  (beeld © Universal Pictures resp. Warner Bros. / Legendary), en een Minecraft-screenshot van
  de Nether van Wikimedia Commons (*Screenshot from the Minecraft Nether*, spelbeeld © Mojang).
- Vrije foto's (slides 5 en 9): Pexels (Pexels-licentie — gratis te gebruiken).
- Gemeten kleurpaletten (Wicked, Dune: Part Two): FrameThrower (CC BY 4.0).
- reveal.js 5.2.1 — MIT-licentie (`vendor/reveal/`).
- Space Grotesk & Hanken Grotesk — SIL Open Font License.
- YouTube-video: GCFLearnFree, *Beginning Graphic Design: Color* (start op 1:37).

## Aanpassen

- **Kleur of typografie**: pas de variabelen bovenin `css/glr.css` aan (`--canvas`, `--lime`, …).
- **Slide toevoegen**: kopieer een `<section>…</section>`-blok in `index.html`; zet het
  paginanummer in de `.footer` en voeg een `<aside class="notes">` toe.
- **Nieuwe plugin**: de reveal.js-plugins staan in `vendor/reveal/plugin/`. De `math`-plugin
  (offline KaTeX) en de `chalkboard`-plugin laden uit `shared/vendor/`; formules schrijf je
  als `$…$` en tekenen op slides doe je met `B` (bord) of `C` (notitie-canvas).
- **Timer-duur**: pas `data-timer="20:00"` aan in de `.timer`-div op slide 17/19.
- **Kleurenwielen**: de selectie per harmonie staat in `data-hues` (12-uurs indexen 0–11) op
  `.harm-wheel`; `data-shades="1"` tekent de monochromatische variant.

