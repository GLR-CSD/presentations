/**
 * App-state van de GLR Slide Studio: het geladen deck, de actieve slide-index,
 * de opslaglocatie en een simpele event-bus. UI-modules abonneren zich op
 * events en renderen opnieuw.
 */
export class StudioState {
  constructor() {
    this.deck = null;
    this.deckMeta = null; // { source: 'github'|'local'|'manifest', path, sha, baseUrl }
    this.currentIndex = 0;
    this.mode = 'visual'; // 'visual' | 'split' | 'source'
    this.listeners = new Map();
  }

  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(fn);
    return () => this.listeners.get(event).delete(fn);
  }

  emit(event, payload) {
    for (const fn of this.listeners.get(event) || []) fn(payload);
  }

  setDeck(deck, meta) {
    this.deck = deck;
    this.deckMeta = meta || null;
    this.currentIndex = 0;
    this.emit('deck', deck);
    this.emit('slide', 0);
  }

  setCurrentIndex(index) {
    if (!this.deck) return;
    const clamped = Math.max(0, Math.min(index, this.deck.slides.length - 1));
    if (clamped === this.currentIndex) return;
    this.currentIndex = clamped;
    this.emit('slide', clamped);
  }

  get currentSlide() {
    return this.deck ? this.deck.slides[this.currentIndex] : null;
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.emit('mode', mode);
  }

  markDirty() {
    this.emit('dirty', true);
  }
}
