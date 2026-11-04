# Kleurenleer les 2 — reveal.js presentatie

Verbeterde versie van *"Kleurenleer les 2"* (MBO-4 Grafisch Vormgeven, GLR Media Creative)
in **reveal.js**-vorm. De les draait om **moodboards**: wat is het, waarvoor gebruik je het,
en hoe maak je er zelf één rond één eigen kleur — met een **foto-opdracht buiten van 1 uur**
en de **5-hoeken regel** als diversiteitseis bij de vijf foto's die je uiteindelijk kiest.

Alles werkt **offline**: reveal.js, de fonts (Space Grotesk / Hanken Grotesk), de les-timer
(HTML/CSS/JS) en alle 8 afbeeldingen uit de originele PowerPoint zitten in deze map. Er zijn
geen externe video's, scripts of webfonts nodig.

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
| `Alt + klik` | inzoomen op een slide (handig bij de moodboard-voorbeelden) |

Printen naar PDF: open `index.html?print-pdf` in Chrome → Afdrukken → als PDF
(liggend, geen marges, "achtergronden" aan).

## Structuur

```
kleurenleer-les2-reveal/
├── index.html          ← de presentatie (alle 23 slides)
├── css/glr.css         ← huisstijl-thema (gedeeld met les 1, + les 2-bouwstenen)
├── js/
│   ├── timer.js        ← offline les-timer (countdown met ring)
│   └── wheel.js        ← tekent de mini-kleurenwielen (svg)
├── fonts/              ← Space Grotesk + Hanken Grotesk (.ttf)
├── media/              ← 8 afbeeldingen uit de originele PowerPoint
└── vendor/reveal/      ← reveal.js 5.2.1 (MIT) + plugins notes/search/zoom
```

## Opbouw van de les (23 slides)

| # | Slide | Didactische functie |
|---|---|---|
| 01 | Titel | — |
| 02 | Sfeer zie je eerder dan je hem leest | Gagné 1 · aandacht trekken |
| 03 | Afspraken (incl. buiten-afspraak) | klassenmanagement |
| 04 | Programma | verwachtingen kaderen (60 min buiten) |
| 05 | Leerdoelen P1 | Gagné 2 · doelen communiceren |
| 06 | Lesdoelen kleurenleer | Gagné 2 · doelen communiceren |
| 07 | Terugblik: het kleurenwiel | Gagné 3 · voorkennis activeren |
| 08 | Wat is een moodboard? | presentatie van de stof (definitie) |
| 09 | Waarom maak je een moodboard? | drie functies · elaboratie |
| 10 | Voorbeeld 1 · grafisch & web | voorbeeld (assertion-evidence) |
| 11 | Voorbeeld 2 · merk & campagne | voorbeeld (andere sfeer, zelfde gereedschap) |
| 12 | Voorbeeld 3 · in Figma | gereedschap tonen |
| 13 | Kies jouw kleur (12 kleurvlakken) | keuzemoment + begeleiding |
| 14 | Fototips | Gagné 5 · begeleiding bij de opdracht |
| 15 | **De 5-hoeken regel** (foto-eisen) | eisen stellen · diversiteit van beelden |
| 16 | Naar buiten! + **60-min timer** | Gagné 6 · toepassen/inoefenen |
| 17 | Kleurenonderzoek: geel, blauw, oranje | voorbeeld · variatie binnen één kleur |
| 18 | Van foto's naar één moodboard | Gagné 6 · toepassen (4 stappen) |
| 19 | Moodboard maken in Figma | procedurele uitleg |
| 20 | Welke sfeer roept jouw kleur op? | reflectie · onderbouwen |
| 21 | Inleveren | afspraken & verwachtingen |
| 22 | Wat viel je op? | Gagné 9 · afsluiten & terugkijken |
| 23 | Einde | — |

Elke slide heeft **sprekersnotities** (toets `S`) met de uitleg die je mondeling geeft —
de slide zelf houdt alleen de kernwoorden (Mayer: redundantieprincipe). In de notities staan
ook de momenten waarop je iets moet aanvullen met de afspraken van je eigen locatie
(terugkomtijd, deadline, uitgang bij de buitenopdracht).


## Ontwerp & toegankelijkheid

- **Huisstijl**: Space Grotesk (display) + Hanken Grotesk (tekst), accent electric-lime `#A6E22E`
  op canvas `#FAF9FD`. Het thema (`css/glr.css`) is het thema van les 1, uitgebreid met vijf
  bouwstenen voor deze les: `.defbox` (definitieblok), `.split` (tekstpaneel + volledig zichtbaar
  beeld), `.pick` (kleurvlakkenraster), `.shots3` (drie collages naast elkaar) en `.hoeken`
  (vijf categoriekaarten voor de 5-hoeken regel).
- **Contrast (WCAG 2.1 AA)**: tekst `#111111`/`#424936` op `#FAF9FD`; lime alleen als accentvlak
  met donkere tekst, nooit als tekstkleur op licht. Groen op licht is `#416900`. Op de
  kleurvlakken (dia 13) is de tekstkleur per vlak gekozen op minimaal 4,5:1 contrast — donker op
  geel, oranje, roze, lichtblauw, lime en wit; wit op rood, paars, blauw, groen, bruin en zwart.
