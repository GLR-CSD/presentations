/** De 14 MCP-tools van de GLR Slide Studio. */
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { bodyToDoc } from '../../admin/src/markdown/bridge.js';
import * as T from '../../admin/src/blocks/html-tree.js';
import * as B from '../../admin/src/blocks/block-ops.js';
import { BLOCKS, nodeFor } from '../../admin/src/blocks/registry.js';
import { htmlBlock } from '../../admin/src/blocks/snippets.js';
import { SLIDE_TEMPLATES, slideTemplateBody, deckFooterText } from '../../admin/src/blocks/templates.js';
import { serializeSlideAttrs } from '../../admin/src/state/deck.js';
import { buildDeckMarkdown, resolveFrameworkId, FRAMEWORK_INPUTS } from '../../admin/src/pedagogy/frameworks.js';
import { classifySlide, deckBalance, headingOf } from '../../admin/src/pedagogy/phases.js';
import { analyzeSlide } from '../../admin/src/pedagogy/coach.js';
import { extractDeckMarkdown } from '../../admin/src/pedagogy/ai-prompt.js';
import { describeBuildRun, isPermissionError } from '../../admin/src/storage/build-status.js';
import * as gh from '../../admin/src/storage/github.js';
import { slugify, SLUG_RE } from '../../admin/src/ui/util.js';
import { buildHtmlShell } from '../lib/html-shell.js';
import { slideAt } from './workspace.js';
import { InputDocs } from './input-docs.js';
import { deckView, slideView, outline } from './deck-view.js';
import { componentPath, applyComponentChanges } from './component-ops.js';

const ok = (text, structured) => ({ content: [{ type: 'text', text }], ...(structured ? { structuredContent: structured } : {}) });
const fail = (text) => ({ content: [{ type: 'text', text }], isError: true });
const slideNo = z.number().int().min(1).describe('Slidenummer, 1-gebaseerd (zoals in de Studio).');
const deckPath = z.string().describe('Pad of mapnaam van het deck, bijv. "presentations/design1_logos/slides.md" of "design1_logos".');

/** Voert een tool-body uit en vertaalt fouten naar een nette isError-respons. */
const guard = (fn) => async (args) => {
  try { return await fn(args); } catch (err) { return fail(err.message || String(err)); }
};

export function githubConfig() {
  const token = process.env.GITHUB_TOKEN || process.env.GLR_GITHUB_TOKEN || '';
  const [owner, repo] = (process.env.GLR_GITHUB_REPO || '').split('/');
  return { token, opts: owner && repo ? { owner, repo } : {} };
}

const NO_TOKEN = 'Er is geen GitHub-token ingesteld. Zet de omgevingsvariabele GITHUB_TOKEN (fine-grained token voor GLR-CSD/presentations met Contents: read & write, optioneel Actions: read) in de MCP-configuratie en herstart de app. Je kunt de presentatie ondertussen wel lokaal bewerken; publiceren kan ook via de Studio (Opslaan).';

