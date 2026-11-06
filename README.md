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
├── .github/workflows/deploy.yml    # CI/CD: site-deploy (deploy.yml) + PDF-build (pdfs.yml)
├── .github/workflows/pdfs.yml      # Rendert verouderde PDF's naar de 'pdfs'-release
├── .agents/skills/                 # Agent Skills (educational-presentation-nl + reveal-slide-builder)
├── admin/                          # GLR Slide Studio (visuele editor)
│   ├── index.html                  # Shell die de gebundelde Studio laadt
│   ├── src/                        # Broncode (ESM-modules: parser, editor, preview, opslag)
│   └── vendor/                     # Gebundelde Studio + libs (gegenereerd met `npm run vendor`)
├── input/                          # Lokale staging voor brondocumenten (niet in Git)
├── presentations/                  # De presentaties, per cohort/jaar/vak
├── shared/                         # Gedeelde assets
│   ├── css/glr-theme.css           # GLR-huisstijl (kleuren, typografie, utilities)
│   ├── fonts/                      # Space Grotesk + Hanken Grotesk (.ttf)
│   ├── img/glr-logo.svg            # Logo
│   ├── img/uploads/                # Door docenten geüploade afbeeldingen (via /admin)
│   ├── js/glr-plugins.js           # Gedeelde plugins/controllers (timer, kleurenwiel)
│   └── vendor/                     # reveal.js, KaTeX + chalkboard (gegenereerd met `npm run vendor`)
├── scripts/
│   ├── build-index.js              # Portaalpagina (dist/index.html) + shells + deck-manifest naar dist
│   ├── export-pdf.js               # PDF-export via DeckTape
│   ├── vendor-reveal.js            # Kopieert reveal.js uit node_modules
│   ├── vendor-plugins.js           # Kopieert KaTeX + haalt chalkboard/customcontrols op
│   ├── vendor-editor.js            # Bundelt de GLR Slide Studio (esbuild) naar admin/vendor/
│   ├── test-roundtrip.js           # Verliesvrije parse/serialize-test op alle decks
│   └── test-bridge.js              # Markdown ↔ ProseMirror-fidelity-test
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
> regel ervoor én erna**. Het frontmatter-blok bovenin `slides.md` staat tussen de
> HTML-comment-markers `<!-- frontmatter` en `-->`; Reveal.js ziet dat als een
> (onzichtbare) comment, zodat de `---` scheiders nooit met YAML-frontmatter worden
> verward. De portaalpagina (`scripts/build-index.js`) leest de YAML tussen de
> markers (en ondersteunt voor oudere decks ook het `--- … ---`-formaat).

## Slides bewerken met de GLR Slide Studio (`/admin/`)

