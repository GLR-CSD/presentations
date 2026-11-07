/**
 * Globale, selectie-bewuste Undo/Redo voor de GLR Slide Studio.
 *
 * Een snapshot is de volledige `serializeDeck(deck)` plus de view-toestand
 * (slide-index en geselecteerd blok). Herstellen = `parseDeck(markdown)`;
 * dankzij de verliesvrije roundtrip is dat byte-identiek.
 *
 * DOM-vrij, zodat het in Node getest kan worden.
 */
import { serializeDeck } from '../state/deck.js';
import * as B from '../blocks/block-ops.js';
import * as T from '../blocks/html-tree.js';

/** Origins waarvan wijzigingen samensmelten (typen). */
export const TYPING_ORIGINS = new Set(['form-input', 'inline-canvas', 'editor', 'source']);

const cloneSel = (sel) => (sel ? JSON.parse(JSON.stringify(sel)) : null);

export function makeSnapshot(deck, slideIndex, selection, { label = '', coalesceKey = null, timestamp = Date.now() } = {}) {
  return {
    markdown: serializeDeck(deck),
    slideIndex,
    selection: cloneSel(selection),
    label,
    timestamp,
    coalesceKey,
  };
}

/** Geeft de selectie terug als blok en pad nog bestaan, anders null. */
export function validSelection(deck, slideIndex, sel) {
  if (!deck || !sel) return null;
  const slide = deck.slides[slideIndex];
  if (!slide) return null;
  if (sel.blockIndex == null || sel.blockIndex >= B.blockCount(slide.body)) return null;
  const html = B.htmlAt(slide.body, sel.blockIndex);
  if (html != null && sel.path && sel.path.length && !T.nodeAt(T.parse(html), sel.path)) return null;
  return cloneSel(sel);
}

export class HistoryManager {
  constructor({ limit = 100, coalesceMs = 800, now = Date.now, onChange = null } = {}) {
    this.limit = limit;
    this.coalesceMs = coalesceMs;
    this.now = now;
    this.onChange = onChange;
    this.past = [];
    this.future = [];
    this.present = null;
  }

  /** Nieuw deck geopend: begin met een schone geschiedenis. */
  reset(snap) {
    this.past = [];
    this.future = [];
    this.present = snap ? { ...snap, coalesceKey: null } : null;
    this._notify();
  }

  /**
   * Legt de nieuwe toestand vast (aanroepen NA de wijziging).
   * @returns {boolean} true als er iets is vastgelegd of samengevoegd
   */
  record(snap, { label = '', origin = 'action', coalesceKey = null } = {}) {
    if (!this.present) { this.reset(snap); return false; }
    if (snap.markdown === this.present.markdown) {
      this.updateView(snap);
      return false;
    }
    const t = this.now();
    const typing = TYPING_ORIGINS.has(origin) && coalesceKey != null;
    if (typing && this.present.coalesceKey === coalesceKey && this.past.length && t - this.present.timestamp <= this.coalesceMs) {
      this.present = { ...snap, label: this.present.label, timestamp: t, coalesceKey };
      this.future = [];
      this._notify();
      return true;
    }
    this.past.push(this.present);
    if (this.past.length > this.limit) this.past.shift();
    this.present = { ...snap, label, timestamp: t, coalesceKey: typing ? coalesceKey : null };
    this.future = [];
    this._notify();
    return true;
  }

  /**
   * Alleen de view (slide/selectie) van de huidige stap bijwerken. Een andere
   * slide of een ander blok/pad verbreekt de coalescing; kleine selectie-
   * aanpassingen (highlight, openItem) niet, zodat typen blijft samensmelten.
   */
  updateView({ slideIndex, selection }) {
    if (!this.present) return;
    const a = this.present.selection;
    const b = selection || null;
    const same = this.present.slideIndex === slideIndex
      && ((!a && !b) || (a && b && a.blockIndex === b.blockIndex && JSON.stringify(a.path || []) === JSON.stringify(b.path || [])));
    this.present.slideIndex = slideIndex;
    this.present.selection = cloneSel(selection);
    if (!same) this.breakCoalesce();
  }

  breakCoalesce() {
    if (this.present) this.present.coalesceKey = null;
  }

  get canUndo() { return this.past.length > 0; }
  get canRedo() { return this.future.length > 0; }
  get undoLabel() { return this.canUndo ? this.present.label : ''; }
  get redoLabel() { return this.canRedo ? this.future[this.future.length - 1].label : ''; }

  /**
   * Stap terug. De vorige snapshot draagt de view (slide/selectie) zoals die
   * was vlak vóór de wijziging (via updateView bijgehouden): zo is na het
   * ongedaan maken van "Blok verwijderd" hetzelfde blok weer geselecteerd.
   */
  undo() {
    if (!this.canUndo) return null;
    const prev = this.past.pop();
    this.future.push(this.present);
    this.present = { ...prev, coalesceKey: null };
    this._notify();
    return { ...this.present, selection: cloneSel(this.present.selection) };
  }

  redo() {
    if (!this.canRedo) return null;
    const next = this.future.pop();
    this.past.push(this.present);
    this.present = { ...next, coalesceKey: null };
    this._notify();
    return { ...this.present };
  }

  _notify() {
    if (this.onChange) this.onChange(this);
  }
}
