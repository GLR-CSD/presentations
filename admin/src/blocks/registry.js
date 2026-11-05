/**
 * Blokken-registry: de 1-klik Blokken-toolbar + de Schema-Registry die de
 * pop-over-inspectors aanstuurt voor bekende GLR-componenten.
 *
 * Alleen blokken die écht in shared/css/glr-theme.css en
 * shared/js/glr-plugins.js bestaan worden aangeboden. HTML-componenten worden
 * als beschermd `htmlBlock` ingevoegd (Optie A).
 */
import { htmlBlock, commentBlock } from './snippets.js';

/* ------------------------------------------------------------- categorieën -- */

/** De vier visueel gescheiden categorieën boven het canvas (in volgorde). */
export const BLOCK_CATEGORIES = [
  { id: 'typography', label: 'Typografie' },
  { id: 'layout', label: 'Layout & Kaarten' },
  { id: 'code', label: 'Code & Media' },
  { id: 'interact', label: 'Interactie & Slide-onderdelen' },
];

const CARDS_STD = '<div class="cards">\n  <div class="glr-card"><span class="k">01</span><h3>Titel</h3><p>Omschrijving.</p></div>\n  <div class="glr-card"><span class="k">02</span><h3>Titel</h3><p>Omschrijving.</p></div>\n</div>';
const CARDS_ACCENT = '<div class="cards">\n  <div class="glr-card glr-card--accent"><span class="k">01</span><h3>Titel</h3><p>Omschrijving.</p></div>\n  <div class="glr-card glr-card--accent"><span class="k">02</span><h3>Titel</h3><p>Omschrijving.</p></div>\n</div>';

/* ------------------------------------------------------------------ blokken -- */