Minder technische collega's bewerken de presentaties **visueel** met de
**GLR Slide Studio** — een offline-first visuele editor die op GitHub Pages
draait onder [`/admin/`](https://GLR-CSD.github.io/presentations/admin/).
De Studio werkt volledig **zonder externe CDN's**: alle libraries zijn lokaal
gebundeld in `admin/vendor/` (zie `scripts/vendor-editor.js`).

Kenmerken:

- **Altijd zichtbare 1-op-1 Reveal.js-preview** naast de editor: elke wijziging
  is direct zichtbaar, zonder pagina-refresh en zonder terug te springen naar
  slide 1. Je kunt ook op een element in de preview klikken om het te bewerken.
- **Visueel / Split / Source**: WYSIWYG bewerken (Tiptap/ProseMirror), een
  CodeMirror 6-bronweergave of beide naast elkaar.
- **Beschermde HTML-blokken (Optie A)**: grids, kaarten, timers en GLR-plugins
  zijn niet per ongeluk kapot te typen; een klik opent een inspector voor de
  tekst of parameters (bijv. `data-timer`, `data-hues`).
- **Slide-navigator** links met drag-and-drop herordening (SortableJS) en een
  **Inspector** rechts voor `<!-- .slide: … -->`-layouts, sprekersnotities en
  deck-metadata.
- **Opslaan**: rechtstreeks naar `main` via de GitHub API (één atomaire commit
  per keer), lokaal wegschrijven via de File System Access API, of downloaden.

De `.html`-shell naast elk deck wordt bij de build automatisch gegenereerd
(`scripts/build-index.js`); de Studio schrijft alleen de `slides.md`.

### Eenmalig: een Fine-Grained Personal Access Token (PAT) aanmaken

1. Ga naar <https://github.com/settings/personal-access-tokens/new?name=GLR%20Slide%20Studio&contents=write&actions=read> (de "Template-URL" vult de tokennaam en de *Contents: read & write*-rechten alvast in).
2. **Resource owner:** kies de organisatie **`GLR-CSD`** (een organisatiebeheerder
   moet de token mogelijk eerst goedkeuren).
3. **Repository access:** *Only select repositories* → **`presentations`**.
4. **Repository permissions:**
   - **Contents:** *Read and write* — presentaties en afbeeldingen lezen/schrijven
     (de Studio commit rechtstreeks naar `main`, zonder Pull Requests).
   - **Actions:** *Read-only* (optioneel) — nodig voor de live build-status na het opslaan.
     Zonder dit recht toont de Studio een aftelling van 60 seconden in plaats van de echte status.
   - *Metadata* staat standaard op *Read-only*; laat dat zo.
5. **Expiration:** kies een redelijke geldigheidsduur en genereer de token.
6. **Kopieer de token direct** (hij is daarna niet meer zichtbaar) en bewaar hem
   veilig, bijvoorbeeld in een wachtwoordmanager.

> Deel de token nooit in de repository of in een chatbericht: hij geeft
> schrijftoegang tot de presentaties.

### De Studio openen

1. Open <https://GLR-CSD.github.io/presentations/admin/> (of lokaal via
   `npm run serve` → `/admin/`).
2. Kies **Deck openen** en selecteer een presentatie uit de lijst (die direct uit
   het gegenereerde `presentations-manifest.json` komt — geen token nodig).
3. Voor **opslaan naar GitHub**: kies **Opslaan ▾ → GitHub-token instellen…** en
   plak de PAT. Daarna schrijft **Opslaan ▾ → Naar GitHub (main)** de `slides.md`
   in één atomaire commit naar `main`.
4. Voor **offline werken**: kies **Opslaan ▾ → Lokaal wegschrijven…** en koppel
   de map, of gebruik **Download .md**.

### Slides maken in de Studio

- Voeg slides toe met **+ Nieuwe slide** of **+ Verticale slide** (`---` resp.
  `--`), herorden ze door te slepen in de linkernavigator, of gebruik het
  `⋮`-menu voor dupliceren/verwijderen.
- De **Blokken-toolbar** biedt kant-en-klare GLR-bouwstenen: kicker, lede,
  kaarten, genummerde lijst, definitieblok, callout, checklist, opdrachtkaart,
  twee kolommen, terminalvenster, codeblok, timer, kleurenwiel, footer en meer.
- Bewerk slide-layout (`<!-- .slide: … -->`), sprekersnotities (`Note:`) en
  deck-metadata via de **Inspector** rechts.
- Afbeeldingen die je uploadt komen in `shared/img/uploads/` en worden als
  `/presentations/shared/img/uploads/…` in de Markdown gezet.

### Build-status na opslaan

Na **Opslaan** (online) toont de Studio in de topbar een indicator: *wachten tot de
build start* → *GitHub Pages bouwt (~45-60 s)* → *Gepubliceerd!* met een link naar de live
presentatie. De Studio vraagt elke 5 seconden (maximaal 3 minuten) de GitHub Actions-run van
`deploy.yml` op. Heeft het token geen *Actions: read*-recht (HTTP 403/404), dan volgt een
aftelling van 60 seconden. Via de **Actions**-link zie je altijd de echte logs.

