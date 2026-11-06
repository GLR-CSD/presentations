/**
 * Properties Panel (rechterkolom) — contextgevoelig, Figma/Unity-stijl.
 *
 *  - Geen selectie  → Slide- & presentatie-eigenschappen
 *  - Wel selectie   → "Blok Eigenschappen" voor dat exacte onderdeel
 *
 * Elke wijziging werkt LIVE: formulier → bron-behoudende HTML-boom → body →
 * canvas. Er zijn geen Opslaan/OK-knoppen in het paneel.
 */
import * as T from '../blocks/html-tree.js';
import * as B from '../blocks/block-ops.js';
import { describe, crumbLabel } from '../blocks/parsers.js';
import { markdownForm } from '../blocks/md-forms.js';
import { blockToMarkdown, bodyToDoc } from '../markdown/bridge.js';
import { renderFields, segmented, simpleField, h } from './form-kit.js';
import { icon } from './icons.js';
import { escapeHtml } from './util.js';
import { renderCoach } from '../pedagogy/coach-panel.js';
import { titleTip } from '../pedagogy/coach.js';
import { NOTE_PROMPTS, appendNotePrompt } from '../pedagogy/note-prompts.js';

const shiftLast = (p, d) => (p.length ? [...p.slice(0, -1), p[p.length - 1] + d] : p);

export class PropertiesPanel {
  /**
   * @param {HTMLElement} host
   * @param {object} api  zie Studio.panelApi()
   */
  constructor(host, api) {
    this.host = host;
    this.api = api;
  }

  get state() { return this.api.state; }

  render() {
    const scroll = this.host.scrollTop;
    this.host.innerHTML = '';
    this.host.classList.add('pp');
    if (!this.state.deck) {
      this.host.appendChild(h('p', 'insp-help', 'Open een presentatie om te beginnen.'));
      return;
    }
    const sel = this.state.selection;
    if (!sel) this.renderSlide();
    else if (!this.renderBlock(sel)) { this.state.selection = null; this.renderSlide(); }
    renderCoach(this.host, this.coachApi());
    this.host.scrollTop = scroll;
    this.applyPendingFocus();
  }

  /** Vraag om na de volgende render een veld te focussen (bijv. door de Didactische Coach). */
  focusFieldAfterRender(labelPrefix) {
    this.pendingFocus = labelPrefix;
  }

  applyPendingFocus() {
    const want = this.pendingFocus;
    if (!want) return;
    this.pendingFocus = null;
    const wrap = [...this.host.querySelectorAll('[data-field-label]')].find((w) => w.dataset.fieldLabel.startsWith(want));
    const input = wrap && wrap.querySelector('input, textarea');
    if (!input) return;
    wrap.scrollIntoView({ block: 'center' });
    input.focus();
    if (typeof input.select === 'function') input.select();
  }

  coachApi() {
    return {
      state: this.state,
      applyCoach: (r) => this.api.applyCoach(r),
      restoreCoach: (snap) => this.api.restoreCoach(snap),
      rerender: () => this.render(),
    };
  }

  /* ------------------------------------------------------ Blok Eigenschappen --- */

