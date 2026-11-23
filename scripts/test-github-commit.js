#!/usr/bin/env node
/**
 * Test: commitFiles probeert opnieuw bij "not a fast forward" (gestubde Octokit).
 * Gebruik:  npm run test:commit
 */
import { commitFiles, cloneDeck, moveDeck, _setClientForTests } from '../admin/src/storage/github.js';
import { cloneMarkdown } from '../admin/src/state/clone.js';
import { parseFrontmatter } from '../admin/src/state/frontmatter.js';

let failures = 0;
const ok = (c, m) => { if (!c) { failures += 1; console.error(`✖ ${m}`); } };

function makeApi(updateFailures, failWith = { status: 422, message: 'Update is not a fast forward' }) {
  const calls = { getRef: 0, createBlob: 0, updateRef: 0, createCommit: 0 };
  let tip = 0;
  const api = { rest: { git: {
    getRef: async () => { calls.getRef += 1; tip += 1; return { data: { object: { sha: `tip${tip}` } } }; },
    getCommit: async ({ commit_sha }) => ({ data: { tree: { sha: `tree-${commit_sha}` } } }),
    createBlob: async () => { calls.createBlob += 1; return { data: { sha: 'blob1' } }; },
    createTree: async () => ({ data: { sha: 'newtree' } }),
    createCommit: async ({ parents }) => { calls.createCommit += 1; return { data: { sha: `commit-on-${parents[0]}` } }; },
    updateRef: async () => {
      calls.updateRef += 1;
      if (calls.updateRef <= updateFailures) throw Object.assign(new Error(failWith.message), failWith);
      return {};
    },
  } } };
  return { api, calls };
}

const files = [{ path: 'shared/img/uploads/a.png', content: 'AAAA', encoding: 'base64' }];

{ // 1 conflict → retry op nieuwe tip, blob maar één keer
  const { api, calls } = makeApi(1);
  _setClientForTests(api);
  const sha = await commitFiles('m', files);
  ok(calls.getRef === 2, 'getRef 2x');
  ok(calls.createBlob === 1, 'blob 1x');
  ok(sha === 'commit-on-tip2', 'tweede commit heeft nieuwe tip als parent');
}
{ // blijvend conflict → gooit na 3 pogingen
  const { api, calls } = makeApi(99);
  _setClientForTests(api);
  let err = null;
  try { await commitFiles('m', files); } catch (e) { err = e; }
  ok(err && err.status === 422 && calls.updateRef === 3, 'stopt na 3 pogingen');
}
{ // andere fout → geen retry
  const { api, calls } = makeApi(99, { status: 403, message: 'Forbidden' });
  _setClientForTests(api);
  let err = null;
  try { await commitFiles('m', files); } catch (e) { err = e; }
  ok(err && err.status === 403 && calls.updateRef === 1, '403 niet opnieuw geprobeerd');
}

