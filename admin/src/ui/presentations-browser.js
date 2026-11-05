/**
 * Directory Tree Explorer — vervangt de platte deck-dropdown door een gelaagde,
 * doorzoekbare modal.
 *
 * Links een inklapbare boom die op twee manieren groepeert:
 *   - "Per leerjaar": Leerjaar 1/2/3 → Periode 1–4
 *   - "Per vakgebied": Beroeps / Design / Interface / MVI / WebXR / Immersive Design / Overig
 * Rechts overzichtelijke kaartjes van de presentaties in de geselecteerde map.
 * Bovenin een zoekbalk (titel, map, auteur, tags) en klikbare tag-chips.
 */
import { openModal } from './modal.js';
import { icon } from './icons.js';
import { escapeHtml, entrySubject, entryLeerjaar, entryPeriode } from './util.js';

function groupJaar(entries) {
  const years = new Map();
  for (const entry of entries) {
    const y = entryLeerjaar(entry);
    if (!years.has(y)) years.set(y, new Map());
    const p = entryPeriode(entry);
    const periods = years.get(y);
    if (!periods.has(p)) periods.set(p, []);
    periods.get(p).push(entry);
  }
  return [...years.entries()].map(([year, periods]) => ({
    label: year,
    children: [...periods.entries()].map(([period, items]) => ({ label: period, entries: items })),
  }));
}

function groupVak(entries) {
  const subjects = new Map();
  for (const entry of entries) {
    const s = entrySubject(entry);
    if (!subjects.has(s)) subjects.set(s, []);
    subjects.get(s).push(entry);
  }
  return [...subjects.entries()].map(([label, items]) => ({ label, children: [], entries: items }));
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => String(a.title || a.md || '').localeCompare(String(b.title || b.md || ''), 'nl', { numeric: true }));
}

/**
 * @param {{ manifest: object, currentPath?: string, onOpen: Function, onNew: Function }} ctx
 */
