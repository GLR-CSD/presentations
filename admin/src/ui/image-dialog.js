/**
 * Media-kiezer van de GLR Slide Studio: één modal met 3 tabbladen.
 *
 *  1. GLR Bibliotheek   — alle afbeeldingen uit de repo (media-manifest.json)
 *  2. Tech-logo's       — ingebakken, offline vector-iconen (tech-icons.js)
 *  3. Uploaden / pad    — upload naar shared/img/uploads/, of eigen pad/URL + bijschrift
 *
 * `mode: 'insert'` plaatst een nieuwe <figure>; `mode: 'replace'` vervangt de
 * `src` van de geselecteerde afbeelding (Properties Panel).
 */
import { openModal } from './modal.js';
import { icon } from './icons.js';
import { escapeHtml, relativeAssetPath } from './util.js';
import { ICON_VARIANTS, TECH_CATEGORIES, searchTechIcons, techIconDataUri } from './tech-icons.js';

const LIB_CATEGORIES = ['Gedeeld', 'Design', 'Interface', 'Beroeps', 'MVI', 'WebXR', 'Uploads', 'Overig'];

/** "kleuren-palet.jpg" → "Kleuren palet" (voor alt-tekst). */
function prettyName(file) {
  const base = String(file).replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : '';
}

/**
 * @param {{
 *   mode?: 'insert'|'replace', current?: string, deckPath?: string,
 *   loadMedia?: () => Promise<object[]>, upload?: (file: File) => Promise<string>,
 *   onPick: (data: { src: string, alt?: string, caption?: string }) => void,
 *   onCancel?: () => void,
 * }} ctx
 */
