/**
 * GLR Slide Studio — bootstrap en UI-bedrading.
 *
 * Combineert: verliesvrije deck-parser, Tiptap visuele editor, altijd zichtbare
 * in-memory Reveal.js-preview, SortableJS slide-sorter, CodeMirror source-view,
 * rechter Inspector (Layout/Notes/Frontmatter) en de opslag (manifest, lokale
 * File System Access API, GitHub direct-naar-main).
 */
import { StudioState } from './app/state.js';
import { HistoryManager, makeSnapshot, validSelection } from './app/history.js';
import { SlideEditor } from './editor/editor.js';
import { setAssetBase, setSlideClasses } from './editor/schema.js';
import { LivePreviewController } from './preview/live-preview.js';
import { SlideSorter } from './sorter/sorter.js';
import { SourceEditor } from './source/source.js';
import { BLOCKS, BLOCK_CATEGORIES, insertBlock, nodeFor } from './blocks/registry.js';
import * as T from './blocks/html-tree.js';
import * as B from './blocks/block-ops.js';
import { resolveTarget, describe } from './blocks/parsers.js';
import { slideTemplateBody, deckFooterText } from './blocks/templates.js';
import { buildDeckMarkdown, frameworkById } from './pedagogy/frameworks.js';
import { blockToMarkdown, bodyToDoc } from './markdown/bridge.js';
import { PropertiesPanel } from './ui/properties-panel.js';
import { QuickBar } from './ui/quick-actions.js';
import { Presenter } from './preview/presenter.js';
import { parseDeck, serializeDeck, serializeSlideAttrs } from './state/deck.js';
import { loadManifest, loadMediaManifest, fetchDeckMarkdown, fetchDeckCss } from './storage/manifest.js';
import { supportsFileSystemAccess, pickDirectory, readFileFromDir, writeFileToDir, writeBlobToDir, downloadText, pickLocalFileForWrite, writeLocalFile, listInputFiles, readInputText } from './storage/local.js';
import * as gh from './storage/github.js';
import { icon } from './ui/icons.js';
import { AuthGate } from './ui/auth-gate.js';
import { openModal } from './ui/modal.js';
import { openPresentationsBrowser as browsePresentations } from './ui/presentations-browser.js';
import { openNewDeckWizard as showNewDeckWizard } from './ui/new-deck-wizard.js';
import { openImageDialog as showImageDialog } from './ui/image-dialog.js';
import { escapeHtml, slugify, SUBJECT_PREFIXES, deckFolder } from './ui/util.js';
import { deckDepth, rewriteShellPrefix } from '../../scripts/lib/rewrite-prefix.js';
import { mountDeployIndicator } from './ui/deploy-poller.js';
import { openAiAssistant as showAiAssistant } from './ui/ai-assistant.js';
import { parseOAuthHash, isOAuthMessage, loginUrl, loadStudioConfig, checkOAuthHealth } from './storage/oauth.js';

const SHARED_BASE = '../shared/';
const TOKEN_KEY = 'glr-gh-token';

