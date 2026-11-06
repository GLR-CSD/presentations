#!/usr/bin/env node
/**
 * Bouwt de centrale portaalpagina (dist/index.html).
 *
 * Scant recursief alle mappen onder `presentations/` en beschouwt elke map
 * met een `index.html` en/of `slides.md` als een presentatie. Titel, cohort,
 * leerjaar, periode en tags komen uit de YAML-frontmatter van `slides.md`,
 * anders uit de <title> van index.html, anders uit de mapnaam.
 *
 * Presentaties worden gegroepeerd in een opvouwbare directory-tree
 * (cohort / jaar / vak / presentatie) met zoekfunctie en uitvouwbediening.
 *
 * Gebruik:  npm run build:index
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildHtmlShell, shellNameFor } from './lib/html-shell.js';
import { pdfUrl, computeDeckHash, listPdfAssets, pdfStatus } from './lib/pdf-assets.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const presentationsRoot = path.join(root, 'presentations');
const distDir = path.join(root, 'dist');

// dist/index.html staat in de deploy naast `presentations/` en `shared/`;
// de links beginnen daarom met `presentations/`.
const WEB_PREFIX = 'presentations';

/** Escapecode voor veilige HTML-interpolatie. */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/**
 * Leest eenvoudige `key: value`-frontmatter uit een markdownbestand.
 * Ondersteunt zowel het nieuwe `<!-- frontmatter … -->`-formaat (dat het CMS
 * schrijft en dat de `---` slide-scheidingstekens van Reveal.js ongemoeid laat)
 * als het oudere `--- … ---`-formaat (backwards-compatibility).
 */
function readFrontmatter(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(
      /^(?:<!--\s*frontmatter\r?\n([\s\S]*?)\r?\n-->|---\r?\n([\s\S]*?)\r?\n---)/
    );
    if (!match) return {};
    const block = match[1] ?? match[2] ?? '';
    const data = {};
    for (const line of block.split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
      if (!kv) continue;
      let value = kv[2].trim().replace(/^["']|["']$/g, '');
      if (/^\[.*\]$/.test(value)) {
        value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      }
      data[kv[1]] = value;
    }
    return data;
  } catch {
    return {};
  }
}

/** Leest de <title> uit index.html als nette titel (zonder GLR-suffix). */
function readHtmlTitle(file) {
  try {
    const match = fs.readFileSync(file, 'utf8').match(/<title>([\s\S]*?)<\/title>/i);
    if (!match) return '';
    return match[1].replace(/\s+/g, ' ').trim().replace(/\s*[—–|-]\s*GLR\b.*$/i, '').trim();
  } catch {
    return '';
  }
}

/** Van `p1-html-css-basics` naar "Html css basics". */
function prettifyName(slug) {
  const cleaned = slug.replace(/^[0-9]+[-_]/, '').replace(/[-_]+/g, ' ').trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/** Label voor een mapsegment: `2026-2027` blijft, `jaar-1` wordt "Jaar 1". */
function prettifySegment(segment) {
  if (/^\d{4}\s*[–-]\s*\d{4}$/.test(segment)) return segment;
  return prettifyName(segment) || segment;
}

/**
 * Is dit .md-bestand een reveal-deck? `slides.md` is dat altijd; andere
 * bestanden alleen als ze met frontmatter beginnen. Zo voorkomen we dat losse
 * notitie-/README-bestanden onterecht een slide-shell krijgen.
 */
function isDeckMarkdown(file) {
  if (path.basename(file) === 'slides.md') return true;
  try {
    return /^(---|<!--\s*frontmatter)/.test(fs.readFileSync(file, 'utf8'));
  } catch {
    return false;
  }
}

/**
 * Genereert voor elk deck-`.md` zonder bijbehorende `.html`-shell automatisch
 * de standaard GLR-shell (naast het .md-bestand). Geeft de paden van de nieuw
 * gegenereerde shells terug, zodat de aanroeper ze naar `dist/` kan spiegelen.
 */
function generateMissingShells(dir, created) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      generateMissingShells(full, created);
      continue;
    }
    if (!entry.isFile() || !/\.md$/i.test(entry.name) || !isDeckMarkdown(full)) continue;

    const shellPath = path.join(dir, shellNameFor(entry.name));
    if (fs.existsSync(shellPath)) continue;

    const depth = path.relative(root, dir).split(path.sep).length;
    const prefix = '../'.repeat(depth);
    const fm = readFrontmatter(full);
    const title = fm.title || prettifyName(path.basename(dir));
    fs.writeFileSync(shellPath, buildHtmlShell({ prefix, mdFile: entry.name, title }));
    created.push(shellPath);
    console.log(`  ✚ shell gegenereerd: ${path.relative(root, shellPath)}`);
  }
}

