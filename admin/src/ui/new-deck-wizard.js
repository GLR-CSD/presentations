/**
 * "+ Nieuwe Presentatie"-wizard.
 *
 * Maakt een compleet nieuw deck aan onder `presentations/<prefix>_<slug>/`:
 * de docent vult titel, vak/module-prefix, mapnaam, cohort, leerjaar, periode,
 * auteur en tags in. De slug wordt automatisch `<prefix>_<geslugificeerde-titel>`
 * en blijft bijstelbaar.
 */
import { openModal } from './modal.js';
import { icon } from './icons.js';
import { escapeHtml, slugify, SLUG_RE, SUBJECT_PREFIXES } from './util.js';

function formRow(label, control, hint = '') {
  const row = document.createElement('label');
  row.className = 'form-row';
  const lab = document.createElement('span');
  lab.className = 'form-row__label';
  lab.textContent = label;
  row.append(lab, control);
  if (hint) {
    const h = document.createElement('span');
    h.className = 'form-row__hint';
    h.textContent = hint;
    row.append(h);
  }
  return row;
}

function select(options, value) {
  const el = document.createElement('select');
  for (const opt of options) {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    if (String(opt.value) === String(value)) o.selected = true;
    el.append(o);
  }
  return el;
}

function input(value, attrs = {}) {
  const el = document.createElement('input');
  el.type = attrs.type || 'text';
  el.value = value == null ? '' : value;
  if (attrs.placeholder) el.placeholder = attrs.placeholder;
  if (attrs.mono) el.classList.add('is-mono');
  return el;
}

/**
 * @param {{ manifest: object, onCreated: (data: object) => void }} ctx
 */
export function openNewDeckWizard({ manifest, onCreated }) {
  const modal = openModal({ title: 'Nieuwe presentatie', subtitle: 'Maak een nieuw deck onder presentations/.', size: 'lg' });

  const form = document.createElement('form');
  form.className = 'deck-form';

  const titleEl = input('', { placeholder: 'bijv. Introductie Databases' });
  const prefixEl = select(SUBJECT_PREFIXES.map((p) => ({ value: p.value, label: p.label })), 'beroeps1');
  const slugEl = input('', { placeholder: 'bijv. design1_kleur-en-contrast', mono: true });
  const cohortEl = input('2026-2027');
  const leerjaarEl = select([{ value: '1', label: 'Leerjaar 1' }, { value: '2', label: 'Leerjaar 2' }, { value: '3', label: 'Leerjaar 3' }], '1');
  const periodeEl = select([{ value: '1', label: 'Periode 1' }, { value: '2', label: 'Periode 2' }, { value: '3', label: 'Periode 3' }, { value: '4', label: 'Periode 4' }], '1');
  const auteurEl = input('', { placeholder: 'bijv. Docententeam CSD' });
  const tagsEl = input('', { placeholder: 'Design, Kleur, Contrast' });

  let slugTouched = false;
  const regenerateSlug = () => {
    const prefix = prefixEl.value;
    const base = slugify(titleEl.value);
    slugEl.value = prefix === 'custom' ? base : (base ? `${prefix}_${base}` : prefix);
  };
  titleEl.addEventListener('input', () => { if (!slugTouched) regenerateSlug(); updatePreview(); });
  prefixEl.addEventListener('change', () => { if (!slugTouched) regenerateSlug(); updatePreview(); });
  slugEl.addEventListener('input', () => { slugTouched = true; updatePreview(); });

  const grid = document.createElement('div');
  grid.className = 'deck-form__grid';
  grid.append(
    formRow('Titel *', titleEl),
    formRow('Vak / Module prefix *', prefixEl),
    formRow('Mapnaam / Slug *', slugEl, 'Wordt de mapnaam onder presentations/.'),
    formRow('Cohort', cohortEl),
    formRow('Leerjaar', leerjaarEl),
    formRow('Periode', periodeEl),
    formRow('Auteur', auteurEl),
    formRow('Tags', tagsEl, 'Komma-gescheiden.'),
  );

  const status = document.createElement('p');
  status.className = 'deck-form__status';
  const actions = document.createElement('div');
  actions.className = 'deck-form__actions';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'studio-btn';
  cancel.textContent = 'Annuleren';
  cancel.addEventListener('click', () => modal.close());
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'studio-btn studio-btn--primary';
  submit.innerHTML = `${icon('file-plus', 15)}<span>Presentatie aanmaken</span>`;
  actions.append(cancel, submit);

  form.append(grid, status, actions);
  modal.body.append(form);

  function readForm() {
    return {
      title: titleEl.value.trim(),
      prefix: prefixEl.value,
      slug: slugEl.value.trim(),
      cohort: cohortEl.value.trim(),
      leerjaar: leerjaarEl.value,
      periode: periodeEl.value,
      auteur: auteurEl.value.trim(),
      tags: tagsEl.value.split(',').map((s) => s.trim()).filter(Boolean),
    };
  }

  function updatePreview() {
    const data = readForm();
    const problems = [];
    if (!data.title) problems.push('Vul een titel in.');
    if (!SLUG_RE.test(data.slug)) problems.push('De mapnaam mag alleen kleine letters, cijfers, _ en - bevatten.');
    const path = `presentations/${data.slug}/slides.md`;
    const exists = (manifest.presentations || []).some((p) => p.md === path);
    if (exists) problems.push(`Let op: ${path} bestaat al en wordt overschreven bij opslaan.`);
    status.innerHTML = problems.length
      ? problems.map((p) => `<span class="deck-form__warn">${icon('alert', 14)} ${escapeHtml(p)}</span>`).join('')
      : `<span class="deck-form__ok">${icon('circle-check', 14)} <code>${escapeHtml(path)}</code></span>`;
    return problems.filter((p) => !p.startsWith('Let op'));
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const problems = updatePreview();
    if (problems.length) return;
    const data = readForm();
    modal.close();
    if (onCreated) onCreated(data);
  });

  updatePreview();
  setTimeout(() => titleEl.focus(), 30);
  return modal;
}
