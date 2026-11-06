# Architectuur & Richtlijnen: Reveal.js Presentatie Monorepo
**Opleiding:** MBO 4 Creative Software Developer (CSD) — Grafisch Lyceum Rotterdam  
**Doelgroep:** Docenten, curriculumontwikkelaars en gastsprekers  
**Versie:** 1.1.0  

---

## 1. Inleiding & Visie

Binnen de opleiding Creative Software Developer (MBO 4) hanteren we het *Docs-as-Code* en *Slides-as-Code* principe. Door onderwijspresentaties op te slaan als platte tekst (Markdown) en open standaarden (HTML5/CSS3/JavaScript), waarborgen we:
* **Duurzaamheid:** Presentaties blijven onafhankelijk van gesloten softwarelicenties (zoals proprietary cloud-tools) tientallen jaren leesbaar en bewerkbaar.
* **Versiebeheer:** Wijzigingen, curriculum-iteraties en bijdragen van collega's worden nauwgezet bijgehouden via Git.
* **Didactische wendbaarheid:** Code-voorbeelden, live componenten en syntax highlighting sluiten naadloos aan op het vakgebied van web- en softwaredevelopment.
* **Consistente AI-ondersteuning:** Door het integreren van dedicated *Agent Skills* borgen we dat AI-ondersteunde transformaties van brondocumenten direct voldoen aan de didactische structuur en huisstijl van het GLR.

Dit document beschrijft de aanbevolen architectuur, mappenstructuur, automatisering (CI/CD), agent workflows en didactische richtlijnen voor een centrale presentatie-monorepo.

---

## 2. Repository Architectuur & Mappenstructuur

Een monorepo-aanpak stelt ons in staat om configuraties, agent skills, GLR-huisstijlcomponenten en build-scripts op één centrale plek te beheren, terwijl afzonderlijke presentaties modulair blijven.

```text
reveal-presentations/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline voor build, PDF-generatie en deployment
├── .agents/skills/                 # Agent Skills en AI-gedragsprofielen
│   └── reveal-slide-builder/
│       ├── SKILL.md                # Instructieset voor structuur, styling en didactiek
│       └── templates/              # Referentie-templates voor Markdown & slides
├── input/                          # Lokale staging folder voor brondocumenten (uitgesloten van Git)
│   └── .gitkeep
├── presentations/                  # Alle actieve presentaties per cohort of thema
│   ├── cohort-2025/
│   │   ├── p1-html-css-basics/
│   │   │   ├── index.html          # Hoofdbestand dat slides.md inlaadt
│   │   │   ├── slides.md           # Presentatie-inhoud in Markdown
│   │   │   └── assets/             # Presentatiespecifieke afbeeldingen/diagrammen
│   │   └── p2-javascript-async/
│   │       ├── index.html
│   │       └── slides.md
│   └── workshops/
│       └── git-advanced/
├── shared/                         # Gedeelde assets en thema's
│   ├── css/
│   │   └── glr-theme.css           # GLR-huisstijl, typografie en kleurpalet
│   ├── js/
│   │   └── glr-plugins.js          # Gedeelde plugins of custom controllers
│   └── img/
│       └── glr-logo.svg            # Gedeelde school- en vaklogo's
├── scripts/
│   ├── build-index.js              # Bouwt de centrale portaalpagina (index.html)
│   └── export-pdf.js               # Automatiseert PDF-generatie via DeckTape/Puppeteer
├── .gitignore                      # Sluit input/, node_modules/ en build artifacts uit
├── package.json                    # Scripts en dependencies (Reveal.js, DeckTape, etc.)
└── README.md                       # Instructies voor docenten en bijdragers
```

---

## 3. Beheer van Bronmateriaal (`input/`)

Docenten ontvangen regelmatig brondocumenten van uitgevers, conferenties of collega's in de vorm van `.pptx`, `.key`, `.docx` of `.pdf`.

### 3.1 Scheiding van bron en output
* De map `input/` fungeert uitsluitend als lokale staging-omgeving waarin documenten worden geplaatst om door een LLM / Agent Skill te worden omgezet naar `slides.md`.
* **Privacy & Auteursrecht (AVG):** Door deze map strikt lokaal te houden, voorkomen we dat beschermd lesmateriaal of vertrouwelijke toetsnotities per ongeluk in openbare repositories belanden.

### 3.2 `.gitignore` Specificatie
Voeg de volgende configuratie toe aan de root `.gitignore`:

```gitignore
# Node afhankelijkheden
node_modules/
dist/

# Lokale brondocumenten en staging (alles negeren, behalve gitkeep)
input/*
!input/.gitkeep

# Lokale omgevingsvariabelen en OS-bestanden
.env
.DS_Store
Thumbs.db

# Gegenereerde PDF-bestanden tijdens lokale tests
*.pdf
```

---

## 4. Agent Skills: Structuur- & Stylingspecificatie

