/**
 * "Afbeelding toevoegen"-dialoog.
 *
 * De docent kiest een bestand vanaf de computer (wordt in de upload-queue voor
 * `shared/img/uploads/` gezet) of vult een URL/pad in, plus een bijschrift.
 * De Studio plaatst daarna een `<figure><img …><figcaption>…</figcaption></figure>`.
 */
import { openModal } from './modal.js';
import { icon } from './icons.js';

/**
 * @param {{ upload?: (file: File) => Promise<string>, onInsert: (data: { src: string, caption: string }) => void }} ctx
 */
export function openImageDialog({ upload, onInsert }) {
  const modal = openModal({ title: 'Afbeelding toevoegen', subtitle: 'Upload een bestand of gebruik een URL/pad.', size: 'sm' });

  const form = document.createElement('form');
  form.className = 'deck-form';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.hidden = true;

  const pickBtn = document.createElement('button');
  pickBtn.type = 'button';
  pickBtn.className = 'studio-btn';
  pickBtn.innerHTML = `${icon('upload', 15)}<span>Afbeelding kiezen vanaf computer</span>`;
  const fileLabel = document.createElement('span');
  fileLabel.className = 'image-dialog__file';
  fileLabel.textContent = 'Geen bestand gekozen';

  pickBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    fileLabel.textContent = file ? file.name : 'Geen bestand gekozen';
    updateStatus();
  });

  const urlEl = document.createElement('input');
  urlEl.type = 'text';
  urlEl.placeholder = '/presentations/shared/img/uploads/… of https://…';
  urlEl.classList.add('is-mono');
  urlEl.addEventListener('input', updateStatus);

  const captionEl = document.createElement('input');
  captionEl.type = 'text';
  captionEl.placeholder = 'Bijschrift (optioneel)';

  const row = (label, ...nodes) => {
    const wrap = document.createElement('div');
    wrap.className = 'form-row';
    const lab = document.createElement('span');
    lab.className = 'form-row__label';
    lab.textContent = label;
    wrap.append(lab, ...nodes);
    return wrap;
  };

  const status = document.createElement('p');
  status.className = 'deck-form__status';

  const actions = document.createElement('div');
  actions.className = 'deck-form__actions';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'studio-btn';
  cancel.textContent = 'Annuleren';
  cancel.addEventListener('click', () => modal.close());
  const insert = document.createElement('button');
  insert.type = 'submit';
  insert.className = 'studio-btn studio-btn--primary';
  insert.innerHTML = `${icon('image', 15)}<span>Invoegen</span>`;
  actions.append(cancel, insert);

  form.append(
    row('Bestand', pickBtn, fileInput),
    row('', fileLabel),
    row('URL / pad', urlEl),
    row('Bijschrift', captionEl),
    status,
    actions,
  );
  modal.body.append(form);

  function updateStatus() {
    const file = fileInput.files && fileInput.files[0];
    const hasUpload = typeof upload === 'function';
    if (file && !hasUpload) {
      status.innerHTML = `<span class="deck-form__warn">${icon('alert', 14)} Log in met GitHub of koppel een map om te kunnen uploaden.</span>`;
    } else if (file) {
      status.innerHTML = `<span class="deck-form__ok">${icon('circle-check', 14)} Wordt geüpload naar shared/img/uploads/.</span>`;
    } else if (urlEl.value.trim()) {
      status.innerHTML = `<span class="deck-form__ok">${icon('circle-check', 14)} Gebruikt het opgegeven pad.</span>`;
    } else {
      status.textContent = '';
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = fileInput.files && fileInput.files[0];
    const caption = captionEl.value.trim();
    insert.disabled = true;
    try {
      let src = urlEl.value.trim();
      if (file) {
        if (typeof upload !== 'function') throw new Error('Uploaden niet beschikbaar in deze modus.');
        src = await upload(file);
      }
      if (!src) throw new Error('Kies een bestand of vul een URL/pad in.');
      modal.close();
      if (onInsert) onInsert({ src, caption });
    } catch (err) {
      insert.disabled = false;
      status.innerHTML = `<span class="deck-form__warn">${icon('alert', 14)} ${err.message}</span>`;
    }
  });

  return modal;
}
