# GLR CSD — Presentatie-monorepo

Reveal.js presentatie-monorepo voor de opleiding **Creative Software Developer
(MBO 4)** van het **Grafisch Lyceum Rotterdam**. Presentaties worden geschreven
als platte tekst (Markdown) volgens het *Slides-as-Code*-principe en gedeeld via
één centrale repository.

Zie voor de volledige architectuur en richtlijnen:
[`architectuur_reveal_js_monorepo.md`](architectuur_reveal_js_monorepo.md).

## Mappenstructuur

```text
.
├── .github/workflows/deploy.yml    # CI/CD: build, PDF-export en deploy naar GitHub Pages
├── .agents/skills/                 # Agent Skills (educational-presentation-nl + reveal-slide-builder)
├── input/                          # Lokale staging voor brondocumenten (niet in Git)
├── presentations/                  # De presentaties, per cohort/jaar/vak
├── shared/                         # Gedeelde assets
│   ├── css/glr-theme.css           # GLR-huisstijl (kleuren, typografie, utilities)
│   ├── fonts/                      # Space Grotesk + Hanken Grotesk (.ttf)
│   ├── img/glr-logo.svg            # Logo
│   ├── js/glr-plugins.js           # Gedeelde plugins/controllers (timer, kleurenwiel)
│   └── vendor/                     # reveal.js, KaTeX + chalkboard (gegenereerd met `npm run vendor`)
├── scripts/
│   ├── build-index.js              # Bouwt de portaalpagina (dist/index.html)
│   ├── export-pdf.js               # PDF-export via DeckTape
│   ├── vendor-reveal.js            # Kopieert reveal.js uit node_modules
│   └── vendor-plugins.js           # Kopieert KaTeX + haalt chalkboard/customcontrols op
├── package.json
└── README.md
```

## Snelstart

Vereist Node.js ≥ 20.

```bash
npm install          # installeert reveal.js en tooling
npm run vendor       # zet reveal.js klaar in shared/vendor/ (offline)
npm run serve        # start een lokale server op http://localhost:3000
```

Open daarna een presentatie via de server, bijvoorbeeld
`http://localhost:3000/presentations/…/index.html`. De markdown-plugin haalt
`slides.md` op via HTTP, dus open presentaties **niet** via `file://`.

## Een nieuwe presentatie maken

1. Plaats het brondocument (`.pptx`, `.pdf`, `.docx`, …) in `input/`.
   Deze map staat in `.gitignore` en blijft dus strikt lokaal (AVG/auteursrecht).
2. Laat de Agent Skill **`reveal-slide-builder`** het bronmateriaal omzetten naar
   een `slides.md` die voldoet aan de syntax- en didactiekregels.
3. Kopieer de templates uit
   [`.agents/skills/reveal-slide-builder/templates/`](.agents/skills/reveal-slide-builder/templates)
   naar een nieuwe map onder
   `presentations/<cohort>/<jaar>/<vak>/<presentatie>/`.
4. Werk de YAML-frontmatter bij (titel, cohort, leerjaar, periode, tags) en
   bekijk het resultaat met `npm run serve`.

> **Diepte van presentatiemappen.** De gedeelde wrapper `index.html` verwijst met
> `../../../../../shared/` naar de gedeelde map — dat werkt zolang een
> presentatie 5 niveaus onder de repo-root staat
> (`presentations/<cohort>/<jaar>/<vak>/<presentatie>/`). Nest je dieper of
> ondieper, pas dan het aantal `../` in `index.html` aan.

> **Markdown-scheidingstekens & frontmatter.** De wrapper splitst `slides.md`
> met `data-separator="\n---\n\n"` en `data-separator-vertical="\n--\n\n"`.
> Horizontale (`---`) en verticale (`--`) scheiders hebben dus **steeds een lege
> regel ervoor én erna**. Dat is bewust: het YAML-frontmatter-blok bovenin
> `slides.md` (dat geen lege regel rond de `---` heeft) wordt dan niet als slide
> gezien. Zet in de frontmatter als laatste regel
> `<!-- .slide: data-visibility="hidden" -->`; de markdown-plugin maakt er één
> sectie van die reveal.js direct weer verbergt. Zo blijft de frontmatter
> beschikbaar voor de portaalpagina (`scripts/build-index.js`) zonder als lege
> of tekstslide in de presentatie te verschijnen.

## Scripts

