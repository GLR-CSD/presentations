/**
 * Prompt-bouwer en output-validator voor de "AI Les-Assistent".
 *
 * Puur (geen DOM): wordt gebruikt door de Studio-modal (browser-LLM's) én door
 * de MCP-server (prompts en resources). De prompt is model-onafhankelijk, zodat
 * hij werkt in Claude.ai, Gemini, ChatGPT en Copilot.
 */
import { BLOCKS } from '../blocks/registry.js';
import { SLIDE_TEMPLATES } from '../blocks/templates.js';
import { buildDeckMarkdown, frameworkById, resolveFrameworkId } from './frameworks.js';
import { parseDeck } from '../state/deck.js';
import { SUBJECT_PREFIXES } from '../ui/util.js';

export const LLM_TARGETS = [
  { id: 'claude', label: 'Claude.ai', url: 'https://claude.ai/new' },
  { id: 'gemini', label: 'Gemini', url: 'https://gemini.google.com/app' },
  { id: 'chatgpt', label: 'ChatGPT', url: 'https://chatgpt.com/' },
  { id: 'copilot', label: 'Copilot', url: 'https://copilot.microsoft.com/' },
];

/** De harde opmaakregels van een GLR `slides.md`. */
export function formatRules() {
  return [
    '1. Het bestand begint met een frontmatter-blok tussen HTML-commentaar (GEEN `---` YAML):',
    '   <!-- frontmatter',
    '   title: "Titel"',
    '   cohort: "2026-2027"',
    '   leerjaar: 1',
    '   periode: 1',
    '   auteur: "Naam"',
    '   tags: ["Vak", "Onderwerp"]',
    '   -->',
    '2. Slides worden gescheiden door een regel `---` met een LEGE regel ervoor en erna. Sub-slides (verticaal) gebruiken `--` op dezelfde manier. Gebruik `---` nooit ergens anders (ook niet in code).',
    '3. Optionele slide-attributen staan op de eerste regel van een slide: `<!-- .slide: class="bleed dark" data-background-color="#111111" -->`.',
    '4. Docentnotities staan onderaan de slide na een lege regel, beginnend met een regel `Note:` en daarna de tekst. Elke slide krijgt een korte, praktische notitie.',
    '5. Gebruik Markdown voor koppen (`## Titel`) en gewone alinea\'s; gebruik de HTML-componenten hieronder voor al het andere.',
    '6. Een HTML-component is één aaneengesloten blok ZONDER lege regels erin (anders breekt Markdown het blok).',
    '7. Elke inhoudsslide eindigt met een footer: `<div class="footer"><span>Vak · Onderwerp</span><span class="num">02</span></div>` (tweecijferig nummer).',
    '8. Schrijf de slidetitel als stelling (Assertion-Evidence), houd lopende tekst kort en zet uitleg in de `Note:`.',
    '9. Schrijf alles in het Nederlands (MBO-niveau 4), tenzij de docent anders vraagt.',
  ].join('\n');
}

/** Cheat-sheet van de beschikbare GLR-componenten, gegenereerd uit de registry. */
export function componentCheatSheet() {
  const lines = ['Beschikbare GLR HTML-componenten (kopieer de structuur exact):', ''];
  const seen = new Set();
  const add = (label, html) => {
    if (!html || seen.has(html)) return;
    seen.add(html);
    lines.push(`- ${label}:`, '```html', html, '```');
  };
  for (const b of BLOCKS) {
    if (b.inlineOnly) continue;
    if (b.html) add(b.label, b.html);
    for (const v of b.variants || []) if (v.html) add(v.label, v.html);
  }
  lines.push('', 'Slide-soorten (templates): ' + SLIDE_TEMPLATES.map((t) => `${t.label} (${t.hint})`).join('; ') + '.');
  return lines.join('\n');
}

const subjectOf = (prefix) => (SUBJECT_PREFIXES.find((p) => p.value === prefix) || {}).subject || '';

/**
 * Bouwt de complete, model-onafhankelijke prompt.
 * @param {{ frameworkId?:string, title:string, prefix?:string, leerjaar?:string|number, periode?:string|number, cohort?:string, auteur?:string, tags?:string[], sourceText?:string }} data
 */