function toast(message, isError = false) {
  const el = document.createElement('div');
  el.className = `studio-toast${isError ? ' studio-toast--error' : ''}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

export class Studio {
  constructor() {
    this.state = new StudioState();
    this.manifest = { presentations: [] };
    this.dirHandle = null;
    this.fileHandle = null;
    this.previewCss = '';
    this.auth = { mode: 'none', token: '', repo: '' };
    this.history = new HistoryManager({ onChange: () => this.renderHistoryButtons() });
    this._tx = 0;
    this._txMeta = null;
    this._restoring = false;
    this.savedMarkdown = null;
  }

  async init() {
    this.el = {
      deckname: document.getElementById('deckname'),
      deckpath: document.getElementById('deckpath'),
      openBtn: document.getElementById('open-btn'),
      openBtnIcon: document.getElementById('open-btn-icon'),
      openBtnChev: document.getElementById('open-btn-chev'),
      newDeckBtn: document.getElementById('new-deck-btn'),
      saveBtn: document.getElementById('save-btn'),
      downloadBtn: document.getElementById('download-btn'),
      accountBtn: document.getElementById('account-btn'),
      accountMenu: document.getElementById('account-menu'),
      authGate: document.getElementById('auth-gate'),
      modes: document.getElementById('modes'),
      sorter: document.getElementById('sorter'),
      toolbar: document.getElementById('toolbar'),
      editor: document.getElementById('editor'),
      sourcePane: document.getElementById('source-pane'),
      preview: document.getElementById('preview'),
      panes: document.getElementById('panes'),
      inspector: document.getElementById('inspector'),
      presentBtn: document.getElementById('present-btn'),
      standaloneBtn: document.getElementById('standalone-btn'),
      editorPane: document.getElementById('editor-pane'),
      status: document.getElementById('status-text'),
      aiBtn: document.getElementById('ai-btn'),
      undoBtn: document.getElementById('undo-btn'),
      redoBtn: document.getElementById('redo-btn'),
      deployStatus: document.getElementById('deploy-status'),
    };

    this.decorateTopbar();
    this.authGate = new AuthGate(this.el.authGate, {
      onSubmitToken: (token, remember) => this.handleLogin(token, remember),
      onOffline: () => this.handleOffline(),
      onGitHubLogin: () => this.startGitHubLogin(),
    });
    this.studioConfig = await loadStudioConfig();
    this.authGate.setOAuthEnabled(!!this.studioConfig.oauthUrl);
    // PAT-foldout blijft dicht, tenzij OAuth niet werkt (geen URL, onbereikbaar of niet geconfigureerd).
    if (!this.studioConfig.oauthUrl) this.authGate.openAdvanced();
    else checkOAuthHealth(this.studioConfig.oauthUrl).then((healthy) => { if (!healthy) this.authGate.openAdvanced(); });
    window.addEventListener('message', (event) => this.onOAuthMessage(event));

    this.buildToolbar();
    this.buildSorter();
    this.buildEditor();
    this.buildSource();
    await this.buildPreview();
    this.panel = new PropertiesPanel(this.el.inspector, this.panelApi());
    this.editorBar = new QuickBar(this.el.editorPane, (a) => this.onQuickAction(a));
    this.presenter = new Presenter(this.preview, { onExit: (i) => this.onPresentExit(i) });
    this.deployPoller = mountDeployIndicator(this.el.deployStatus, {
      fetchRun: (sha) => gh.getWorkflowRunForCommit(sha),
      actionsUrl: gh.actionsUrl(),
    });
    this.wireTopbar();
    this.wireState();
    this.wireShortcuts();
    this.renderHistoryButtons();

    this.manifest = await loadManifest();
    this.panel.render();
    this.renderStatus();
    await this.initAuth();
  }

  /** Zet de SVG-iconen in de statische topbar-knoppen. */
  decorateTopbar() {
    if (this.el.openBtnIcon) this.el.openBtnIcon.innerHTML = icon('folder-open', 18);
    if (this.el.openBtnChev) this.el.openBtnChev.innerHTML = icon('chevron-down', 14);
    if (this.el.undoBtn) this.el.undoBtn.innerHTML = icon('undo-2', 17);
    if (this.el.redoBtn) this.el.redoBtn.innerHTML = icon('redo-2', 17);
    if (this.el.aiBtn) this.el.aiBtn.innerHTML = `${icon('sparkles', 15)}<span>AI Assistent</span>`;
    if (this.el.newDeckBtn) this.el.newDeckBtn.innerHTML = `${icon('file-plus', 15)}<span>Nieuwe Presentatie</span>`;
    if (this.el.saveBtn) this.el.saveBtn.innerHTML = `${icon('save', 15)}<span>Opslaan</span>`;
    if (this.el.standaloneBtn) this.el.standaloneBtn.innerHTML = icon('external-link', 16);
    if (this.el.presentBtn) this.el.presentBtn.innerHTML = `${icon('play', 15)}<span>Presenteer</span><kbd>F5</kbd>`;
    if (this.el.downloadBtn) this.el.downloadBtn.innerHTML = icon('download', 16);
    if (this.el.accountBtn) this.el.accountBtn.innerHTML = icon('key', 16);
  }


  /* ------------------------------------------------------------- toolbar */

  buildToolbar() {
    this.el.toolbar.innerHTML = '';
    const visual = this.state.mode === 'visual';
    for (const cat of BLOCK_CATEGORIES) {
      // In de Visuele modus staan er geen inline-opmaakknoppen (vet/cursief/highlight).
      const items = BLOCKS.filter((b) => b.category === cat.id && !(visual && b.inlineOnly));
      if (!items.length) continue;
      const wrap = document.createElement('div');
      wrap.className = 'tool-group';
      const label = document.createElement('span');
      label.className = 'tool-group__label';
      label.textContent = cat.label;
      wrap.appendChild(label);
      const row = document.createElement('div');
      row.className = 'tool-group__items';
      for (const block of items) row.appendChild(this.makeToolButton(block));
      wrap.appendChild(row);
      this.el.toolbar.appendChild(wrap);
    }
  }

  makeToolButton(block) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tool-btn';
    btn.setAttribute('aria-label', block.tooltip);
    btn.dataset.tooltip = block.tooltip;
    btn.innerHTML = `<span class="tool-btn__ic">${icon(block.icon, 17)}</span>`
      + `<span class="tool-btn__label">${block.label}</span>`
      + (block.variants ? `<span class="tool-btn__chev">${icon('chevron-down', 12)}</span>` : '');
    if (block.variants) {
      btn.classList.add('tool-btn--menu');
      btn.addEventListener('click', (e) => { e.stopPropagation(); this.openToolMenu(btn, block); });
    } else if (block.upload) {
      btn.addEventListener('click', () => this.openImageDialog());
    } else {
      btn.addEventListener('click', () => this.insertBlockDef(block));
    }
    return btn;
  }

  /** Kleine dropdown voor blokken met varianten (Kop, GLR Kaarten). */
  openToolMenu(anchor, block) {
    document.querySelectorAll('.tool-menu').forEach((m) => m.remove());
    const menu = document.createElement('div');
    menu.className = 'tool-menu';
    for (const variant of block.variants) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tool-menu__item';
      b.innerHTML = `<span class="tool-menu__ic">${icon(variant.icon || block.icon, 15)}</span><span>${variant.label}</span>`;
      b.addEventListener('click', () => {
        menu.remove();
        this.insertBlockDef(variant);
      });
      menu.appendChild(b);
    }
    document.body.appendChild(menu);
    const r = anchor.getBoundingClientRect();
    menu.style.top = `${r.bottom + 6}px`;
    menu.style.left = `${Math.min(r.left, window.innerWidth - 240)}px`;
    const close = (ev) => {
      if (!menu.contains(ev.target) && ev.target !== anchor) {
        menu.remove();
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 0);
  }

  /* -------------------------------------------------------------- modules */

  buildSorter() {
    this.sorter = new SlideSorter(this.el.sorter, {
      onSelect: (i) => this.state.setCurrentIndex(i),
      onReorder: (from, to) => {
        if (!this.state.deck) return;
        this.transact({ label: 'Slide verplaatst' }, () => {
          this.state.deck.moveSlide(from, to);
          this.state.markDirty();
          this.renderSorter();
          this.preview.rebuild();
          this.state.setCurrentIndex(to);
          this.renderStatus();
        });
      },
      onAdd: (index, kind) => this.addSlide(index, kind),
      onDelete: (i) => {
        if (!this.state.deck || this.state.deck.slides.length <= 1) return;
        this.transact({ label: 'Slide verwijderd' }, () => {
          this.state.deck.removeSlide(i);
          this.state.markDirty();
          this.renderSorter();
          this.preview.rebuild();
          this.state.setCurrentIndex(Math.min(i, this.state.deck.slides.length - 1));
          this.renderStatus();
        });
      },
      onDuplicate: (i) => {
        this.transact({ label: 'Slide gedupliceerd' }, () => {
          this.state.deck.duplicateSlide(i);
          this.state.markDirty();
          this.renderSorter();
          this.preview.rebuild();
          this.state.setCurrentIndex(i + 1);
          this.renderStatus();
        });
      },
    });
  }

  buildEditor() {
    this.editor = new SlideEditor(this.el.editor, {
      onChange: () => this.onEditorChange(),
      onBlockClick: (payload) => { if (payload.blockIndex != null) this.selectBlockDefault(payload.blockIndex); },
      onCaretBlock: (i) => { if (!this.state.selection || this.state.selection.blockIndex !== i) this.selectBlockDefault(i); },
    });
  }

  buildSource() {
    this.source = new SourceEditor(this.el.sourcePane, {
      onChange: (text) => this.onSourceChange(text),
    });
  }

  async buildPreview() {
    this.preview = new LivePreviewController(this.el.preview, SHARED_BASE);
    try {
      await this.preview.init();
    } catch (err) {
      // De preview is een hulpmiddel: een fout mag de Studio nooit blokkeren.
      console.warn('Preview-init mislukt:', err);
    }
    this.preview.setHandlers({
      onPick: (pick) => this.onCanvasPick(pick),
      onResolve: (bi, bp) => this.resolveHover(bi, bp),
      onAction: (a) => this.onQuickAction(a),
      getBarState: () => this.barState(),
      onImageResize: (pct) => this.onImageResize(pct),
      canEditText: (bi, bp, el) => this.canEditText(bi, bp, el),
      onTextEdit: (p) => this.onCanvasText(p),
      onTextEditEnd: () => this.onCanvasTextEnd(),
    });
  }

  /* -------------------------------------------------------------- topbar */

  wireTopbar() {
    for (const dd of document.querySelectorAll('.dropdown')) {
      const toggle = dd.querySelector('[data-toggle]');
      if (!toggle) continue;
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = dd.classList.contains('is-open');
        document.querySelectorAll('.dropdown').forEach((d) => d.classList.remove('is-open'));
        dd.classList.toggle('is-open', !wasOpen);
      });
    }
    document.addEventListener('click', () => document.querySelectorAll('.dropdown').forEach((d) => d.classList.remove('is-open')));

    for (const btn of this.el.modes.querySelectorAll('button')) {
      btn.addEventListener('click', () => this.setMode(btn.dataset.mode));
    }

    if (this.el.openBtn) this.el.openBtn.addEventListener('click', () => this.openPresentationsBrowser());
    if (this.el.newDeckBtn) this.el.newDeckBtn.addEventListener('click', () => this.openNewDeckWizard());
    if (this.el.aiBtn) this.el.aiBtn.addEventListener('click', () => this.openAiAssistant());
    if (this.el.undoBtn) this.el.undoBtn.addEventListener('click', () => this.undo());
    if (this.el.redoBtn) this.el.redoBtn.addEventListener('click', () => this.redo());
    if (this.el.saveBtn) this.el.saveBtn.addEventListener('click', () => this.save());
    if (this.el.presentBtn) this.el.presentBtn.addEventListener('click', () => this.startPresentation());
    if (this.el.standaloneBtn) this.el.standaloneBtn.addEventListener('click', () => this.openStandalone());
    if (this.el.downloadBtn) this.el.downloadBtn.addEventListener('click', () => this.downloadDeck());
    this.renderAccountMenu();
  }

  wireShortcuts() {
    // Globale undo/redo: capture-fase, zodat het ook werkt in inputs, textareas,
    // het Properties Panel, ProseMirror en CodeMirror (die hun eigen undo niet gebruiken).
    document.addEventListener('keydown', (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod || e.altKey) return;
      const k = e.key.toLowerCase();
      const isUndo = k === 'z' && !e.shiftKey;
      const isRedo = (k === 'z' && e.shiftKey) || (k === 'y' && !e.shiftKey);
      if (!isUndo && !isRedo) return;
      if (!this.state.deck || (this.presenter && this.presenter.active)) return;
      if (document.querySelector('.modal-backdrop') || (this.el.authGate && !this.el.authGate.hidden)) return;
      e.preventDefault();
      e.stopPropagation();
      if (isUndo) this.undo(); else this.redo();
    }, true);

    document.addEventListener('keydown', (e) => {
      if (this.presenter && this.presenter.active) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        this.save();
        return;
      }
      if (e.key === 'F5') {
        e.preventDefault();
        this.startPresentation();
        return;
      }
      const t = e.target;
      const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || (t.closest && t.closest('.cm-editor, .ProseMirror')));
      if (typing || document.querySelector('.modal-backdrop')) return;
      if (e.key === 'Escape' && this.state.selection) { this.state.setSelection(null); return; }
      if (!this.state.selection) return;
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); this.onQuickAction('delete'); }
      else if (mod && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); this.onQuickAction('duplicate'); }
    });
  }

  wireState() {
    this.state.on('deck', () => this.renderSorter());
    this.state.on('slide', (i) => { this.syncHistoryView(); this.onSlideChange(i); });
    this.state.on('mode', (m) => this.applyMode(m));
    this.state.on('dirty', () => this.renderStatus());
    this.state.on('selection', (sel) => { this.syncHistoryView(); this.onSelectionChange(sel); });
  }

  setMode(mode) {
    this.state.setMode(mode);
  }

  applyMode(mode) {
    this.el.panes.dataset.mode = mode;
    for (const btn of this.el.modes.querySelectorAll('button')) {
      btn.classList.toggle('is-active', btn.dataset.mode === mode);
    }
    this.buildToolbar();
    if (this.state.deck) {
      if (mode === 'source') this.source.setValue(this.deckMarkdown());
      if (mode !== 'visual') this.editor.loadBody(this.state.currentSlide.body);
    }
    this.preview.rebuild();
    this.preview.refreshSelection();
    this.applyEditorTheme();
    requestAnimationFrame(() => { this.updateEditorBar(); });
  }

  /* ------------------------------------------------------------ deck laden */

  /** Opent de Directory Tree Explorer (vervangt de platte deck-dropdown). */
  openPresentationsBrowser() {
    browsePresentations({
      manifest: this.manifest,
      currentPath: this.state.deckMeta ? this.state.deckMeta.path : '',
      onOpen: (entry) => this.openDeckFromManifest(entry),
      onNew: () => this.openNewDeckWizard(),
    });
  }

  /** Opent de AI Les-Assistent (prompt voor browser-LLM's + MCP-uitleg). */
  openAiAssistant() {
    const local = !!this.dirHandle;
    showAiAssistant({
      hasLocalFolder: local,
      listInputFiles: local ? () => listInputFiles(this.dirHandle) : null,
      readInputText: local ? (name) => readInputText(this.dirHandle, name) : null,
      onLoadDeck: (markdown, info) => this.loadDeckFromAi(markdown, info),
    });
  }

  /** Laadt een door een AI gegenereerd deck op het canvas (nog niet opgeslagen). */
  loadDeckFromAi(markdown, { title, prefix }) {
    if (this.state.deck && this.state.deck.slides.some((s) => s.dirty)
      && !window.confirm('Er zijn niet-opgeslagen wijzigingen. Toch de AI-presentatie laden?')) return false;
    const base = slugify(title) || 'ai-presentatie';
    const slug = !prefix || prefix === 'custom' ? base : `${prefix}_${base}`;
    const path = `presentations/${slug}/slides.md`;
    this.previewCss = '';
    this.loadDeck(parseDeck(markdown), { source: 'ai', path, title });
    this.state.deck.slides.forEach((sl) => { sl.dirty = true; });
    this.state.markDirty();
    this.renderStatus();
    this.setStatus(`AI-presentatie geladen: ${path} (nog niet opgeslagen)`);
    toast('AI-presentatie geladen op het canvas. Controleer de slides en klik op Opslaan.');
    return true;
  }

  /** Opent de "+ Nieuwe Presentatie"-wizard. */
  openNewDeckWizard() {
    showNewDeckWizard({
      manifest: this.manifest,
      onCreated: (data) => this.createDeckFromWizard(data),
    });
  }

  /** Bouwt een nieuw deck uit de wizard en laadt het in de Studio. */
  createDeckFromWizard(data) {
    const dir = deckFolder({ cohort: data.cohort, leerjaar: data.leerjaar, slug: data.slug }) || `presentations/${data.slug}`;
    const path = `${dir}/slides.md`;
    const markdown = buildDeckMarkdown(data, data.framework || 'vrij');
    const deck = parseDeck(markdown);
    const subject = (SUBJECT_PREFIXES.find((p) => p.value === data.prefix) || {}).subject || '';
    this.previewCss = '';
    this.loadDeck(deck, { source: 'new', path, title: data.title, subject });
    this.setStatus(`Nieuw deck aangemaakt: ${path}`);
    const fw = frameworkById(data.framework);
    toast(fw.id === 'vrij'
      ? 'Nieuwe presentatie aangemaakt. Bewerk de slides en klik op Opslaan.'
      : `Nieuwe presentatie aangemaakt met het start-model "${fw.label}". Alles blijft vrij aan te passen.`);
  }

  async openDeckFromManifest(entry) {
    if (!entry.md) {
      // Family B (legacy inline-HTML deck): nog geen slides.md om te bewerken.
      if (entry.html) window.open(`../${entry.html}`, '_blank', 'noopener');
      toast('Legacy deck (inline HTML): alleen-lezen. Nog niet visueel te bewerken.');
      return;
    }
    try {
      const text = await fetchDeckMarkdown(entry);
      const css = await fetchDeckCss(entry);
      this.previewCss = css;
      this.loadDeck(parseDeck(text), { source: 'manifest', path: entry.md, entry });
      this.setStatus(`Geladen uit manifest: ${entry.title || entry.md}`);
    } catch (err) {
      toast(err.message, true);
    }
  }

  async openDeckFromGithub() {
    const token = this.auth.token || this.getToken();
    if (!token) return toast('Log eerst in met een GitHub-token.', true);
    try {
      await gh.connect(token);
      const decks = await gh.listDecks();
      const path = window.prompt(`GitHub-deck (pad):\n\n${decks.map((d) => d.md).join('\n')}`, decks[0] ? decks[0].md : '');
      if (!path) return;
      const { text, sha } = await gh.readTextFile(path);
      this.loadDeck(parseDeck(text), { source: 'github', path, sha });
      this.setStatus(`Geladen van GitHub: ${path}`);
    } catch (err) {
      toast(`GitHub: ${err.message}`, true);
    }
  }

  async openDeckFromLocal() {
    const picked = await pickLocalFileForWrite();
    if (!picked) return;
    this.fileHandle = picked.handle || null;
    this.loadDeck(parseDeck(picked.text), { source: 'local-file', path: picked.name });
    this.setStatus(`Lokaal bestand: ${picked.name}`);
  }

  async pickDir() {
    try {
      this.dirHandle = await pickDirectory();
      toast('Map gekoppeld. Je kunt nu offline opslaan.');
    } catch (err) {
      toast(err.message, true);
    }
  }

  loadDeck(deck, meta) {
    // Basis-URL eerst: sorter en preview lossen relatieve `assets/…`-paden daartegen op.
    const dir = meta && meta.path && meta.path.includes('/') ? meta.path.slice(0, meta.path.lastIndexOf('/') + 1) : '';
    this.preview.setBaseUrl(dir ? `../${dir}` : '');
    this.sorter.baseUrl = dir ? `../${dir}` : '';
    setAssetBase(dir ? `../${dir}` : '');
    this.state.setDeck(deck, meta);
    this.el.deckname.textContent = (deck.frontmatter && deck.frontmatter.get('title')) || (meta && meta.path) || 'Naamloos deck';
    if (this.el.deckpath) this.el.deckpath.textContent = (meta && meta.path) || 'Nieuw concept (nog niet opgeslagen)';
    if (this.preview.ready) this.preview.loadDeck(deck, this.previewCss);
    this.applyEditorTheme();
    this.source.setValue(this.deckMarkdown());
    this.editor.loadBody(deck.slides[0].body);
    this.panel.render();
    this.renderStatus();
    // Compleet ander deck: schone history.
    this.savedMarkdown = meta && (meta.source === 'new' || meta.source === 'ai') ? null : this.deckMarkdown();
    this.history.reset(makeSnapshot(deck, this.state.currentIndex, null, { label: 'Geopend' }));
  }

  /* ------------------------------------------------------------ wijzigingen */

  onSlideChange(index) {
    if (!this.state.deck) return;
    this.sorter.setActive(index);
    this.preview.gotoSlide(index);
    this.applyEditorTheme();
    this.editor.loadBody(this.state.currentSlide.body);
    this.editor.setActiveBlock(null);
    this.preview.setSelection(null);
    this.editorBar.hide();
    this.panel.render();
    this.renderStatus();
  }

  onEditorChange() {
    if (!this.state.deck) return;
    const slide = this.state.currentSlide;
    slide.setBody(this.editor.getBody());
    this.state.markDirty();
    const pe = this._editorLabel;
    this._editorLabel = null;
    this.recordHistory(pe ? pe.label : 'Tekst aangepast', { origin: 'editor', coalesceKey: pe ? null : `ed:${this.state.currentIndex}` });
    this.schedulePreviewUpdate();
    this.scheduleSorterThumb();
    this.renderStatus();
    const sel = this.state.selection;
    if (sel && sel.blockIndex >= B.blockCount(slide.body)) this.state.setSelection(null);
    clearTimeout(this._panelTimer);
    this._panelTimer = setTimeout(() => { if (this.state.selection) this.panel.render(); }, 250);
  }

  onSourceChange(text) {
    if (!this.state.deck) return;
    clearTimeout(this._sourceTimer);
    this._sourceTimer = setTimeout(() => {
      const index = this.state.currentIndex;
      const deck = parseDeck(text);
      this.state.deck = deck;
      this.state.markDirty();
      this.state.currentIndex = Math.min(index, deck.slides.length - 1);
      this.recordHistory('Broncode aangepast', { origin: 'source', coalesceKey: 'src' });
      this.renderSorter();
      this.preview.deck = deck;
      this.preview.rebuild();
      this.editor.loadBody(deck.slides[this.state.currentIndex].body);
      this.state.selection = null;
      this.preview.setSelection(null);
      this.panel.render();
      this.renderStatus();
    }, 250);
  }

  schedulePreviewUpdate() {
    clearTimeout(this._previewTimer);
    this._previewTimer = setTimeout(() => {
      this.preview.updateSlide(this.state.currentIndex, this.state.currentSlide);
    }, 150);
  }

  scheduleSorterThumb() {
    clearTimeout(this._thumbTimer);
    this._thumbTimer = setTimeout(() => {
      const li = this.sorter.list.children[this.state.currentIndex];
      const inner = li && li.querySelector('.sorter-thumb__inner');
      if (!inner) return;
      const slide = this.state.currentSlide;
      const section = document.createElement('section');
      for (const [k, v] of Object.entries(slide.attrsData || {})) section.setAttribute(k, v);
      section.innerHTML = this.preview.ready ? '' : '';
      // Mini-thumbnail opnieuw opbouwen via de renderer.
      import('./markdown/render.js').then(({ renderSlideBody, resolveAssets }) => {
        section.innerHTML = resolveAssets(renderSlideBody(slide.body), this.sorter.baseUrl);
        inner.innerHTML = '';
        inner.appendChild(section);
      });
      this.sorter.refreshMeta(this.state.currentIndex);
    }, 500);
  }

  renderSorter() {
    if (this.state.deck) this.sorter.render(this.state.deck, this.state.currentIndex);
  }

  renderStatus() {
    if (!this.state.deck) return;
    const dirty = this.state.deck.slides.some((s) => s.dirty);
    const slideNo = this.state.currentIndex + 1;
    const source = (this.state.deckMeta && this.state.deckMeta.source) || '—';
    this.el.status.innerHTML = dirty
      ? `<span class="is-dirty">● Niet opgeslagen</span> · slide ${slideNo}/${this.state.deck.slides.length} · ${source}`
      : `Opgeslagen · slide ${slideNo}/${this.state.deck.slides.length} · ${source}`;
  }

  setStatus(text) {
    this.el.status.textContent = text;
  }

  addSlide(index = null, kind = 'standard') {
    if (!this.state.deck) return;
    const at = index == null ? this.state.currentIndex + 1 : Math.max(0, Math.min(index, this.state.deck.slides.length));
    const vertical = kind === 'sub';
    const body = slideTemplateBody(kind, { number: at + 1, footerText: this.deckFooterText() });
    this.transact({ label: 'Slide toegevoegd' }, () => {
      this.state.deck.insertSlide(at, { vertical, body });
      this.state.markDirty();
      this.renderSorter();
      this.preview.rebuild();
      this.state.setCurrentIndex(at);
      this.renderStatus();
    });
  }

  /* ------------------------------------------------------- undo / redo */

  /** Voert `fn` uit en legt daarna precies één history-stap vast (buitenste meta wint). */
  transact(meta, fn) {
    const outer = this._tx === 0;
    this._tx += 1;
    if (outer) this._txMeta = meta || null;
    else if (!this._txMeta) this._txMeta = meta || null;
    try {
      fn();
    } finally {
      this._tx -= 1;
    }
    if (outer) {
      const m = this._txMeta || { label: 'Wijziging' };
      this._txMeta = null;
      this.recordHistory(m.label, { origin: m.origin, coalesceKey: m.coalesceKey });
    }
  }

  recordHistory(label, { origin = 'action', coalesceKey = null } = {}) {
    if (this._restoring || this._tx > 0 || !this.state.deck) return;
    const snap = makeSnapshot(this.state.deck, this.state.currentIndex, this.state.selection, { label, coalesceKey });
    this.history.record(snap, { label, origin, coalesceKey });
    this.history.updateView({ slideIndex: this.state.currentIndex, selection: this.state.selection });
  }

  /** Slide- of selectiewissel: view van de huidige stap bijwerken (verbreekt typen-coalescing). */
  syncHistoryView() {
    if (this._restoring || this._tx > 0 || !this.state.deck) return;
    this.history.updateView({ slideIndex: this.state.currentIndex, selection: this.state.selection });
  }

  undo() { this.applySnapshot(this.history.undo()); }

  redo() { this.applySnapshot(this.history.redo()); }

  applySnapshot(snap) {
    if (!snap || !this.state.deck) return;
    this._restoring = true;
    try {
      clearTimeout(this._sourceTimer);
      clearTimeout(this._panelTimer);
      clearTimeout(this._previewTimer);
      if (this.preview.endTextEdit) this.preview.endTextEdit();
      const active = document.activeElement;
      const field = active && this.el.inspector.contains(active) && active.closest('[data-field-label]');
      const fieldLabel = field ? field.dataset.fieldLabel : null;

      const deck = parseDeck(snap.markdown);
      const index = Math.max(0, Math.min(snap.slideIndex, deck.slides.length - 1));
      const dirty = this.savedMarkdown == null || snap.markdown !== this.savedMarkdown;
      deck.slides.forEach((sl) => { sl.dirty = dirty; });
      this.state.deck = deck;
      this.state.currentIndex = index;
      this.state.selection = null;
      this.preview.deck = deck;
      this.preview.rebuild();
      this.preview.gotoSlide(index);
      this.renderSorter();
      this.sorter.setActive(index);
      this.applyEditorTheme();
      this.editor.loadBody(deck.slides[index].body);
      if (this.state.mode === 'source') this.source.setValue(snap.markdown);
      this.el.deckname.textContent = (deck.frontmatter && deck.frontmatter.get('title')) || (this.state.deckMeta && this.state.deckMeta.path) || 'Naamloos deck';
      this.editorBar.hide();
      const sel = validSelection(deck, index, snap.selection);
      if (sel && fieldLabel) this.panel.focusFieldAfterRender(fieldLabel, { select: false });
      this.state.setSelection(sel); // rendert paneel + canvas-highlight
      this.renderStatus();
    } finally {
      this._restoring = false;
    }
    this.renderHistoryButtons();
  }

  renderHistoryButtons() {
    const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');
    const undoKey = mac ? '⌘Z' : 'Ctrl+Z';
    const redoKey = mac ? '⇧⌘Z' : 'Ctrl+Y';
    const h = this.history;
    if (this.el && this.el.undoBtn) {
      const t = h.canUndo ? `Ongedaan maken: ${h.undoLabel} (${undoKey})` : `Niets om ongedaan te maken (${undoKey})`;
      this.el.undoBtn.disabled = !h.canUndo;
      this.el.undoBtn.title = t;
      this.el.undoBtn.setAttribute('aria-label', t);
    }
    if (this.el && this.el.redoBtn) {
      const t = h.canRedo ? `Opnieuw: ${h.redoLabel} (${redoKey})` : `Niets om opnieuw te doen (${redoKey})`;
      this.el.redoBtn.disabled = !h.canRedo;
      this.el.redoBtn.title = t;
      this.el.redoBtn.setAttribute('aria-label', t);
    }
  }

  deckMarkdown() {
    return this.state.deck ? serializeDeck(this.state.deck) : '';
  }

  /* ----------------------------------- selectie, Properties Panel & canvas */

  /** De functies die het Properties Panel nodig heeft (geen directe Studio-afhankelijkheid). */
  panelApi() {
    return {
      state: this.state,
      getBody: () => this.state.currentSlide.body,
      commitBody: (body, opts) => this.commitBody(body, opts),
      setSelection: (sel) => this.state.setSelection(sel),
      selectPath: (bi, path) => this.selectPath(bi, path),
      selectExact: (bi, path) => this.state.setSelection({ blockIndex: bi, path, highlight: path, openItem: -1 }),
      toggleFragment: () => this.onQuickAction('fragment'),
      upload: (file) => this.uploadImageFile(file),
      updateSlideAttrs: (fn, opts) => this.updateSlideAttrs(fn, opts),
      pickImage: (current) => this.pickImage(current),
      addToContainer: (bi, path, kind) => this.addToContainer(bi, path, kind),
      setNote: (v) => {
        this.transact({ label: 'Notitie aangepast', origin: 'form-input', coalesceKey: `note:${this.state.currentIndex}` }, () => {
          this.state.currentSlide.setNote(v);
          this.state.markDirty();
          this.renderStatus();
        });
      },
      setFrontmatter: (key, value) => {
        const fm = this.state.deck.frontmatter;
        if (!fm) return;
        this.transact({ label: 'Lesgegevens aangepast', origin: 'form-input', coalesceKey: `fm:${key}` }, () => {
          fm.set(key, value);
          this.state.markDirty();
          this.el.deckname.textContent = fm.get('title') || 'Naamloos deck';
          this.renderStatus();
        });
      },
      locationInfo: () => this.locationInfo(),
      moveDeck: () => this.moveDeckToTarget(),
      addFooter: () => this.addFooter(),
      applyCoach: (r) => this.applyCoach(r),
      restoreCoach: (snap) => this.restoreCoach(snap),
    };
  }

  /** Voert een actie van de Didactische Coach uit: `{ body, note, focus? }`. */
  applyCoach(result) {
    this.transact({ label: `Coach: ${result.label || 'tip toegepast'}` }, () => this._applyCoach(result));
  }

  _applyCoach({ body, note, focus }) {
    const slide = this.state.currentSlide;
    if (!slide) return;
    const noteChanged = note != null && note !== slide.noteText;
    if (noteChanged) {
      slide.setNote(note);
      this.state.markDirty();
    }
    this.commitBody(body, { origin: 'panel' });
    this.renderStatus();
    if (focus) {
      this.panel.focusFieldAfterRender(focus.field);
      if (focus.path) this.selectPath(focus.blockIndex, focus.path);
      else this.state.setSelection({ blockIndex: focus.blockIndex, path: [], highlight: [], openItem: -1 });
    } else if (noteChanged) {
      // Er is een blok of onderdeel verwijderd: de oude selectie klopt niet meer.
      this.state.setSelection(null);
    } else {
      this.panel.render();
    }
  }

  /** "Ongedaan maken" van de laatste coach-actie: body én notitie exact terugzetten. */
  restoreCoach(snap) {
    this.transact({ label: 'Coach-actie teruggedraaid' }, () => this._restoreCoach(snap));
  }

  _restoreCoach(snap) {
    const slide = snap && snap.slide;
    if (!slide || slide !== this.state.currentSlide) return;
    slide.note = snap.note;
    slide.gap2 = snap.gap2;
    slide.dirty = true;
    this.state.markDirty();
    this.commitBody(snap.body, { origin: 'panel' });
    this.renderStatus();
    this.state.setSelection(null);
  }

  /**
   * Eén doorgang voor elke wijziging van de slide-inhoud (paneel, canvas,
   * quick actions, toolbar). `selection`: undefined = ongemoeid, null = wissen.
   */
  commitBody(body, opts = {}) {
    const { origin = 'panel', label, coalesceKey } = opts;
    const meta = { label: label || ({ 'canvas-text': 'Tekst aangepast', toolbar: 'Blok toegevoegd', 'form-input': 'Tekst aangepast' }[origin] || 'Eigenschap aangepast'), origin: origin === 'canvas-text' ? 'inline-canvas' : origin, coalesceKey };
    this.transact(meta, () => this._commitBody(body, opts));
  }

  _commitBody(body, { origin = 'panel', selection } = {}) {
    const slide = this.state.currentSlide;
    if (!slide) return;
    if (body !== slide.body) {
      slide.setBody(body);
      this.state.markDirty();
      const cur = this.state.selection;
      if (selection === undefined && cur && cur.blockIndex >= B.blockCount(body)) selection = null;
      if (origin !== 'canvas-text') this.schedulePreviewNow();
      if (origin !== 'editor' && this.state.mode !== 'visual') this.editor.loadBody(body);
      if (this.state.mode === 'source' && origin !== 'source') this.source.setValue(this.deckMarkdown());
      this.scheduleSorterThumb();
      this.renderStatus();
    }
    if (selection !== undefined) this.state.setSelection(selection);
    requestAnimationFrame(() => this.updateEditorBar());
  }

  schedulePreviewNow() {
    if (this._pvRaf) return;
    this._pvRaf = requestAnimationFrame(() => {
      this._pvRaf = 0;
      if (this.state.currentSlide) this.preview.updateSlide(this.state.currentIndex, this.state.currentSlide);
    });
  }

  /**
   * Geeft de Tiptap-editor dezelfde achtergrond en tekstkleur als het slide-canvas
   * (zodat bv. een zwarte slide ook in Split-modus zwart is).
   */
  applyEditorTheme() {
    const slide = this.state.currentSlide;
    const pane = this.el.editorPane;
    if (!slide || !pane || !this.preview.revealEl) return;
    const a = slide.attrsData;
    const viewport = getComputedStyle(this.preview.revealEl);
    const section = this.preview._currentSection();
    const fg = section ? getComputedStyle(section).color : viewport.color;
    if (a['data-background-color']) {
      pane.style.backgroundImage = 'none';
      pane.style.backgroundColor = a['data-background-color'];
    } else {
      pane.style.backgroundImage = viewport.backgroundImage;
      pane.style.backgroundColor = viewport.backgroundColor;
    }
    pane.style.setProperty('--ed-fg', fg);
    setSlideClasses(a.class || '');
  }

  /** Slide-attributen (`<!-- .slide: … -->`) aanpassen; `mutate` krijgt een kopie van het attr-object. */
  updateSlideAttrs(mutate, opts = {}) {
    const idx = this.state.currentIndex;
    this.transact({ label: opts.label || 'Slide-eigenschap aangepast', origin: opts.origin || 'action', coalesceKey: opts.coalesceKey ? `${opts.coalesceKey}:${idx}` : null }, () => this._updateSlideAttrs(mutate));
  }

  _updateSlideAttrs(mutate) {
    const slide = this.state.currentSlide;
    const obj = { ...slide.attrsData };
    mutate(obj);
    const next = serializeSlideAttrs(obj);
    if (!slide.attrs && next && slide.gap1 === '') slide.gap1 = '\n\n';
    slide.setAttrs(next);
    this.state.markDirty();
    this.preview.updateSlide(this.state.currentIndex, slide);
    this.applyEditorTheme();
    if (this.state.mode !== 'visual') this.editor.loadBody(slide.body);
    this.scheduleSorterThumb();
    this.renderStatus();
  }

  deckFooterText() {
    return deckFooterText(this.state.deck);
  }

  addFooter() {
    const n = String(this.state.currentIndex + 1).padStart(2, '0');
    const html = `<div class="footer"><span>${escapeHtml(this.deckFooterText())}</span><span class="num">${n}</span></div>`;
    const r = B.insertAfterSelection(this.state.currentSlide.body, { blockIndex: B.blockCount(this.state.currentSlide.body) - 1 }, { type: 'htmlBlock', attrs: { html } });
    this.commitBody(r.body, { origin: 'panel', label: 'Footer toegevoegd' });
  }

  /** Selecteer de component rond element-pad `path` van html-blok `bi` (zoals een klik op het canvas). */
  selectPath(bi, path) {
    const html = B.htmlAt(this.state.currentSlide.body, bi);
    if (html == null) return this.state.setSelection({ blockIndex: bi, path: [], highlight: [], openItem: -1 });
    const r = resolveTarget(html, path);
    return this.state.setSelection({ blockIndex: bi, path: r.path, highlight: r.highlight, openItem: r.openItem });
  }

  /** Selecteer een heel blok (klik in de editor). */
  selectBlockDefault(i) {
    const body = this.state.currentSlide.body;
    if (B.htmlAt(body, i) == null) this.state.setSelection({ blockIndex: i, path: [], highlight: [], openItem: -1 });
    else this.selectPath(i, [0]);
  }

  onCanvasPick(pick) {
    if (!pick) { if (this.state.selection) this.state.setSelection(null); return; }
    const html = B.htmlAt(this.state.currentSlide.body, pick.blockIndex);
    if (html == null || pick.bp == null) this.state.setSelection({ blockIndex: pick.blockIndex, path: [], highlight: [], openItem: -1 });
    else this.selectPath(pick.blockIndex, pick.bp);
  }

  resolveHover(bi, bp) {
    const html = B.htmlAt(this.state.currentSlide.body, bi);
    if (html == null || bp == null) return [];
    return resolveTarget(html, bp).highlight;
  }

  onSelectionChange(sel) {
    this.preview.setSelection(sel);
    this.editor.setActiveBlock(sel ? sel.blockIndex : null);
    this.panel.render();
    this.updateEditorBar(true);
  }

  barState() {
    const sel = this.state.selection;
    if (!sel || !this.state.currentSlide) return {};
    const body = this.state.currentSlide.body;
    return {
      fragmentOn: B.isFragment(body, sel),
      fragmentEnabled: B.canFragment(body, sel),
      canMoveUp: B.canMove(body, sel, -1),
      canMoveDown: B.canMove(body, sel, 1),
      canAddImage: !!this.containerOfSelection(),
    };
  }

  /** Pad van de kolom/kaart/rastercel rond de selectie, of null. */
  containerOfSelection() {
    const sel = this.state.selection;
    const html = sel && this.state.currentSlide ? B.htmlAt(this.state.currentSlide.body, sel.blockIndex) : null;
    if (html == null) return null;
    return B.containerPathFor(html, sel.highlight && sel.highlight.length ? sel.highlight : sel.path);
  }

  /** Quick-Action balk boven het geselecteerde blok in de Tiptap-editor (Split/Broncode). */
  updateEditorBar(scrollIntoView = false) {
    const sel = this.state.selection;
    if (!this.editorBar) return;
    if (this.state.mode === 'visual' || !sel) return this.editorBar.hide();
    const dom = this.editor.blockDom(sel.blockIndex);
    if (!dom) return this.editorBar.hide();
    if (scrollIntoView) dom.scrollIntoView({ block: 'nearest' });
    this.editorBar.show(dom.getBoundingClientRect(), this.barState());
  }

  onQuickAction(action) {
    const sel = this.state.selection;
    if (!sel || !this.state.currentSlide) return;
    const body = this.state.currentSlide.body;
    if (action === 'up' || action === 'down') {
      const r = B.moveSelection(body, sel, action === 'up' ? -1 : 1);
      if (r.changed) this.commitBody(r.body, { origin: 'action', selection: r.selection, label: 'Blok verplaatst' });
    } else if (action === 'fragment') {
      if (!B.canFragment(body, sel)) return toast('Dit onderdeel ondersteunt geen animatiestap.', true);
      this.commitBody(B.toggleFragmentSelection(body, sel), { origin: 'action', selection: { ...sel }, label: 'Animatiestap aangepast' });
    } else if (action === 'duplicate') {
      const r = B.duplicateSelection(body, sel);
      this.commitBody(r.body, { origin: 'action', selection: r.selection, label: 'Blok gedupliceerd' });
    } else if (action === 'image') {
      const cpath = this.containerOfSelection();
      if (cpath) this.addToContainer(sel.blockIndex, cpath, 'image');
    } else if (action === 'delete') {
      const r = B.removeSelection(body, sel);
      this.commitBody(r.body, { origin: 'action', selection: r.selection, label: 'Blok verwijderd' });
    }
  }

  /* ---- tekst direct op het canvas typen ---- */

  /** Markdown-tekst van een kop/alinea zonder `#` en zonder `.element:`-comment. */
  mdParts(block) {
    const md = blockToMarkdown(block);
    const m = /\s*(<!--\s*\.element:[^>]*-->)\s*$/.exec(md);
    let text = m ? md.slice(0, m.index) : md;
    if (block.type === 'heading') text = text.replace(/^#{1,6}\s+/, '');
    return { text, comment: m ? m[1] : '' };
  }

  canEditText(bi, bp, el) {
    const block = B.blockAt(this.state.currentSlide.body, bi);
    if (!block) return false;
    if (block.type === 'htmlBlock') {
      if (bp == null) return false;
      const html = block.attrs.html;
      const node = T.nodeAt(T.parse(html), bp);
      return !!node && T.isLeaf(node) && !node.voidEl && !['script', 'style', 'svg', 'button'].includes(node.tag) && T.rawTextOf(html, node).trim() === el.textContent.trim();
    }
    if (block.type === 'heading' || block.type === 'paragraph') return this.mdParts(block).text === el.textContent;
    return false;
  }

  onCanvasText({ blockIndex, bp, text }) {
    const body = this.state.currentSlide.body;
    const block = B.blockAt(body, blockIndex);
    if (!block) return;
    if (block.type === 'htmlBlock') {
      const node = T.nodeAt(T.parse(block.attrs.html), bp);
      if (!node) return;
      this.commitBody(B.setHtmlAt(body, blockIndex, T.setText(block.attrs.html, node, text)), { origin: 'canvas-text', coalesceKey: `canvas:${this.state.currentIndex}:${blockIndex}:${(bp || []).join('.')}` });
    } else {
      const { comment } = this.mdParts(block);
      const prefix = block.type === 'heading' ? `${'#'.repeat(block.attrs.level)} ` : '';
      const nodes = bodyToDoc(`${prefix}${text}${comment ? ` ${comment}` : ''}`).content;
      this.commitBody(B.replaceBlock(body, blockIndex, nodes.length ? nodes : [block]), { origin: 'canvas-text', coalesceKey: `canvas:${this.state.currentIndex}:${blockIndex}:` });
    }
  }

  onCanvasTextEnd() {
    this.schedulePreviewNow();
    this.panel.render();
  }

  /* ---- blokken toevoegen vanuit de toolbar ---- */

  insertBlockDef(def) {
    if (!this.state.deck) return toast('Open eerst een presentatie.', true);
    if (this.state.mode !== 'visual') { this._editorLabel = { label: `${def.label || 'Blok'} toegevoegd` }; insertBlock(this.editor, def); return; }
    const node = nodeFor(def);
    if (node) this.insertNodes(node, `${def.label || 'Blok'} toegevoegd`);
  }

  insertNodes(nodes, label = 'Blok toegevoegd') {
    this.transact({ label, origin: 'toolbar' }, () => {
      const r = B.insertAfterSelection(this.state.currentSlide.body, this.state.selection, nodes);
      this.commitBody(r.body, { origin: 'toolbar', label });
      this.selectBlockDefault(r.index);
    });
  }

  /* ---- presenteren ---- */

  startPresentation() {
    if (!this.state.deck) return toast('Open eerst een presentatie.', true);
    if (this.presenter.active) return;
    this.presenter.start(this.state.currentIndex);
  }

  /** Opent de echte, standalone Reveal.js-presentatie (index.html van het deck) in een apart venster. */
  openStandalone() {
    const entry = this.state.deckMeta && this.state.deckMeta.entry;
    if (!entry || !entry.html) return toast('Deze presentatie heeft nog geen standalone pagina (nog niet opgeslagen/gebouwd).', true);
    const w = window.open(`../${entry.html.replace(/index\.html$/, '')}`, 'glr-standalone', 'popup=yes,width=1280,height=760');
    if (!w) toast('Pop-up geblokkeerd: sta pop-ups toe voor deze pagina.', true);
  }

  onPresentExit(flatIndex) {
    this.state.setCurrentIndex(flatIndex);
    this.preview.gotoSlide(this.state.currentIndex);
    this.preview.refreshSelection();
    this.updateEditorBar();
  }

  getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
  }

  setToken(token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* noop */ }
  }

  clearToken() {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* noop */ }
  }

  markSaved() {
    this.savedMarkdown = this.state.deck ? this.deckMarkdown() : null;
    if (this.state.deck) this.state.deck.slides.forEach((s) => { s.dirty = false; });
    this.renderStatus();
  }

  /** Huidige en gewenste locatie van het open deck (gewenst = uit cohort/leerjaar/slug-prefix). */
  locationInfo() {
    const meta = this.state.deckMeta;
    const fm = this.state.deck && this.state.deck.frontmatter;
    if (!meta || !meta.path || !fm) return null;
    const current = meta.path.replace(/\/[^/]*$/, '');
    const slug = current.split('/').pop();
    const target = deckFolder({ cohort: fm.get('cohort'), leerjaar: fm.get('leerjaar'), slug });
    return { current, target: target && target !== current ? target : null, source: meta.source };
  }

  /** Verplaatst het open deck naar de map die bij cohort/leerjaar hoort. */
  async moveDeckToTarget() {
    const info = this.locationInfo();
    if (!info || !info.target) return;
    const file = this.state.deckMeta.path.split('/').pop();
    const newPath = `${info.target}/${file}`;
    if (info.source === 'new') {
      this.state.deckMeta.path = newPath;
      if (this.el.deckpath) this.el.deckpath.textContent = newPath;
      this.panel.render();
      return toast(`Nieuwe locatie: ${newPath}`);
    }
    if (!(this.auth.mode === 'github' && this.auth.token)) {
      return toast('Verplaatsen kan alleen in GitHub-modus (log in met GitHub).', true);
    }
    if (!window.confirm(`Verplaats naar ${info.target}?\n\nDit maakt direct een commit op main en wijzigt de live-URL en PDF-naam van deze presentatie. Niet-opgeslagen wijzigingen worden meteen meegenomen.`)) return;
    const depth = deckDepth(`${info.target}/x`);
    try {
      await gh.connect(this.auth.token);
      const commitSha = await gh.moveDeck(
        `refactor: verplaats ${info.current.split('/').pop()} naar ${info.target} via GLR Slide Studio`,
        info.current,
        info.target,
        (rel, text) => (/\.html$/i.test(rel) ? rewriteShellPrefix(text, depth) : null),
        { slidesContent: this.deckMarkdown() },
      );
      this.state.deckMeta.path = newPath;
      this.markSaved();
      if (this.el.deckpath) this.el.deckpath.textContent = newPath;
      try {
        const u = new URL(window.location.href);
        u.searchParams.set('deck', newPath);
        window.history.replaceState(null, '', u);
      } catch { /* noop */ }
      const base = `../${info.target}/`;
      this.preview.setBaseUrl(base); this.sorter.baseUrl = base; setAssetBase(base);
      this.panel.render();
      toast(`Verplaatst naar ${info.target}`);
      this.deployPoller.start({ commitSha, liveUrl: gh.pagesUrl(newPath) });
    } catch (err) {
      toast(gh.describeGitHubError ? gh.describeGitHubError(err) : err.message, true);
    }
  }

  /** 1-klik opslaan: GitHub (main) of lokaal, afhankelijk van de modus. */
  async save() {
    if (!this.state.deck) return toast('Geen presentatie geopend.', true);
    const markdown = this.deckMarkdown();
    const path = (this.state.deckMeta && this.state.deckMeta.path) || 'presentations/nieuw/slides.md';

    if (this.auth.mode === 'github' && this.auth.token) {
      const label = path.split('/').slice(-2)[0] || path;
      try {
        await gh.connect(this.auth.token);
        const commitSha = await gh.commitFiles(`feat: update ${label} via GLR Slide Studio`, [{ path, content: markdown, encoding: 'utf-8' }]);
        this.markSaved();
        toast('Opgeslagen op GitHub (main)');
        this.deployPoller.start({ commitSha, liveUrl: gh.pagesUrl(path) });
      } catch (err) {
        const msg = gh.describeGitHubError(err);
        toast(msg, true);
        if (err.isPermission) {
          // Token opnieuw vragen; de presentatie en ongeopgeslagen wijzigingen blijven staan.
          this.logout();
          this.authGate.setError(msg);
        }
      }
      return;
    }

    if (this.dirHandle) {
      try {
        await writeFileToDir(this.dirHandle, path, markdown);
        this.markSaved();
        toast(`Lokaal opgeslagen: ${path}`);
      } catch (err) {
        toast(err.message, true);
      }
      return;
    }

    if (this.fileHandle) {
      try {
        await writeLocalFile(this.fileHandle, markdown);
        this.markSaved();
        toast(`Lokaal opgeslagen: ${this.state.deckMeta.path}`);
      } catch (err) {
        toast(err.message, true);
      }
      return;
    }

    this.downloadDeck();
    toast('Geen map gekoppeld — bestand gedownload.');
  }

  /** Secundaire actie: download het losse .md-bestand. */
  downloadDeck() {
    if (!this.state.deck) return toast('Geen presentatie geopend.', true);
    const path = (this.state.deckMeta && this.state.deckMeta.path) || 'slides.md';
    downloadText(path.split('/').pop() || 'slides.md', this.deckMarkdown());
  }






  /* -------------------------------------------------------- afbeelding */

  /** Opent de afbeelding-dialoog (upload of URL) en plaatst een <figure>. */
  openImageDialog(target = null) {
    if (!this.state.deck) return toast('Open eerst een presentatie.', true);
    showImageDialog({
      mode: 'insert',
      deckPath: this.deckPathForAssets(),
      loadMedia: () => loadMediaManifest(),
      upload: this.canUpload() ? (file) => this.uploadImageFile(file) : undefined,
      onPick: ({ src, alt, caption }) => this.insertFigure(src, caption, alt, target),
    });
  }

  /** Vervangt de afbeelding van het geselecteerde onderdeel (Properties Panel); Promise<{src, alt}|null>. */
  pickImage(current) {
    return new Promise((resolve) => {
      showImageDialog({
        mode: 'replace',
        current,
        deckPath: this.deckPathForAssets(),
        loadMedia: () => loadMediaManifest(),
        upload: this.canUpload() ? (file) => this.uploadImageFile(file) : undefined,
        onPick: (data) => resolve(data),
        onCancel: () => resolve(null),
      });
    });
  }

  deckPathForAssets() {
    const p = this.state.deckMeta && this.state.deckMeta.path;
    return p && p.startsWith('presentations/') ? p : '';
  }

  canUpload() {
    return (this.auth.mode === 'github' && !!this.auth.token) || !!this.dirHandle;
  }

  /** Sleep-resize op het canvas: dezelfde apply-route als het Breedte-veld (één undo-stap). */
  onImageResize(pct) {
    const sel = this.state.selection;
    const slide = this.state.currentSlide;
    if (!sel || !slide) return;
    const body = slide.body;
    const html = B.htmlAt(body, sel.blockIndex);
    const node = html != null ? T.nodeAt(T.parse(html), sel.path) : null;
    const field = node && describe(html, node).fields.find((f) => f.label === 'Breedte');
    if (!field) return;
    const out = field.apply(html, node, pct);
    this.transact({ label: 'Afbeeldingsbreedte aangepast', origin: 'toolbar' }, () => {
      if (out !== html) this.commitBody(B.setHtmlAt(body, sel.blockIndex, out), { origin: 'toolbar', label: 'Afbeeldingsbreedte aangepast' });
      else this.preview.updateSlide(this.state.currentIndex, slide);
    });
    this.panel && this.panel.render && this.panel.render();
  }

  /**
   * Plaatst een gekozen afbeelding. Met `target` ({ blockIndex, containerPath }) komt hij in dat
   * vak (kolom/kaart/rastercel); anders laagbewust t.o.v. de selectie, en als laatste redmiddel
   * als nieuw blok na de selectie.
   */
  insertFigure(src, caption, altText, target = null) {
    const alt = altText != null ? altText : (caption || '');
    const figureHtml = `<figure class="img-auto"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`
      + (caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : '')
      + '</figure>';
    const slide = this.state.currentSlide;
    if (!slide) return;
    const img = { src, alt, figureHtml };
    const placed = target
      ? B.insertImageInContainer(slide.body, target.blockIndex, target.containerPath, img)
      : B.insertImageIntoSelection(slide.body, this.state.selection, img);
    if (placed) {
      this.commitBody(placed.body, { origin: 'toolbar', label: 'Afbeelding toegevoegd', selection: placed.selection });
      toast(target || B.containerPathFor(B.htmlAt(placed.body, placed.selection.blockIndex) || '', placed.selection.path) ? 'Afbeelding in het vak geplaatst.' : 'Afbeelding toegevoegd.');
      return;
    }
    if (this.state.mode === 'visual') this.insertNodes({ type: 'htmlBlock', attrs: { html: figureHtml } }, 'Afbeelding toegevoegd');
    else {
      this._editorLabel = { label: 'Afbeelding toegevoegd' };
      this.editor.run((c) => c.insertContent({ type: 'htmlBlock', attrs: { html: figureHtml } }));
      this.onEditorChange();
    }
    toast('Afbeelding toegevoegd.');
  }

  /** Voegt iets toe IN een vak (kolom/kaart/rastercel): 'image' opent de mediakiezer, 'text' een tekstregel. */
  addToContainer(blockIndex, containerPath, kind) {
    const slide = this.state.currentSlide;
    if (!slide || !containerPath) return;
    if (kind === 'image') { this.openImageDialog({ blockIndex, containerPath }); return; }
    if (kind === 'text') {
      const r = B.appendToContainer(slide.body, blockIndex, containerPath, '<p class="body">Nieuwe tekst</p>');
      if (!r) return;
      this.panel.focusFieldAfterRender('Tekst');
      this.commitBody(r.body, { origin: 'toolbar', label: 'Tekst toegevoegd', selection: r.selection });
    }
  }

  /** Uploadt een afbeeldingsbestand naar shared/img/uploads/ (GitHub of lokaal). */
  async uploadImageFile(file) {
    const buffer = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    for (let i = 0; i < buffer.length; i += 1) binary += String.fromCharCode(buffer[i]);
    const base64 = btoa(binary);
    const safeName = `${Date.now()}-${file.name.replace(/[^\w.-]+/g, '-')}`;
    const publicPath = `/presentations/shared/img/uploads/${safeName}`;
    if (this.auth.mode === 'github' && this.auth.token) {
      await gh.connect(this.auth.token);
      try {
        await gh.commitFiles(`chore: upload ${safeName}`, [gh.uploadImageBase64(safeName, base64)]);
      } catch (err) {
        throw new Error(gh.describeGitHubError(err));
      }
    } else if (this.dirHandle) {
      await writeBlobToDir(this.dirHandle, `shared/img/uploads/${safeName}`, new Blob([buffer], { type: file.type }));
    } else {
      throw new Error('Geen bestemming: log in met GitHub of koppel een map.');
    }
    return publicPath;
  }

  /* ---------------------------------------------------------------- auth */

  /** Valideert een opgeslagen token (localStorage) en opent de Studio. */
  async initAuth() {
    // OAuth-fallback: Worker stuurde ons terug met #oauth_token=… — direct uit de URL wissen.
    const oauth = parseOAuthHash(location.hash);
    if (oauth.token || oauth.error) {
      history.replaceState(null, '', location.pathname + location.search + (oauth.rest ? `#${oauth.rest}` : ''));
      if (oauth.token) return this.handleOAuthToken(oauth.token);
      this.authGate.setError(`GitHub-login mislukt: ${oauth.error}`);
      this.authGate.show();
      return;
    }
    const token = this.getToken();
    if (token) {
      this.authGate.setToken(token);
      this.authGate.setLoading(true);
      try {
        const repo = await gh.validateToken(token);
        this.auth = { mode: 'github', token, repo: repo.full_name };
        this.authGate.hide();
        this.renderAccountMenu();
        this.setStatus(`Verbonden met GitHub (${repo.full_name}).`);
        return;
      } catch (err) {
        this.authGate.setLoading(false);
        this.authGate.setError(`Opgeslagen token ongeldig of geen toegang: ${err.message}. Voer een nieuw token in.`);
        this.authGate.show();
        return;
      }
    }
    this.authGate.show();
  }

  async handleLogin(token, remember) {
    const clean = (token || '').trim();
    if (!clean) return this.authGate.setError('Voer een GitHub Personal Access Token in.');
    this.authGate.setLoading(true);
    this.authGate.setError('');
    try {
      const repo = await gh.validateToken(clean);
      if (remember) this.setToken(clean); else this.clearToken();
      this.completeLogin(clean, repo);
    } catch (err) {
      this.authGate.setLoading(false);
      this.authGate.setError(err.message || 'Inloggen mislukt. Controleer het token en de repo-toegang.');
    }
  }

  /** Gedeeld succespad voor PAT- en OAuth-login. */
  completeLogin(token, repo) {
    this.auth = { mode: 'github', token, repo: repo.full_name };
    this.authGate.hide();
    this.renderAccountMenu();
    this.setStatus(`Verbonden met GitHub (${repo.full_name}).`);
    if (repo.permissions && repo.permissions.push === false) {
      toast('Token heeft alleen leesrechten — opslaan naar GitHub zal niet werken.', true);
    } else {
      toast(`Ingelogd op GitHub (${repo.full_name}).`);
    }
  }

  /** Opent de OAuth-popup; bij een geblokkeerde popup volgt een volledige redirect. */
  startGitHubLogin() {
    const url = this.studioConfig && this.studioConfig.oauthUrl;
    if (!url) return this.authGate.setError("GitHub-login is nog niet geconfigureerd (GLR_OAUTH_URL ontbreekt). Gebruik voorlopig 'Geavanceerd' onderaan.");
    this.authGate.setError('');
    const popup = window.open(loginUrl(url), 'glr-oauth', 'width=600,height=720');
    if (!popup) location.assign(loginUrl(url));
  }

  onOAuthMessage(event) {
    const url = this.studioConfig && this.studioConfig.oauthUrl;
    if (!isOAuthMessage(event, url)) return;
    if (event.data.type === 'glr-oauth-token') this.handleOAuthToken(event.data.token);
    else {
      this.authGate.setLoading(false);
      this.authGate.setError(`GitHub-login mislukt: ${event.data.error || 'onbekende fout'}`);
      this.authGate.show();
    }
  }

  async handleOAuthToken(token) {
    this.authGate.setLoading(true);
    this.authGate.setError('');
    this.authGate.show();
    try {
      const repo = await gh.validateToken(token);
      if (repo.permissions?.push === false) {
        throw new Error('Je GitHub-account heeft geen schrijfrechten op GLR-CSD/presentations.');
      }
      this.setToken(token);
      this.completeLogin(token, repo);
    } catch (err) {
      this.authGate.setLoading(false);
      this.authGate.setError(err.message || 'Inloggen met GitHub mislukt.');
    }
  }

  handleOffline() {
    this.auth = { mode: 'offline', token: '', repo: '' };
    this.authGate.hide();
    this.renderAccountMenu();
    this.setStatus('Offline modus — lokaal werken.');
    this.openDeckFromLocal();
  }

  logout() {
    this.clearToken();
    this.auth = { mode: 'none', token: '', repo: '' };
    this.authGate.setToken('');
    this.authGate.reset();
    this.authGate.show();
    this.renderAccountMenu();
    this.setStatus('Uitgelogd.');
  }

  renderAccountMenu() {
    const menu = this.el.accountMenu;
    if (!menu) return;
    menu.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'menu-head';
    head.textContent = this.auth.mode === 'github'
      ? `Verbonden · ${this.auth.repo || 'GitHub'}`
      : (this.auth.mode === 'offline' ? 'Offline modus' : 'Niet ingelogd');
    menu.appendChild(head);

    const item = (label, iconName, fn) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'menu-item';
      b.innerHTML = `<span class="menu-item__ic">${icon(iconName, 15)}</span><span>${label}</span>`;
      b.addEventListener('click', () => {
        document.querySelectorAll('.dropdown').forEach((d) => d.classList.remove('is-open'));
        fn();
      });
      menu.appendChild(b);
    };

    if (this.auth.mode === 'github') {
      item('Afbeelding uploaden…', 'upload', () => this.openImageDialog());
      item('Laden vanaf GitHub…', 'cloud', () => this.openDeckFromGithub());
      item('Map koppelen (offline opslaan)…', 'folder', () => this.pickDir());
      item('Uitloggen', 'logout', () => this.logout());
    } else if (this.auth.mode === 'offline') {
      item('Online inloggen (GitHub)…', 'key', () => this.authGate.show());
      item('Lokale .md openen…', 'file-text', () => this.openDeckFromLocal());
      item('Map koppelen…', 'folder', () => this.pickDir());
      item('Afbeelding uploaden…', 'upload', () => this.openImageDialog());
    } else {
      item('Inloggen (GitHub)…', 'key', () => this.authGate.show());
      item('Offline werken…', 'wifi-off', () => this.handleOffline());
    }
  }
}

/* --------------------------------------------------------------- bootstrap */

function boot() {
  const studio = new Studio();
  window.glrStudio = studio;
  studio.init().then(() => {
    const params = new URLSearchParams(location.search);
    const wanted = params.get('deck');
    if (wanted) {
      const entry = studio.manifest.presentations.find((p) => p.md && (p.md === wanted || p.md.endsWith(wanted)));
      if (entry) studio.openDeckFromManifest(entry);
    }
  }).catch((err) => {
    console.error(err);
    toast(err.message, true);
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

