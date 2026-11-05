/**
 * SlideSorter — linker navigator (zoals PowerPoint/Google Slides) met
 * drag-and-drop herordening via SortableJS. Verticale slides (`--`) worden
 * ingesprongen weergegeven.
 */
import Sortable from 'sortablejs';
import { renderSlideBody, slideAttrsToHtml } from '../markdown/render.js';
import { icon } from '../ui/icons.js';

/** Snelkeuze voor nieuwe slides in de Slide Sorter. */
const SLIDE_TYPES = [
  { kind: 'standard', label: 'Standaard Slide', hint: '---' },
  { kind: 'title', label: 'Titelslide', hint: 'class="bleed dark"' },
  { kind: 'columns', label: 'Twee Kolommen Slide', hint: '.glr-columns' },
  { kind: 'sub', label: 'Sub-slide eronder', hint: '--' },
];

export class SlideSorter {
  constructor(container, { onSelect, onReorder, onAdd, onDelete, onDuplicate }) {
    this.container = container;
    this.onSelect = onSelect;
    this.onReorder = onReorder;
    this.onAdd = onAdd;
    this.onDelete = onDelete;
    this.onDuplicate = onDuplicate;
    this.deck = null;
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
      inner.innerHTML = `<section ${slideAttrsToHtml(slide)}>${renderSlideBody(slide.body)}</section>`;
      thumb.appendChild(inner);

      const actions = document.createElement('div');
      actions.className = 'sorter-actions';
      actions.append(
        this._actionBtn('Dupliceren', 'copy', () => this.onDuplicate && this.onDuplicate(i)),
        this._actionBtn('Nieuwe slide hierna', 'corner-down-right', () => this.onAdd && this.onAdd(i + 1, 'standard')),
        this._actionBtn('Verwijderen', 'trash', () => this.onDelete && this.onDelete(i), true),
      );

      li.append(num, thumb, actions);
      li.addEventListener('click', () => this.onSelect && this.onSelect(i));
      this.list.appendChild(li);
    });
    this._fitThumbs();
    this._syncThumbScale();
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

  /** Snelkeuze-menu met de vier slide-types, verankerd aan `anchor`. */
  _openTypeMenu(anchor, insertIndex) {
    const menu = document.createElement('div');
    menu.className = 'sorter-context sorter-context--types';
    const head = document.createElement('div');
    head.className = 'sorter-context__head';
    head.textContent = 'Nieuw slide-type';
    menu.appendChild(head);
    const iconFor = { standard: 'file-text', title: 'heading', columns: 'columns', sub: 'corner-down-right' };
    for (const type of SLIDE_TYPES) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sorter-context__item';
      b.innerHTML = `<span class="sorter-context__ic">${icon(iconFor[type.kind] || 'file-text', 15)}</span>`
        + `<span class="sorter-context__label">${type.label}</span>`
        + `<span class="sorter-context__hint">${type.hint}</span>`;
      b.addEventListener('click', () => {
        menu.remove();
        if (this.onAdd) this.onAdd(insertIndex, type.kind);
      });
      menu.appendChild(b);
    }
    document.body.appendChild(menu);
    const r = anchor.getBoundingClientRect();
    menu.style.top = `${Math.min(r.bottom + 4, window.innerHeight - 220)}px`;
    menu.style.left = `${Math.min(r.left, window.innerWidth - 260)}px`;
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
