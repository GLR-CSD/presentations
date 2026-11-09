/**
 * Sleep-handvatten op het canvas om de breedte van een afbeelding (figure) te wijzigen.
 *
 * Overlay in dezelfde positioneringscontext als de QuickBar. Tijdens het slepen wordt
 * alleen de live-DOM aangepast (`--img-w`); bij loslaten volgt precies één `onCommit(pct)`,
 * zodat er één undo-stap ontstaat. Breedte-% = figuurbreedte / inhoudsbreedte van de ouder
 * (de Reveal-schaal valt weg: beide maten zijn schermpixels).
 */
const HANDLES = [
  ['nw', -1], ['ne', 1], ['sw', -1], ['se', 1], ['w', -1], ['e', 1],
];
const SNAPS = [25, 50, 75, 100];
const SNAP_RANGE = 2;

export class ResizeHandles {
  /**
   * @param {HTMLElement} host  positioneringscontext (position: relative)
   * @param {{ onCommit: (pct:number)=>void, onDragChange?: (dragging:boolean)=>void }} cb
   */
  constructor(host, cb) {
    this.host = host;
    this.cb = cb;
    this.target = null;
    this.drag = null;
    this.el = document.createElement('div');
    this.el.className = 'resize-handles';
    this.el.hidden = true;
    this.badge = document.createElement('span');
    this.badge.className = 'resize-handles__badge';
    this.badge.hidden = true;
    this.el.appendChild(this.badge);
    this.nodes = {};
    for (const [id, dir] of HANDLES) {
      const n = document.createElement('span');
      n.className = `resize-handle resize-handle--${id}`;
      n.dataset.dir = String(dir);
      n.setAttribute('aria-hidden', 'true');
      n.addEventListener('pointerdown', (e) => this._start(e, dir));
      n.addEventListener('pointermove', (e) => this._move(e));
      n.addEventListener('pointerup', (e) => this._end(e, true));
      n.addEventListener('pointercancel', (e) => this._end(e, false));
      this.el.appendChild(n);
      this.nodes[id] = n;
    }
    host.appendChild(this.el);
  }

  /** Alleen losse figuren met een <img> (geen bleed/shot/strook) zijn schaalbaar. */
  static canResize(el) {
    return !!el && el.tagName === 'FIGURE' && !!el.querySelector('img')
      && !el.matches('.bleed-img, .shotwrap, .strip-wrap, .shot');
  }

  show(el) {
    if (!ResizeHandles.canResize(el)) return this.hide();
    this.target = el;
    this.el.hidden = false;
    this.reposition();
  }

  hide() {
    if (this.drag) return; // tijdens slepen niet verbergen
    this.target = null;
    this.el.hidden = true;
  }

  reposition() {
    if (!this.target || this.el.hidden) return;
    const r = this.target.getBoundingClientRect();
    const h = this.host.getBoundingClientRect();
    this.el.style.left = `${r.left - h.left + (this.host.scrollLeft || 0)}px`;
    this.el.style.top = `${r.top - h.top + (this.host.scrollTop || 0)}px`;
    this.el.style.width = `${r.width}px`;
    this.el.style.height = `${r.height}px`;
  }

  _parentWidth(el) {
    const p = el.parentElement;
    const cs = getComputedStyle(p);
    const scale = el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1;
    const inner = p.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
    return Math.max(1, inner * scale);
  }

  _start(e, dir) {
    if (!this.target || e.button > 0) return;
    e.preventDefault();
    e.stopPropagation();
    const el = this.target;
    e.currentTarget.setPointerCapture(e.pointerId);
    this.drag = {
      el, dir, startX: e.clientX, startW: el.getBoundingClientRect().width,
      parentW: this._parentWidth(el), pct: null,
      hadAuto: el.classList.contains('img-auto'),
    };
    el.classList.add('img-auto');
    if (this.cb.onDragChange) this.cb.onDragChange(true);
  }

  _move(e) {
    const d = this.drag;
    if (!d) return;
    const dx = (e.clientX - d.startX) * d.dir;
    let pct = ((d.startW + dx) / d.parentW) * 100;
    pct = Math.min(100, Math.max(10, pct));
    if (!e.shiftKey) {
      const hit = SNAPS.find((s) => Math.abs(s - pct) <= SNAP_RANGE);
      if (hit) pct = hit;
    }
    pct = Math.round(pct);
    d.pct = pct;
    d.el.style.setProperty('--img-w', `${pct}%`);
    this.badge.textContent = `${pct}%`;
    this.badge.hidden = false;
    this.reposition();
  }

  _end(e, commit) {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    this.badge.hidden = true;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* al losgelaten */ }
    if (this.cb.onDragChange) this.cb.onDragChange(false);
    if (commit && d.pct != null) this.cb.onCommit(d.pct);
    else {
      // geannuleerd: live-wijziging terugdraaien
      d.el.style.removeProperty('--img-w');
      if (!d.hadAuto) d.el.classList.remove('img-auto');
      this.reposition();
    }
  }
}
