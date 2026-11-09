#!/usr/bin/env node
/**
 * End-to-end test van de MCP-server via de MCP Client SDK (echte stdio-server).
 *
 * Draait tegen een tijdelijke fixture-map (GLR_REPO_ROOT) zodat de echte
 * presentaties nooit worden aangeraakt. Gebruik:  npm run test:mcp
 */
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync, strToU8 } from 'fflate';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { parseDeck, serializeDeck } from '../admin/src/state/deck.js';
import { extractDeckMarkdown } from '../admin/src/pedagogy/ai-prompt.js';
import { buildHtmlShell } from './lib/html-shell.js';
import { resolveFrameworkId } from '../admin/src/pedagogy/frameworks.js';
import { extractPptx } from './mcp/input-docs.js';
import { sanitizeMediaName, filenameFromUrl, mediaKind, buildMediaSnippet, deckMediaFiles } from './mcp/media.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
let checks = 0;
const ok = (cond, msg) => { checks += 1; if (!cond) { failures += 1; console.error(`✖ ${msg}`); } };
const text = (r) => (r.content || []).map((c) => c.text || '').join('\n');

/* ------------------------------------------------------------ fixtures --- */

function makePptx(slideCount) {
  const files = {};
  for (let n = 1; n <= slideCount; n += 1) {
    files[`ppt/slides/slide${n}.xml`] = strToU8(`<p:sld><a:p><a:r><a:t>Slide ${n} titel &amp; inhoud</a:t></a:r></a:p></p:sld>`);
    if (n % 5 === 0) files[`ppt/notesSlides/notesSlide${n}.xml`] = strToU8(`<p:notes><a:p><a:r><a:t>Notitie bij ${n}</a:t></a:r></a:p></p:notes>`);
  }
  return Buffer.from(zipSync(files));
}

