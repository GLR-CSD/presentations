/**
 * LivePreviewController — een échte, altijd zichtbare 1-op-1 reveal.js-preview.
 *
 * Belangrijk: dit is GEEN iframe dat `slides.md` opnieuw inlaadt. We maken één
 * reveal.js-instantie in de pagina en werken de `<section>`-DOM **in-memory**
 * bij. Daardoor:
 *   - zie je bij elke wijziging direct het resultaat (geen refresh);
 *   - blijft de positie behouden (we herbouwen Reveal nooit, dus geen sprong
 *     terug naar slide 1);
 *   - kun je op elementen in de preview klikken (data-block-index) om ze in de
 *     editor te bewerken.
 *
 * De preview laadt de gedeelde `glr-theme.css`, de deck-specifieke `<style>`
 * (indien aanwezig in de bijbehorende index.html) en `glr-plugins.js`, zodat
 * timers/kleurenwielen exact zo werken als in de presentatie.
 */
import { renderSlideBody, slideAttrsToHtml } from '../markdown/render.js';

const REVEAL_SCRIPTS = [
  'vendor/reveal/reveal.js',
  'vendor/reveal/plugin/markdown/markdown.js',
  'vendor/reveal/plugin/highlight/highlight.js',
  'vendor/reveal/plugin/notes/notes.js',
  'vendor/reveal/plugin/search/search.js',
  'vendor/reveal/plugin/zoom/zoom.js',
  'vendor/reveal/plugin/math/math.js',
];

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

export class LivePreviewController {
  /**
   * @param {HTMLElement} host       element waarin de preview komt
   * @param {string}      sharedBase pad naar `shared/` (bijv. '../shared/')
   */
  constructor(host, sharedBase = '../shared/') {
    this.host = host;
    this.sharedBase = sharedBase;
    this.revealEl = null;
    this.ready = false;
    this.deck = null;
    this.blockClickHandler = null;
  }

  async init() {
    this.host.innerHTML = `
      <div class="reveal studio-preview-reveal">
        <div class="slides"><section></section></div>
      </div>`;
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
        minScale: 0.05, maxScale: 1.4, hash: false,
        // Schoon 16:9 slide-canvas: geen Reveal-navigatie, geen voortgangsbalk,
        // geen slidenummers, geen toetsenbord/overview in de editor-preview.
        controls: false, progress: false, slideNumber: false,
        keyboard: false, overview: false,
        transition: 'slide', backgroundTransition: 'fade',
        embedded: true, touch: false, respondToHashChanges: false,
        katex: { local: this.sharedBase + 'vendor/katex' },
        plugins,
        markdown: { smartypants: true },
      });
    } catch (err) {
      // Best-effort: een hapering in Reveal mag de Studio nooit blokkeren.
      console.warn('Reveal-preview kon niet volledig initialiseren:', err);
    }
    this.ready = true;
  }

  /** Laadt een deck in de preview en toont slide 0. */
  loadDeck(deck, extraCss = '') {
    this.deck = deck;
    this.extraCss = extraCss;
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
    section.innerHTML = renderSlideBody(slide.body);
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
  gotoSlide(index) {
    if (!this.ready || !this.deck) return;
    const indices = this._indicesFor(index);
    if (indices) window.Reveal.slide(indices.h, indices.v);
  }

  onBlockClick(handler) {
    this.blockClickHandler = handler;
  }

  /* --------------------------------------------------------------- intern --- */

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
          return `<section ${slideAttrsToHtml(s)} data-block-index="${flatIndex++}">${renderSlideBody(s.body)}</section>`;
        }
        const inner = group
          .map((s) => `<section ${slideAttrsToHtml(s)} data-block-index="${flatIndex++}">${renderSlideBody(s.body)}</section>`)
          .join('\n');
        return `<section>\n${inner}\n</section>`;
      })
      .join('\n');
  }

  _flatSections() {
    return [...this.revealEl.querySelectorAll('.slides section')].filter(
      (s) => s.getAttribute('data-block-index') !== null
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
    try { if (window.RevealHighlight) window.RevealHighlight.highlightAll(); } catch { /* noop */ }
    this._wireClicks();
  }

  _wireClicks() {
    if (!this.blockClickHandler) return;
    const root = this.revealEl.querySelector('.slides');
    root.onclick = (event) => {
      const section = event.target.closest('section[data-block-index]');
      if (!section) return;
      const idx = parseInt(section.getAttribute('data-block-index'), 10);
      this.blockClickHandler(idx, event.target);
    };
  }
}

