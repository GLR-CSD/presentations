/**
 * LivePreviewController — het ene, grote 16:9 slide-canvas van de Studio.
 *
 * Dit is GEEN iframe: één reveal.js-instantie in de pagina waarvan de
 * `<section>`-DOM in-memory wordt bijgewerkt. Daardoor:
 *   - zie je elke wijziging direct (geen refresh, geen sprong naar slide 1);
 *   - kun je op élk onderdeel klikken (elk element heeft `data-bi` = blokindex
 *     en `data-bp` = pad binnen het HTML-blok, zie markdown/render.js);
 *   - krijgt het geselecteerde onderdeel een groene selectie-rand + een
 *     zwevende Quick-Action balk, en kun je kop/tekst direct op het canvas typen.
 *
 * De preview laadt de gedeelde `glr-theme.css`, de deck-specifieke `<style>` en
 * `glr-plugins.js`, zodat timers/kleurenwielen exact zo werken als in de les.
 */
import { renderSlideBody, slideAttrsToHtml, resolveAssets } from '../markdown/render.js';
import { QuickBar } from '../ui/quick-actions.js';

const REVEAL_SCRIPTS = [
  'vendor/reveal/reveal.js',
  'vendor/reveal/plugin/markdown/markdown.js',
  'vendor/reveal/plugin/highlight/highlight.js',
  'vendor/reveal/plugin/notes/notes.js',
  'vendor/reveal/plugin/search/search.js',
  'vendor/reveal/plugin/zoom/zoom.js',
  'vendor/reveal/plugin/math/math.js',
];

const EDIT_CONFIG = { keyboard: false, controls: false, progress: false, touch: false, overview: false };
const PRESENT_CONFIG = { keyboard: true, controls: true, progress: true, touch: true, overview: true, controlsLayout: 'bottom-right' };

/** Laadt een klassiek <script> (reveal.js is geen ESM-bundel) en resolvet. */
function loadScript(src) {
  return new Promise((resolve) => {
    if ([...document.scripts].some((s) => s.src.endsWith(src))) return resolve();
    const el = document.createElement('script');
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => resolve(); // best-effort: preview degradeert netjes
    document.head.appendChild(el);
  });
}

const parseBp = (el) => {
  const raw = el.getAttribute('data-bp');
  if (raw == null) return null;
  return raw === '' ? [] : raw.split('.').map(Number);
};

export class LivePreviewController {
  /**
   * @param {HTMLElement} host       element waarin de preview komt (`.preview-frame`)
   * @param {string}      sharedBase pad naar `shared/` (bijv. '../shared/')
   */
  constructor(host, sharedBase = '../shared/') {
    this.host = host;
    this.sharedBase = sharedBase;
    this.revealEl = null;
    this.ready = false;
    this.deck = null;
    this.baseUrl = '';
    this.currentIndex = 0;
    this.selection = null;
    this.presenting = false;
    this.editingEl = null;
    this.hoverEl = null;
    this.selEl = null;
    this.handlers = {};
  }

  /** Callbacks: onPick, onResolve, onAction, getBarState, canEditText, onTextEdit, onTextEditEnd. */
  setHandlers(handlers) { this.handlers = { ...this.handlers, ...handlers }; }

  async init() {
    this.host.innerHTML = `
      <div class="preview-stage">
        <div class="reveal studio-preview-reveal">
          <div class="slides"><section></section></div>
        </div>
      </div>`;
    this.stage = this.host.querySelector('.preview-stage');
    this.bar = new QuickBar(this.host, (action) => this.handlers.onAction && this.handlers.onAction(action));

    const styleReady = [];
    for (const href of [
      'vendor/reveal/reveal.css',
      'vendor/reveal/plugin/highlight/monokai.css',
      'css/glr-theme.css',
      'vendor/chalkboard/style.css',
      'vendor/customcontrols/style.css',
    ]) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = this.sharedBase + href;
      document.head.appendChild(link);
      styleReady.push(new Promise((resolve) => {
        link.addEventListener('load', resolve, { once: true });
        link.addEventListener('error', resolve, { once: true });
      }));
    }
    for (const src of REVEAL_SCRIPTS) await loadScript(this.sharedBase + src);
    await loadScript(this.sharedBase + 'js/glr-plugins.js');
    // Wacht tot de stylesheets toegepast zijn: Reveal meet de container bij
    // initialisatie en faalt op een ongestylede (0-hoogte) `.reveal`.
    await Promise.all(styleReady);