  renderBlock(sel) {
    const body = this.api.getBody();
    const blocks = B.blocksOf(body);
    const block = blocks[sel.blockIndex];
    if (!block) return false;

    const isHtml = block.type === 'htmlBlock';
    let info;
    let ctx;
    let crumbs = [];
    if (isHtml) {
      const src = block.attrs.html;
      const root = T.parse(src);
      const node = T.nodeAt(root, sel.path);
      if (!node) return false;
      const d = describe(src, node);
      info = { label: d.label, icon: d.icon, badge: node.tag, fields: d.fields };
      for (let n = node.parent; n && n.type === 'el'; n = n.parent) crumbs.unshift({ label: crumbLabel(src, n), path: T.pathOf(n) });
      ctx = this.htmlCtx({ blockIndex: sel.blockIndex, path: sel.path }, sel);
    } else {
      const form = markdownForm(block);
      if (!form) return false;
      info = { label: form.label, icon: form.icon, badge: block.type, fields: form.fields };
      ctx = this.mdCtx(sel.blockIndex);
    }

    // header
    const head = h('div', 'pp-head');
    const back = h('button', 'pp-back', `${icon('arrow-left', 14)}<span>← Terug naar Slide-eigenschappen</span>`);
    back.type = 'button';
    back.addEventListener('click', () => this.api.setSelection(null));
    head.appendChild(back);
    const title = h('div', 'pp-title');
    title.appendChild(h('span', 'pp-title__ic', icon(info.icon || 'braces', 18)));
    title.appendChild(h('h2', 'pp-title__name', escapeHtml(info.label)));
    title.appendChild(h('span', 'pp-badge', escapeHtml(info.badge)));
    head.appendChild(title);
    if (crumbs.length) {
      const c = h('div', 'pp-crumbs');
      c.appendChild(h('span', 'pp-crumbs__lead', 'in:'));
      crumbs.forEach((cr, i) => {
        const b = h('button', 'pp-crumb', escapeHtml(cr.label));
        b.type = 'button';
        b.addEventListener('click', () => this.api.selectExact(sel.blockIndex, cr.path));
        c.appendChild(b);
        if (i < crumbs.length - 1) c.appendChild(h('span', 'pp-crumbs__sep', '›'));
      });
      head.appendChild(c);
    }
    this.host.appendChild(head);

    // universele animatiestap-schakelaar
    if (B.canFragment(body, sel)) {
      const f = { kind: 'toggle', label: 'Toon pas na klik tijdens presentatie (Animatiestap / Fragment)', badge: '.fragment', value: B.isFragment(body, sel) };
      const box = h('div', 'pp-fragment');
      renderFields(box, [f], { apply: () => this.api.toggleFragment(), select() {}, repeater() {}, openItem: -1 });
      this.host.appendChild(box);
    }

    const form = h('div', 'pp-form');
    renderFields(form, info.fields, ctx);
    if (!info.fields.length) form.appendChild(h('p', 'insp-help', 'Dit onderdeel heeft geen instellingen.'));
    this.host.appendChild(form);

    // Assertion-Evidence: subtiele tip direct onder het titelveld (alleen een suggestie).
    const tt = titleTip(this.state.currentSlide);
    if (tt && tt.title.blockIndex === sel.blockIndex && (tt.title.path === null || tt.title.path.join('.') === (sel.path || []).join('.'))) {
      this.host.appendChild(h('p', 'pp-ae-tip', `💡 ${escapeHtml(tt.text)}`));
    }

    this.host.appendChild(isHtml ? this.rawHtmlDetails(sel) : this.rawMdDetails(sel.blockIndex, block));
    return true;
  }

  rawHtmlDetails(sel) {
    const body = this.api.getBody();
    const html = B.htmlAt(body, sel.blockIndex);
    const node = T.nodeAt(T.parse(html), sel.path);
    const d = h('details', 'pp-adv');
    d.appendChild(h('summary', '', 'Geavanceerd: Ruwe HTML (alleen voor developers)'));
    const ta = h('textarea', 'pp-input pp-textarea pp-mono');
    ta.spellcheck = false;
    ta.rows = 10;
    ta.value = html.slice(node.start, node.end);
    let current = html;
    let end = node.end;
    const start = node.start;
    ta.addEventListener('input', () => {
      const next = current.slice(0, start) + ta.value + current.slice(end);
      end = start + ta.value.length;
      current = next;
      this.api.commitBody(B.setHtmlAt(this.api.getBody(), sel.blockIndex, next), { origin: 'panel' });
    });
    d.appendChild(ta);
    d.appendChild(h('p', 'insp-help', 'Let op: dit is de echte HTML van het onderdeel. Wijzig dit alleen als je weet wat je doet.'));
    return d;
  }