function collect(dir, found) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const fileNames = entries.filter((e) => e.isFile()).map((e) => e.name);
  const rel = path.relative(presentationsRoot, dir).split(path.sep).join('/');
  const hasIndex = fileNames.includes('index.html');
  const deckMd = entries.find(
    (e) => e.isFile() && /\.md$/i.test(e.name) && isDeckMarkdown(path.join(dir, e.name))
  );

  if (hasIndex || deckMd) {
    // Primaire markdown: `slides.md` heeft voorkeur, anders het deck-.md-bestand.
    const mdName = fileNames.includes('slides.md') ? 'slides.md' : (deckMd ? deckMd.name : null);
    const mdPath = mdName ? path.join(dir, mdName) : null;
    const fm = mdPath && fs.existsSync(mdPath) ? readFrontmatter(mdPath) : {};
    const shell = mdName ? shellNameFor(mdName) : 'index.html';
    found.push({
      path: rel,
      name: fm.title || readHtmlTitle(path.join(dir, 'index.html')) || prettifyName(path.basename(dir)),
      cohort: fm.cohort || '',
      leerjaar: fm.leerjaar ?? '',
      periode: fm.periode ?? '',
      auteur: fm.auteur || '',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      // Standaard decks hebben een index.html (map-link); gegenereerde shells
      // voor losse `<naam>.md`-decks linken direct naar `<naam>.html`.
      href: hasIndex ? `./${WEB_PREFIX}/${rel}/` : `./${WEB_PREFIX}/${rel}/${shell}`,
      hasPdf: hasIndex,
      // Voor het statische deck-manifest van de GLR Slide Studio:
      mdFile: mdName || null,
      htmlFile: hasIndex ? 'index.html' : (mdName ? shell : null),
      family: mdName ? 'markdown' : 'html',
    });
    return;
  }

  for (const entry of entries.filter((e) => e.isDirectory())) {
    collect(path.join(dir, entry.name), found);
  }
}

/** Bouwt een geneste boom (mappen + presentaties) uit de relatieve paden. */
function buildTree(items) {
  const rootNode = { type: 'folder', segment: '', label: '', children: [] };
  for (const item of items) {
    const segments = item.path.split('/');
    let node = rootNode;
    for (let i = 0; i < segments.length - 1; i += 1) {
      const segment = segments[i];
      let child = node.children.find((c) => c.type === 'folder' && c.segment === segment);
      if (!child) {
        child = { type: 'folder', segment, label: prettifySegment(segment), children: [] };
        node.children.push(child);
      }
      node = child;
    }
    node.children.push({ type: 'presentation', item });
  }
  sortTree(rootNode);
  return rootNode;
}

function nodeLabel(node) {
  return node.type === 'folder' ? node.label : node.item.name;
}

/** Sorteert mappen eerst, daarna presentaties; beide alfabetisch (nl). */
function sortTree(node) {
  node.children.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return nodeLabel(a).localeCompare(nodeLabel(b), 'nl', { numeric: true });
  });
  for (const child of node.children) {
    if (child.type === 'folder') sortTree(child);
  }
}

function countLeaves(node) {
  if (node.type === 'presentation') return 1;
  return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
}