| Commando | Wat het doet |
|---|---|
| `npm run vendor` | Zet reveal.js en KaTeX (uit `node_modules`) plus de chalkboard/customcontrols-plugins klaar in `shared/vendor/` (offline) |
| `npm run build:index` | Bouwt de portaalpagina `dist/index.html` (opvouwbare directory-tree met zoekfunctie) uit de presentaties + frontmatter |
| `npm run build` | `vendor` + `build:index` |
| `npm run export:pdf` | Exporteert elke presentatie naar `presentation.pdf` via DeckTape (Docker) |
| `npm run export:pdf -- --local` | Idem, maar met een lokaal geïnstalleerde `decktape` |
| `npm run export:pdf:cached` | CI-variant met incrementele caching: rendert alleen gewijzigde presentaties, de rest komt uit de GitHub Actions-cache. `-- --dry-run` toont de cache-status zonder te bouwen |
| `npm run serve` | Start een statische server in de repo-root |

## Plugins in de presentaties

Elke presentatie laadt naast de standaardplugins ook:

- **Math (KaTeX)** — formules als `$…$` (inline) of `$$…$$` (los blok). KaTeX
  wordt lokaal meegeleverd via `shared/vendor/katex`, dus dit werkt **offline**.
- **Chalkboard + custom controls** — teken tijdens de les op de slides: `B` voor
  het (chalk)bord, `C` voor de notitie-canvas en `Del` om te wissen. De knoppen
  staan linksonder.

De PDF-export draait met `?showNotes=true`, zodat de sprekersnotities in de PDF
terechtkomen. Op de portaalpagina opent de knop **Presentatie** in een nieuw
tabblad en staat een korte uitleg met een link naar de reveal.js-documentatie.

## Deployment (CI/CD)

Bij elke push naar `main` draait `.github/workflows/deploy.yml`: dependencies
installeren, reveal.js vendoren, de `dist/`-map opbouwen, per presentatie een PDF
genereren en het geheel publiceren naar **GitHub Pages**. De portaalpagina
(`dist/index.html`) toont alle presentaties als een opvouwbare mapstructuur
(`cohort / jaar / vak / presentatie`) met per map het aantal presentaties, een
zoekveld dat live filtert en markeert, en knoppen om alles in of uit te klappen.
Per presentatie staan er links naar de slides en de PDF.

### Incrementele PDF-builds (caching)

PDF's worden niet gecommit; zonder caching zou élke run alle decks opnieuw
renderen. `scripts/export-pdf-cached.js` cached daarom **per presentatie**:

- Per deck wordt een **content-hash** berekend over alle bestanden in de
  presentatiemap (m.u.v. de gegenereerde PDF) plus een `sharedHash` over alle
  gedeelde assets (`shared/**`), de DeckTape-image en het script zelf.
- De cache-key is content-addressed (`pdf-v1-<pad>-<hash>`): wijzigt één deck,
  dan wordt alleen dat deck opnieuw gerenderd; wijzigt iets gedeelds (thema,
  reveal.js, DeckTape-versie), dan alles.
- De runtime-tokens van de GitHub-cache (`ACTIONS_RUNTIME_TOKEN`,
  `ACTIONS_RESULTS_URL`) zijn alleen beschikbaar in JavaScript-actions, niet in
  `run:`-stappen. De workflow exporteert ze daarom eerst via
  `actions/github-script` naar `GITHUB_ENV`.
- DeckTape is vastgepind op `astefanutti/decktape:3.12.0` (i.p.v. `latest`) voor
  reproduceerbare cache-keys, en draait met `--user "$(id -u):$(id -g)"` zodat de
  PDF's eigendom van de runner zijn.
- Caching is **best-effort**: ontbreekt de runtime of faalt de cache-service, dan
  valt de export terug op onvoorwaardelijk bouwen (het oude gedrag).

## Conventies

- **Slides-as-Code**: inhoud in Markdown met YAML-frontmatter; opmaak via de
  GLR-huisstijl (`shared/css/glr-theme.css`), niet via ad-hoc HTML/CSS.
- **Markdown-scheiding**: horizontale `---` en verticale `--` elk met een lege
  regel ervoor én erna; de frontmatter sluit af met
  `<!-- .slide: data-visibility="hidden" -->` (zie de noot bij "Een nieuwe
  presentatie maken").
- **Didactiek**: leerdoelen ("Aan het einde van deze les kun je…"), actieve
  verwerkingsopdrachten en een afsluitende samenvatting. Zie de skill
  `reveal-slide-builder` en `educational-presentation-nl`.
- **Toegankelijkheid**: WCAG 2.1 AA — contrast ≥ 4.5:1, broodtekst ≥ 24px,
  beschrijvende `alt`-tekst.

> **Skills-locatie.** Skills staan in `.agents/skills/` — de locatie die de
> agentskills-runtime leest (zie `skills-lock.json`). Zowel
> `educational-presentation-nl` (didactiek) als `reveal-slide-builder`
> (reveal.js-syntax en -structuur) staan hier.
