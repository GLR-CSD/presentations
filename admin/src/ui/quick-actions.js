/**
 * Zwevende Quick-Action balk boven het geselecteerde onderdeel (canvas én editor).
 * Vijf directe icoonknoppen: ↑ Omhoog, ↓ Omlaag, ✨ Animatiestap, ⧉ Dupliceer, 🗑 Verwijder.
 */
import { icon } from './icons.js';

const ACTIONS = [
  ['up', 'arrow-up', 'Omhoog', 'Verplaats dit blok één plek omhoog'],
  ['down', 'arrow-down', 'Omlaag', 'Verplaats dit blok één plek omlaag'],
  ['fragment', 'sparkles', 'Animatiestap (Fragment)', 'Toon dit blok pas na een klik tijdens de presentatie'],
  ['duplicate', 'copy', 'Dupliceer blok', 'Maak een kopie van dit blok'],
  ['delete', 'trash', 'Verwijder blok', 'Verwijder dit blok'],
];

export class QuickBar {
  /**
   * @param {HTMLElement} host  positioneringscontext (position: relative)
   * @param {(action:string)=>void} onAction
   */
  constructor(host, onAction) {
    this.host = host;
    this.el = document.createElement('div');
    this.el.className = 'quickbar';
    this.el.hidden = true;
    this.el.setAttribute('role', 'toolbar');
    this.el.setAttribute('aria-label', 'Snelle acties voor dit blok');
    this.buttons = {};
    for (const [id, ic, label, hint] of ACTIONS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `quickbar__btn${id === 'delete' ? ' quickbar__btn--danger' : ''}`;
      b.innerHTML = icon(ic, 15);
      b.title = `${label} — ${hint}`;
      b.setAttribute('aria-label', label);
      b.addEventListener('mousedown', (e) => e.preventDefault());
      b.addEventListener('click', (e) => { e.stopPropagation(); onAction(id); });
      this.el.appendChild(b);
      this.buttons[id] = b;
    }
    host.appendChild(this.el);
  }

  /** Toont de balk boven `rect` (viewport-coördinaten). */
  show(rect, { fragmentOn = false, fragmentEnabled = true, canMoveUp = true, canMoveDown = true } = {}) {
    if (!rect) return this.hide();
    this.buttons.fragment.classList.toggle('is-active', !!fragmentOn);
    this.buttons.fragment.setAttribute('aria-pressed', fragmentOn ? 'true' : 'false');
    this.buttons.fragment.disabled = !fragmentEnabled;
    this.buttons.up.disabled = !canMoveUp;
    this.buttons.down.disabled = !canMoveDown;
    this.el.hidden = false;
    const hostRect = this.host.getBoundingClientRect();
    const w = this.el.offsetWidth || 190;
    const h = this.el.offsetHeight || 34;
    let top = rect.top - hostRect.top - h - 10;
    if (top < 4) top = rect.bottom - hostRect.top + 10;
    top = Math.max(4, Math.min(top, hostRect.height - h - 4));
    let left = rect.left - hostRect.left;
    left = Math.max(4, Math.min(left, hostRect.width - w - 4));
    this.el.style.top = `${top + (this.host.scrollTop || 0)}px`;
    this.el.style.left = `${left + (this.host.scrollLeft || 0)}px`;
  }

  hide() {
    this.el.hidden = true;
  }
}