- **Media & timers**: alle afbeeldingen hebben beschrijvende `alt`-tekst; de decoratieve
  titelachtergrond (dia 1 en 23) heeft `alt=""` + `aria-hidden`. De timer op dia 16 is volledig
  offline (HTML/CSS/JS) en ingesteld op **60:00**. De mini-kleurenwielen op dia 7 zijn
  zelfgetekende SVG's (`js/wheel.js`).
- **Voorbeelddia's (10, 11, 12)**: één groot beeld per dia, met een donker tekstpaneel met alleen
  een vraag. De beelden blijven volledig zichtbaar (`object-fit: contain`), zodat studenten de
  opbouw van een moodboard echt kunnen lezen. Met `Alt + klik` zoom je in op details.
- **Progressive disclosure**: lijsten, kaarten en voorbeelden verschijnen in stappen (fragmenten),
  zodat het publiek niet vooruit leest. Het kleurenraster op dia 13 staat bewust in één keer op
  het scherm: dat is een keuzemoment, geen uitleg.
- **Beeldschermgebruik**: alle 23 dia's zijn gecontroleerd op overloop binnen het kader van
  1280 × 720 (headless Chrome), zodat niets buiten de slide valt.

## Herkomst

- Originele inhoud: `Kleurenleer les 2.pptx` (niet gewijzigd). De PowerPoint had 12 dia's, lege
  sprekersnotities en 8 afbeeldingen. Alle 8 afbeeldingen zijn hergebruikt:

  | Bestand | Origineel | Gebruikt op |
  |---|---|---|
  | `media/titel-bg.png` | dia 1 (titelachtergrond) | dia 1 en 23 |
  | `media/planning.jpeg` | dia 3 (programma) | dia 4 |
  | `media/moodboard-1.png` | dia 8 (voorbeeld) | dia 10 |
  | `media/moodboard-2.jpeg` | dia 8 (voorbeeld) | dia 11 |
  | `media/moodboard-3.png` | dia 8 (voorbeeld, Figma-canvas) | dia 12 |
  | `media/buiten-1.jpeg` | dia 10 (kleur geel) | dia 17 |
  | `media/buiten-2.jpeg` | dia 10 (kleur blauw) | dia 17 |
  | `media/buiten-3.jpeg` | dia 10 (kleur oranje) | dia 17 |

- **Inhoudelijke wijzigingen t.o.v. de PowerPoint**: de opdracht "naar buiten" is gesplitst in een
  keuzemoment (dia 13), fototips (dia 14), de **5-hoeken regel** (dia 15) en de opdracht met timer
  (dia 16). De diversiteitseis bij de foto's is toegevoegd op dia 15 (vijf categorieën: architectuur,
  typografie, textuur, natuur, object) en werkt door op dia 16 (regel "Eis") en dia 18 (stap 2: vijf
  foto's kiezen, één per hoek). De lesstof is verder aangevuld met de doelen van P1 en de
  reflectievragen (dia 20). De terugkeertijd uit de originele dia ("10:30 terug!") is vervangen door
  de afspraak uit de les: **1 uur (60 minuten)**.
- reveal.js 5.2.1 — MIT-licentie (`vendor/reveal/`).
- Space Grotesk & Hanken Grotesk — SIL Open Font License.

## Aanpassen

- **Kleur of typografie**: pas de variabelen bovenin `css/glr.css` aan (`--canvas`, `--lime`, …).
- **Slide toevoegen**: kopieer een `<section>…</section>`-blok in `index.html`; zet het
  paginanummer in de `.footer` en voeg een `<aside class="notes">` toe.
- **Timer-duur**: pas `data-timer="60:00"` aan in de `.timer`-div op dia 16 (en de tekst
  `60:00` in `.t-time` plus het label in `.t-label`).
- **Kleuren op dia 13**: elk vlak is een `.tile` met een inline `background`/`color`. Voeg een
  vlak toe of pas een hex-code aan; kies de tekstkleur op minimaal 4,5:1 contrast.
- **Foto-eisen (dia 15)**: elke hoek is een `.hoek`-kaart in het `.hoeken`-raster. Pas de
  categorienaam en de voorbeelden aan je leslocatie aan (bijv. meer of minder categorieën) en
  houd de regel "Eis" op dia 16 en stap 2 op dia 18 daarmee in lijn.
- **Andere voorbeeldbeelden**: vervang de bestanden in `media/` en werk de `alt`-tekst bij.
- **Nieuwe plugin**: de reveal.js-plugins staan in `vendor/reveal/plugin/`. De `math`-plugin
  (offline KaTeX) en de `chalkboard`-plugin laden uit `shared/vendor/`; formules schrijf je
  als `$…$` en tekenen op slides doe je met `B` (bord) of `C` (notitie-canvas).
