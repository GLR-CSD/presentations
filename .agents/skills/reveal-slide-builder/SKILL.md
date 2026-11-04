---
name: reveal-slide-builder
description: >
  Bouw en onderhoud GLR-lespresentaties als reveal.js-markdown (slides-as-code).
  Gebruik deze skill bij het omzetten van bronmateriaal uit `input/` (pptx, pdf,
  docx, losse notities) naar een didactisch valide, toegankelijke en consistente
  `slides.md` binnen een presentatiemap, en bij het aanpassen of uitbreiden van
  bestaande reveal.js-presentaties. Deze skill bewaakt de vaste syntaxregels
  (horizontale/verticale slides, YAML-frontmatter, leerdoelen, line-highlighting,
  fragments) en de GLR-huisstijl-utilities (`.highlight`, `.glr-card`,
  `.terminal-window`). Voor het didactische ontwerp (Cognitive Load Theory,
  Mayer, Gagné, Bloom) leunt deze skill op de skill `educational-presentation-nl`.
license: MIT
metadata:
  author: GLR CSD
  version: 1.0.0
  language: nl
  companion_skill: educational-presentation-nl
---

# Skill: Reveal.js Presentation Builder (GLR CSD)

## Doel

Transformeer bronmateriaal uit `input/` naar een didactisch valide, toegankelijke
en consistente `slides.md` binnen de repository, en help bij het onderhouden van
bestaande presentaties. De inhoud staat in Markdown; de opmaak komt uit de
gedeelde GLR-huisstijl (`shared/css/glr-theme.css`).

## Bestandsstructuur van een presentatie

Elke presentatie is een map onder `presentations/` met:

```
presentations/<cohort>/<jaar>/<vak>/<module>/<presentatie>/
├── index.html        # wrapper die reveal.js + glr-theme + slides.md inlaadt
├── slides.md         # de inhoud (met YAML-frontmatter)
└── assets/           # presentatiespecifieke afbeeldingen/diagrammen
```

Gebruik de templates in `templates/` (`slides.md` en `index.html`) als startpunt.

## Vaste syntaxregels

