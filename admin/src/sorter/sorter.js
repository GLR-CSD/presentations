/**
 * SlideSorter — linker navigator (zoals PowerPoint/Google Slides) met
 * drag-and-drop herordening via SortableJS. Verticale slides (`--`) worden
 * ingesprongen weergegeven.
 */
import Sortable from 'sortablejs';
import { renderSlideBody, slideAttrsToHtml, resolveAssets } from '../markdown/render.js';
import { icon } from '../ui/icons.js';

import { SLIDE_TEMPLATES } from '../blocks/templates.js';
import { classifySlide, deckBalance } from '../pedagogy/phases.js';

export class SlideSorter {
  constructor(container, { onSelect, onReorder, onAdd, onDelete, onDuplicate }) {
    this.container = container;
    this.onSelect = onSelect;
    this.onReorder = onReorder;
    this.onAdd = onAdd;
    this.onDelete = onDelete;
    this.onDuplicate = onDuplicate;
    this.deck = null;
    this.baseUrl = '';
    this.currentIndex = 0;

    // Kop met prominente "+ Nieuwe Slide"-knop.
    this.header = document.createElement('div');
    this.header.className = 'sorter-head';
    this.headerBtn = document.createElement('button');
    this.headerBtn.type = 'button';
    this.headerBtn.className = 'sorter-add-btn';
    this.headerBtn.innerHTML = `${icon('plus', 16)}<span>Nieuwe Slide</span>${icon('chevron-down', 14)}`;
    this.headerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._openTypeMenu(this.headerBtn, this.currentIndex + 1);
    });
    this.header.append(this.headerBtn);
    this.container.appendChild(this.header);

    // Subtiele balans-indicator: theorie ↔ interactie/opdracht in het hele deck.
    this.balance = document.createElement('div');
    this.balance.className = 'sorter-balance';
    this.container.appendChild(this.balance);

    this.list = document.createElement('ul');
    this.list.className = 'sorter-list';
    this.container.appendChild(this.list);

    // Onderaan een grote klikbare "+ Slide toevoegen"-kaart.
    this.footer = document.createElement('button');
    this.footer.type = 'button';
    this.footer.className = 'sorter-add-card';
    this.footer.innerHTML = `${icon('plus', 22)}<span>Slide toevoegen</span>`;
    this.footer.addEventListener('click', (e) => {
      e.stopPropagation();
      const at = this.deck ? this.deck.slides.length : 0;
      this._openTypeMenu(this.footer, at);
    });
    this.container.appendChild(this.footer);

    this.sortable = Sortable.create(this.list, {
      animation: 150,
      handle: '.sorter-item',
      ghostClass: 'sorter-ghost',
      onEnd: (evt) => {
        if (evt.oldIndex !== evt.newIndex && this.onReorder) this.onReorder(evt.oldIndex, evt.newIndex);
      },
    });
  }

  render(deck, currentIndex) {
    this.deck = deck;
    this.currentIndex = currentIndex;
    this.list.innerHTML = '';
    deck.slides.forEach((slide, i) => {
      const li = document.createElement('li');
      li.className = 'sorter-item' + (i === currentIndex ? ' is-active' : '');
      li.dataset.index = String(i);
      if (slide.kind === 'vertical') li.classList.add('is-vertical');

      const num = document.createElement('span');
      num.className = 'sorter-num';
      num.textContent = String(i + 1).padStart(2, '0');

      const thumb = document.createElement('div');
      thumb.className = 'sorter-thumb';
      const inner = document.createElement('div');
      inner.className = 'sorter-thumb__inner';
      inner.setAttribute('style', 'width:1280px;height:720px;transform-origin:top left;');
      inner.innerHTML = resolveAssets(`<section ${slideAttrsToHtml(slide)}>${renderSlideBody(slide.body)}</section>`, this.baseUrl);
      thumb.appendChild(inner);

      const actions = document.createElement('div');
      actions.className = 'sorter-actions';
      actions.append(
        this._actionBtn('Dupliceren', 'copy', () => this.onDuplicate && this.onDuplicate(i)),
        this._actionBtn('Nieuwe slide hierna', 'corner-down-right', () => this.onAdd && this.onAdd(i + 1, 'standard')),
        this._actionBtn('Verwijderen', 'trash', () => this.onDelete && this.onDelete(i), true),
      );

      const phase = document.createElement('span');
      phase.className = 'sorter-phase';
      this._setPhase(phase, slide);
      thumb.appendChild(phase);

      li.append(num, thumb, actions);
      li.addEventListener('click', () => this.onSelect && this.onSelect(i));
      this.list.appendChild(li);
    });
    this._fitThumbs();
    this._syncThumbScale();
    this._renderBalance();
  }

  /** Werkt de fase-badge van één slide en de balans-indicator bij (na een bewerking). */
  refreshMeta(index) {
    if (!this.deck) return;
    const li = this.list.children[index];
    const badge = li && li.querySelector('.sorter-phase');
    if (badge && this.deck.slides[index]) this._setPhase(badge, this.deck.slides[index]);
    this._renderBalance();
  }

  _setPhase(el, slide) {
    const p = classifySlide(slide);
    el.className = `sorter-phase sorter-phase--${p.id}`;
    el.textContent = p.label;
    el.title = `Herkende fase: ${p.label} (alleen een indicatie)`;
  }

  _renderBalance() {
    const b = deckBalance(this.deck ? this.deck.slides : []);
    this.balance.hidden = !b.total;
    if (!b.total) return;
    this.balance.title = 'Verhouding theorie (Theorie + Code) ↔ interactie (Opdracht + Check). '
      + 'Vuistregel uit de skills: elke ~5 inhoudelijke slides een actieve opdracht of check-in. Alleen een indicatie.';
    this.balance.classList.toggle('is-low', b.lowInteraction);
    this.balance.innerHTML = `<div class="sorter-balance__bar" aria-hidden="true">`
      + `<span class="sorter-balance__theory" style="width:${b.theoryPct}%"></span>`
      + `<span class="sorter-balance__interaction" style="width:${b.interactionPct}%"></span></div>`
      + `<div class="sorter-balance__label"><span>Theorie ${b.theoryPct}%</span><span>Interactie ${b.interactionPct}%</span></div>`
      + (b.lowInteraction ? '<div class="sorter-balance__hint">Tip: voeg een opdracht of begripscheck toe.</div>' : '');
  }

  setActive(index) {
    this.currentIndex = index;
    [...this.list.children].forEach((li, i) => li.classList.toggle('is-active', i === index));
  }

  _actionBtn(title, iconName, onClick, danger = false) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `sorter-action${danger ? ' sorter-action--danger' : ''}`;
    b.title = title;
    b.setAttribute('aria-label', title);
    b.innerHTML = icon(iconName, 14);
    b.addEventListener('click', (e) => { e.stopPropagation(); onClick(); });
    return b;
  }

  /** Template-kiezer: 9 didactische slide-types (3x3) als tegels met icoon. */
  _openTypeMenu(anchor, insertIndex) {
    document.querySelectorAll('.sorter-context--types').forEach((m) => m.remove());
    const menu = document.createElement('div');
    menu.className = 'sorter-context sorter-context--types';
    const head = document.createElement('div');
    head.className = 'sorter-context__head';
    head.textContent = 'Kies een slide-type';
    menu.appendChild(head);
    const grid = document.createElement('div');
    grid.className = 'tpl-grid';
    for (const tpl of SLIDE_TEMPLATES) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tpl-tile';
      b.innerHTML = `<span class="tpl-tile__ic">${icon(tpl.icon, 22)}</span>`
        + `<span class="tpl-tile__label">${tpl.label}</span>`
        + `<span class="tpl-tile__hint">${tpl.hint}</span>`;
      b.addEventListener('click', () => {
        menu.remove();
        if (this.onAdd) this.onAdd(insertIndex, tpl.kind);
      });
      grid.appendChild(b);
    }
    menu.appendChild(grid);
    const sub = document.createElement('button');
    sub.type = 'button';
    sub.className = 'tpl-sub';
    sub.innerHTML = `${icon('corner-down-right', 14)}<span>Sub-slide eronder (verticaal)</span>`;
    sub.addEventListener('click', () => { menu.remove(); if (this.onAdd) this.onAdd(insertIndex, 'sub'); });
    menu.appendChild(sub);
    document.body.appendChild(menu);
    const r = anchor.getBoundingClientRect();
    const mw = menu.offsetWidth || 560;
    const mh = menu.offsetHeight || 360;
    menu.style.top = `${Math.max(8, Math.min(r.bottom + 4, window.innerHeight - mh - 8))}px`;
    menu.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - mw - 8))}px`;
    const close = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 0);
  }

  _fitThumbs() {
    // De miniaturen zijn 1280x720; schaal ze naar de thumb-breedte.
    requestAnimationFrame(() => {
      for (const thumb of this.list.querySelectorAll('.sorter-thumb')) {
        const w = thumb.clientWidth || 150;
        const inner = thumb.querySelector('.sorter-thumb__inner');
        if (inner) inner.style.transform = `scale(${w / 1280})`;
      }
    });
  }

  _syncThumbScale() {
    this._fitThumbs();
  }
}