## AI Les-Assistent (Claude.ai, Gemini, ChatGPT)

De knop **AI Assistent** in de topbar helpt collega's die AI gewoon in de browser gebruiken
(geen installatie, geen clone van de repo nodig):

1. Kies een didactisch model (Gagné, ABT, Sparkline, Stand-up, …), vul onderwerp, vak,
   leerjaar en periode in en plak eventueel brontekst.
2. **1. Kopieer Prompt naar Klembord** en open Claude.ai, Gemini, ChatGPT of Copilot
   (snelkoppelingen in de modal). De prompt bevat de GLR-opmaakregels en alle componenten.
3. Plak het antwoord terug en klik **2. Laad Presentatie in Studio**: het deck wordt
   gevalideerd en opent op het 16:9-canvas (daarna Opslaan).

> Het `input/` mapje voor brondocumenten kan alleen **lokaal** worden uitgelezen. In de online
> versie plak je de tekst dus zelf in het tekstvak. Werk je offline met een gekoppelde map
> (**Map koppelen** → repo-root), dan kun je een tekstbestand (`.md`, `.txt`, `.html`) uit
> `input/` kiezen. PDF en PowerPoint lees je met de MCP-server (zie hieronder).

## MCP-server (Claude Desktop, Claude Code, Cursor, VS Code)

`scripts/mcp-server.js` laat een AI-assistent rechtstreeks met de decks werken en hergebruikt
daarvoor dezelfde verliesvrije modules als de Studio (`admin/src/`). Tweede tab in de
AI-assistent-modal bevat kopieerbare configuraties.

**Installeren:** `npm install`, daarna het blok voor jouw app (pad aanpassen):

```json
{
  "mcpServers": {
    "glr-slides": {
      "command": "node",
      "args": ["/VOLLEDIG/PAD/NAAR/presentations/scripts/mcp-server.js"],
      "env": { "GITHUB_TOKEN": "optioneel — alleen om te publiceren" }
    }
  }
}
```

*Claude Code* leest het meegeleverde `.mcp.json` in de repo-root automatisch. In *VS Code*
(`.vscode/mcp.json`) heet de sleutel `servers` en komt er `"type": "stdio"` bij.

| Onderdeel | Inhoud |
|---|---|
| Resources | `glr://decks/manifest`, `glr://input/files`, `glr://components/catalog`, `glr://pedagogy/guidelines` |
| Tools (invoer) | `list_input_documents`, `read_input_document` (md, txt, html, **pptx**, **pdf**) — alleen lokaal; online volgt een melding om de tekst in de chat te plakken |
| Tools (decks) | `list_presentations`, `get_presentation`, `create_presentation`, `add_slide`, `update_slide_component` (velden, herhalers zoals kaarten/stappen, html, markdown), `insert_component_on_slide`, `update_slide_properties`, `manage_slides` |
| Tools (didactiek) | `analyze_presentation_pedagogy`, `apply_pedagogical_fix` |
| Tools (GitHub) | `publish_deck_to_github` (atomaire commit + live-URL; bouwen duurt nog ~45-90 s), `check_github_build_status` |
| Prompts | `van-input-naar-presentatie`, `maak-theorieles-gagne`, `maak-werkles-standup`, `didactische-les-review` |

Omgevingsvariabelen: `GLR_REPO_ROOT` (andere werkmap), `GITHUB_TOKEN` of `GLR_GITHUB_TOKEN`,
`GLR_GITHUB_REPO` (`owner/repo`, standaard `GLR-CSD/presentations`). Slides zijn 1-gebaseerd,
`blockIndex` 0-gebaseerd. Zonder token werkt alles lokaal; alleen publiceren en build-status
hebben een token nodig.

## Scripts