function makePdf(line) {
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
  ];
  const stream = `BT /F1 18 Tf 20 100 Td (${line}) Tj ET`;
  objs.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  let out = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((o, i) => { offsets.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`;
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'glr-mcp-'));
const withInput = path.join(tmp, 'met-input');
const withoutInput = path.join(tmp, 'zonder-input');
for (const dir of [withInput, withoutInput]) {
  fs.mkdirSync(path.join(dir, 'presentations/design1_logos'), { recursive: true });
  fs.copyFileSync(path.join(root, 'presentations/2026-2027/jaar-1/design/design1_logos/slides.md'), path.join(dir, 'presentations/design1_logos/slides.md'));
}
fs.mkdirSync(path.join(withInput, 'input'));
fs.writeFileSync(path.join(withInput, 'input/lesplan.md'), '# Lesplan\n\nKleurenleer: warm en koel.\n');
fs.writeFileSync(path.join(withInput, 'input/les.html'), '<html><body><h1>HTML-les</h1><p>Contrast &amp; kleur</p><script>x()</script></body></html>');
fs.writeFileSync(path.join(withInput, 'input/deck.pptx'), makePptx(12));
fs.writeFileSync(path.join(withInput, 'input/lesson.pdf'), makePdf('Hallo PDF wereld'));
fs.writeFileSync(path.join(withInput, 'input/raar.xyz'), 'x');

async function connect(rootDir, env = {}) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(root, 'scripts/mcp-server.js')],
    env: { PATH: process.env.PATH, GLR_REPO_ROOT: rootDir, GITHUB_TOKEN: '', GLR_GITHUB_TOKEN: '', ...env },
    stderr: 'pipe',
  });
  const client = new Client({ name: 'glr-test', version: '1.0.0' });
  await client.connect(transport);
  return { client, transport };
}

const call = (client, name, args = {}) => client.callTool({ name, arguments: args });

/* ---------------------------------------------------- pure helpers (unit) --- */

{
  const md = '<!-- frontmatter\ntitle: "T"\ncohort: "x"\nleerjaar: 1\nperiode: 1\nauteur: "a"\ntags: ["x"]\n-->\n\n## A\n\n---\n\n## B\n';
  const fenced = extractDeckMarkdown(`Zeker! Hier is je deck:\n\n\`\`\`markdown\n${md}\`\`\`\n\nSucces!`);
  ok(!fenced.errors.length && fenced.slideCount === 2 && fenced.title === 'T', 'extractDeckMarkdown: codeblok + inleiding');
  ok(fenced.markdown === md, 'extractDeckMarkdown: inhoud byte-gelijk');
  ok(extractDeckMarkdown('## Los\n\n---\n\n## Twee').errors.length > 0, 'extractDeckMarkdown: zonder frontmatter = fout');
  ok(extractDeckMarkdown('   ').errors.length > 0, 'extractDeckMarkdown: leeg = fout');
  ok(resolveFrameworkId('Standup') === 'agile' && resolveFrameworkId('stand-up') === 'agile' && resolveFrameworkId('agile') === 'agile', 'framework-alias standup → agile');
  ok(resolveFrameworkId('onzin') === 'vrij', 'onbekend framework → vrij');
  const shell = buildHtmlShell({ prefix: '../../', mdFile: 'slides.md', title: 'X' });
  ok(shell.includes('data-markdown="slides.md"') && shell.includes('../../shared/vendor/reveal/reveal.js'), 'buildHtmlShell');
  const nums = extractPptx(makePptx(12)).map((s) => s.slide);
  ok(nums.join(',') === '1,2,3,4,5,6,7,8,9,10,11,12', `pptx numeriek gesorteerd (${nums.join(',')})`);
  ok(extractPptx(makePptx(12))[9].notes === 'Notitie bij 10', 'pptx-notities bij het juiste slide');
  ok(sanitizeMediaName('Foto Test.PNG') === 'foto-test.png', 'sanitizeMediaName: kebab-case + kleine-letter-extensie');
  ok(sanitizeMediaName('../../x y!.jpeg') === 'x-y.jpeg', 'sanitizeMediaName: pad en rare tekens weg');
  ok(sanitizeMediaName('zonder-ext') === 'zonder-ext', 'sanitizeMediaName: zonder extensie');
  ok(filenameFromUrl('https://cdn.example.com/a/b/Logo%20Groot.png?x=1') === 'Logo Groot.png', 'filenameFromUrl: laatste segment, query eraf');
  ok(mediaKind('webm') === 'video' && mediaKind('jpg') === 'image' && mediaKind('txt') === null, 'mediaKind: video/afbeelding/onbekend');
  ok(buildMediaSnippet('video', 'assets/a.mp4', { caption: 'Demo' }).includes('src="assets/a.mp4"') && buildMediaSnippet('video', 'assets/a.mp4', { caption: 'Demo' }).includes('<figcaption>Demo</figcaption>'), 'buildMediaSnippet: video');
  ok(buildMediaSnippet('image', 'assets/a.png', { alt: 'A & B' }).includes('alt="A &amp; B"'), 'buildMediaSnippet: HTML-escape in alt');
}

/* --------------------------------------------------------------- server --- */