export function openImageDialog({ mode = 'insert', current = '', deckPath = '', loadMedia, upload, onPick, onCancel }) {
  let picked = false;
  const modal = openModal({
    title: mode === 'replace' ? 'Afbeelding wijzigen' : 'Afbeelding toevoegen',
    subtitle: 'Kies uit de GLR-bibliotheek, de tech-logo\'s of upload zelf een bestand.',
    size: 'xl',
    onClose: () => { if (!picked && onCancel) onCancel(); },
  });
  const done = (data) => { picked = true; modal.close(); onPick(data); };

  const state = { tab: 'library', query: '', libCat: '', techCat: '', variant: 'brand', media: null };

  /* ---- zoekbalk + tabs ---- */
  const bar = document.createElement('div');
  bar.className = 'media-bar';
  const tabs = document.createElement('div');
  tabs.className = 'media-tabs';
  tabs.setAttribute('role', 'tablist');
  const TABS = [
    ['library', 'GLR Bibliotheek', 'image'],
    ['tech', 'Tech-logo\'s & Iconen', 'code'],
    ['upload', 'Uploaden / Eigen pad', 'upload'],
  ];
  const tabBtns = {};
  for (const [id, label, ic] of TABS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'media-tab';
    b.setAttribute('role', 'tab');
    b.innerHTML = `${icon(ic, 15)}<span>${label}</span>`;
    b.addEventListener('click', () => { state.tab = id; render(); });
    tabs.appendChild(b);
    tabBtns[id] = b;
  }
  const search = document.createElement('label');
  search.className = 'media-search';
  search.innerHTML = icon('search', 15);
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.setAttribute('aria-label', 'Zoeken');
  searchInput.addEventListener('input', () => { state.query = searchInput.value; renderPanel(); });
  search.appendChild(searchInput);
  bar.append(tabs, search);

  const panel = document.createElement('div');
  panel.className = 'media-panel';
  modal.body.append(bar, panel);

  /* ---- hulpjes ---- */
  const chip = (label, active, onClick, disabled = false, count) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `media-chip${active ? ' is-active' : ''}`;
    b.disabled = disabled;
    b.textContent = count == null ? label : `${label} · ${count}`;
    b.addEventListener('click', onClick);
    return b;
  };
  const chipRow = () => { const r = document.createElement('div'); r.className = 'media-chips'; return r; };
  const empty = (msg) => { const p = document.createElement('p'); p.className = 'media-empty'; p.textContent = msg; return p; };

  /* ---- tab 1: bibliotheek ---- */
  function renderLibrary() {
    panel.innerHTML = '';
    if (state.media == null) {
      panel.appendChild(empty('Bibliotheek laden…'));
      Promise.resolve(loadMedia ? loadMedia() : []).then((m) => { state.media = Array.isArray(m) ? m : []; if (state.tab === 'library') renderLibrary(); })
        .catch(() => { state.media = []; if (state.tab === 'library') renderLibrary(); });
      return;
    }
    const counts = {};
    for (const m of state.media) counts[m.category] = (counts[m.category] || 0) + 1;
    const chips = chipRow();
    chips.appendChild(chip('Alles', !state.libCat, () => { state.libCat = ''; renderLibrary(); }, false, state.media.length));
    for (const c of LIB_CATEGORIES) {
      if (c === 'Overig' && !counts.Overig) continue;
      chips.appendChild(chip(c, state.libCat === c, () => { state.libCat = c; renderLibrary(); }, !counts[c], counts[c] || 0));
    }
    panel.appendChild(chips);

    const q = state.query.trim().toLowerCase();
    const items = state.media.filter((m) => (!state.libCat || m.category === state.libCat)
      && (!q || `${m.name} ${m.folder} ${m.deck || ''}`.toLowerCase().includes(q)));
    if (!items.length) {
      panel.appendChild(empty(state.media.length ? 'Geen afbeeldingen gevonden.' : 'Geen media-bibliotheek beschikbaar. Draai `npm run build` of open de Studio via de gepubliceerde site.'));
      return;
    }
    const grid = document.createElement('div');
    grid.className = 'media-grid';
    for (const m of items) {
      const tileEl = document.createElement('button');
      tileEl.type = 'button';
      tileEl.className = 'media-tile';
      tileEl.title = m.path;
      const thumb = document.createElement('span');
      thumb.className = 'media-tile__thumb';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = '';
      img.src = `../${m.path}`;
      thumb.appendChild(img);
      const name = document.createElement('span');
      name.className = 'media-tile__name';
      name.textContent = m.name;
      const sub = document.createElement('span');
      sub.className = 'media-tile__sub';
      sub.textContent = m.category;
      tileEl.append(thumb, name, sub);
      tileEl.addEventListener('click', () => done({ src: relativeAssetPath(deckPath, m.path), alt: prettyName(m.name) }));
      grid.appendChild(tileEl);
    }
    panel.appendChild(grid);
  }

  /* ---- tab 2: tech-logo's ---- */
  function renderTech() {
    panel.innerHTML = '';
    const top = document.createElement('div');
    top.className = 'media-techbar';
    const chips = chipRow();
    chips.appendChild(chip('Alles', !state.techCat, () => { state.techCat = ''; renderTech(); }));
    for (const c of TECH_CATEGORIES) chips.appendChild(chip(c, state.techCat === c, () => { state.techCat = c; renderTech(); }));
    const seg = document.createElement('div');
    seg.className = 'pp-seg media-variants';
    seg.setAttribute('aria-label', 'Kleur');
    for (const v of ICON_VARIANTS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `pp-seg__btn${state.variant === v.id ? ' is-active' : ''}`;
      b.textContent = v.label;
      b.addEventListener('click', () => { state.variant = v.id; renderTech(); });
      seg.appendChild(b);
    }
    top.append(chips, seg);
    panel.appendChild(top);

    const list = searchTechIcons(state.query, state.techCat);
    if (!list.length) { panel.appendChild(empty('Geen logo\'s gevonden.')); return; }
    const grid = document.createElement('div');
    grid.className = 'media-grid media-grid--icons';
    // Wit en lime zijn onzichtbaar op licht: toon die varianten op een donkere tegel.
    const darkBg = state.variant === 'white' || state.variant === 'lime';
    for (const it of list) {
      const uri = techIconDataUri(it.id, state.variant);
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'media-tile';
      t.title = `${it.label} (${it.category})`;
      t.innerHTML = `<span class="media-tile__thumb media-tile__thumb--icon${darkBg ? ' is-dark' : ''}"><img alt="" src="${escapeHtml(uri)}"></span>`
        + `<span class="media-tile__name">${escapeHtml(it.label)}</span>`
        + `<span class="media-tile__sub">${escapeHtml(it.category)}</span>`;
      t.addEventListener('click', () => done({ src: uri, alt: `${it.label} logo` }));
      grid.appendChild(t);
    }
    panel.appendChild(grid);
  }

  /* ---- tab 3: upload / eigen pad ---- */
  function renderUpload() {
    panel.innerHTML = '';
    const form = document.createElement('form');
    form.className = 'deck-form media-upload';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.hidden = true;
    const pickBtn = document.createElement('button');
    pickBtn.type = 'button';
    pickBtn.className = 'studio-btn';
    pickBtn.innerHTML = `${icon('upload', 15)}<span>Afbeelding kiezen vanaf computer</span>`;
    const fileLabel = document.createElement('span');
    fileLabel.className = 'image-dialog__file';
    fileLabel.textContent = 'Geen bestand gekozen';

    const urlEl = document.createElement('input');
    urlEl.type = 'text';
    urlEl.placeholder = '/presentations/shared/img/uploads/… of https://…';
    urlEl.classList.add('is-mono');
    urlEl.value = current && !current.startsWith('data:') ? current : '';
    const captionEl = document.createElement('input');
    captionEl.type = 'text';
    captionEl.placeholder = mode === 'replace' ? 'Alt-tekst (optioneel)' : 'Bijschrift (optioneel)';

    const row = (label, ...nodes) => {
      const wrap = document.createElement('div');
      wrap.className = 'form-row';
      const lab = document.createElement('span');
      lab.className = 'form-row__label';
      lab.textContent = label;
      wrap.append(lab, ...nodes);
      return wrap;
    };
    const status = document.createElement('p');
    status.className = 'deck-form__status';
    const updateStatus = () => {
      const file = fileInput.files && fileInput.files[0];
      if (file && typeof upload !== 'function') status.innerHTML = `<span class="deck-form__warn">${icon('alert', 14)} Log in met GitHub of koppel een map om te kunnen uploaden.</span>`;
      else if (file) status.innerHTML = `<span class="deck-form__ok">${icon('circle-check', 14)} Wordt geüpload naar shared/img/uploads/.</span>`;
      else if (urlEl.value.trim()) status.innerHTML = `<span class="deck-form__ok">${icon('circle-check', 14)} Gebruikt het opgegeven pad.</span>`;
      else status.textContent = '';
    };
    pickBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      fileLabel.textContent = file ? file.name : 'Geen bestand gekozen';
      updateStatus();
    });
    urlEl.addEventListener('input', updateStatus);

    const actions = document.createElement('div');
    actions.className = 'deck-form__actions';
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'studio-btn';
    cancel.textContent = 'Annuleren';
    cancel.addEventListener('click', () => modal.close());
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'studio-btn studio-btn--primary';
    submit.innerHTML = `${icon('image', 15)}<span>${mode === 'replace' ? 'Gebruiken' : 'Invoegen'}</span>`;
    actions.append(cancel, submit);

    form.append(row('Bestand', pickBtn, fileInput), row('', fileLabel), row('URL / pad', urlEl), row(mode === 'replace' ? 'Alt-tekst' : 'Bijschrift', captionEl), status, actions);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const file = fileInput.files && fileInput.files[0];
      const text = captionEl.value.trim();
      submit.disabled = true;
      try {
        let src = urlEl.value.trim();
        if (file) {
          if (typeof upload !== 'function') throw new Error('Uploaden niet beschikbaar in deze modus.');
          src = await upload(file);
        }
        if (!src) throw new Error('Kies een bestand of vul een URL/pad in.');
        done(mode === 'replace' ? { src, alt: text || undefined } : { src, caption: text, alt: text });
      } catch (err) {
        submit.disabled = false;
        status.innerHTML = `<span class="deck-form__warn">${icon('alert', 14)} ${escapeHtml(err.message)}</span>`;
      }
    });
    panel.appendChild(form);
  }

  function renderPanel() {
    if (state.tab === 'library') renderLibrary();
    else if (state.tab === 'tech') renderTech();
    else renderUpload();
  }

  function render() {
    for (const [id] of TABS) {
      tabBtns[id].classList.toggle('is-active', state.tab === id);
      tabBtns[id].setAttribute('aria-selected', state.tab === id ? 'true' : 'false');
    }
    search.hidden = state.tab === 'upload';
    searchInput.placeholder = state.tab === 'tech' ? 'Zoek een logo (bijv. react, git, database)…' : 'Zoek op bestandsnaam of map…';
    renderPanel();
    if (state.tab !== 'upload') searchInput.focus();
  }

  render();
  return modal;
}
