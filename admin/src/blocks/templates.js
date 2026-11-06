/**
 * De 9 visuele slide-templates onder "+ Nieuwe Slide" (3x3-raster).
 *
 * Elk template is Markdown + één (of meer) HTML-blokken zonder lege regels, zodat
 * elk onderdeel meteen via het Properties Panel te bewerken is. De opbouw volgt
 * de bestaande decks (.row/.col, .cards, .rows, .opcard, .timer) en de skills
 * `reveal-slide-builder` en `educational-presentation-nl` (Assertion-Evidence,
 * uitgewerkt voorbeeld, concepttoets / Peer Instruction).
 *
 * De bouwstenen (timer, footer, bewijs-rij, worked example, quizkaarten) worden
 * ook gebruikt door de les-flows in `pedagogy/frameworks.js`.
 */
import { terminalHtml } from './md-forms.js';

export const SLIDE_TEMPLATES = [
  { kind: 'standard', label: 'Standaard Slide', hint: 'Kicker + Titel + Tekst', icon: 'file-text' },
  { kind: 'hero', label: 'Hoofdstuk / Hero Slide', hint: 'Grote titel op donkere achtergrond', icon: 'hero' },
  { kind: 'columns', label: 'Twee Kolommen', hint: 'Titel + twee kolommen naast elkaar', icon: 'columns' },
  { kind: 'cards', label: '3 Kernkaarten', hint: 'Titel + drie GLR-kaarten', icon: 'layout-grid' },
  { kind: 'steps', label: 'Stappenplan / Agenda', hint: 'Titel + drie genummerde stappen', icon: 'steps' },
  { kind: 'assignment', label: 'Opdracht & Timer', hint: 'Opdrachtkaart + timer van 15:00', icon: 'assignment' },
  { kind: 'assertion', label: 'Assertion-Evidence', hint: 'Stelling als titel + visueel bewijs', icon: 'lede' },
  { kind: 'worked', label: 'Worked Example', hint: 'Aanpak + code stap-voor-stap', icon: 'terminal' },
  { kind: 'quiz', label: 'Begripscheck / Quiz', hint: '3 opties, juiste licht op na klik', icon: 'circle-help' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pad2 = (n) => String(n).padStart(2, '0');
const indentLines = (html, pad) => html.split('\n').map((l) => `${pad}${l}`).join('\n');

/** Werkvorm-timer (zelfde opbouw als de bestaande decks). De eerste regel is niet ingesprongen. */
export function timerHtml(minutes = 15, label = 'Opdracht', indent = '    ') {
  const t = `${pad2(minutes)}:00`;
  return [
    `<div class="timer" data-timer="${t}" role="group" aria-label="Timer ${minutes} minuten">`,
    `${indent}  <div class="t-dial">`,
    `${indent}    <svg viewBox="0 0 120 120" aria-hidden="true">`,
    `${indent}      <circle class="t-track" cx="60" cy="60" r="54"></circle>`,
    `${indent}      <circle class="t-prog" cx="60" cy="60" r="54"></circle>`,
    `${indent}    </svg>`,
    `${indent}    <div class="t-face"><span class="t-time">${t}</span><span class="t-label">${esc(label)}</span></div>`,
    `${indent}  </div>`,
    `${indent}  <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>`,
    `${indent}</div>`,
  ].join('\n');
}

/** GLR-footer met paginanummer. */
export function footerHtml(text, number) {
  return `<div class="footer"><span>${esc(text)}</span><span class="num">${pad2(number)}</span></div>`;
}

/** Neutrale placeholder (inline SVG) voor visueel bewijs; vervang hem via het Afbeelding-formulier. */
export const EVIDENCE_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'%3E%3Crect width='640' height='400' fill='%23F4F4F6'/%3E%3Crect x='10' y='10' width='620' height='380' fill='none' stroke='%23111111' stroke-width='3' stroke-dasharray='14 10'/%3E%3Ctext x='320' y='210' text-anchor='middle' font-family='sans-serif' font-size='26' fill='%23444444'%3EVisueel bewijs: diagram, grafiek of screenshot%3C/text%3E%3C/svg%3E";

/** `.row` met links een korte kern en rechts een figuur als visueel bewijs (Assertion-Evidence, geen bullets). */
export function evidenceRowHtml({
  kicker = 'Kern',
  core = 'Eén of twee zinnen die de stelling ondersteunen. De rest vertel je.',
  alt = 'Beschrijf hier wat het diagram of de afbeelding laat zien.',
  caption = 'Bron: …',
} = {}) {
  return [
    '<div class="row">',
    '  <div class="col vcenter">',
    `    <p class="kicker">${esc(kicker)}</p>`,
    `    <p class="lede">${esc(core)}</p>`,
    '  </div>',
    '  <div class="col">',
    '    <figure class="fig-fill">',
    `      <img src="${EVIDENCE_PLACEHOLDER}" alt="${esc(alt)}">`,
    `      <figcaption>${esc(caption)}</figcaption>`,
    '    </figure>',
    '  </div>',
    '</div>',
  ].join('\n');
}

/** Voorbeeldcode zonder lege regels (een lege regel zou het HTML-blok breken). */
export const WORKED_CODE = [
  'const studenten = await haalStudentenOp();',
  'const actief = studenten.filter((s) => s.actief);',
  '// Stap 2: maak er een herbruikbare functie van',
  'function toonNamen(lijst) {',
  "  return lijst.map((s) => s.naam).join(', ');",
  '}',
].join('\n');

/** `.row` met links de aanpak in stappen en rechts het codevoorbeeld met stapsgewijze regel-focus. */
export function workedRowHtml({ highlight = '1-2|4-6', code = WORKED_CODE, lang = 'javascript' } = {}) {
  return [
    '<div class="row">',
    '  <div class="col">',
    '    <p class="kicker">Aanpak</p>',
    '    <div class="rows rows--tight">',
    '      <div class="listrow"><span class="n">01</span><div><h3>Data ophalen</h3><p>Regel 1–2: haal de gegevens op en filter ze.</p></div></div>',
    '      <div class="listrow"><span class="n">02</span><div><h3>Functie schrijven</h3><p>Regel 4–6: maak er herbruikbare code van.</p></div></div>',
    '    </div>',
    '  </div>',
    '  <div class="col">',
    indentLines(terminalHtml({ lang, highlight, text: code, title: lang }), '    '),
    '  </div>',
    '</div>',
  ].join('\n');
}

/**
 * `.cards` met antwoordopties. Alle opties zijn direct zichtbaar; de juiste
 * kaart krijgt `glr-card--accent fragment custom` en licht pas na een klik
 * lime op (zie `.glr-card--accent.fragment.custom` in glr-theme.css).
 */
export function quizCardsHtml({
  options = ['Antwoord A', 'Antwoord B', 'Antwoord C'],
  correct = 1,
  explain = ['Waarom klopt dit (niet)?', 'Dit is het juiste antwoord, omdat …', 'Waarom klopt dit (niet)?'],
} = {}) {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  return [
    '<div class="cards">',
    ...options.map((o, i) => `  <div class="glr-card${i === correct ? ' glr-card--accent fragment custom' : ''}"><span class="k">${letters[i]}</span><h3>${esc(o)}</h3><p>${esc(explain[i] || '')}</p></div>`),
    '</div>',
  ].join('\n');
}

/**
 * @param {string} kind
 * @param {{ number?: number, footerText?: string }} opts
 * @returns {string} slide-body (kan een `<!-- .slide: … -->`-regel bevatten)
 */
export function slideTemplateBody(kind, { number = 1, footerText = 'Vak · Onderwerp' } = {}) {
  const footer = footerHtml(footerText, number);
  switch (kind) {
    case 'hero':
      return [
        '<!-- .slide: class="bleed dark" data-background-color="#111111" -->',
        '',
        '<div class="bar" style="margin-top:150px"></div>',
        '<p class="kicker kicker--lime">Hoofdstuk · Onderwerp</p>',
        '<h1 class="title title--xl" style="color:#fff">Titel van het hoofdstuk</h1>',
        '<p class="lede" style="color:#EDEDED;font-size:30px">Korte inleidende regel.</p>',
        footer,
      ].join('\n');
    case 'columns':
      return [
        '## Titel van de slide',
        '',
        '<div class="row">',
        '  <div class="col">',
        '    <p class="kicker">Links</p>',
        '    <p class="body">Tekst voor de linkerkolom.</p>',
        '  </div>',
        '  <div class="col">',
        '    <p class="kicker">Rechts</p>',
        '    <p class="body">Tekst voor de rechterkolom.</p>',
        '  </div>',
        '</div>',
        '',
        footer,
      ].join('\n');
    case 'cards':
      return [
        '## Drie kernpunten',
        '',
        '<div class="cards">',
        '  <div class="glr-card"><span class="k">01</span><h3>Kernpunt</h3><p>Korte uitleg.</p></div>',
        '  <div class="glr-card glr-card--accent"><span class="k">02</span><h3>Kernpunt</h3><p>Korte uitleg.</p></div>',
        '  <div class="glr-card"><span class="k">03</span><h3>Kernpunt</h3><p>Korte uitleg.</p></div>',
        '</div>',
        '',
        footer,
      ].join('\n');
    case 'steps':
      return [
        '## Stappenplan',
        '',
        '<div class="rows">',
        '  <div class="listrow"><span class="n">01</span><div><h3>Eerste stap</h3><p>Wat gaan we doen?</p></div></div>',
        '  <div class="listrow"><span class="n">02</span><div><h3>Tweede stap</h3><p>Wat gaan we doen?</p></div></div>',
        '  <div class="listrow"><span class="n">03</span><div><h3>Derde stap</h3><p>Wat gaan we doen?</p></div></div>',
        '</div>',
        '',
        footer,
      ].join('\n');
    case 'assignment':
      return [
        '## Aan de slag',
        '',
        '<div class="row">',
        '  <div class="col">',
        '    <div class="opcard"><span class="k">Opdracht</span><h3>Titel van de opdracht</h3><p>Beschrijf wat de studenten gaan doen.</p></div>',
        '  </div>',
        '  <div class="col col--narrow">',
        `    ${timerHtml(15, 'Opdracht')}`,
        '  </div>',
        '</div>',
        '',
        footer,
      ].join('\n');
    case 'assertion':
      return [
        '<p class="kicker">Theorie · Assertion-Evidence</p>',
        '',
        '## Schrijf hier je kernboodschap als één volledige stelling',
        '',
        evidenceRowHtml(),
        '',
        footer,
      ].join('\n');
    case 'worked':
      return [
        '<p class="kicker">Worked Example · Stap voor stap</p>',
        '',
        '## Zo pak je het aan: loop stap voor stap door de code',
        '',
        workedRowHtml(),
        '',
        footer,
      ].join('\n');
    case 'quiz':
      return [
        '<p class="kicker">Begripscheck · Denk – stem – overleg</p>',
        '',
        '## Welke uitspraak klopt?',
        '',
        quizCardsHtml(),
        '',
        footer,
      ].join('\n');
    case 'sub':
      return ['## Sub-slide', '', 'Inhoud van deze sub-slide.', '', footer].join('\n');
    case 'standard':
    default:
      return [
        '<p class="kicker">Kicker · Onderwerp</p>',
        '',
        '## Titel van de slide',
        '',
        'Hier komt de tekst van je slide.',
        '',
        footer,
      ].join('\n');
  }
}