function countFolders(node) {
  let total = 0;
  for (const child of node.children) {
    if (child.type === 'folder') total += 1 + countFolders(child);
  }
  return total;
}

const FOLDER_ICON = '<svg class="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h3.6l1.8 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
const CHEVRON = '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>';

function renderLeaf(item) {
  const meta = [item.cohort, item.leerjaar && `leerjaar ${item.leerjaar}`, item.periode && `periode ${item.periode}`, item.auteur]
    .filter(Boolean)
    .map((part) => `<span class="meta-item">${escapeHtml(part)}</span>`)
    .join('');
  const tags = item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
  const search = [item.name, item.path, item.cohort, item.auteur, item.leerjaar, item.periode, ...item.tags]
    .filter(Boolean).join(' ').toLowerCase();
  const metaBlock = meta || tags ? `\n            <div class="meta">${meta}${tags}</div>` : '';
  let pdfLink = '';
  if (item.hasPdf) {
    const href = pdfUrl(item.path);
    if (item.pdfStatus === 'missing') {
      pdfLink = '\n            <span class="pdf-pending" title="De PDF wordt nog gegenereerd">PDF volgt</span>';
    } else {
      const badge = item.pdfStatus === 'outdated'
        ? '<span class="pdf-badge" title="Deze PDF is van een eerdere versie; de nieuwe wordt gegenereerd.">oude versie — wordt bijgewerkt</span>'
        : '';
      pdfLink = `\n            <a class="btn btn-secondary" href="${href}" download>PDF</a>${badge}`;
    }
  }
  const editLink = item.mdFile
    ? `\n            <a class="btn btn-secondary" href="./admin/?deck=${encodeURIComponent(`presentations/${item.path}/${item.mdFile}`)}">Bewerken</a>`
    : '';
  return `
        <div class="leaf" data-search="${escapeHtml(search)}">
          <div class="leaf-main">
            <span class="leaf-title" data-title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>${metaBlock}
          </div>
          <div class="links">
            <a class="btn" href="${item.href}" target="_blank" rel="noopener noreferrer">Presentatie</a>${editLink}${pdfLink}
          </div>
        </div>`;
}

function renderNode(node) {
  if (node.type === 'presentation') return renderLeaf(node.item);
  const children = node.children.map((child) => renderNode(child)).join('\n');
  return `
      <details class="node" open>
        <summary class="folder-summary">
          ${CHEVRON}
          ${FOLDER_ICON}
          <span class="folder-label">${escapeHtml(node.label)}</span>
          <span class="folder-count">${countLeaves(node)}</span>
        </summary>
        <div class="children">
${children}
        </div>
      </details>`;
}

