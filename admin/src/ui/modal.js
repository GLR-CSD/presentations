/**
 * Modal-helper voor de GLR Slide Studio: een nette backdrop + dialoogvenster
 * met kop, sluitknop en body. Esc en klik-buiten sluiten de modal.
 */
import { icon } from './icons.js';

/**
 * @param {{ title?: string, subtitle?: string, size?: 'sm'|'md'|'lg'|'xl', onClose?: Function }} opts
 * @returns {{ el: HTMLElement, body: HTMLElement, head: HTMLElement, close: Function, setTitle: Function, setSubtitle: Function }}
 */
export function openModal({ title = '', subtitle = '', size = 'md', onClose } = {}) {
  const root = document.getElementById('modal-root') || document.body;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const dialog = document.createElement('div');
  dialog.className = `modal modal--${size}`;
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  if (title) dialog.setAttribute('aria-label', title);

  const head = document.createElement('header');
  head.className = 'modal__head';
  const titles = document.createElement('div');
  titles.className = 'modal__titles';
  const titleEl = document.createElement('h2');
  titleEl.className = 'modal__title';
  titleEl.textContent = title;
  const subtitleEl = document.createElement('p');
  subtitleEl.className = 'modal__subtitle';
  subtitleEl.textContent = subtitle;
  titles.append(titleEl);
  if (subtitle) titles.append(subtitleEl);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'modal__close';
  closeBtn.setAttribute('aria-label', 'Sluiten');
  closeBtn.innerHTML = icon('x', 18);
  head.append(titles, closeBtn);

  const body = document.createElement('div');
  body.className = 'modal__body';

  dialog.append(head, body);
  backdrop.append(dialog);
  root.append(backdrop);

  const api = {
    el: dialog,
    body,
    head,
    close() {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
      if (onClose) onClose();
    },
    setTitle(text) { titleEl.textContent = text; },
    setSubtitle(text) { subtitleEl.textContent = text; subtitleEl.hidden = !text; },
  };

  const onKey = (event) => { if (event.key === 'Escape') api.close(); };
  document.addEventListener('keydown', onKey);
  closeBtn.addEventListener('click', () => api.close());
  backdrop.addEventListener('mousedown', (event) => { if (event.target === backdrop) api.close(); });

  return api;
}
