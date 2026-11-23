/**
 * "Kopie maken"-dialoog: vraagt titel, auteur, slug, cohort, leerjaar en periode
 * voor een kloon van het geopende deck. De kopie komt in een eigen map, zodat het
 * origineel nooit wordt overschreven.
 */
import { openModal } from './modal.js';
import { icon } from './icons.js';
import { escapeHtml, slugify, SLUG_RE, deckFolder } from './util.js';

function row(label, control, hint = '') {
  const el = document.createElement('label');
  el.className = 'form-row';
  const lab = document.createElement('span');
  lab.className = 'form-row__label';
  lab.textContent = label;
  el.append(lab, control);
  if (hint) {
    const h = document.createElement('span');
    h.className = 'form-row__hint';
    h.textContent = hint;
    el.append(h);
  }
  return el;
}

function input(value, attrs = {}) {
  const el = document.createElement('input');
  el.type = 'text';
  el.value = value == null ? '' : value;
  if (attrs.placeholder) el.placeholder = attrs.placeholder;
  if (attrs.mono) el.classList.add('is-mono');
  return el;
}

function select(options, value) {
  const el = document.createElement('select');
  for (const [v, label] of options) {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = label;
    if (String(v) === String(value)) o.selected = true;
    el.append(o);
  }
  return el;
}

/**
 * Doelmap van de kopie: volgt cohort/leerjaar/slug (zoals nieuwe decks);
 * anders dezelfde bovenliggende map als het origineel.
 */
export function cloneTargetDir({ cohort, leerjaar, slug, sourceDir }) {
  return deckFolder({ cohort, leerjaar, slug }) || `${sourceDir.replace(/\/[^/]*$/, '')}/${slug}`;
}

/**
 * @param {{ source: {dir:string, slug:string, title:string, cohort:string, leerjaar:number|string, periode:number|string},
 *           manifest: object, onSubmit: (data: object) => void }} ctx
 */
export function openCloneDeckDialog({ source, manifest, onSubmit }) {
  const modal = openModal({
    title: 'Kopie maken',
    subtitle: `Maakt een eigen kopie van "${source.title}". Het origineel blijft ongewijzigd.`,
    size: 'lg',
  });

  const form = document.createElement('form');
  form.className = 'deck-form';

  const titleEl = input(`${source.title} (kopie)`);
  const auteurEl = input('', { placeholder: 'bijv. Jan Jansen' });
  const slugEl = input('', { mono: true });
  const cohortEl = input(source.cohort || '');
  const leerjaarEl = select([['1', 'Leerjaar 1'], ['2', 'Leerjaar 2'], ['3', 'Leerjaar 3']], source.leerjaar || 1);
  const periodeEl = select([['1', 'Periode 1'], ['2', 'Periode 2'], ['3', 'Periode 3'], ['4', 'Periode 4']], source.periode || 1);

  let slugTouched = false;
  const regenerateSlug = () => {
    const who = slugify(auteurEl.value);
    slugEl.value = who ? `${source.slug}-${who}` : `${source.slug}-kopie`;
  };
  regenerateSlug();
  auteurEl.addEventListener('input', () => { if (!slugTouched) regenerateSlug(); update(); });
  slugEl.addEventListener('input', () => { slugTouched = true; update(); });
  [titleEl, cohortEl, leerjaarEl, periodeEl].forEach((el) => el.addEventListener('input', update));

  const grid = document.createElement('div');
  grid.className = 'deck-form__grid';
  grid.append(
    row('Titel *', titleEl),
    row('Auteur *', auteurEl, 'Jouw naam; komt in de Lesgegevens van de kopie.'),
    row('Mapnaam / Slug *', slugEl, 'Wordt de mapnaam van jouw kopie.'),
    row('Cohort', cohortEl),
    row('Leerjaar', leerjaarEl),
    row('Periode', periodeEl),
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
  submit.innerHTML = `${icon('copy', 15)}<span>Kopie maken</span>`;
  actions.append(cancel, submit);
  form.append(grid, status, actions);
  modal.body.append(form);

  function read() {
    return {
      title: titleEl.value.trim(),
      auteur: auteurEl.value.trim(),
      slug: slugEl.value.trim(),
      cohort: cohortEl.value.trim(),
      leerjaar: leerjaarEl.value,
      periode: periodeEl.value,
    };
  }

  function update() {
    const d = read();
    const problems = [];
    if (!d.title) problems.push('Vul een titel in.');
    if (!d.auteur) problems.push('Vul je naam in als auteur.');
    if (!SLUG_RE.test(d.slug)) problems.push('De mapnaam mag alleen kleine letters, cijfers, _ en - bevatten.');
    const dir = SLUG_RE.test(d.slug) ? cloneTargetDir({ ...d, sourceDir: source.dir }) : '';
    if (dir === source.dir) problems.push('De kopie moet een andere mapnaam hebben dan het origineel.');
    else if (dir && (manifest.presentations || []).some((p) => p.md && p.md.startsWith(`${dir}/`))) problems.push(`${dir} bestaat al.`);
    status.innerHTML = problems.length
      ? problems.map((p) => `<span class="deck-form__warn">${icon('alert', 14)} ${escapeHtml(p)}</span>`).join('')
      : `<span class="deck-form__ok">${icon('circle-check', 14)} <code>${escapeHtml(dir)}/slides.md</code></span>`;
    submit.disabled = problems.length > 0;
    return { problems, dir };
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { problems, dir } = update();
    if (problems.length) return;
    modal.close();
    onSubmit({ ...read(), dir });
  });

  update();
  setTimeout(() => auteurEl.focus(), 30);
  return modal;
}