Om te voorkomen dat handmatige styling of inconsistente opmaak ontstaat bij het converteren van ruw lesmateriaal, wordt een specifieke **Agent Skill** vastgelegd in `.agents/skills/reveal-slide-builder/SKILL.md`. Deze skill definieert de interactie tussen de agent, het bronmateriaal uit `input/` en het gegenereerde `slides.md`.

### 4.1 Taken en Verantwoordelijkheden van de Skill
De agent skill dwingt de volgende regels af tijdens de generatie:
1. **Didactische ordening:** Toepassen van de Taxonomie van Bloom (starten met doelen, opdelen in conceptuele brokken, eindigen met reflectie/actieve opdrachten).
2. **Slide Architectuur:**
   * Horizontale slide-overgangen (`---`) voor hoofdthema's.
   * Verticale slide-overgangen (`--`) voor verdiepingen, uitwerkingen en codevoorbeelden.
3. **Styling & CSS Selectors:** Direct toepassen van GLR utilities (bijv. `.highlight`, `.glr-card`, `.terminal-window`) in de Markdown-annotaties.
4. **Code-optimalisatie:** Automatische toevoeging van Reveal.js line-highlighting tokens (zoals `[1-3|5|7-9]`) bij codefragmenten om cognitieve overbelasting te voorkomen.

### 4.2 Structuurvoorbeeld van `SKILL.md`
```markdown
# Skill: Reveal.js Presentation Builder (GLR CSD)

## Doel
Transformeer bronmateriaal uit `input/` naar een didactisch valide, toegankelijke en consistente `slides.md` binnen de repository.

## Vaste Syntax Regels
- Slides scheiden met `---` (horizontaal) en `--` (verticaal).
- Elke presentatie opent met een YAML-frontmatter met verplichte velden (titel, cohort, leerjaar, periode, tags).
- Lessen bevatten verplicht:
  1. Slide 2: Leerdoelen (geformuleerd als "Aan het einde van deze les kun je...").
  2. Actieve verwerkingsopdracht of check-in vraag per 5 inhoudelijke slides.
  3. Afsluitende samenvattende slide met vervolgstappen.
- Codeblokken MOETEN altijd een taaldeclaratie en regelaccentuering bevatten wanneer ze meer dan 4 regels tellen.
- Gebruik Reveal.js fragment-klassen (`<!-- .element: class="fragment" -->`) voor stapsgewijze opbouw van complexe concepten.
```

---

## 5. Metadata & Presentatiestandaard

Elke presentatie maakt gebruik van Markdown met een YAML-frontmatter block aan het begin van `slides.md`. Dit maakt geautomatiseerde indexering en filtering mogelijk.

### 5.1 Voorbeeld `slides.md`
```markdown
---
title: "Asynchrone JavaScript & Promises"
cohort: "2025-2026"
leerjaar: 1
periode: 2
auteur: "Docententeam CSD"
tags: ["JavaScript", "Frontend", "Async", "API"]
---

# Asynchrone JavaScript
### Werken met Promises en Async/Await
*Creative Software Developer — Grafisch Lyceum Rotterdam*

---

## Leerdoelen van vandaag
Aan het einde van deze les kun je:
1. Uitleggen waarom JavaScript single-threaded is.
2. Een API-aanroep uitvoeren met behulp van `fetch()`.
3. Foutafhandeling implementeren met `try...catch`.

---

## De Event Loop
De Event Loop zorgt ervoor dat JavaScript niet blokkeert:

```javascript [1|2|3]
console.log("Stap 1");
setTimeout(() => console.log("Stap 2"), 1000);
console.log("Stap 3");
```

<!-- .element: class="fragment" -->
*Merk op dat stap 3 vóór stap 2 verschijnt in de console!*
```

---

## 6. Automatisering: Index Generatie & PDF Export

### 6.1 Dynamische Portaalpagina (`scripts/build-index.js`)
Dit script scant recursief alle presentaties en bouwt een gestructureerd overzicht voor studenten en docenten op basis van directory-structuur en frontmatter.

```javascript
import fs from 'node:fs';
import path from 'node:path';

const presentationsRoot = './presentations';
const distDir = './dist';

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function getDirectories(srcPath) {
  return fs.readdirSync(srcPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(srcPath, dirent.name));
}

const presentations = [];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  if (files.includes('index.html') || files.includes('slides.md')) {
    const relPath = path.relative('./presentations', dir);
    presentations.push({
      path: relPath,
      name: path.basename(dir).replace(/^[0-9]+-/, '').replace(/-/g, ' ')
    });
  } else {
    for (const subDir of getDirectories(dir)) {
      scanDir(subDir);
    }
  }
}

scanDir(presentationsRoot);

const listItems = presentations.map(item => `
  <li class="presentation-item">
    <span class="title">${item.name}</span>
    <div class="links">
      <a class="btn" href="./${item.path}/">Presentatie</a>
      <a class="btn btn-secondary" href="./${item.path}/presentation.pdf" download>PDF</a>
    </div>
  </li>