export function buildLessonPrompt(data) {
  const id = resolveFrameworkId(data.frameworkId);
  const fw = frameworkById(id);
  const deckData = {
    title: data.title || 'Titel van de les',
    prefix: data.prefix || 'custom',
    cohort: data.cohort || '2026-2027',
    leerjaar: data.leerjaar || 1,
    periode: data.periode || 1,
    auteur: data.auteur || 'Docententeam CSD',
    tags: data.tags || [],
  };
  const skeleton = buildDeckMarkdown(deckData, id);
  const subject = subjectOf(deckData.prefix);
  const source = (data.sourceText || '').trim();
  return [
    'Je bent een ervaren MBO-docent en instructional designer bij het Grafisch Lyceum Rotterdam (opleiding Creative Software Developer). Je maakt een complete lespresentatie als één `slides.md`-bestand voor Reveal.js in de GLR-huisstijl.',
    '',
    '## Opdracht',
    `- Onderwerp / titel: ${deckData.title}`,
    subject ? `- Vak: ${subject}` : '',
    `- Leerjaar ${deckData.leerjaar}, periode ${deckData.periode}, cohort ${deckData.cohort}`,
    `- Didactisch model: ${fw.label}. ${fw.short}`,
    `- Opbouw (volg deze volgorde): ${fw.outline.join(' → ')}`,
    '',
    '## Opmaakregels (strikt volgen)',
    formatRules(),
    '',
    '## Componenten',
    componentCheatSheet(),
    '',
    '## Voorbeeldstructuur van het gekozen model',
    'Vervang alle plaatsvervangende tekst door echte, vakinhoudelijke inhoud over het onderwerp. Behoud de structuur en componenten.',
    '```markdown',
    skeleton.trimEnd(),
    '```',
    '',
    source ? `## Brondocument / aantekeningen van de docent\n${source}\n` : '',
    '## Uitvoer',
    'Geef uitsluitend de volledige inhoud van `slides.md` terug in één ```markdown-codeblok, zonder uitleg ervoor of erna.',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
}

/**
 * Haalt de `slides.md` uit LLM-uitvoer (met of zonder chat-tekst/codeblok) en valideert hem.
 * @returns {{ markdown:string, errors:string[], warnings:string[], slideCount:number, title:string }}
 */
export function extractDeckMarkdown(output) {
  const errors = [];
  const warnings = [];
  let text = String(output || '').replace(/\r\n?/g, '\n');
  if (!text.trim()) return { markdown: '', errors: ['Er is nog niets geplakt.'], warnings, slideCount: 0, title: '' };

  // Codeblok-omheining van de LLM verwijderen (de buitenste ```markdown … ```).
  const start = text.search(/<!--\s*frontmatter/);
  const fence = /```(?:markdown|md)?[ \t]*\n([\s\S]*)\n```[ \t]*(?:\n[\s\S]*)?$/.exec(text);
  if (fence && (start === -1 || text.indexOf(fence[0]) <= start)) text = fence[1];
  else if (start > 0) text = text.slice(start);

  // Eventuele resterende afsluitende fence na de inhoud weghalen.
  text = text.replace(/\n```[ \t]*\n?[^\n`]*$/, (m) => (/^\n```[ \t]*\n?$/.test(m) ? '' : m));

  const fmAt = text.search(/<!--\s*frontmatter/);
  if (fmAt > 0) text = text.slice(fmAt);
  text = `${text.replace(/\s+$/, '')}\n`;

  const deck = parseDeck(text);
  const title = deck.frontmatter ? String(deck.frontmatter.get('title') || '') : '';
  if (!deck.frontmatter) errors.push('Geen frontmatter gevonden: het bestand moet beginnen met `<!-- frontmatter … -->`.');
  else if (!title) errors.push('De frontmatter mist een `title`.');
  if (deck.slides.length < 2) errors.push('Er zijn minder dan 2 slides gevonden. Controleer of de slides gescheiden zijn met `---` (met een lege regel ervoor en erna).');
  if (deck.fenceWarnings.length) warnings.push('Een `---` binnen een codeblok kan een slide ongewenst splitsen; controleer de code-slides.');
  if (deck.frontmatter && deck.frontmatter.style === 'yaml') warnings.push('De frontmatter gebruikt het oude `---`-formaat; de Studio schrijft `<!-- frontmatter -->`.');
  return { markdown: text, errors, warnings, slideCount: deck.slides.length, title };
}
