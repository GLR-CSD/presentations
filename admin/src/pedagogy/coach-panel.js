/**
 * UI van de Didactische Coach: inklapbare sectie onderaan het Properties Panel.
 *
 * Vrijblijvend: elke tip is weg te klikken (alleen voor deze slide en deze
 * sessie), acties doen nooit iets zonder klik, en na elke actie is er
 * "Ongedaan maken".
 */
import { analyzeSlide } from './coach.js';
import { h } from '../ui/form-kit.js';
import { escapeHtml } from '../ui/util.js';

const OPEN_KEY = 'glr-coach-open';
const dismissed = new WeakMap(); // slide → Set(tip-id)
let lastUndo = null; // { slide, body, note, gap2, label }

function readOpen() {
  try { return localStorage.getItem(OPEN_KEY) !== '0'; } catch { return true; }
}
function writeOpen(open) {
  try { localStorage.setItem(OPEN_KEY, open ? '1' : '0'); } catch { /* geen opslag beschikbaar */ }
}
const isDismissed = (slide, id) => (dismissed.get(slide) || new Set()).has(id);
function dismiss(slide, id) {
  if (!dismissed.has(slide)) dismissed.set(slide, new Set());
  dismissed.get(slide).add(id);
}

/**
 * @param {HTMLElement} host
 * @param {{ state: object, applyCoach: Function, restoreCoach: Function, rerender: Function }} api
 */
export function renderCoach(host, api) {
  const slide = api.state.currentSlide;
  if (!slide) return;
  const tips = analyzeSlide(slide, api.state.selection).filter((t) => !isDismissed(slide, t.id));
  const active = tips.filter((t) => !t.quiet).length;

  const box = h('details', 'pp-coach');
  box.open = readOpen();
  box.addEventListener('toggle', () => writeOpen(box.open));
  const sum = h('summary', 'pp-coach__sum', '<span>💡 Didactische Tips &amp; Handigheidjes</span>');
  if (active) sum.appendChild(h('span', 'pp-coach__count', String(active)));
  box.appendChild(sum);

  const inner = h('div', 'pp-coach__body');

  if (lastUndo && lastUndo.slide === slide) {
    const bar = h('div', 'pp-coach__undo', `<span>Uitgevoerd: ${escapeHtml(lastUndo.label)}</span>`);
    const undo = h('button', 'pp-coach__btn', '↶ Ongedaan maken');
    undo.type = 'button';
    undo.addEventListener('click', () => {
      const snap = lastUndo;
      lastUndo = null;
      api.restoreCoach(snap);
    });
    bar.appendChild(undo);
    inner.appendChild(bar);
  }

  for (const tip of tips) {
    const card = h('div', `pp-tip${tip.quiet ? ' pp-tip--quiet' : ''}`);
    const head = h('div', 'pp-tip__head');
    head.appendChild(h('span', 'pp-tip__principle', escapeHtml(tip.principle)));
    const x = h('button', 'pp-tip__x', '×');
    x.type = 'button';
    x.title = 'Verberg deze tip voor deze slide';
    x.setAttribute('aria-label', 'Verberg deze tip');
    x.addEventListener('click', () => { dismiss(slide, tip.id); api.rerender(); });
    head.appendChild(x);
    card.appendChild(head);
    card.appendChild(h('p', 'pp-tip__title', escapeHtml(tip.title)));
    card.appendChild(h('p', 'pp-tip__text', escapeHtml(tip.text)));
    for (const action of tip.actions) {
      const b = h('button', `pp-coach__btn${action.primary ? ' pp-coach__btn--primary' : ''}`, escapeHtml(action.label));
      b.type = 'button';
      b.addEventListener('click', () => {
        const before = { slide, body: slide.body, note: slide.note, gap2: slide.gap2, label: action.label };
        const result = action.run(slide.body, slide.noteText);
        lastUndo = before;
        api.applyCoach(result);
      });
      card.appendChild(b);
    }
    if (tip.hint) card.appendChild(h('p', 'pp-tip__hint', escapeHtml(tip.hint)));
    inner.appendChild(card);
  }

  if (!tips.length) inner.appendChild(h('p', 'pp-coach__empty', 'Geen tips voor deze slide 👍'));
  inner.appendChild(h('p', 'pp-coach__foot', 'Alle tips zijn suggesties. Wijk er gerust van af.'));
  box.appendChild(inner);
  host.appendChild(box);
}