export function openPresentationsBrowser({ manifest, currentPath = '', onOpen, onNew }) {
  const all = sortEntries((manifest.presentations || []).filter((p) => p.md || p.html));
  const allTags = [...new Set(all.flatMap((e) => e.tags || []))].sort((a, b) => a.localeCompare(b, 'nl'));

  const modal = openModal({ title: 'Presentaties openen', subtitle: 'Kies een presentatie of maak een nieuwe aan.', size: 'xl' });

  const wrap = document.createElement('div');
  wrap.className = 'explorer';

  const bar = document.createElement('div');
  bar.className = 'explorer__bar';
  const searchWrap = document.createElement('label');
  searchWrap.className = 'explorer__search';
  searchWrap.innerHTML = `<span class="explorer__search-ic">${icon('search', 16)}</span>`;
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Zoek op titel, mapnaam, auteur of tag…';
  searchWrap.append(input);
  const newBtn = document.createElement('button');
  newBtn.type = 'button';
  newBtn.className = 'studio-btn studio-btn--primary';
  newBtn.innerHTML = `${icon('file-plus', 15)}<span>Nieuwe Presentatie</span>`;
  newBtn.addEventListener('click', () => { modal.close(); if (onNew) onNew(); });
  bar.append(searchWrap, newBtn);

  const chips = document.createElement('div');
  chips.className = 'explorer__chips';

  const cols = document.createElement('div');
  cols.className = 'explorer__cols';
  const treePane = document.createElement('div');
  treePane.className = 'explorer__tree';
  const cardPane = document.createElement('div');
  cardPane.className = 'explorer__cards';
  cols.append(treePane, cardPane);

  wrap.append(bar, chips, cols);
  modal.body.append(wrap);

  const state = { view: 'jaar', scope: null, scopeKey: null, query: '', tags: new Set() };

  /* ------------------------------------------------------------- kaartjes */
  function deckCard(entry) {
    const legacy = !entry.md;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'deck-card';
    const badges = [
      entry.leerjaar ? `Leerjaar ${escapeHtml(entry.leerjaar)}` : '',
      entry.periode ? `Periode ${escapeHtml(entry.periode)}` : '',
      entry.cohort ? escapeHtml(entry.cohort) : '',
    ].filter(Boolean).map((t) => `<span class="deck-card__badge">${t}</span>`).join('');
    card.innerHTML = `
      <span class="deck-card__top">
        <span class="deck-card__ic">${icon('file-text', 18)}</span>
        <span class="deck-card__title">${escapeHtml(entry.title || entry.md || entry.html || 'Naamloos')}</span>
        ${legacy ? `<span class="deck-card__flag">HTML</span>` : ''}
      </span>
      <span class="deck-card__meta">${badges}</span>
      ${entry.auteur ? `<span class="deck-card__author">${icon('user', 13)} ${escapeHtml(entry.auteur)}</span>` : ''}
      <span class="deck-card__tags">${(entry.tags || []).slice(0, 6).map((t) => `<span class="deck-tag">${escapeHtml(t)}</span>`).join('')}</span>
      ${entry.md && entry.md === currentPath ? `<span class="deck-card__current">${icon('check', 13)} Nu geopend</span>` : ''}`;
    card.addEventListener('click', () => { modal.close(); if (onOpen) onOpen(entry); });
    return card;
  }

  function renderCards(entries) {
    cardPane.innerHTML = '';
    if (!entries.length) {
      const empty = document.createElement('p');
      empty.className = 'explorer__empty';
      empty.textContent = 'Geen presentaties gevonden.';
      cardPane.append(empty);
      return;
    }
    const grid = document.createElement('div');
    grid.className = 'deck-cards';
    for (const entry of entries) grid.append(deckCard(entry));
    cardPane.append(grid);
  }

  /* -------------------------------------------------------------- boom */
  function selectScope(key, entries) {
    state.scopeKey = key;
    state.scope = entries;
    state.query = '';
    input.value = '';
    applyFilters();
    renderTree();
  }

  function treeFolder(node) {
    const el = document.createElement('div');
    el.className = 'tree-node';
    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'tree-node__head';
    const entries = node.entries || node.children.flatMap((c) => c.entries || []);
    if (state.scopeKey === node.key) head.classList.add('is-active');
    head.innerHTML = `
      <span class="tree-node__chev">${icon('chevron-right', 14)}</span>
      <span class="tree-node__ic">${icon('folder', 15)}</span>
      <span class="tree-node__label">${escapeHtml(node.label)}</span>
      <span class="tree-node__count">${entries.length}</span>`;
    head.addEventListener('click', () => {
      const open = el.classList.toggle('is-open');
      head.querySelector('.tree-node__chev').innerHTML = icon(open ? 'chevron-down' : 'chevron-right', 14);
      selectScope(node.key, entries);
    });
    el.append(head);
    if (node.children && node.children.length) {
      const kids = document.createElement('div');
      kids.className = 'tree-node__children';
      for (const child of node.children) kids.append(treeFolder(child));
      el.append(kids);
    }
    return el;
  }

  function renderTree() {
    treePane.innerHTML = '';

    const toggle = document.createElement('div');
    toggle.className = 'explorer__toggle';
    for (const [id, label] of [['jaar', 'Per leerjaar'], ['vak', 'Per vakgebied']]) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.classList.toggle('is-active', state.view === id);
      b.addEventListener('click', () => { state.view = id; state.scope = null; state.scopeKey = null; renderTree(); applyFilters(); });
      toggle.append(b);
    }
    treePane.append(toggle);

    const groups = state.view === 'jaar' ? groupJaar(all) : groupVak(all);
    if (!groups.length) {
      const empty = document.createElement('p');
      empty.className = 'explorer__empty';
      empty.textContent = 'Nog geen presentaties in de repo.';
      treePane.append(empty);
      return;
    }
    for (const group of groups) {
      treePane.append(treeFolder({
        key: `${state.view}:${group.label}`,
        label: group.label,
        children: (group.children || []).map((c) => ({ key: `${state.view}:${group.label}:${c.label}`, label: c.label, entries: c.entries })),
        entries: group.entries,
      }));
    }
  }

  /* -------------------------------------------------------------- chips */
  function renderChips() {
    chips.innerHTML = '';
    if (!allTags.length) return;
    const label = document.createElement('span');
    label.className = 'explorer__chips-label';
    label.textContent = 'Tags:';
    chips.append(label);
    for (const tag of allTags) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'deck-tag deck-tag--chip';
      chip.textContent = tag;
      chip.classList.toggle('is-active', state.tags.has(tag));
      chip.addEventListener('click', () => {
        if (state.tags.has(tag)) state.tags.delete(tag); else state.tags.add(tag);
        renderChips();
        applyFilters();
      });
      chips.append(chip);
    }
  }

  /* ------------------------------------------------------------ filtering */
  function matchesQuery(entry, q) {
    const hay = [entry.title, entry.md, entry.html, entry.auteur, ...(entry.tags || [])]
      .filter(Boolean).join(' ').toLowerCase();
    return hay.includes(q);
  }

  function applyFilters() {
    const q = state.query.trim().toLowerCase();
    let entries;
    if (q) entries = all.filter((e) => matchesQuery(e, q));
    else if (state.scope) entries = state.scope;
    else entries = all;
    if (state.tags.size) entries = entries.filter((e) => (e.tags || []).some((t) => state.tags.has(t)));
    renderCards(entries);
  }

  input.addEventListener('input', () => {
    state.query = input.value;
    if (state.query.trim()) { state.scope = null; state.scopeKey = null; renderTree(); }
    applyFilters();
  });

  renderTree();
  renderChips();
  applyFilters();
  setTimeout(() => input.focus(), 30);
  return modal;
}
