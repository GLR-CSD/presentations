/** De 4 MCP-resources. */
import fs from 'node:fs';
import { COMPONENT_LIST } from '../../admin/src/blocks/parsers.js';
import { SLIDE_TEMPLATES } from '../../admin/src/blocks/templates.js';
import { FRAMEWORKS } from '../../admin/src/pedagogy/frameworks.js';
import { PHASES } from '../../admin/src/pedagogy/phases.js';
import { SEGMENT_MIN_ITEMS, REDUNDANCY_WORDS, CODE_MIN_LINES } from '../../admin/src/pedagogy/coach.js';
import { componentCheatSheet, formatRules } from '../../admin/src/pedagogy/ai-prompt.js';
import { InputDocs } from './input-docs.js';

const json = (uri, data) => ({ contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(data, null, 2) }] });
const md = (uri, text) => ({ contents: [{ uri, mimeType: 'text/markdown', text }] });

export function registerResources(server, ws) {
  const input = new InputDocs(ws);

  server.registerResource('decks-manifest', 'glr://decks/manifest', {
    title: 'Presentaties (manifest)', description: 'Alle decks onder presentations/ met metadata.', mimeType: 'application/json',
  }, (uri) => json(uri.href, { generatedAt: new Date().toISOString(), presentations: ws.scanDecks() }));

  server.registerResource('input-files', 'glr://input/files', {
    title: 'Brondocumenten (input/)', description: 'Bestanden in de lokale input/ map, of een melding dat die alleen lokaal te lezen is.', mimeType: 'application/json',
  }, (uri) => json(uri.href, input.list()));

  server.registerResource('components-catalog', 'glr://components/catalog', {
    title: 'GLR-componenten', description: 'Beschikbare componenten, slide-templates en de opmaakregels van slides.md.', mimeType: 'text/markdown',
  }, (uri) => md(uri.href, [
    '# GLR-componenten', '',
    '## Herkende componenten (Properties Panel)',
    ...COMPONENT_LIST.map((c) => `- \`${c.id}\` — ${c.label}`),
    '', '## Slide-templates (add_slide)', ...SLIDE_TEMPLATES.map((t) => `- \`${t.kind}\` — ${t.label}: ${t.hint}`),
    '', '## Opmaakregels', formatRules(), '', '## HTML-voorbeelden', componentCheatSheet(),
  ].join('\n')));

  server.registerResource('pedagogy-guidelines', 'glr://pedagogy/guidelines', {
    title: 'Didactische richtlijnen', description: 'Didactische modellen, fasen, coach-drempels en de onderliggende skill-tekst.', mimeType: 'text/markdown',
  }, (uri) => {
    const skill = ['.agents/skills/educational-presentation-nl/SKILL.md', '.agents/skills/reveal-slide-builder/SKILL.md']
      .map((p) => { try { return fs.readFileSync(ws.abs(p), 'utf8'); } catch { return ''; } }).filter(Boolean);
    return md(uri.href, [
      '# Didactische richtlijnen', '',
      '## Les-modellen (create_presentation → framework)',
      ...FRAMEWORKS.map((f) => `- **${f.id}** — ${f.label}\n  ${f.short}\n  Opbouw: ${f.outline.join(' → ')}`),
      '', '## Slide-fasen', ...Object.values(PHASES).map((p) => `- ${p.label} (${p.group === 'neutral' ? 'neutraal' : p.group === 'theory' ? 'theorie' : 'interactie'})`),
      '', '## Coach-regels',
      `- Segmentatie: vanaf ${SEGMENT_MIN_ITEMS} items tegelijk in beeld → laat ze één voor één verschijnen (fragment).`,
      `- Redundantie: meer dan ${REDUNDANCY_WORDS} woorden leestekst op een slide → verplaats uitleg naar de docentnotitie.`,
      `- Signalering: codeblok vanaf ${CODE_MIN_LINES} regels → stapsgewijze regel-focus.`,
      '- Assertion-Evidence: slidetitel is een stelling, geen onderwerp-label.',
      '- Ritme: ongeveer elke 5 inhoudsslides één actieve verwerkingsopdracht of check (Peer Instruction elke 10-15 minuten).',
      ...(skill.length ? ['', '---', '', ...skill] : []),
    ].join('\n'));
  });
}