export function registerTools(server, ws) {
  const input = new InputDocs(ws);
  const save = (rel, deck) => ws.saveDeck(rel, deck);
  const reg = (name, config, handler) => server.registerTool(name, config, guard(handler));

  /* 1 */ reg('list_input_documents', {
    title: 'Brondocumenten in input/ tonen',
    description: 'Toont de bestanden in de lokale input/ map (lesplannen, PPTX, PDF). Werkt alleen lokaal.',
    inputSchema: {},
  }, async () => {
    const r = input.list();
    if (!r.available) return ok(r.message, { available: false });
    return ok(r.files.length
      ? `${r.files.length} bestand(en) in input/:\n${r.files.map((f) => `- ${f.name} (${f.type || '?'}, ${Math.round(f.size / 1024)} KB)${f.readable ? '' : ' — niet leesbaar'}`).join('\n')}`
      : 'De input/ map is leeg. Zet brondocumenten in input/ of plak de tekst in de chat.', r);
  });

  /* 2 */ reg('read_input_document', {
    title: 'Brondocument uit input/ lezen',
    description: 'Leest de tekst van een bestand in input/ (.md .txt .csv .json .html .pptx .pdf). Werkt alleen lokaal.',
    inputSchema: { name: z.string().describe('Bestandsnaam in input/.'), maxChars: z.number().int().min(500).max(200000).optional().describe('Maximaal aantal tekens (standaard 40000).') },
  }, async ({ name, maxChars }) => {
    const r = await input.read(name, maxChars);
    if (!r.available) return ok(r.message, { available: false });
    return ok(`${r.name} (${r.format}, ${r.chars} tekens${r.truncated ? ', ingekort — vraag een kleiner stuk of verhoog maxChars' : ''}):\n\n${r.text}`, { ...r, text: undefined });
  });

  /* 3 */ reg('list_presentations', {
    title: 'Presentaties tonen',
    description: 'Alle decks onder presentations/ met titel, cohort, leerjaar, periode en aantal slides.',
    inputSchema: { query: z.string().optional().describe('Filter op tekst in pad, titel of tags.') },
  }, async ({ query }) => {
    let decks = ws.scanDecks();
    if (query) { const q = query.toLowerCase(); decks = decks.filter((d) => `${d.path} ${d.title} ${d.tags.join(' ')}`.toLowerCase().includes(q)); }
    return ok(decks.length ? decks.map((d) => `- ${d.path} — ${d.title} (lj ${d.leerjaar}, p ${d.periode}, ${d.slides} slides)`).join('\n') : 'Geen presentaties gevonden.', { decks });
  });

  /* 4 */ reg('get_presentation', {
    title: 'Presentatie ophalen',
    description: 'Geeft frontmatter, slides, notities, didactische fase en per slide de blokken en bewerkbare componenten (met veld-keys voor update_slide_component). blockIndex is 0-gebaseerd.',
    inputSchema: { path: deckPath, slide: slideNo.optional().describe('Alleen deze slide (met alle details).'), includeMarkdown: z.boolean().optional() },
  }, async ({ path: p, slide, includeMarkdown }) => {
    const { rel, deck, source } = ws.loadDeck(p);
    const data = slide ? { path: rel, slide: slideView(slideAt(deck, slide), slide - 1) } : { path: rel, ...deckView(deck, { blocks: false }) };
    const text = `${rel}\n${outline(deck)}${includeMarkdown ? `\n\n--- slides.md ---\n${source}` : ''}`;
    return ok(slide ? `${text}\n\n${JSON.stringify(data.slide, null, 2)}` : text, data);
  });

  /* 5 */ reg('create_presentation', {
    title: 'Nieuwe presentatie maken',
    description: 'Maakt presentations/<slug>/slides.md (+ index.html). Geef óf een framework (vrij, gagne, abt, sparkline, agile/standup) óf complete `markdown` (bijv. door de AI geschreven).',
    inputSchema: {
      title: z.string().min(1), prefix: z.string().default('custom').describe('Vak-prefix: beroeps1, beroeps2, design1, interface1, mvi-k09, webxr, immersive-design of custom.'),
      slug: z.string().optional(), framework: z.enum(FRAMEWORK_INPUTS).optional().describe('Standaard "vrij". "standup" is een alias van "agile".'),
      leerjaar: z.union([z.number(), z.string()]).optional(), periode: z.union([z.number(), z.string()]).optional(),
      cohort: z.string().optional(), auteur: z.string().optional(), tags: z.array(z.string()).optional(),
      markdown: z.string().optional().describe('Complete slides.md; wordt gevalideerd.'), overwrite: z.boolean().optional(),
    },
  }, async (a) => {
    const base = slugify(a.title);
    const slug = a.slug || (a.prefix === 'custom' || !a.prefix ? base : `${a.prefix}_${base}`);
    if (!SLUG_RE.test(slug)) return fail(`Ongeldige mapnaam "${slug}": alleen kleine letters, cijfers, _ en - (begin met letter/cijfer).`);
    const rel = `presentations/${slug}/slides.md`;
    if (ws.exists(rel) && !a.overwrite) return fail(`${rel} bestaat al. Kies een andere slug of zet overwrite op true.`);
    let md;
    let warnings = [];
    if (a.markdown) {
      const r = extractDeckMarkdown(a.markdown);
      if (r.errors.length) return fail(`De meegegeven markdown is ongeldig:\n- ${r.errors.join('\n- ')}`);
      md = r.markdown; warnings = r.warnings;
    } else {
      const fw = resolveFrameworkId(a.framework || 'vrij');
      md = buildDeckMarkdown({ title: a.title, prefix: a.prefix, cohort: a.cohort, leerjaar: a.leerjaar ?? 1, periode: a.periode ?? 1, auteur: a.auteur || 'Docententeam CSD', tags: a.tags || [] }, fw);
    }
    ws.writeFile(rel, md);
    const htmlRel = `presentations/${slug}/index.html`;
    if (!ws.exists(htmlRel)) ws.writeFile(htmlRel, buildHtmlShell({ prefix: '../../', mdFile: 'slides.md', title: a.title }));
    const { deck } = ws.loadDeck(rel);
    return ok(`Aangemaakt: ${rel} (${deck.slides.length} slides)${warnings.length ? `\nLet op: ${warnings.join(' ')}` : ''}\n${outline(deck)}`, { path: rel, slides: deck.slides.length, warnings });
  });

  /* 6 */ reg('add_slide', {
    title: 'Slide toevoegen',
    description: `Voegt een slide toe vanuit een template (${SLIDE_TEMPLATES.map((t) => t.kind).join(', ')}, sub) of eigen body.`,
    inputSchema: {
      path: deckPath, template: z.enum([...SLIDE_TEMPLATES.map((t) => t.kind), 'sub']).default('standard'),
      position: z.number().int().min(1).optional().describe('Nieuw slidenummer; standaard achteraan.'),
      body: z.string().optional().describe('Eigen slide-body (Markdown/HTML) in plaats van het template.'), note: z.string().optional().describe('Docentnotitie (Note:).'),
    },
  }, async ({ path: p, template, position, body, note }) => {
    const { rel, deck } = ws.loadDeck(p);
    const at = Math.min(Math.max((position || deck.slides.length + 1) - 1, 0), deck.slides.length);
    const content = body != null ? body : slideTemplateBody(template, { number: at + 1, footerText: deckFooterText(deck) });
    const s = deck.insertSlide(at, { vertical: template === 'sub', body: content });
    if (note) s.setNote(note);
    save(rel, deck);
    return ok(`Slide ${at + 1} toegevoegd (${body != null ? 'eigen inhoud' : template}).\n${outline(deck)}`, { slide: at + 1, slides: deck.slides.length });
  });

  /* 7 */ reg('update_slide_component', {
    title: 'Component of blok aanpassen',
    description: 'Wijzigt een blok op een slide. Kies één van: `fields` (veld-key → waarde), `repeater` (items van kaarten/stappen/checklists aanpassen, toevoegen, verwijderen, verplaatsen), `html` (vervang html) of `markdown` (vervang markdown-blok). Keys en blockIndex (0-gebaseerd) komen uit get_presentation.',
    inputSchema: {
      path: deckPath, slide: slideNo, blockIndex: z.number().int().min(0),
      elementPath: z.array(z.number().int().min(0)).optional().describe('Pad van het element binnen het html-blok (standaard [0]).'),
      fields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
      repeater: z.object({
        label: z.string().optional().describe('Naam/key van de herhaler, bijv. "Kaarten"; standaard de eerste.'),
        ops: z.array(z.object({ op: z.enum(['add', 'remove', 'move']), index: z.number().int().min(0).optional(), dir: z.number().int().optional().describe('-1 omhoog, 1 omlaag') })).optional().describe('Worden eerst uitgevoerd, in volgorde.'),
        items: z.array(z.object({ index: z.number().int().min(0), fields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])) })).optional().describe('Daarna: velden van items (0-gebaseerd, na de ops).'),
      }).optional(),
      html: z.string().optional(), markdown: z.string().optional(),
    },
  }, async (a) => {
    const { rel, deck } = ws.loadDeck(a.path);
    const slide = slideAt(deck, a.slide);
    const body = slide.body;
    if (a.blockIndex >= B.blockCount(body)) return fail(`Blok ${a.blockIndex} bestaat niet (slide ${a.slide} heeft ${B.blockCount(body)} blokken, 0-gebaseerd).`);
    const given = ['fields', 'repeater', 'html', 'markdown'].filter((k) => a[k] != null);
    if (given.length !== 1) return fail('Geef precies één van: fields, repeater, html of markdown.');
    const cur = B.htmlAt(body, a.blockIndex);
    let next; let what;
    if (a.markdown != null) {
      if (cur != null) return fail('Dit is een html-blok; gebruik `html`, `fields` of `repeater`.');
      next = B.replaceBlock(body, a.blockIndex, bodyToDoc(a.markdown).content); what = 'markdown vervangen';
    } else if (cur == null) {
      return fail('Dit is een markdown-blok (geen html-component); gebruik de parameter `markdown`.');
    } else if (a.html != null) {
      if (a.elementPath) {
        const node = T.nodeAt(T.parse(cur), a.elementPath);
        if (!node) return fail(`Geen element op pad [${a.elementPath.join(',')}].`);
        next = B.setHtmlAt(body, a.blockIndex, cur.slice(0, node.start) + a.html + cur.slice(node.end));
      } else next = B.setHtmlAt(body, a.blockIndex, a.html);
      what = 'html vervangen';
    } else {
      const r = applyComponentChanges(cur, componentPath(cur, a.elementPath || [0]), { fields: a.fields, repeater: a.repeater });
      next = B.setHtmlAt(body, a.blockIndex, r.html); what = r.changes.join(', ') || 'geen wijziging';
    }
    slide.setBody(next);
    save(rel, deck);
    return ok(`Slide ${a.slide}, blok ${a.blockIndex}: ${what}.`, { slide: a.slide, blockIndex: a.blockIndex, changed: next !== body });
  });

  /* 8 */ reg('insert_component_on_slide', {
    title: 'Component toevoegen aan een slide',
    description: `Voegt een component in (standaard boven de footer). Component-id's: ${BLOCKS.filter((b) => !b.inlineOnly && (b.html || b.node)).map((b) => b.id).join(', ')}; of geef eigen \`html\`.`,
    inputSchema: {
      path: deckPath, slide: slideNo, component: z.string().optional(), variant: z.union([z.number().int().min(0), z.string()]).optional().describe('Bij varianten (cards, heading): index of label.'),
      html: z.string().optional(), afterBlockIndex: z.number().int().min(0).optional().describe('Invoegen na dit blok (0-gebaseerd).'),
    },
  }, async (a) => {
    const { rel, deck } = ws.loadDeck(a.path);
    const slide = slideAt(deck, a.slide);
    let node;
    if (a.html) node = htmlBlock(a.html);
    else {
      let def = BLOCKS.find((b) => b.id === a.component);
      if (!def) return fail(`Onbekend component "${a.component}". Kies uit: ${BLOCKS.filter((b) => !b.inlineOnly).map((b) => b.id).join(', ')}.`);
      if (def.variants) {
        const v = typeof a.variant === 'number' ? def.variants[a.variant] : def.variants.find((x) => x.label.toLowerCase().includes(String(a.variant ?? '').toLowerCase()));
        def = v || def.variants[0];
      }
      node = nodeFor(def);
      if (!node) return fail(`"${a.component}" is inline-opmaak en kan niet als blok worden ingevoegd.`);
    }
    const sel = a.afterBlockIndex != null ? { blockIndex: a.afterBlockIndex } : null;
    const r = B.insertAfterSelection(slide.body, sel, node);
    slide.setBody(r.body);
    save(rel, deck);
    return ok(`Component ingevoegd op slide ${a.slide} als blok ${r.index}.`, { slide: a.slide, blockIndex: r.index });
  });

  /* 9 */ reg('update_slide_properties', {
    title: 'Slide- en deck-eigenschappen aanpassen',
    description: 'Achtergrondkleur, klassen, slide-attributen (data-*), docentnotitie en deck-frontmatter. Lege string of null verwijdert een attribuut.',
    inputSchema: {
      path: deckPath, slide: slideNo.optional(), background: z.string().optional().describe('Hex-kleur of "" om te wissen.'), classes: z.string().optional().describe('Bijv. "dark bleed".'),
      transition: z.string().optional(), attrs: z.record(z.string(), z.union([z.string(), z.null()])).optional(),
      note: z.string().optional().describe('Vervangt de docentnotitie.'), appendNote: z.string().optional(),
      frontmatter: z.record(z.string(), z.union([z.string(), z.number(), z.array(z.string())])).optional().describe('Deck-metadata: title, cohort, leerjaar, periode, auteur, tags.'),
    },
  }, async (a) => {
    const { rel, deck } = ws.loadDeck(a.path);
    const done = [];
    if (a.frontmatter) {
      if (!deck.frontmatter) return fail('Dit deck heeft geen frontmatter om aan te passen.');
      for (const [k, v] of Object.entries(a.frontmatter)) { deck.frontmatter.set(k, (k === 'leerjaar' || k === 'periode') && /^\d+$/.test(String(v)) ? Number(v) : v); done.push(`frontmatter ${k}`); }
    }
    const slideChange = a.background != null || a.classes != null || a.transition != null || a.attrs || a.note != null || a.appendNote != null;
    if (slideChange) {
      if (!a.slide) return fail('Geef `slide` op voor slide-eigenschappen.');
      const slide = slideAt(deck, a.slide);
      const obj = { ...slide.attrsData };
      const set = (k, v) => { if (v === '' || v === null) delete obj[k]; else obj[k] = v; done.push(k); };
      if (a.background != null) set('data-background-color', a.background);
      if (a.classes != null) set('class', a.classes);
      if (a.transition != null) set('data-transition', a.transition);
      for (const [k, v] of Object.entries(a.attrs || {})) set(k, v);
      if (a.background != null || a.classes != null || a.transition != null || a.attrs) {
        const next = serializeSlideAttrs(obj);
        if (!slide.attrs && next && slide.gap1 === '') slide.gap1 = '\n\n';
        slide.setAttrs(next);
      }
      if (a.note != null) { slide.setNote(a.note); done.push('notitie'); }
      if (a.appendNote) { slide.setNote(slide.noteText ? `${slide.noteText}\n${a.appendNote}` : a.appendNote); done.push('notitie toegevoegd'); }
    }
    if (!done.length) return fail('Niets om te wijzigen: geef minstens één eigenschap op.');
    save(rel, deck);
    return ok(`Bijgewerkt: ${done.join(', ')}.`, { changed: done });
  });

  /* 10 */ reg('manage_slides', {
    title: 'Slides verplaatsen, dupliceren of verwijderen',
    description: 'action: move (naar positie `to`), duplicate of delete.',
    inputSchema: { path: deckPath, action: z.enum(['move', 'duplicate', 'delete']), slide: slideNo, to: z.number().int().min(1).optional() },
  }, async ({ path: p, action, slide, to }) => {
    const { rel, deck } = ws.loadDeck(p);
    slideAt(deck, slide);
    if (action === 'move') {
      if (!to) return fail('Geef `to` (doelpositie) op bij move.');
      slideAt(deck, to);
      deck.moveSlide(slide - 1, to - 1);
    } else if (action === 'duplicate') deck.duplicateSlide(slide - 1);
    else {
      if (deck.slides.length <= 1) return fail('De laatste slide kan niet worden verwijderd.');
      deck.removeSlide(slide - 1);
    }
    save(rel, deck);
    return ok(`${action} uitgevoerd.\n${outline(deck)}`, { slides: deck.slides.length });
  });

  /* 11 */ reg('analyze_presentation_pedagogy', {
    title: 'Didactische analyse',
    description: 'Fase per slide, balans theorie/interactie en tips (Mayer: segmentatie, redundantie, signalering; Assertion-Evidence). Tips met acties kunnen met apply_pedagogical_fix worden toegepast.',
    inputSchema: { path: deckPath },
  }, async ({ path: p }) => {
    const { rel, deck } = ws.loadDeck(p);
    const bal = deckBalance(deck.slides);
    const slides = deck.slides.map((s, i) => ({
      slide: i + 1, title: headingOf(s.body), phase: classifySlide(s).label,
      tips: analyzeSlide(s).map((t) => ({ id: t.id, principle: t.principle, title: t.title, text: t.text, quiet: !!t.quiet, actions: t.actions.map((x, k) => ({ actionIndex: k, label: x.label })) })),
    }));
    const lines = slides.flatMap((s) => s.tips.filter((t) => !t.quiet).map((t) => `- Slide ${s.slide} [${t.principle}] ${t.title} (tipId "${t.id}", ${t.actions.length} actie(s)): ${t.text}`));
    const summary = `${rel}: ${bal.theory} theorie- en ${bal.interaction} interactie-slides (${bal.theoryPct}% theorie).${bal.lowInteraction ? ' Weinig interactie: ongeveer elke 5 inhoudsslides hoort één actief moment (opdracht of check).' : ''}`;
    return ok(`${summary}\n${lines.join('\n') || 'Geen verbeterpunten gevonden.'}`, { balance: bal, slides });
  });

  /* 12 */ reg('apply_pedagogical_fix', {
    title: 'Didactische verbetering toepassen',
    description: 'Voert een actie uit van een tip uit analyze_presentation_pedagogy (bijv. stapsgewijs tonen, alinea naar notities, regel-focus op code).',
    inputSchema: { path: deckPath, slide: slideNo, tipId: z.string(), actionIndex: z.number().int().min(0).default(0) },
  }, async ({ path: p, slide: n, tipId, actionIndex }) => {
    const { rel, deck } = ws.loadDeck(p);
    const slide = slideAt(deck, n);
    const tips = analyzeSlide(slide);
    const tip = tips.find((t) => t.id === tipId);
    if (!tip) return fail(`Tip "${tipId}" niet gevonden op slide ${n}. Beschikbaar: ${tips.map((t) => t.id).join(', ') || '(geen)'}. Draai analyze_presentation_pedagogy opnieuw.`);
    const action = tip.actions[actionIndex];
    if (!action) return fail(`Actie ${actionIndex} bestaat niet voor deze tip (${tip.actions.length} actie(s)).`);
    const r = action.run(slide.body, slide.noteText);
    if (r.body !== slide.body) slide.setBody(r.body);
    if (r.note != null && r.note !== slide.noteText) slide.setNote(r.note);
    save(rel, deck);
    return ok(`Toegepast op slide ${n}: ${action.label}`, { slide: n, tipId, label: action.label });
  });

  /* 13 */ reg('publish_deck_to_github', {
    title: 'Deck publiceren naar GitHub',
    description: 'Commit slides.md + index.html in één atomaire commit naar main. Geeft commitSha en de live GitHub Pages-URL; bouwen duurt daarna nog ~45-90 seconden (volg met check_github_build_status).',
    inputSchema: { path: deckPath, message: z.string().optional() },
  }, async ({ path: p, message }) => {
    const { token, opts } = githubConfig();
    if (!token) return fail(NO_TOKEN);
    const { rel, source, deck } = ws.loadDeck(p);
    const dir = path.posix.dirname(rel);
    const htmlRel = `${dir}/index.html`;
    const title = (deck.frontmatter && deck.frontmatter.get('title')) || path.posix.basename(dir);
    const html = ws.exists(htmlRel)
      ? fs.readFileSync(ws.abs(htmlRel), 'utf8')
      : buildHtmlShell({ prefix: '../'.repeat(dir.split('/').length), mdFile: 'slides.md', title });
    await gh.connect(token);
    const commitSha = await gh.commitFiles(message || `feat: update ${path.posix.basename(dir)} via GLR MCP`, [
      { path: rel, content: source, encoding: 'utf-8' },
      { path: htmlRel, content: html, encoding: 'utf-8' },
    ], opts);
    const url = gh.pagesUrl(rel, opts);
    return ok(`Gepubliceerd naar main (commit ${commitSha.slice(0, 7)}).\nLive URL (zodra de build klaar is): ${url}\nHet bouwen op GitHub Pages duurt nog circa 45-90 seconden; vraag met check_github_build_status (commitSha ${commitSha}) of het live staat.\nLet op: lokale afbeeldingen in assets/ worden niet mee gepubliceerd.`,
      { commitSha, url, actionsUrl: gh.actionsUrl(opts), buildSecondsEstimate: [45, 90] });
  });

  /* 14 */ reg('check_github_build_status', {
    title: 'GitHub Pages build-status',
    description: 'Controleert de GitHub Actions-build (deploy.yml) voor een commit, of de laatste op main.',
    inputSchema: { commitSha: z.string().optional() },
  }, async ({ commitSha }) => {
    const { token, opts } = githubConfig();
    if (!token) return fail(NO_TOKEN);
    await gh.connect(token);
    try {
      const run = await gh.getWorkflowRunForCommit(commitSha, opts);
      const d = describeBuildRun(run);
      return ok(`${d.message}${d.url ? `\nDetails: ${d.url}` : ''}${d.phase === 'queued' ? '\nCheck over een paar seconden opnieuw.' : ''}`, { phase: d.phase, final: d.final, url: d.url });
    } catch (err) {
      if (isPermissionError(err)) return ok('Geen toegang tot de build-status (HTTP ' + err.status + '): het token mist het recht "Actions: read". De update staat meestal binnen ~1 minuut na het publiceren live op GitHub Pages.', { phase: 'unknown', permission: false });
      throw err;
    }
  });
}