  rawMdDetails(index, block) {
    const d = h('details', 'pp-adv');
    d.appendChild(h('summary', '', 'Geavanceerd: Ruwe Markdown (alleen voor developers)'));
    const ta = h('textarea', 'pp-input pp-textarea pp-mono');
    ta.spellcheck = false;
    ta.rows = 6;
    ta.value = blockToMarkdown(block);
    ta.addEventListener('input', () => {
      const nodes = bodyToDoc(ta.value).content;
      this.api.commitBody(B.replaceBlock(this.api.getBody(), index, nodes.length ? nodes : [{ type: 'paragraph' }]), { origin: 'panel' });
    });
    d.appendChild(ta);
    return d;
  }

  /** ctx voor HTML-componenten. `target` = { blockIndex, path } waarop de apply-functies werken. */
  htmlCtx(target, sel) {
    const run = (fn) => {
      const body = this.api.getBody();
      const html = B.htmlAt(body, target.blockIndex);
      if (html == null) return null;
      const node = T.nodeAt(T.parse(html), target.path);
      if (!node) return null;
      return fn(html, node, body);
    };
    const ctx = {
      openItem: sel ? sel.openItem : -1,
      apply: (f, value, { redraw } = {}) => {
        const result = run((html, node, body) => ({ out: f.apply(html, node, value), html, body }));
        if (!result) return;
        const { out, html, body } = result;
        if (typeof out === 'string') {
          if (out !== html) this.api.commitBody(B.setHtmlAt(body, target.blockIndex, out), { origin: 'panel' });
        } else if (out && out.replaceWithCode) {
          const { lang, highlight, text } = out.replaceWithCode;
          const node = { type: 'codeBlock', attrs: { lang, highlight }, content: text ? [{ type: 'text', text }] : [] };
          this.api.commitBody(B.replaceBlock(body, target.blockIndex, node), { origin: 'panel', selection: { blockIndex: target.blockIndex, path: [], highlight: [], openItem: -1 } });
          return;
        }
        if (redraw) this.render();
      },
      repeater: (rep, op, i, dir) => {
        const result = run((html, node, body) => {
          let out = html;
          if (op === 'add') out = rep.add(html, node);
          else if (op === 'remove') out = rep.remove(html, node, i);
          else out = rep.move(html, node, i, dir);
          return { out, body };
        });
        if (!result) return;
        const items = rep.items;
        const cur = this.state.selection || {};
        let highlight = cur.highlight || target.path;
        let openItem = -1;
        if (op === 'move') { highlight = shiftLast(items[i].path, dir); openItem = i + dir; }
        else if (op === 'add') { highlight = items.length ? shiftLast(items[items.length - 1].path, 1) : target.path; openItem = items.length; }
        else highlight = target.path;
        this.api.commitBody(B.setHtmlAt(result.body, target.blockIndex, result.out), {
          origin: 'panel',
          selection: this.state.selection ? { ...this.state.selection, highlight, openItem } : undefined,
        });
        this.render();
      },
      select: (path) => this.api.selectPath(target.blockIndex, path),
      upload: (file) => this.api.upload(file),
    };
    return ctx;
  }

  /** ctx voor Markdown-blokken. */
  mdCtx(index) {
    return {
      openItem: -1,
      apply: (f, value, { redraw } = {}) => {
        const body = this.api.getBody();
        const block = B.blocksOf(body)[index];
        if (!block || !f.applyMd) return;
        const nodes = f.applyMd(block, value);
        this.api.commitBody(B.replaceBlock(body, index, nodes), { origin: 'panel' });
        if (redraw) this.render();
      },
      repeater() {},
      select() {},
      upload: (file) => this.api.upload(file),
    };
  }

  /* ----------------------------------------------- Slide & Presentatie --- */