    this.revealEl = this.host.querySelector('.reveal');
    if (typeof window.Reveal === 'undefined') return;

    const plugins = [
      window.RevealMarkdown, window.RevealHighlight, window.RevealNotes,
      window.RevealSearch, window.RevealZoom,
      window.RevealMath && window.RevealMath.KaTeX,
    ].filter(Boolean);

    try {
      await window.Reveal.initialize({
        width: 1280, height: 720, margin: 0, display: 'flex', center: false,
        minScale: 0.05, maxScale: 3, hash: false,
        // Schoon 16:9 slide-canvas: geen Reveal-navigatie in de editor.
        slideNumber: false, ...EDIT_CONFIG,
        transition: 'slide', backgroundTransition: 'fade',
        embedded: true, respondToHashChanges: false,
        katex: { local: this.sharedBase + 'vendor/katex' },
        plugins,
        markdown: { smartypants: true },
      });
    } catch (err) {
      // Best-effort: een hapering in Reveal mag de Studio nooit blokkeren.
      console.warn('Reveal-preview kon niet volledig initialiseren:', err);
    }
    this.ready = true;
    this._wireEvents();
  }

  /** Basis-URL (t.o.v. de admin-pagina) waartegen relatieve `assets/…`-paden worden opgelost. */
  setBaseUrl(url) { this.baseUrl = url || ''; }

  /** Laadt een deck in de preview en toont slide 0. */
  loadDeck(deck, extraCss = '') {
    this.deck = deck;
    this.extraCss = extraCss;
    this.currentIndex = 0;
    if (!this.ready) return;
    const slidesEl = this.revealEl.querySelector('.slides');
    slidesEl.innerHTML = this._buildSections(deck);
    this._applyExtraCss(extraCss);
    window.Reveal.sync();
    window.Reveal.slide(0, 0);
    this._postRender();
  }

  /** Werkt één slide in-place bij — zonder reload en zonder positieverlies. */
  updateSlide(index, slide) {
    if (!this.ready || !this.deck) return;
    const section = this._flatSections()[index];
    if (!section) return;
    const state = window.Reveal.getIndices();
    section.innerHTML = this._renderBody(slide);
    this._syncAttrs(section, slide);
    window.Reveal.sync();
    window.Reveal.layout();
    if (state) window.Reveal.slide(state.h, state.v, state.f);
    this._postRender(section);
  }

  /** Volledige herbouw (na toevoegen/verwijderen/herordenen van slides). */
  rebuild() {
    if (!this.ready || !this.deck) return;
    const state = window.Reveal.getIndices();
    const slidesEl = this.revealEl.querySelector('.slides');
    slidesEl.innerHTML = this._buildSections(this.deck);
    window.Reveal.sync();
    if (state) window.Reveal.slide(state.h, state.v);
    else window.Reveal.slide(0, 0);
    this._postRender();
  }

  /** Toon een specifieke slide (bijv. na klik in de sorter). */
  gotoSlide(index, fragment) {
    this.currentIndex = index;
    if (!this.ready || !this.deck) return;
    const indices = this._indicesFor(index);
    if (indices) window.Reveal.slide(indices.h, indices.v, fragment);
    this._applySelection();
  }

  /** Flat slide-index van de slide die nu getoond wordt (ook na navigatie in presentatiemodus). */
  currentFlatIndex() {
    if (!this.ready) return this.currentIndex;
    const cur = window.Reveal.getCurrentSlide();
    const i = this._flatSections().indexOf(cur);
    return i >= 0 ? i : this.currentIndex;
  }

  /* ------------------------------------------------------------- selectie --- */

  /** @param {{blockIndex:number, highlight:number[]}|null} sel */
  setSelection(sel) {
    this.selection = sel;
    this._applySelection();
  }

  refreshSelection() { this._applySelection(); }

  _currentSection() { return this._flatSections()[this.currentIndex] || null; }

  _findEl(bi, highlight) {
    const section = this._currentSection();
    if (!section) return null;
    const q = highlight && highlight.length
      ? `[data-bi="${bi}"][data-bp="${highlight.join('.')}"]`
      : `[data-bi="${bi}"]:not([data-bp])`;
    return section.querySelector(q);
  }

  _applySelection() {
    if (this.selEl) this.selEl.classList.remove('glr-sel');
    this.selEl = null;
    if (this.presenting || !this.ready) { this.bar && this.bar.hide(); return; }
    if (this.selection) {
      this.selEl = this._findEl(this.selection.blockIndex, this.selection.highlight);
      if (this.selEl) this.selEl.classList.add('glr-sel');
    }
    this.positionBar();
  }

  positionBar() {
    if (!this.bar) return;
    if (!this.selEl || this.presenting || this.editingEl) { this.bar.hide(); return; }
    this.bar.show(this.selEl.getBoundingClientRect(), this.handlers.getBarState ? this.handlers.getBarState() : {});
  }

  /* ----------------------------------------------------------- presenteren --- */

  setPresenting(on) {
    this.presenting = !!on;
    this.host.classList.toggle('is-presenting', this.presenting);
    if (this.hoverEl) { this.hoverEl.classList.remove('glr-hover'); this.hoverEl = null; }
    if (this.ready) {
      window.Reveal.configure(this.presenting ? PRESENT_CONFIG : EDIT_CONFIG);
      window.Reveal.sync();
    }
    this._applySelection();
    if (this.ready) requestAnimationFrame(() => window.Reveal.layout());
  }

  startAt(index) {
    this.currentIndex = index;
    const indices = this._indicesFor(index);
    if (indices && this.ready) window.Reveal.slide(indices.h, indices.v, -1);
    if (this.ready) window.Reveal.layout();
  }

  /* --------------------------------------------------------------- intern --- */

  _renderBody(slide) {
    return resolveAssets(renderSlideBody(slide.body, { annotate: true }), this.baseUrl);
  }

  _buildSections(deck) {
    let flatIndex = 0;
    const groups = [];
    for (const slide of deck.slides) {
      if (slide.kind === 'vertical' && groups.length) groups[groups.length - 1].push(slide);
      else groups.push([slide]);
    }
    return groups
      .map((group) => {
        if (group.length === 1) {
          const s = group[0];
          return `<section ${slideAttrsToHtml(s)} data-block-index="${flatIndex++}">${this._renderBody(s)}</section>`;
        }
        const inner = group
          .map((s) => `<section ${slideAttrsToHtml(s)} data-block-index="${flatIndex++}">${this._renderBody(s)}</section>`)
          .join('\n');
        return `<section>\n${inner}\n</section>`;
      })
      .join('\n');
  }

  _flatSections() {
    return [...this.revealEl.querySelectorAll('.slides section')].filter(
      (s) => s.getAttribute('data-block-index') !== null,
    );
  }

  _topSections() {
    return [...this.revealEl.querySelectorAll('.slides>section')];
  }

  _indicesFor(flatIndex) {
    const section = this._flatSections()[flatIndex];
    if (!section) return null;
    const parent = section.parentElement;
    const isStack = parent.classList.contains('stack');
    const top = isStack ? parent : section;
    const h = this._topSections().indexOf(top);
    const v = isStack ? [...parent.children].indexOf(section) : 0;
    return { h, v };
  }

  _syncAttrs(section, slide) {
    for (const attr of ['class', 'data-background-color', 'data-state', 'data-visibility']) {
      section.removeAttribute(attr);
    }
    for (const [k, v] of Object.entries(slide.attrsData || {})) section.setAttribute(k, v);
  }

  _applyExtraCss(css) {
    let style = document.getElementById('studio-deck-css');
    if (!style) {
      style = document.createElement('style');
      style.id = 'studio-deck-css';
      document.head.appendChild(style);
    }
    style.textContent = css || '';
  }

  _postRender(section) {
    // GLR-componenten (timers/kleurenwielen), highlight en KaTeX opnieuw.
    try { if (window.GLRPlugins) window.GLRPlugins.initAll(section || document); } catch { /* noop */ }
    // Het highlight-plugin highlight alleen bij init; hier dus elk (nieuw) codeblok zelf (incl. regel-highlights).
    try {
      const hl = window.Reveal.getPlugin('highlight');
      const scope = section || this.revealEl;
      if (hl && hl.hljs && hl.hljs.configure) hl.hljs.configure({ ignoreUnescapedHTML: true });
      if (hl && hl.highlightBlock) scope.querySelectorAll('pre code:not(.hljs)').forEach((b) => hl.highlightBlock(b));
    } catch { /* noop */ }
    this._setBackAt(section || this._currentSection());
    this.selEl = null;
    this.hoverEl = null;
    this._applySelection();
  }

  /**
   * Pauzeslide: "Terug om" = nu + `data-back-at` minuten (zoals de index.html van de
   * Mega Villains-decks dat doet). Zonder dit zou de preview de placeholder tonen.
   */
  _setBackAt(root) {
    if (!root) return;
    for (const el of root.querySelectorAll('[data-back-at]')) {
      const t = new Date(Date.now() + parseInt(el.getAttribute('data-back-at'), 10) * 60000);
      el.textContent = `${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`;
    }
  }

  /* ------------------------------------------------------------- events --- */

  _wireEvents() {
    const root = this.revealEl;
    root.addEventListener('click', (e) => this._onClick(e));
    root.addEventListener('dblclick', (e) => this._onDblClick(e));
    root.addEventListener('mouseover', (e) => this._onHover(e));
    root.addEventListener('mouseleave', () => this._clearHover());

    const relayout = () => requestAnimationFrame(() => {
      try { window.Reveal.layout(); } catch { /* noop */ }
      this.positionBar();
    });
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(relayout).observe(this.host);
    window.Reveal.on('resize', () => this.positionBar());
    window.Reveal.on('slidechanged', (e) => { this._setBackAt(e.currentSlide); this._applySelection(); });
  }

  _targetOf(e) {
    const section = this._currentSection();
    const t = e.target.closest ? e.target.closest('[data-bi]') : null;
    if (!t || !section || !section.contains(t)) return null;
    return t;
  }

  _onClick(e) {
    if (this.presenting) return;
    if (e.target.closest('.quickbar')) return;
    if (this.editingEl && this.editingEl.contains(e.target)) return;
    const t = this._targetOf(e);
    if (!t) { if (this.handlers.onPick) this.handlers.onPick(null); return; }
    if (this.handlers.onPick) this.handlers.onPick({ blockIndex: Number(t.getAttribute('data-bi')), bp: parseBp(t), target: t });
  }

  _onHover(e) {
    if (this.presenting || this.editingEl) return;
    const t = this._targetOf(e);
    if (!t || !this.handlers.onResolve) { this._clearHover(); return; }
    const hl = this.handlers.onResolve(Number(t.getAttribute('data-bi')), parseBp(t));
    const el = hl ? this._findEl(Number(t.getAttribute('data-bi')), hl) : t;
    if (el === this.hoverEl) return;
    this._clearHover();
    if (el && el !== this.selEl) { el.classList.add('glr-hover'); this.hoverEl = el; }
  }

  _clearHover() {
    if (this.hoverEl) this.hoverEl.classList.remove('glr-hover');
    this.hoverEl = null;
  }

  _onDblClick(e) {
    if (this.presenting || this.editingEl) return;
    const t = this._targetOf(e);
    if (!t || t.children.length > 0) return;
    const bi = Number(t.getAttribute('data-bi'));
    const bp = parseBp(t);
    if (this.handlers.canEditText && !this.handlers.canEditText(bi, bp, t)) return;
    this._startEdit(t, bi, bp);
  }

  _startEdit(el, bi, bp) {
    this.editingEl = el;
    this._clearHover();
    el.contentEditable = 'true';
    el.spellcheck = true;
    el.classList.add('glr-editing');
    this.bar.hide();
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const onInput = () => { if (this.handlers.onTextEdit) this.handlers.onTextEdit({ blockIndex: bi, bp, text: el.textContent }); };
    const onKey = (ev) => {
      ev.stopPropagation();
      if (ev.key === 'Enter' || ev.key === 'Escape') { ev.preventDefault(); el.blur(); }
    };
    const onPaste = (ev) => {
      ev.preventDefault();
      const text = (ev.clipboardData || window.clipboardData).getData('text/plain').replace(/\s*\n\s*/g, ' ');
      document.execCommand('insertText', false, text);
    };
    const onBlur = () => {
      el.removeEventListener('input', onInput);
      el.removeEventListener('keydown', onKey);
      el.removeEventListener('paste', onPaste);
      el.removeEventListener('blur', onBlur);
      el.contentEditable = 'false';
      el.classList.remove('glr-editing');
      this.editingEl = null;
      if (this.handlers.onTextEditEnd) this.handlers.onTextEditEnd();
    };
    el.addEventListener('input', onInput);
    el.addEventListener('keydown', onKey);
    el.addEventListener('paste', onPaste);
    el.addEventListener('blur', onBlur);
  }
}