// Client-side: live zoeken/filteren, highlights, uitvouwen/inklappen.
const clientJs = `
(function () {
  var tree = document.getElementById('tree');
  if (!tree) return;
  var input = document.getElementById('q');
  var clearBtn = document.getElementById('clear');
  var stats = document.getElementById('stats');
  var searchBox = input.closest('.search');
  var totalLabel = stats.getAttribute('data-total') || '';
  var leaves = Array.prototype.slice.call(tree.querySelectorAll('.leaf'));
  var folders = Array.prototype.slice.call(tree.querySelectorAll('details.node'));

  function highlight(el, text, term) {
    if (!term) { el.textContent = text; return; }
    var idx = text.toLowerCase().indexOf(term);
    if (idx < 0) { el.textContent = text; return; }
    el.textContent = '';
    el.appendChild(document.createTextNode(text.slice(0, idx)));
    var mark = document.createElement('mark');
    mark.textContent = text.slice(idx, idx + term.length);
    el.appendChild(mark);
    el.appendChild(document.createTextNode(text.slice(idx + term.length)));
  }

  function restore() {
    leaves.forEach(function (leaf) {
      leaf.hidden = false;
      var t = leaf.querySelector('.leaf-title');
      highlight(t, t.getAttribute('data-title'), '');
    });
    folders.forEach(function (folder) { folder.hidden = false; });
    stats.textContent = totalLabel;
  }

  function apply() {
    var value = input.value;
    searchBox.classList.toggle('has-value', value.length > 0);
    var term = value.trim().toLowerCase();
    if (!term) { restore(); return; }
    var matches = 0;
    leaves.forEach(function (leaf) {
      var hit = (leaf.getAttribute('data-search') || '').indexOf(term) !== -1;
      leaf.hidden = !hit;
      var t = leaf.querySelector('.leaf-title');
      highlight(t, t.getAttribute('data-title'), hit ? term : '');
      if (!hit) return;
      matches += 1;
      var parent = leaf.parentElement;
      while (parent && parent !== tree) {
        if (parent.tagName === 'DETAILS') { parent.hidden = false; parent.open = true; }
        parent = parent.parentElement;
      }
    });
    folders.forEach(function (folder) {
      folder.hidden = !folder.querySelector('.leaf:not([hidden])');
    });
    stats.textContent = matches === 1 ? '1 resultaat' : matches + ' resultaten';
  }

  // Zoekterm in de URL (?q=…) zodat een zoekopdracht deelbaar en herlaadbaar is.
  var canSync = !!(window.history && history.replaceState && window.URL && window.URLSearchParams);

  function syncUrl() {
    if (!canSync) return;
    var url = new URL(location.href);
    var term = input.value.trim();
    if (term) url.searchParams.set('q', term);
    else url.searchParams.delete('q');
    if (url.href !== location.href) history.replaceState(history.state, '', url.href);
  }

  function loadFromUrl() {
    if (!canSync) return;
    input.value = new URLSearchParams(location.search).get('q') || '';
    apply();
  }

  input.addEventListener('input', function () {
    apply();
    syncUrl();
  });
  clearBtn.addEventListener('click', function () {
    input.value = '';
    apply();
    syncUrl();
    input.focus();
  });
  window.addEventListener('popstate', loadFromUrl);
  loadFromUrl();
  Array.prototype.forEach.call(document.querySelectorAll('[data-action]'), function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('data-action') === 'expand';
      folders.forEach(function (folder) { folder.open = open; });
    });
  });
})();
`;

// Genereer eerst ontbrekende .html-shells voor deck-`.md`-bestanden, zodat
// een nieuw in het CMS aangemaakt `.md` automatisch een werkende Reveal.js-
// presentatie wordt (en op de portaalpagina verschijnt).
const createdShells = [];
if (fs.existsSync(presentationsRoot)) generateMissingShells(presentationsRoot, createdShells);

const presentations = [];
if (fs.existsSync(presentationsRoot)) collect(presentationsRoot, presentations);
presentations.sort((a, b) => a.path.localeCompare(b.path, 'nl'));

// PDF-status per deck (release-assets vs. huidige content-hash). Zonder token
// of bij een API-fout is de status 'unknown' en tonen we gewoon de link.
const pdfAssets = await listPdfAssets();
if (!pdfAssets) console.warn('⚠️  PDF-status onbekend (geen GITHUB_TOKEN of API-fout); PDF-links worden ongecontroleerd getoond.');
for (const p of presentations) {
  if (p.hasPdf) p.pdfStatus = pdfStatus(pdfAssets, p.path, pdfAssets ? computeDeckHash(p.path) : '');
}

const tree = buildTree(presentations);
const treeHtml = tree.children.map((child) => renderNode(child)).join('\n');
const totalPresentations = presentations.length;
const totalFolders = countFolders(tree);
const summary = `${totalPresentations} presentatie${totalPresentations === 1 ? '' : 's'} · ${totalFolders} map${totalFolders === 1 ? '' : 'pen'}`;

const empty = '<p class="empty">Nog geen presentaties gevonden onder <code>presentations/</code>.</p>';