`).join('\n');

const htmlTemplate = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GLR CSD — Lespresentaties</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #222; }
    h1 { color: #d6004b; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    ul { list-style: none; padding: 0; }
    .presentation-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; margin-bottom: 8px; border: 1px solid #e1e4e8; border-radius: 6px; }
    .presentation-item:hover { background-color: #f8f9fa; }
    .title { text-transform: capitalize; font-weight: 600; }
    .links a { text-decoration: none; margin-left: 8px; padding: 6px 12px; font-size: 14px; border-radius: 4px; }
    .btn { background: #d6004b; color: #fff; }
    .btn-secondary { background: #e1e4e8; color: #333; }
  </style>
</head>
<body>
  <h1>Creative Software Developer — Presentaties</h1>
  <p>Centraal archief voor theorie-, instructie- en workshopslides.</p>
  <ul>
    ${listItems}
  </ul>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), htmlTemplate);
```

### 6.2 GitHub Actions Pipeline (`.github/workflows/deploy.yml`)
> **Update:** de pipeline is gesplitst. `deploy.yml` bouwt en deployt alleen de site (met `paths`-filters); `pdfs.yml` rendert verouderde decks via **DeckTape** en uploadt ze naar de GitHub Release `pdfs`. Zie de README ("Deployment (CI/CD)"). Het voorbeeld hieronder is de oorspronkelijke, gecombineerde opzet.

De oorspronkelijke pipeline bouwde bij elke push naar `main` de volledige static website, exporteerde de presentaties naar PDF via **DeckTape** en publiceerde naar GitHub Pages.

```yaml
name: Deploy Presentations to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Prepare build directory
        run: |
          mkdir -p dist
          cp -r presentations dist/
          cp -r shared dist/

      - name: Build Index Page
        run: node scripts/build-index.js

      - name: Generate PDFs via DeckTape (Docker)
        run: |
          find dist/presentations -name "index.html" | while read -r presentation; do
            dir=$(dirname "$presentation")
            echo "Genereren PDF voor: $dir"
            docker run --rm -v "$(pwd)/$dir:/slides" astefanutti/decktape \
              --size 1920x1080 /slides/index.html /slides/presentation.pdf
          done

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 7. Didactische Richtlijnen & Best Practices (MBO CSD)

### 7.1 Cognitieve Belasting & Structuur (Cognitive Load Theory)
MBO-studenten hebben baat bij gestructureerde, voorspelbare presentaties:
* **Minder is meer:** Hanteer maximaal één concept of programmeerconstructie per slide.
* **Geen 'Wall of Text':** Gebruik codefragmenten met syntax highlighting en loop er interactief doorheen met Reveal.js *line highlighting* (`<pre><code data-line-numbers="2|4-6">`).
* **Taxonomie van Bloom:** Begin altijd met duidelijke, meetbare lesdoelen (Onthouden $\rightarrow$ Begrijpen $\rightarrow$ Toepassen) en sluit af met een concrete verwerkingsopdracht.

### 7.2 Toegankelijkheid (WCAG 2.1 AA)
* **Contrast:** Zorg voor een minimale contrastverhouding van 4.5:1 tussen tekst en achtergrond (zeker bij projectie op beamers en schermen in leslokalen).
* **Typografie:** Gebruik schreefloze lettertypen met een minimale korpsgrootte van 24px op 1080p presentaties.
* **Toetsenbordnavigatie:** Reveal.js ondersteunt standaard pijltoetsen en spatiebalk; test of custom elementen en embeds de focus niet vangen (geen keyboard traps).

---

## 8. Relevante Tools & Ecosysteem

1. **Reveal.js:** De basis-engine voor presentaties (open source, licentie MIT).
2. **DeckTape:** Headless Chrome-gebaseerde PDF exporter voor HTML5 presentatie-frameworks.
3. **reveal-md:** CLI-tool om presentaties direct lokaal te ontwikkelen zonder handmatige HTML wrapper-code.
4. **Mermaid.js:** Ondersteund door Reveal.js plugins; ideaal om flowcharts, ERD's en UML-sequencediagrammen direct via tekst te genereren.
5. **Agent Skills / Custom Instructions:** Hulpmiddel om prompts, stylingregels en didactische conventies direct te borgen in de repository.

---

## 9. Bronvermeldingen

* **Reveal.js Documentatie:** Hakim El Hattab. *Reveal.js Documentation & API*. https://revealjs.com/
* **DeckTape Repository:** Antonin Stefanutti. *DeckTape: High-quality PDF exporter for HTML5 presentations*. https://github.com/astefanutti/decktape
* **GitHub Pages & Actions:** GitHub Docs. *Continuous integration and deployment for GitHub Pages*. https://docs.github.com/en/pages
* **Sweller, J. (1988):** *Cognitive Load During Problem Solving: Effects on Learning*. Cognitive Science, 12(2), 257-285.
* **W3C:** *Web Content Accessibility Guidelines (WCAG) 2.1*. World Wide Web Consortium. https://www.w3.org/TR/WCAG21/