/** @type {Array<{id:string,label:string,category:string,icon:string,tooltip:string,html?:string,action?:Function,variants?:Array,upload?:boolean}>} */
export const BLOCKS = [
  /* ------------------------------------------------------------- Typografie */
  { id: 'bold', label: 'Vet', category: 'typography', icon: 'bold', tooltip: 'Maak de geselecteerde tekst vet (B).', action: (c) => c.toggleBold() },
  { id: 'italic', label: 'Cursief', category: 'typography', icon: 'italic', tooltip: 'Maak de geselecteerde tekst cursief (I).', action: (c) => c.toggleItalic() },
  { id: 'heading', label: 'Kop', category: 'typography', icon: 'heading', tooltip: 'Voeg een kop toe (H1, H2 of H3).', variants: [
    { label: 'Kop 1 (H1)', icon: 'heading', action: (c) => c.toggleHeading({ level: 1 }) },
    { label: 'Kop 2 (H2)', icon: 'heading', action: (c) => c.toggleHeading({ level: 2 }) },
    { label: 'Kop 3 (H3)', icon: 'heading', action: (c) => c.toggleHeading({ level: 3 }) },
  ] },
  { id: 'paragraph', label: 'Tekst', category: 'typography', icon: 'type', tooltip: 'Gewone alinea / lopende tekst.', action: (c) => c.setParagraph() },
  { id: 'kicker', label: 'Kicker', category: 'typography', icon: 'kicker', tooltip: 'Kleine bovenregel die het onderwerp inleidt.', html: '<p class="kicker">Label</p>' },
  { id: 'lede', label: 'Lede', category: 'typography', icon: 'lede', tooltip: 'Korte inleidende regel onder een titel.', html: '<p class="lede">Korte inleidende regel.</p>' },
  { id: 'bullet', label: 'Bullet-lijst', category: 'typography', icon: 'list', tooltip: 'Opsomming met bullets.', action: (c) => c.toggleBulletList() },
  { id: 'ordered', label: 'Genummerde lijst', category: 'typography', icon: 'list-ordered', tooltip: 'Genummerde opsomming.', action: (c) => c.toggleOrderedList() },
  { id: 'highlight', label: 'Highlight', category: 'typography', icon: 'highlight', tooltip: 'Markeer een kernbegrip met de lime-highlight.', html: '<span class="highlight">kernbegrip</span>' },

  /* -------------------------------------------------------- Layout & Kaarten */
  { id: 'columns', label: '2 Kolommen', category: 'layout', icon: 'columns', tooltip: 'Twee kolommen naast elkaar (.glr-columns).', html: '<div class="glr-columns">\n<div class="glr-col">\nLinks\n</div>\n<div class="glr-col">\nRechts\n</div>\n</div>' },
  { id: 'cards', label: 'GLR Kaarten', category: 'layout', icon: 'layout-grid', tooltip: 'Kaarten-rij in GLR-huisstijl (standaard of accent).', variants: [
    { label: 'Kaarten (standaard)', icon: 'layout-grid', html: CARDS_STD },
    { label: 'Kaarten (accent)', icon: 'layout-grid', html: CARDS_ACCENT },
  ] },
  { id: 'rows', label: 'Stappenrij', category: 'layout', icon: 'rows', tooltip: 'Genummerde stappenrij (.listrow).', html: '<div class="rows">\n  <div class="listrow"><span class="n">01</span><div><h3>Stap</h3><p>Uitleg.</p></div></div>\n  <div class="listrow"><span class="n">02</span><div><h3>Stap</h3><p>Uitleg.</p></div></div>\n</div>' },
  { id: 'defbox', label: 'Definitiebox', category: 'layout', icon: 'book', tooltip: 'Kader met een begrip en de definitie (.defbox).', html: '<div class="defbox"><span class="k">Begrip</span><p>De <strong>definitie</strong> van het begrip.</p></div>' },
  { id: 'callout', label: 'Callout', category: 'layout', icon: 'info', tooltip: 'Uitgelichte waarschuwing of aanwijzing (.callout).', html: '<div class="callout"><span class="dot"></span><div><h3>Let op</h3><p>Belangrijke aanwijzing.</p></div></div>' },
  { id: 'opcard', label: 'Opdrachtkaart', category: 'layout', icon: 'clipboard', tooltip: 'Opdrachtkader voor de student (.opcard).', html: '<div class="opcard"><span class="k">Opdracht</span><h3>Titel</h3><p>Wat ga je doen?</p></div>' },
  { id: 'check', label: 'Checklist', category: 'layout', icon: 'list-checks', tooltip: 'Afvinkbare checklist (.check).', html: '<ul class="check">\n  <li>Eerste punt</li>\n  <li>Tweede punt</li>\n</ul>' },
  { id: 'hr', label: 'Scheidingslijn', category: 'layout', icon: 'minus', tooltip: 'Horizontale scheidingslijn.', action: (c) => c.insertContent({ type: 'hr' }) },

  /* ----------------------------------------------------------- Code & Media */
  { id: 'code', label: 'Codeblok', category: 'code', icon: 'code', tooltip: 'Codeblok met syntaxmarkering en line-highlighting.', action: (c) => c.insertContent({ type: 'codeBlock', attrs: { lang: 'javascript', highlight: '' }, content: [{ type: 'text', text: 'const antwoord = 42;' }] }) },
  { id: 'terminal', label: 'Terminalvenster', category: 'code', icon: 'terminal', tooltip: 'Terminalvenster met een commando (.terminal-window).', html: '<div class="terminal-window">\n  <div class="terminal-window__bar"><span class="dot"></span><span class="dot"></span><span class="dot dot--lime"></span><span class="title">bash</span></div>\n  <pre><code>npm run serve</code></pre>\n</div>' },
  { id: 'image', label: 'Afbeelding', category: 'code', icon: 'image', tooltip: 'Afbeelding toevoegen (uploaden vanaf computer of via URL).', upload: true },
  { id: 'bar', label: 'Accentbalk', category: 'code', icon: 'bar', tooltip: 'Lime accentbalk als visueel anker (.bar).', html: '<div class="bar"></div>' },
  { id: 'pill', label: 'Pill', category: 'code', icon: 'pill', tooltip: 'Klein label in een pill-vorm.', html: '<p><span class="pill">Label</span></p>' },

  /* --------------------------------------------- Interactie & Slide-onderdelen */
  { id: 'timer', label: 'Timer', category: 'interact', icon: 'timer', tooltip: 'Interactieve afteltimer (.timer).', html: '<div class="timer" data-timer="05:00" role="group" aria-label="Timer 5 minuten">\n  <div class="t-dial">\n    <svg viewBox="0 0 120 120" aria-hidden="true">\n      <circle class="t-track" cx="60" cy="60" r="54"></circle>\n      <circle class="t-prog" cx="60" cy="60" r="54"></circle>\n    </svg>\n    <div class="t-face"><span class="t-time">05:00</span><span class="t-label">Overleg</span></div>\n  </div>\n  <div class="t-btns"><button class="t-btn t-start" type="button">Start</button><button class="t-btn t-reset" type="button">Reset</button></div>\n</div>' },
  { id: 'wheel', label: 'Kleurenwiel', category: 'interact', icon: 'palette', tooltip: 'Kleurenwiel met harmonie-uitleg (.harm-wheel).', html: '<div class="harm"><span class="harm-wheel" data-hues="0,6"></span><div class="harm-txt"><h3>Complementair</h3><p>Tegenover elkaar — veel contrast.</p></div></div>' },
  { id: 'footer', label: 'Footer', category: 'interact', icon: 'footer', tooltip: 'Vaste slide-footer met vak en paginanummer (.footer).', html: '<div class="footer"><span>Vak · Onderwerp</span><span class="num">01</span></div>' },
  { id: 'rawhtml', label: 'Custom HTML', category: 'interact', icon: 'braces', tooltip: 'Vrij HTML-blok voor maatwerk (blijft beschermd).', action: (c) => c.insertContent(htmlBlock('<div class="grid2">\n  <div>Kolom A</div>\n  <div>Kolom B</div>\n</div>')) },
];

/** Voegt een blok in op de cursorpositie. */
export function insertBlock(editor, def) {
  if (def.action) editor.run(def.action);
  else if (def.html) editor.run((c) => c.insertContent(htmlBlock(def.html)));
}

/** Voegt een variant (uit een dropdown) in — werkt exact als een blok. */
export function insertVariant(editor, variant) {
  insertBlock(editor, variant);
}

export { commentBlock };