const css = `
    :root{--canvas:#FAF9FD;--ink:#111111;--ink-soft:#424936;--muted:#6B7280;--subtle:#F4F4F6;--border:#E5E7EB;--lime:#A6E22E;--green:#76B800;--green-dk:#416900;--white:#fff;--radius:10px;}
    :root{--font-display:'Space Grotesk','Hanken Grotesk',system-ui,sans-serif;--font-body:'Hanken Grotesk',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;}
    @font-face{font-family:'Space Grotesk';src:url('shared/fonts/SpaceGrotesk-Bold.ttf') format('truetype');font-weight:700;font-display:swap}
    @font-face{font-family:'Hanken Grotesk';src:url('shared/fonts/HankenGrotesk-Regular.ttf') format('truetype');font-weight:400;font-display:swap}
    @font-face{font-family:'Hanken Grotesk';src:url('shared/fonts/HankenGrotesk-SemiBold.ttf') format('truetype');font-weight:600;font-display:swap}
    *{box-sizing:border-box}
    body{margin:0;background:var(--canvas);color:var(--ink);font-family:var(--font-body);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased}
    a{color:var(--green-dk)}
    a:focus-visible,button:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid var(--green);outline-offset:2px;border-radius:6px}
    .wrap{max-width:960px;margin:0 auto;padding:0 20px 80px}
    .page-head{position:sticky;top:0;z-index:20;padding:28px 0 16px;margin-bottom:18px;background:rgba(250,249,253,.92);backdrop-filter:saturate(180%) blur(10px);-webkit-backdrop-filter:saturate(180%) blur(10px);border-bottom:1px solid var(--border)}
    h1{font-family:var(--font-display);font-weight:700;letter-spacing:-.02em;font-size:30px;margin:0 0 4px;color:var(--green-dk)}
    .subtitle{margin:0 0 18px;font-size:15px;color:var(--muted)}
    .toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
    .search{position:relative;flex:1 1 260px;display:flex;align-items:center}
    .search>svg{position:absolute;left:13px;width:16px;height:16px;color:var(--muted);pointer-events:none}
    .search input{width:100%;padding:11px 40px;border:1px solid var(--border);border-radius:999px;font:inherit;font-size:15px;background:var(--white);color:var(--ink);appearance:none;-webkit-appearance:none}
    .search input::-webkit-search-cancel-button{display:none}
    .search .clear{position:absolute;right:8px;width:26px;height:26px;display:none;align-items:center;justify-content:center;border:0;border-radius:999px;background:var(--subtle);color:var(--ink-soft);font-size:16px;line-height:1;cursor:pointer}
    .search.has-value .clear{display:flex}
    .search .clear:hover{background:var(--lime);color:var(--ink)}
    .actions{display:flex;gap:8px}
    .actions button{font:inherit;font-size:13px;font-weight:600;padding:9px 15px;border-radius:999px;border:1px solid var(--border);background:var(--white);color:var(--ink-soft);cursor:pointer}
    .actions button:hover{border-color:var(--green);color:var(--green-dk)}
    .actions .cms-link{display:inline-flex;align-items:center;font:inherit;font-size:13px;font-weight:600;padding:9px 15px;border-radius:999px;border:1px solid var(--green-dk);background:var(--green-dk);color:var(--white);text-decoration:none;cursor:pointer}
    .actions .cms-link:hover{background:var(--green);border-color:var(--green);color:var(--white)}
    .stats{margin:14px 0 0;font-size:13px;color:var(--muted)}
    .node{margin:0}
    .children{margin:2px 0 6px 13px;padding-left:14px;border-left:1px solid var(--border)}
    .folder-summary{list-style:none;display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--radius);cursor:pointer;user-select:none;-webkit-user-select:none}
    .folder-summary::-webkit-details-marker{display:none}
    .folder-summary:hover{background:var(--subtle)}
    .chevron{flex:0 0 auto;width:14px;height:14px;color:var(--muted);transition:transform .15s ease}
    details[open]>.folder-summary .chevron{transform:rotate(90deg)}
    .folder-icon{flex:0 0 auto;width:18px;height:18px;color:var(--green-dk)}
    .folder-label{font-family:var(--font-display);font-weight:600;font-size:16px}
    .folder-count{margin-left:auto;font-size:12px;font-variant-numeric:tabular-nums;color:var(--muted);background:var(--white);border:1px solid var(--border);border-radius:999px;padding:1px 9px}
    .leaf{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:10px 14px;border:1px solid transparent;border-radius:var(--radius)}
    .leaf:hover{background:var(--white);border-color:var(--border)}
    .leaf-main{min-width:0}
    .leaf-title{display:block;font-weight:600;font-size:15px}
    .leaf-title mark{background:var(--lime);color:var(--ink);border-radius:2px;padding:0 2px}
    .meta{margin-top:5px;display:flex;flex-wrap:wrap;gap:6px;font-size:12.5px;color:var(--muted)}
    .meta-item{background:var(--subtle);border-radius:4px;padding:1px 8px}
    .tag{background:var(--lime);color:var(--ink);font-weight:600;border-radius:4px;padding:1px 8px}
    .links{flex:0 0 auto;display:flex;gap:8px}
    .links a{display:inline-block;text-decoration:none;padding:7px 14px;font-size:13px;font-weight:600;border-radius:999px;white-space:nowrap}
    .btn{background:var(--green-dk);color:var(--white)}
    .btn:hover{background:var(--green);color:var(--white)}
    .btn-secondary{background:var(--subtle);color:var(--ink-soft);border:1px solid var(--border)}
    .btn-secondary:hover{border-color:var(--green);color:var(--green-dk)}
    .pdf-pending{display:inline-block;padding:6px 13px;font-size:13px;font-weight:600;border-radius:999px;white-space:nowrap;color:var(--muted);background:var(--subtle);border:1px dashed var(--border);cursor:default}
    .pdf-badge{align-self:center;font-size:11.5px;color:var(--muted);white-space:nowrap}
    .empty{padding:28px 4px;color:var(--muted)}
    .help{margin:18px 0 0;border:1px solid var(--border);border-radius:var(--radius);background:var(--white)}
    .help>summary{cursor:pointer;padding:11px 16px;font-weight:600;font-size:14px;list-style:none;display:flex;align-items:center;gap:9px}
    .help>summary::-webkit-details-marker{display:none}
    .help>summary::before{content:'?';display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:18px;height:18px;border-radius:999px;background:var(--lime);color:var(--ink);font-size:12px;font-weight:700}
    .help[open]>summary{border-bottom:1px solid var(--border)}
    .help ul{margin:12px 16px;padding-left:18px;display:flex;flex-direction:column;gap:6px;font-size:14px;color:var(--ink-soft)}
    .help code{background:var(--subtle);border-radius:4px;padding:1px 5px;font-size:13px}
    .help-link{margin:12px 16px 14px;font-size:13px;color:var(--muted)}
    [hidden]{display:none !important}
    @media (max-width:620px){h1{font-size:25px}.leaf{flex-direction:column;align-items:stretch;gap:10px}.links{justify-content:flex-start}}
    @media (prefers-reduced-motion:reduce){*{transition:none !important}}
`;

