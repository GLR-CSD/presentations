/**
 * De 6 visuele slide-templates onder "+ Nieuwe Slide".
 *
 * Elk template is Markdown + één (of meer) HTML-blokken zonder lege regels, zodat
 * elk onderdeel meteen via het Properties Panel te bewerken is. De opbouw volgt
 * de bestaande decks (.row/.col, .cards, .rows, .opcard, .timer).
 */

export const SLIDE_TEMPLATES = [
  { kind: 'standard', label: 'Standaard Slide', hint: 'Kicker + Titel + Tekst', icon: 'file-text' },
  { kind: 'hero', label: 'Hoofdstuk / Hero Slide', hint: 'Grote titel op donkere achtergrond', icon: 'hero' },
  { kind: 'columns', label: 'Twee Kolommen', hint: 'Titel + twee kolommen naast elkaar', icon: 'columns' },
  { kind: 'cards', label: '3 Kernkaarten', hint: 'Titel + drie GLR-kaarten', icon: 'layout-grid' },
  { kind: 'steps', label: 'Stappenplan / Agenda', hint: 'Titel + drie genummerde stappen', icon: 'steps' },
  { kind: 'assignment', label: 'Opdracht & Timer', hint: 'Opdrachtkaart + timer van 15:00', icon: 'assignment' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TIMER = `<div class="timer" data-timer="15:00" role="group" aria-label="Timer 15 minuten">
      <div class="t-dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="t-track" cx="60" cy="60" r="54"></circle>
          <circle class="t-prog" cx="60" cy="60" r="54"></circle>
        </svg>
        <div class="t-face"><span class="t-time">15:00</span><span class="t-label">Opdracht</span></div>
      </div>
      <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>
    </div>`;

/**
 * @param {string} kind
 * @param {{ number?: number, footerText?: string }} opts
 * @returns {string} slide-body (kan een `<!-- .slide: … -->`-regel bevatten)
 */
export function slideTemplateBody(kind, { number = 1, footerText = 'Vak · Onderwerp' } = {}) {
  const n = String(number).padStart(2, '0');
  const footer = `<div class="footer"><span>${esc(footerText)}</span><span class="num">${n}</span></div>`;
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
        `    ${TIMER}`,
        '  </div>',
        '</div>',
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