| Commando | Wat het doet |
|---|---|
| `npm run vendor` | Zet reveal.js en KaTeX (uit `node_modules`) plus de chalkboard/customcontrols-plugins klaar in `shared/vendor/`, en bundelt de GLR Slide Studio (esbuild) naar `admin/vendor/` — alles offline |
| `npm run build:index` | Bouwt de portaalpagina `dist/index.html` (opvouwbare directory-tree met zoekfunctie), genereert ontbrekende `.html`-shells voor losse `.md`-decks, schrijft het deck-manifest (`presentations-manifest.json`) en kopieert `admin/` + `shared/img/uploads/` naar `dist/` |
| `npm run build` | `vendor` + `build:index` |
| `npm run test:roundtrip` | Verifieert dat de deck-parser elke `slides.md` byte-identiek terugschrijft (verliesvrij) |
| `npm run test:bridge` | Meet de Markdown ↔ ProseMirror-fidelity van de visuele editor |
| `npm run test:parsers` | Test de HTML-boom, formulier-parsers, templates en didactische modules |
| `npm run test:deploy` | Test de logica van de build-indicator (queued → bouwen → live, 403-fallback) |
| `npm run test:mcp` | End-to-end test van de MCP-server via de MCP Client SDK (alle tools, resources en prompts) |
| `npm run mcp` | Start de MCP-server (stdio) |
| `npm run export:pdf` | Exporteert elke presentatie naar `presentation.pdf` via DeckTape (Docker) |
| `npm run export:pdf -- --local` | Idem, maar met een lokaal geïnstalleerde `decktape` |
| `npm run export:pdf:release` | CI-variant: rendert alleen verouderde decks (parallel) en uploadt ze naar de GitHub Release `pdfs`. `-- --dry-run` toont de status, `-- --force` bouwt alles |
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

Twee onafhankelijke workflows, elk met `paths`-filters zodat ze alleen draaien als dat nodig is:

| Workflow | Draait bij wijzigingen in | Doet | Duur |
|---|---|---|---|
| `deploy.yml` (site) | `presentations/`, `shared/`, `admin/`, `scripts/build-index.js`, `scripts/lib/`, vendor-scripts, `package*.json` | bouwt `dist/` + portaalpagina en deployt naar **GitHub Pages**; wacht nooit op PDF's | ~30-45 s |
| `pdfs.yml` (PDF's) | `presentations/`, `shared/`, `scripts/lib/`, export-/vendor-scripts, `package-lock.json` | rendert alleen verouderde decks (parallel, DeckTape) en uploadt ze naar de **GitHub Release `pdfs`** | ~10 s (niets te doen) tot ~2 min (alles) |

Alleen README/docs/tests/MCP-wijzigingen starten geen van beide. Via *Actions → Build PDFs →
Run workflow* (optie `force`) bouw je alle PDF's opnieuw. De Studio-build-indicator volgt
alleen `deploy.yml`; de PDF volgt enkele minuten later.

### PDF's op een GitHub Release

GitHub Pages vervangt bij elke deploy de héle site, dus PDF's staan als assets op de
release-tag `pdfs`. De state zit in de release zelf: elk asset heeft als label
`<pad> · <content-hash>`.

- De **content-hash** per deck dekt de deckmap, de gebruikte `shared/img/uploads/*`-
  afbeeldingen en een `sharedHash` over `shared/**`, de `reveal.js`/`katex`-versies uit
  `package-lock.json`, de vendor-scripts, de DeckTape-image (`3.17.0`) en de exportlogica.
  Zie `scripts/lib/pdf-assets.js`.
- De portaalpagina vergelijkt bij het bouwen de hash met de release en toont per deck
  **PDF** (actueel), **PDF + "oude versie — wordt bijgewerkt"**, of **"PDF volgt"** (nog
  niet beschikbaar, geen link). Zonder token (lokale build) worden links ongecontroleerd getoond.
- Na een upload/verwijdering start `pdfs.yml` `deploy.yml` opnieuw zodat de status
  ververst wordt.
- Vendor-output (`shared/vendor`, `admin/vendor`) wordt gecached (`.github/actions/vendor`);
  `npm ci` draait alleen bij een cache-miss.

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