const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GLR CSD — Lespresentaties</title>
  <meta name="description" content="Centraal archief met lespresentaties van de opleiding Creative Software Developer (GLR).">
  <style>
${css}  </style>
</head>
<body>
  <div class="wrap">
    <header class="page-head">
      <h1>Creative Software Developer — Presentaties</h1>
      <p class="subtitle">Centraal archief voor theorie-, instructie- en workshopslides.</p>
      <div class="toolbar">
        <label class="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="q" type="search" placeholder="Zoek op titel, vak, tag of leerjaar…" aria-label="Zoek presentaties" autocomplete="off">
          <button type="button" id="clear" class="clear" aria-label="Zoekopdracht wissen">&times;</button>
        </label>
        <div class="actions">
          <a class="cms-link" href="./admin/">Slides Bewerken (GLR Slide Studio)</a>
          <button type="button" data-action="expand">Alles uitvouwen</button>
          <button type="button" data-action="collapse">Alles inklappen</button>
        </div>
      </div>
      <p class="stats" id="stats" data-total="${summary}" aria-live="polite">${summary}</p>
      <details class="help">
        <summary>Hoe gebruik je deze presentaties?</summary>
        <ul>
          <li>Klik op <strong>Presentatie</strong> om een les te openen; die opent in een nieuw tabblad.</li>
          <li>Navigeer met de <strong>pijltoetsen</strong> of <strong>spatie</strong>. Met <strong>Esc</strong> krijg je een overzicht en met <strong>F</strong> volledig scherm.</li>
          <li>Druk op <strong>S</strong> voor de sprekersnotities in een apart venster.</li>
          <li>Druk op <strong>B</strong> om op de slides te tekenen (chalkboard), op <strong>C</strong> voor de notitie-canvas en op <strong>Del</strong> om het bord te wissen.</li>
          <li>Formules tussen <code>$…$</code> worden automatisch als wiskunde weergegeven.</li>
          <li>Met <strong>PDF</strong> download je een statische versie van de presentatie (inclusief sprekersnotities).</li>
        </ul>
        <p class="help-link">Nieuw met reveal.js? De <a href="https://revealjs.com/" target="_blank" rel="noopener noreferrer">officiële reveal.js-documentatie</a> legt alle sneltoetsen, plugins en het maken van slides uit.</p>
      </details>
    </header>
    <main id="tree" class="tree">