/* ---- cloneDeck / moveDeck: boom-bewuste stub ---- */
function makeTreeApi(treePaths) {
  const captured = { tree: null, blobs: [] };
  const b64 = (t) => Buffer.from(t).toString('base64');
  const contents = { 'sha-html': '<script src="../../shared/vendor/reveal.js"></script>', 'sha-md': 'oud' };
  const tree = treePaths.map((path) => ({ path, type: 'blob', mode: '100644', sha: path.endsWith('index.html') ? 'sha-html' : path.endsWith('slides.md') ? 'sha-md' : `sha-${path}` }));
  const api = { rest: { git: {
    getRef: async () => ({ data: { object: { sha: 'tip' } } }),
    getCommit: async () => ({ data: { tree: { sha: 'basetree' } } }),
    getTree: async () => ({ data: { tree, truncated: false } }),
    getBlob: async ({ file_sha }) => ({ data: { content: b64(contents[file_sha] || 'x') } }),
    createBlob: async ({ content }) => { captured.blobs.push(content); return { data: { sha: `new-${captured.blobs.length}` } }; },
    createTree: async ({ tree: t }) => { captured.tree = t; return { data: { sha: 'newtree' } }; },
    createCommit: async () => ({ data: { sha: 'c1' } }),
    updateRef: async () => ({}),
  } } };
  return { api, captured };
}
const FROM = 'presentations/beroeps2_x';
const TO = 'presentations/2026-2027/jaar-2/beroeps/beroeps2_x-jan';
const deckTree = [`${FROM}/slides.md`, `${FROM}/index.html`, `${FROM}/assets/a.png`, 'shared/css/glr-theme.css'];
const rewriteDepth5 = (rel, text) => (/\.html$/i.test(rel) ? text.replace(/(\.\.\/)+shared\//g, '../../../../../shared/') : null);

{ // clone: kopieert, laat het origineel staan, hergebruikt asset-blobs, herschrijft prefix
  const { api, captured } = makeTreeApi(deckTree);
  _setClientForTests(api);
  await cloneDeck('m', FROM, TO, rewriteDepth5, { slidesContent: 'NIEUW' });
  const paths = captured.tree.map((e) => e.path);
  ok(paths.includes(`${TO}/slides.md`) && paths.includes(`${TO}/index.html`) && paths.includes(`${TO}/assets/a.png`), 'clone: alle bestanden op nieuwe plek');
  ok(!captured.tree.some((e) => e.sha === null), 'clone: geen delete-entries (origineel blijft)');
  ok(!paths.some((p) => p.startsWith(`${FROM}/`)), 'clone: nergens een pad in het origineel geschreven');
  ok(captured.tree.find((e) => e.path === `${TO}/assets/a.png`).sha === `sha-${FROM}/assets/a.png`, 'clone: asset-blob hergebruikt');
  ok(captured.blobs.includes('NIEUW') && captured.blobs.some((b) => b.includes('../../../../../shared/')), 'clone: slides.md vervangen en index.html-prefix herschreven');
}
{ // move blijft verplaatsen: delete-entries aanwezig
  const { api, captured } = makeTreeApi(deckTree);
  _setClientForTests(api);
  await moveDeck('m', FROM, TO, rewriteDepth5, {});
  ok(captured.tree.filter((e) => e.sha === null).length === 3, 'move: 3 bestanden uit het origineel verwijderd');
}
{ // clone weigert bestaande doelmap en doel binnen de bron
  const { api } = makeTreeApi([...deckTree, `${TO}/slides.md`]);
  _setClientForTests(api);
  let err = null;
  try { await cloneDeck('m', FROM, TO, null, {}); } catch (e) { err = e; }
  ok(err && /bestaat al/.test(err.message), 'clone: bestaande doelmap geweigerd');
  err = null;
  try { await cloneDeck('m', FROM, `${FROM}/sub`, null, {}); } catch (e) { err = e; }
  ok(err && /Ongeldige doelmap/.test(err.message), 'clone: doel binnen bron geweigerd');
}
{ // cloneMarkdown: frontmatter aangepast, body ongemoeid
  const src = '<!-- frontmatter\ntitle: "Orig"\ncohort: "2026-2027"\nleerjaar: 2\nauteur: "Melvin"\ntags: ["A"]\n-->\n\n## Slide\n';
  const out = cloneMarkdown(src, { title: 'Kopie', auteur: 'Jan', leerjaar: '1', clonedFrom: 'presentations/beroeps2_x/slides.md' });
  const fm = parseFrontmatter(out).toObject();
  ok(fm.title === 'Kopie' && fm.auteur === 'Jan' && fm.leerjaar === 1 && fm.cohort === '2026-2027', 'cloneMarkdown: velden bijgewerkt, rest behouden');
  ok(fm.gekloond_van === 'presentations/beroeps2_x/slides.md' && fm.tags[0] === 'A', 'cloneMarkdown: gekloond_van toegevoegd');
  ok(out.endsWith('\n\n## Slide\n'), 'cloneMarkdown: body ongewijzigd');
  ok(cloneMarkdown('## geen frontmatter', { title: 'x' }) === '## geen frontmatter', 'cloneMarkdown: zonder frontmatter ongewijzigd');
}

if (failures) { console.error(`${failures} test(s) mislukt`); process.exit(1); }
console.log('✓ github commit-retry tests ok');