const { client, transport } = await connect(withInput);
try {
  // Catalogus
  const tools = (await client.listTools()).tools.map((t) => t.name);
  const wantedTools = ['list_input_documents', 'read_input_document', 'list_presentations', 'get_presentation', 'create_presentation', 'move_presentation', 'add_slide', 'update_slide_component', 'insert_component_on_slide', 'update_slide_properties', 'manage_slides', 'analyze_presentation_pedagogy', 'apply_pedagogical_fix', 'publish_deck_to_github', 'check_github_build_status', 'add_media_file', 'list_media'];
  ok(tools.length === 17 && wantedTools.every((t) => tools.includes(t)), `17 tools aanwezig (${tools.length})`);
  const resources = (await client.listResources()).resources.map((r) => r.uri).sort();
  ok(resources.join() === ['glr://components/catalog', 'glr://decks/manifest', 'glr://input/files', 'glr://media/library', 'glr://pedagogy/guidelines'].join(), `5 resources (${resources})`);
  const prompts = (await client.listPrompts()).prompts.map((p) => p.name).sort();
  ok(prompts.join() === ['didactische-les-review', 'maak-theorieles-gagne', 'maak-werkles-standup', 'van-input-naar-presentatie'].join(), `4 prompts (${prompts})`);

  // Resources lezen
  const rd = async (uri) => (await client.readResource({ uri })).contents[0].text;
  const manifest = JSON.parse(await rd('glr://decks/manifest'));
  ok(manifest.presentations.length === 1 && manifest.presentations[0].slides > 5, 'manifest-resource');
  const files = JSON.parse(await rd('glr://input/files'));
  ok(files.available && files.files.length === 5, 'input-resource met bestanden');
  const catalog = await rd('glr://components/catalog');
  ok(catalog.includes('glr-card') && catalog.includes('listrow') && catalog.includes('defbox') && catalog.includes('opcard') && catalog.includes('timer'), 'component-catalogus');
  const guide = await rd('glr://pedagogy/guidelines');
  ok(guide.includes('Gagné') && guide.includes('Segmentatie'), 'pedagogie-richtlijnen');
  const mediaRes = JSON.parse(await rd('glr://media/library'));
  ok(Array.isArray(mediaRes.media) && mediaRes.media.every((m) => m.kind === 'image' || m.kind === 'video'), 'media-resource met soort');

  // Prompts
  const pr = await client.getPrompt({ name: 'maak-werkles-standup', arguments: { onderwerp: 'Git workflow', prefix: 'webxr' } });
  ok(pr.messages[0].content.text.includes('GLR Agile stand-up'), 'prompt maak-werkles-standup gebruikt agile-framework');
  const pr2 = await client.getPrompt({ name: 'van-input-naar-presentatie', arguments: { bestand: 'lesplan.md' } });
  ok(pr2.messages[0].content.text.includes('read_input_document'), 'prompt van-input-naar-presentatie');

  // input/
  const li = await call(client, 'list_input_documents');
  ok(!li.isError && text(li).includes('lesplan.md') && text(li).includes('deck.pptx'), 'list_input_documents');
  ok((await call(client, 'read_input_document', { name: 'lesplan.md' })).content[0].text.includes('warm en koel'), 'read .md');
  const html = text(await call(client, 'read_input_document', { name: 'les.html' }));
  ok(html.includes('HTML-les') && html.includes('Contrast & kleur') && !html.includes('x()'), 'read .html (tags + script gestript)');
  const pptx = text(await call(client, 'read_input_document', { name: 'deck.pptx' }));
  ok(pptx.indexOf('## Slide 2') < pptx.indexOf('## Slide 10') && pptx.includes('Slide 12 titel & inhoud') && pptx.includes('Notitie bij 5'), 'read .pptx (volgorde 2 vóór 10, notities)');
  const pdf = text(await call(client, 'read_input_document', { name: 'lesson.pdf' }));
  ok(pdf.includes('Hallo PDF wereld'), `read .pdf (${pdf.slice(0, 80)})`);
  ok((await call(client, 'read_input_document', { name: '../secret.txt' })).isError, 'pad-traversal geweigerd');
  ok((await call(client, 'read_input_document', { name: 'raar.xyz' })).isError, 'onbekend type = nette fout');

  // Deck-flow
  const created = await call(client, 'create_presentation', { title: 'Kleur Basis', prefix: 'design1', framework: 'gagne', leerjaar: 1, periode: 2, tags: ['Design'] });
  const P = 'presentations/2026-2027/jaar-1/design/design1_kleur-basis/slides.md';
  ok(!created.isError && created.structuredContent.slides === 9, `create_presentation gagne = 9 slides (${text(created).slice(0, 60)})`);
  ok(fs.existsSync(path.join(withInput, 'presentations/2026-2027/jaar-1/design/design1_kleur-basis/index.html')), 'index.html-shell aangemaakt');
  ok((await call(client, 'create_presentation', { title: 'Kleur Basis', prefix: 'design1' })).isError, 'overschrijven standaard geweigerd');
  ok(!(await call(client, 'create_presentation', { title: 'Werk', prefix: 'webxr', framework: 'standup' })).isError, 'framework-alias standup werkt');
  // Verplaatsen: aangemaakt deck staat al goed; afleiden uit frontmatter, expliciete map, botsing, traversal.
  const shell = path.join(withInput, 'presentations/2026-2027/jaar-1/design/design1_kleur-basis/index.html');
  ok(fs.readFileSync(shell, 'utf8').includes('"../../../../../shared/'), 'shell-prefix diep genoeg (5x ../)');
  ok((await call(client, 'move_presentation', { path: P })).isError, 'verplaatsen naar dezelfde map geweigerd');
  const flatDir = path.join(withInput, 'presentations/design1_flat');
  fs.mkdirSync(path.join(flatDir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(flatDir, 'slides.md'), '<!-- frontmatter\ntitle: "Flat"\ncohort: "2026-2027"\nleerjaar: 1\n-->\n\n## Een\n');
  fs.writeFileSync(path.join(flatDir, 'assets/a.txt'), 'x');
  fs.writeFileSync(path.join(flatDir, 'index.html'), buildHtmlShell({ prefix: '../../', mdFile: 'slides.md', title: 'Flat' }).replace('</head>', '<style>.eigen{color:red}</style></head>'));
  const mv = await call(client, 'move_presentation', { path: 'presentations/design1_flat' });
  const NEW = 'presentations/2026-2027/jaar-1/design/design1_flat';
  ok(!mv.isError && mv.structuredContent.path === `${NEW}/slides.md`, `move afgeleid uit frontmatter (${text(mv).slice(0, 80)})`);
  ok(!fs.existsSync(flatDir) && fs.existsSync(path.join(withInput, NEW, 'assets/a.txt')), 'map inclusief assets verplaatst');
  const movedHtml = fs.readFileSync(path.join(withInput, NEW, 'index.html'), 'utf8');
  ok(movedHtml.includes('"../../../../../shared/') && !movedHtml.includes('"../../shared/') && movedHtml.includes('.eigen{color:red}'), 'prefix herschreven, eigen stijl behouden');
  fs.mkdirSync(path.join(withInput, 'presentations/botst'), { recursive: true });
  fs.writeFileSync(path.join(withInput, 'presentations/botst/slides.md'), '## x\n');
  ok((await call(client, 'move_presentation', { path: 'presentations/botst', folder: NEW })).isError, 'verplaatsen naar bestaande map geweigerd');
  ok((await call(client, 'move_presentation', { path: 'presentations/botst', folder: 'presentations/../buiten' })).isError, 'traversal geweigerd');
  ok((await call(client, 'move_presentation', { path: 'presentations/botst' })).isError, 'zonder afleidbare map: expliciete folder vereist');
  ok(parseDeck(fs.readFileSync(path.join(withInput, 'presentations/2026-2027/jaar-1/minor-immersive-design/webxr_werk/slides.md'), 'utf8')).slides.length === 4, 'standup = agile (4 slides)');
  const own = await call(client, 'create_presentation', { title: 'Eigen AI', prefix: 'custom', markdown: 'Hier je deck:\n```markdown\n<!-- frontmatter\ntitle: "Eigen AI"\nleerjaar: 1\n-->\n\n## Een\n\n---\n\n## Twee\n```' });
  ok(!own.isError && own.structuredContent.slides === 2, 'create_presentation met eigen (gefencede) markdown');
  ok((await call(client, 'create_presentation', { title: 'Kapot', markdown: '## geen frontmatter' })).isError, 'ongeldige markdown geweigerd');

  const got = await call(client, 'get_presentation', { path: P, slide: 2 });
  ok(!got.isError && got.structuredContent.slide.blocks.length > 0 && got.structuredContent.slide.phase, 'get_presentation (slide-detail)');

  // add_slide (cards) + insert timer
  const added = await call(client, 'add_slide', { path: P, template: 'cards', position: 3, note: 'Test-notitie' });
  ok(!added.isError && added.structuredContent.slides === 10, 'add_slide cards op positie 3');
  const ins = await call(client, 'insert_component_on_slide', { path: P, slide: 3, component: 'timer' });
  ok(!ins.isError, `insert_component_on_slide timer (${text(ins)})`);

  // Afbeelding: invoegen als component, daarna src/grootte/bijsnijden/focus wijzigen
  const insImg = await call(client, 'insert_component_on_slide', { path: P, slide: 3, component: 'image' });
  ok(!insImg.isError, `insert_component_on_slide image (${text(insImg)})`);
  const s3i = (await call(client, 'get_presentation', { path: P, slide: 3 })).structuredContent.slide;
  const imgBlock = s3i.blocks.find((b) => b.type === 'html' && b.components.some((c) => c.id === 'media'));
  ok(!!imgBlock, 'afbeelding-component gevonden');
  const updImg = await call(client, 'update_slide_component', {
    path: P, slide: 3, blockIndex: imgBlock.blockIndex,
    fields: { 'Afbeelding (pad of URL)': 'assets/x.png', Grootte: 'm', Weergave: 'cover', Focuspunt: '0% 0%' },
  });
  ok(!updImg.isError, `update_slide_component afbeelding (${text(updImg)})`);
  const diskImg = fs.readFileSync(path.join(withInput, P), 'utf8');
  ok(/<figure class="[^"]*img-m[^"]*img-cover[^"]*"[^>]*--img-pos:0% 0%/.test(diskImg) || (diskImg.includes('img-m') && diskImg.includes('img-cover') && diskImg.includes('--img-pos:0% 0%')), 'afbeelding: grootte, bijsnijden en focus op schijf');
  const badFocus = await call(client, 'update_slide_component', { path: P, slide: 3, blockIndex: imgBlock.blockIndex, fields: { Focuspunt: 'midden' } });
  ok(badFocus.isError, 'ongeldig focuspunt wordt geweigerd');
  const bg = await call(client, 'update_slide_properties', { path: P, slide: 3, attrs: { 'data-background-image': 'assets/bg.jpg', 'data-background-opacity': '0.5' } });
  ok(!bg.isError && fs.readFileSync(path.join(withInput, P), 'utf8').includes('data-background-image="assets/bg.jpg"'), 'achtergrondafbeelding via attrs');

  // Component-mutatie: repeater op de kaarten-slide
  const s3 = (await call(client, 'get_presentation', { path: P, slide: 3 })).structuredContent.slide;
  const cardsBlock = s3.blocks.find((b) => b.type === 'html' && b.components.some((c) => c.id === 'cards'));
  ok(!!cardsBlock, 'kaarten-component gevonden in get_presentation');
  const titleKey = cardsBlock.components[0].repeaters[0].items[0].fields.find((f) => f.key.startsWith('Titel')).key;
  const upd = await call(client, 'update_slide_component', {
    path: P, slide: 3, blockIndex: cardsBlock.blockIndex,
    repeater: { ops: [{ op: 'add' }], items: [{ index: 0, fields: { [titleKey]: 'Warme kleuren' } }] },
  });
  ok(!upd.isError, `update_slide_component repeater (${text(upd)})`);
  let disk = fs.readFileSync(path.join(withInput, P), 'utf8');
  ok(disk.includes('Warme kleuren'), 'kaart-titel gewijzigd op schijf');
  const s3b = (await call(client, 'get_presentation', { path: P, slide: 3 })).structuredContent.slide;
  const cards2 = s3b.blocks.find((b) => b.type === 'html' && b.components.some((c) => c.id === 'cards')).components[0];
  ok(cards2.repeaters[0].items.length === 4, `kaart toegevoegd (3 → ${cards2.repeaters[0].items.length})`);
  const rem = await call(client, 'update_slide_component', { path: P, slide: 3, blockIndex: cardsBlock.blockIndex, repeater: { ops: [{ op: 'remove', index: 3 }] } });
  ok(!rem.isError, 'kaart verwijderd');
  ok((await call(client, 'update_slide_component', { path: P, slide: 3, blockIndex: cardsBlock.blockIndex, fields: { 'bestaat-niet': 'x' } })).isError, 'onbekend veld = nette fout met suggesties');
  ok((await call(client, 'update_slide_component', { path: P, slide: 3, blockIndex: cardsBlock.blockIndex, fields: { a: 'b' }, html: '<p>x</p>' })).isError, 'meerdere wijzigingsmodi geweigerd');

  // markdown + html wijzigen op slide 2
  const s2 = (await call(client, 'get_presentation', { path: P, slide: 2 })).structuredContent.slide;
  const mdBlock = s2.blocks.find((b) => b.type === 'heading');
  if (mdBlock) {
    ok(!(await call(client, 'update_slide_component', { path: P, slide: 2, blockIndex: mdBlock.blockIndex, markdown: '## Nieuwe koptekst' })).isError, 'markdown-blok vervangen');
    ok(fs.readFileSync(path.join(withInput, P), 'utf8').includes('## Nieuwe koptekst'), 'markdown-wijziging op schijf');
  }

  // Slide-eigenschappen
  const prop = await call(client, 'update_slide_properties', { path: P, slide: 4, background: '#222222', classes: 'dark', appendNote: 'Extra tip', frontmatter: { auteur: 'Test Docent' } });
  ok(!prop.isError, `update_slide_properties (${text(prop)})`);
  disk = fs.readFileSync(path.join(withInput, P), 'utf8');
  ok(disk.includes('data-background-color="#222222"') && disk.includes('Extra tip') && disk.includes('auteur: "Test Docent"'), 'eigenschappen op schijf');

  // manage_slides
  ok(!(await call(client, 'manage_slides', { path: P, action: 'duplicate', slide: 3 })).isError, 'duplicate');
  ok(!(await call(client, 'manage_slides', { path: P, action: 'move', slide: 1, to: 4 })).isError, 'move slide 1 → 4');
  const afterMove = parseDeck(fs.readFileSync(path.join(withInput, P), 'utf8'));
  ok(afterMove.slides.length === 11 && afterMove.frontmatter, `slides na move intact (${afterMove.slides.length})`);
  ok(!(await call(client, 'manage_slides', { path: P, action: 'delete', slide: 4 })).isError, 'delete');
  ok((await call(client, 'manage_slides', { path: P, action: 'delete', slide: 99 })).isError, 'delete buiten bereik = fout');

  // Didactiek: cards zonder fragments → segmentatietip → fix
  const an = await call(client, 'analyze_presentation_pedagogy', { path: P });
  ok(!an.isError && an.structuredContent.balance && an.structuredContent.slides.length === 10, 'analyze_presentation_pedagogy');
  const segSlide = an.structuredContent.slides.find((s) => s.tips.some((t) => t.id.startsWith('segment:') && !t.quiet));
  ok(!!segSlide, 'segmentatie-tip gevonden');
  if (segSlide) {
    const tip = segSlide.tips.find((t) => t.id.startsWith('segment:') && !t.quiet);
    const before = fs.readFileSync(path.join(withInput, P), 'utf8').split('fragment').length;
    const fix = await call(client, 'apply_pedagogical_fix', { path: P, slide: segSlide.slide, tipId: tip.id });
    ok(!fix.isError, `apply_pedagogical_fix (${text(fix)})`);
    const after = fs.readFileSync(path.join(withInput, P), 'utf8').split('fragment').length;
    ok(after > before, 'fragment-klasse toegevoegd op schijf');
    const an2 = await call(client, 'analyze_presentation_pedagogy', { path: P });
    ok(!an2.structuredContent.slides[segSlide.slide - 1].tips.some((t) => t.id === tip.id && !t.quiet), 'tip verdwenen na fix');
  }
  ok((await call(client, 'apply_pedagogical_fix', { path: P, slide: 1, tipId: 'bestaat-niet' })).isError, 'onbekende tip = nette fout');

  // Media toevoegen: foto en video (lokaal bestand)
  const pngBytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  const photoSrc = path.join(tmp, 'Foto Test.PNG');
  fs.writeFileSync(photoSrc, pngBytes);
  const clipSrc = path.join(tmp, 'clip.webm');
  fs.writeFileSync(clipSrc, Buffer.from('webm-dummy-bytes'));
  const deckDirRel = 'presentations/2026-2027/jaar-1/design/design1_kleur-basis';

  const add1 = await call(client, 'add_media_file', { path: P, source: photoSrc, alt: 'Testfoto' });
  ok(!add1.isError, `add_media_file foto (${text(add1)})`);
  ok(add1.structuredContent.path === `${deckDirRel}/assets/foto-test.png`, `foto-pad genormaliseerd (${add1.structuredContent.path})`);
  ok(add1.structuredContent.reference === 'assets/foto-test.png' && add1.structuredContent.kind === 'image', 'foto: referentie + kind');
  ok(add1.structuredContent.snippet.includes('src="assets/foto-test.png"') && add1.structuredContent.snippet.includes('alt="Testfoto"'), 'foto: kant-en-klaar snippet');
  ok(fs.readFileSync(path.join(withInput, add1.structuredContent.path)).equals(pngBytes), 'foto-bytes op schijf identiek');

  const add2 = await call(client, 'add_media_file', { path: P, source: photoSrc });
  ok(add2.structuredContent.name === 'foto-test-2.png', `naamconflict krijgt -2 (${add2.structuredContent.name})`);

  const addv = await call(client, 'add_media_file', { path: P, source: clipSrc, caption: 'Demo' });
  ok(!addv.isError && addv.structuredContent.kind === 'video' && addv.structuredContent.snippet.includes('<video controls'), 'video toegevoegd met video-snippet');

  const badExt = path.join(tmp, 'notities.txt');
  fs.writeFileSync(badExt, 'x');
  ok((await call(client, 'add_media_file', { path: P, source: badExt })).isError, 'onbekend bestandstype geweigerd');
  ok((await call(client, 'add_media_file', { path: P, source: path.join(tmp, 'bestaat-niet.png') })).isError, 'ontbrekende bron = nette fout');
  ok((await call(client, 'add_media_file', { source: photoSrc })).isError, 'target assets zonder deck = fout');
  ok((await call(client, 'add_media_file', { path: P, source: photoSrc, url: 'https://x/y.png' })).isError, 'source + url samen geweigerd');
  const trav = await call(client, 'add_media_file', { path: P, source: photoSrc, filename: '../../evil.png' });
  ok(!trav.isError && trav.structuredContent.path === `${deckDirRel}/assets/evil.png`, `bestandsnaam-traversal geneutraliseerd (${trav.structuredContent.path})`);

  // Gedeeld (shared/) i.p.v. de deck-map → publiek absoluut pad (zoals de Studio-uploads)
  const shared = await call(client, 'add_media_file', { path: P, source: clipSrc, target: 'shared' });
  ok(!shared.isError && shared.structuredContent.path.startsWith('shared/video/') && shared.structuredContent.reference === `/presentations/${shared.structuredContent.path}`, `gedeelde video (${shared.structuredContent.reference})`);

  // Downloaden via URL (lokale http-server)
  const server = http.createServer((_req, res) => { res.writeHead(200, { 'content-type': 'image/png' }); res.end(pngBytes); });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  try {
    const port = server.address().port;
    const dl = await call(client, 'add_media_file', { path: P, url: `http://127.0.0.1:${port}/remote-logo.png` });
    ok(!dl.isError && dl.structuredContent.name === 'remote-logo.png' && dl.structuredContent.reference === 'assets/remote-logo.png', `download via URL (${text(dl)})`);
    ok(fs.readFileSync(path.join(withInput, dl.structuredContent.path)).equals(pngBytes), 'gedownloade bytes op schijf');
  } finally {
    await new Promise((r) => server.close(r));
  }

  // list_media + de helper die publish gebruikt om assets te verzamelen
  const lm = await call(client, 'list_media', { path: P });
  ok(!lm.isError && lm.structuredContent.media.some((m) => m.reference === 'assets/foto-test.png' && m.kind === 'image'), 'list_media: deck-media met referentie');
  ok(lm.structuredContent.media.every((m) => m.path.startsWith(`${deckDirRel}/`) || m.path.startsWith('shared/')), 'list_media: beperkt tot deck + shared');
  const publishAssets = deckMediaFiles(withInput, deckDirRel);
  ok(publishAssets.some((f) => f.endsWith('/assets/foto-test.png')) && publishAssets.some((f) => f.endsWith('/assets/clip.webm')), `deckMediaFiles voor publish (${publishAssets.length})`);

  // Verliesvrij: serialisatie van de huidige schijf is byte-gelijk
  disk = fs.readFileSync(path.join(withInput, P), 'utf8');
  ok(serializeDeck(parseDeck(disk)) === disk, 'bestand op schijf blijft byte-identiek round-trippen');

  // Ongewijzigde decks blijven onaangeroerd
  ok(fs.readFileSync(path.join(withInput, 'presentations/design1_logos/slides.md'), 'utf8') === fs.readFileSync(path.join(withoutInput, 'presentations/design1_logos/slides.md'), 'utf8'), 'overige decks onaangeroerd');
  ok((await call(client, 'get_presentation', { path: '../etc/passwd' })).isError, 'pad buiten presentations/ geweigerd');

  // GitHub zonder token
  const pub = await call(client, 'publish_deck_to_github', { path: P });
  ok(pub.isError && text(pub).includes('GITHUB_TOKEN'), 'publish zonder token = heldere fout');
  const chk = await call(client, 'check_github_build_status', {});
  ok(chk.isError && text(chk).includes('GITHUB_TOKEN'), 'build-status zonder token = heldere fout');

  const stderr = transport.stderr ? await new Promise((res) => { let b = ''; transport.stderr.on('data', (d) => { b += d; }); setTimeout(() => res(b), 50); }) : '';
  ok(!stderr.includes('Error:'), 'geen onverwachte serverfouten op stderr');
} finally {
  await client.close();
}

/* ------------------------------------- server zonder input/-map (online) --- */

{
  const { client: c2 } = await connect(withoutInput);
  try {
    const li = await call(c2, 'list_input_documents');
    ok(!li.isError && text(li).includes('alleen lokaal worden uitgelezen') && text(li).includes('Plak de brontekst'), 'zonder input/: expliciete "alleen lokaal"-melding (list)');
    const rd = await call(c2, 'read_input_document', { name: 'lesplan.md' });
    ok(text(rd).includes('alleen lokaal worden uitgelezen'), 'zonder input/: expliciete melding (read)');
    const res = JSON.parse((await c2.readResource({ uri: 'glr://input/files' })).contents[0].text);
    ok(res.available === false && res.message.includes('lokaal'), 'zonder input/: resource meldt niet beschikbaar');
  } finally {
    await c2.close();
  }
}

fs.rmSync(tmp, { recursive: true, force: true });
if (failures) { console.error(`\n${failures} fout(en).`); process.exit(1); }
console.log(`✔ MCP: 17 tools, 5 resources, 4 prompts — end-to-end geslaagd (${checks} controles)`);