${treeHtml || empty}
    </main>
  </div>
  <script>
${clientJs}  </script>
</body>
</html>
`;

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'index.html'), html);

// Zet de CMS-map en de media-uploads klaar in dist/, en spiegel de zojuist
// gegenereerde shells (de deploy-workflow kopieert `presentations/` en
// `shared/` al vóór deze stap, dus we vullen alleen de nieuwe bestanden aan).
for (const shell of createdShells) {
  const dest = path.join(distDir, WEB_PREFIX, path.relative(presentationsRoot, shell));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(shell, dest);
}

const adminSrc = path.join(root, 'admin');
if (fs.existsSync(adminSrc)) {
  fs.cpSync(adminSrc, path.join(distDir, 'admin'), { recursive: true, force: true });
}

const uploadsSrc = path.join(root, 'shared', 'img', 'uploads');
if (fs.existsSync(uploadsSrc)) {
  fs.cpSync(uploadsSrc, path.join(distDir, 'shared', 'img', 'uploads'), { recursive: true, force: true });
}

// --- Statisch deck-manifest voor de GLR Slide Studio ------------------------
// Laat de Studio de "Deck openen"-lijst direct vullen (zonder GitHub-token of
// mapselectie) en elk deck via fetch() laden — offline, vanaf GitHub Pages of
// een lokale server.
const manifest = {
  generatedAt: new Date().toISOString(),
  presentations: presentations.map((p) => ({
    title: p.name,
    md: p.mdFile ? `presentations/${p.path}/${p.mdFile}` : null,
    html: p.htmlFile ? `presentations/${p.path}/${p.htmlFile}` : null,
    cohort: p.cohort,
    leerjaar: p.leerjaar,
    periode: p.periode,
    auteur: p.auteur,
    tags: p.tags,
    family: p.family,
    href: p.href,
  })),
};
const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
for (const dir of [distDir, adminSrc, path.join(distDir, 'admin')]) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'presentations-manifest.json'), manifestJson);
}

// Studio-config (build-time): de Worker-URL voor "Inloggen met GitHub" komt uit
// env GLR_OAUTH_URL, zodat hij niet in de code hoeft te staan. Geen geheim.
const studioConfigJson = `${JSON.stringify({ oauthUrl: (process.env.GLR_OAUTH_URL || '').trim().replace(/\/+$/, '') || null }, null, 2)}\n`;
for (const dir of [adminSrc, path.join(distDir, 'admin')]) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'studio-config.json'), studioConfigJson);
}

console.log(`✔ Portaalpagina gebouwd: dist/index.html (${totalPresentations} presentatie(s), ${totalFolders} map(pen))`);
if (createdShells.length) console.log(`  ${createdShells.length} nieuwe shell(s) gegenereerd.`);