  renderSlide() {
    const slide = this.state.currentSlide;
    const a = slide.attrsData;
    const root = this.host;

    const head = h('div', 'pp-head');
    head.appendChild(h('h2', 'pp-title__name', `Slide ${this.state.currentIndex + 1} · Eigenschappen`));
    head.appendChild(h('p', 'insp-help', 'Klik op een onderdeel op de slide om dat onderdeel te bewerken.'));
    root.appendChild(head);

    /* thema */
    root.appendChild(h('div', 'pp-section-title pp-section-title--first', 'Slide-thema'));
    const cls = (a.class || '').split(/\s+/).filter(Boolean);
    const theme = a['data-state'] === 'pauze' ? 'pauze' : cls.includes('bleed') ? 'hero' : cls.includes('dark') ? 'donker' : 'licht';
    root.appendChild(segmented([
      ['licht', 'Licht', 'eye'], ['donker', 'Donker', 'palette'], ['hero', 'Hero', 'hero'], ['pauze', 'Pauze', 'timer'],
    ], theme, (t) => { this.setTheme(t); this.render(); }));
    root.appendChild(h('p', 'insp-help', 'Donker = .dark · Hero = .bleed (beeldvullend, donker) · Pauze = pauze-slide.'));

    /* achtergrond */
    root.appendChild(simpleField('color', { label: 'Achtergrondkleur', badge: 'data-background-color', value: a['data-background-color'] || '#ffffff', clearable: true }, (v) => {
      this.api.updateSlideAttrs((obj) => { if (v) obj['data-background-color'] = v; else delete obj['data-background-color']; });
      if (!v) this.render();
    }));

    /* footer */
    root.appendChild(h('div', 'pp-section-title', 'Footer'));
    this.renderFooter(root);

    /* notities */
    root.appendChild(h('div', 'pp-section-title', 'Docentnotities (Note:)'));
    const chips = h('div', 'pp-note-chips');
    for (const p of NOTE_PROMPTS) {
      const b = h('button', 'pp-note-chip', escapeHtml(p.label));
      b.type = 'button';
      b.title = `${p.title}: voegt een regel onderaan je notitie toe`;
      b.addEventListener('click', () => {
        this.api.setNote(appendNotePrompt(this.state.currentSlide.noteText, p.text));
        this.render();
        const ta = this.host.querySelector('.pp-notes textarea');
        if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); ta.scrollTop = ta.scrollHeight; }
      });
      chips.appendChild(b);
    }
    root.appendChild(chips);
    const notes = simpleField('textarea', { label: 'Alleen zichtbaar in de sprekersweergave (toets S)', value: slide.noteText }, (v) => this.api.setNote(v));
    notes.classList.add('pp-notes');
    root.appendChild(notes);

    /* lesgegevens */
    this.renderLesgegevens(root);

    /* geavanceerd */
    const adv = h('details', 'pp-adv');
    adv.appendChild(h('summary', '', 'Geavanceerd: Slide-attributen (alleen voor developers)'));
    const set = (key) => (v) => this.api.updateSlideAttrs((obj) => { if (v === '') delete obj[key]; else obj[key] = v; });
    adv.appendChild(simpleField('text', { label: 'Klassen', badge: 'class', value: a.class || '' }, set('class')));
    adv.appendChild(simpleField('text', { label: 'State', badge: 'data-state', value: a['data-state'] || '' }, set('data-state')));
    adv.appendChild(simpleField('text', { label: 'Zichtbaarheid', badge: 'data-visibility', value: a['data-visibility'] || '' }, set('data-visibility')));
    root.appendChild(adv);
  }

  setTheme(theme) {
    this.api.updateSlideAttrs((obj) => {
      const classes = (obj.class || '').split(/\s+/).filter((c) => c && c !== 'dark' && c !== 'bleed');
      if (obj['data-state'] === 'pauze') delete obj['data-state'];
      if (obj['data-background-color'] === '#111111') delete obj['data-background-color'];
      const add = { donker: ['dark'], hero: ['bleed', 'dark'], licht: [], pauze: [] }[theme];
      const next = [...classes, ...add];
      const rebuilt = {};
      if (next.length) rebuilt.class = next.join(' ');
      for (const [k, v] of Object.entries(obj)) if (k !== 'class') rebuilt[k] = v;
      if (theme === 'donker' || theme === 'hero') rebuilt['data-background-color'] = '#111111';
      if (theme === 'pauze') rebuilt['data-state'] = 'pauze';
      for (const k of Object.keys(obj)) delete obj[k];
      Object.assign(obj, rebuilt);
    });
  }

  renderFooter(root) {
    const body = this.api.getBody();
    const found = B.findFooter(body);
    if (!found) {
      const b = h('button', 'pp-btn pp-btn--add', `${icon('plus', 14)}<span>Footer toevoegen</span>`);
      b.type = 'button';
      b.addEventListener('click', () => { this.api.addFooter(); this.render(); });
      root.appendChild(b);
      return;
    }
    const html = B.htmlAt(body, found.blockIndex);
    const node = T.nodeAt(T.parse(html), found.path);
    const d = describe(html, node);
    const form = h('div', 'pp-form');
    renderFields(form, d.fields, this.htmlCtx({ blockIndex: found.blockIndex, path: found.path }, null));
    root.appendChild(form);
    const sel = h('button', 'pp-link', 'Footer op de slide selecteren');
    sel.type = 'button';
    sel.addEventListener('click', () => this.api.selectExact(found.blockIndex, found.path));
    root.appendChild(sel);
  }

  renderLesgegevens(root) {
    const fm = this.state.deck.frontmatter;
    const d = h('details', 'pp-adv');
    d.appendChild(h('summary', '', 'Lesgegevens (hele presentatie)'));
    if (!fm) {
      d.appendChild(h('p', 'insp-help', 'Dit deck heeft geen frontmatter.'));
      root.appendChild(d);
      return;
    }
    const loc = h('div', 'pp-location');
    const refreshLoc = () => {
      loc.textContent = '';
      const info = this.api.locationInfo && this.api.locationInfo();
      if (!info || !info.target) return;
      loc.appendChild(h('p', 'insp-help', `Deze presentatie staat in ${info.current}, maar hoort bij deze gegevens in ${info.target}.`));
      const btn = h('button', 'studio-btn studio-btn--primary', 'Verplaatsen');
      btn.type = 'button';
      btn.addEventListener('click', () => this.api.moveDeck());
      loc.appendChild(btn);
    };
    const set = (key, numeric = false) => (v) => { this.api.setFrontmatter(key, numeric && /^\d+$/.test(v) ? Number(v) : v); refreshLoc(); };
    refreshLoc();
    d.appendChild(loc);
    d.appendChild(simpleField('text', { label: 'Titel', value: fm.get('title') || '' }, set('title')));
    d.appendChild(simpleField('text', { label: 'Cohort', value: fm.get('cohort') || '' }, set('cohort')));
    d.appendChild(simpleField('text', { label: 'Leerjaar', value: String(fm.get('leerjaar') ?? '') }, set('leerjaar', true)));
    d.appendChild(simpleField('text', { label: 'Periode', value: String(fm.get('periode') ?? '') }, set('periode', true)));
    d.appendChild(simpleField('text', { label: 'Auteur', value: fm.get('auteur') || '' }, set('auteur')));
    const tags = fm.get('tags');
    d.appendChild(simpleField('text', { label: 'Tags (komma)', value: Array.isArray(tags) ? tags.join(', ') : String(tags || '') }, (v) => this.api.setFrontmatter('tags', v.split(',').map((s) => s.trim()).filter(Boolean))));
    root.appendChild(d);
  }
}