- Slides scheiden met `---` (horizontaal, voor hoofdthema's) en `--`
  (verticaal, voor verdiepingen, uitwerkingen en codevoorbeelden).
- Elke `slides.md` opent met een frontmatter-blok tussen de HTML-comment-markers
  `<!-- frontmatter` en `-->` met de verplichte velden `title`, `cohort`,
  `leerjaar`, `periode`, `auteur` en `tags`.
- Geen losse HTML voor opmaak; gebruik de GLR-utilities (zie hieronder).
- Splits nooit een concept over meerdere niveaus tegelijk; maximaal één concept
  of programmeerconstructie per slide.

## Frontmatter (verplicht)

Elke `slides.md` opent met een frontmatter-blok tussen de HTML-comment-markers
`<!-- frontmatter` en `-->`. Zo ziet Reveal.js het als een (onzichtbare)
HTML-comment en worden de `---` slide-scheidingstekens nooit met YAML-
frontmatter verward. De YAML tussen de markers is 100% valide.

```yaml
<!-- frontmatter
title: "Asynchrone JavaScript & Promises"
cohort: "2026-2027"
leerjaar: 1
periode: 2
auteur: "Docententeam CSD"
tags: ["JavaScript", "Frontend", "Async", "API"]
-->
```

De portaalpagina (`scripts/build-index.js`) leest deze velden voor de
indexering en ondersteunt (voor oudere decks) ook het `--- … ---`-formaat.

## Didactische structuur (verplicht)

Elke les bevat minimaal:

1. **Slide 1** — titel.
2. **Slide 2** — leerdoelen, geformuleerd als *"Aan het einde van deze les kun je…"*.
3. Per **5 inhoudelijke slides** minimaal één actieve verwerkingsopdracht of
   check-in vraag (Peer Instruction / retrieval practice).
4. **Afsluitende slide** met een samenvatting en concrete vervolgstappen.

Orden de inhoud volgens de Taxonomie van Bloom
(Onthouden → Begrijpen → Toepassen → Analyseren → Evalueren → Creëren) en volg
Gagné's instructiegebeurtenissen. Voor de onderbouwing en de volledige
checklists: zie de skill **`educational-presentation-nl`**.

## Verhouding tot `educational-presentation-nl`

Deze repository gebruikt twee complementaire skills:

- **`educational-presentation-nl`** — het didactische en visuele ontwerp:
  Cognitive Load Theory, Mayers principes, Gagné's 9 instructiegebeurtenissen,
  Bloom, Peer Instruction, beeldgebruik en toegankelijkheid (WCAG 2.1 AA).
- **`reveal-slide-builder`** (deze skill) — de *technische* vertaling naar
  reveal.js: markdown-syntax (`---`/`--`), YAML-frontmatter, line-highlighting,
  fragments en de GLR-huisstijl-utilities.

**Precedentie bij twijfel:** didactische en toegankelijkheidskeuzes volgen
`educational-presentation-nl`; de reveal.js-syntax, bestandsstructuur en styling
volgen deze skill. De vuistregels "elke 5 slides een actieve opdracht" (deze
skill) en "elke 10–15 minuten een Peer Instruction-checkpoint"
(`educational-presentation-nl`) zijn gelijkwaardig — pas ze samen toe.

## GLR-huisstijl-utilities

Pas deze klassen toe in de markdown-annotaties in plaats van losse CSS:

| Utility | Gebruik |
|---|---|
| `.highlight` | markeer een kernwoord of sleutelbegrip inline |
| `.glr-card` | kaart met kop (`<span class="k">`) en tekst, in een `.cards`-rij |
| `.terminal-window` | verpak een codeblok in een herkenbaar terminalvenster |
| `.defbox` | definitie- of kernblok met lime-accentrand |
| `.pill` | klein label/badge |
| `.kicker` | bovenkop in klein kapitaal |
| `.footer` | onderbalk met paginanummer (`.num`) |

Voeg slide-specifieke styling **niet** aan het gedeelde thema toe; zet die in de
presentatie zelf (bijv. een klein `<style>`-blok in `index.html`) of, als het
generiek is, in `shared/css/glr-theme.css`.

## Code-blokken

- Geef elk codeblok een taaldeclaratie (` ```javascript `, ` ```css `, …).
- Blokken van **meer dan 4 regels** krijgen regelaccentuering via Reveal.js
  line-highlighting: ` ```javascript [1-3|5|7-9] `. Zo loop je stap voor stap
  door de code zonder cognitieve overbelasting.
- Gebruik voor shell/voorbeeldoutput een `terminal-window`.

## Fragmenten & progressive disclosure

- Gebruik Reveal.js fragment-klassen voor stapsgewijze opbouw:
  `<!-- .element: class="fragment" -->`.
- Zet een volledige lijst of rij kaarten niet in één keer op het scherm als de
  student eerst moet nadenken; gebruik fragmenten per item.
- Uitzondering: keuzemomenten (bijv. een palet) mogen in één keer zichtbaar zijn.

## Wiskunde & tekenen (gedeelde plugins)

De decks laden naast de standaardplugins ook:

- **Math (KaTeX)** — schrijf formules als inline `$…$` of als los blok `$$…$$`.
  KaTeX wordt lokaal meegeleverd (`shared/vendor/katex`), dus formules renderen
  ook **offline**.
- **Chalkboard + custom controls** — tijdens de les kun je op de slides tekenen:
  `B` opent het (chalk)bord, `C` de notitie-canvas en `Del` wist het bord. De
  knoppen verschijnen linksonder.

Deze plugins staan al in de template (`templates/index.html`) en worden
aangeleverd via `shared/`; je hoeft per presentatie niets extra te installeren.

## Accessibility (WCAG 2.1 AA)

- Contrast ≥ 4.5:1; gebruik `.highlight` (lime op donker) en `--green-dk`
  (groen op licht) zoals bedoeld.
- Broodtekst ≥ 24px op 1080p. Dit is de PowerPoint-eenheid ≥ 24pt (≈ 32px) uit
  `educational-presentation-nl`, vertaald naar de reveal.js-canvas van 1080p.
- Beschrijvende `alt`-tekst voor inhoudelijke beelden; decoratieve beelden
  krijgen `alt=""` + `aria-hidden="true"`.
- Geen keyboard traps in embeds/custom componenten.

## Workflow

1. Plaats het brondocument in `input/` (lokaal; wordt niet gecommit).
2. Lees het bronmateriaal en bepaal de didactische boog (doelen → inhoud →
   opdracht → reflectie).
3. Kopieer de templates uit `templates/` naar de nieuwe presentatiemap.
4. Schrijf `slides.md` volgens de regels hierboven.
5. Werk de frontmatter bij (titel, cohort, leerjaar, periode, tags).
6. Controleer met de checklist hieronder en bekijk de presentatie lokaal
   (`npm run serve`, of open `index.html` in de browser).
7. Genereer indien nodig een PDF: `npm run export:pdf`.

## Checklist vóór oplevering

- [ ] YAML-frontmatter compleet en correct.
- [ ] Slide 2 bevat meetbare leerdoelen ("Aan het einde van deze les kun je…").
- [ ] Elke 5 inhoudelijke slides een actieve verwerkingsopdracht of check-in.
- [ ] Afsluitende slide met samenvatting + vervolgstappen.
- [ ] Codeblokken > 4 regels hebben een taaldeclaratie én line-highlighting.
- [ ] Formules (indien gebruikt) in `$…$`/`$$…$$` genoteerd (KaTeX, offline).
- [ ] Gebruik van GLR-utilities in plaats van ad-hoc HTML/CSS.
- [ ] Contrast en tekstgrootte voldoen aan WCAG 2.1 AA.
- [ ] Alle inhoudelijke beelden hebben beschrijvende `alt`-tekst.
- [ ] Sprekersnotities (`<aside class="notes">`) toegevoegd waar zinvol.
