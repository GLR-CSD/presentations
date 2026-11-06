/**
 * Form-kit: bouwstenen voor het Properties Panel. Alle velden werken LIVE
 * (`input`-event, geen OK-knop) en roepen `ctx.apply(field, waarde, opts)` aan.
 *
 * ctx = {
 *   apply(field, value, { redraw })   voert field.apply uit op het component
 *   repeater(rep, op, index, dir)     'add' | 'remove' | 'move'
 *   select(path)                      selecteer een genest onderdeel (absoluut pad in het blok)
 *   upload(file) → Promise<string>    uploadt een afbeelding, geeft het pad terug
 *   openItem                          index van de repeater-rij die open moet staan
 * }
 *
 * Tekstvelden herrenderen het paneel NIET tijdens het typen (focus blijft).
 */
import { icon } from './icons.js';
import { escapeHtml } from './util.js';

const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};

/* ------------------------------------------------------- rich text helpers --- */

const RICH_TAGS = new Set(['strong', 'em', 'b', 'i', 'u', 'code', 'a', 'br', 'span', 'mark', 'small', 'sub', 'sup', 'kbd', 's', 'abbr']);
const RICH_ATTRS = ['class', 'style', 'href', 'title', 'target', 'rel'];
const TAG_MAP = { b: 'strong', i: 'em' };

/** Maakt veilige HTML voor in het contenteditable veld (whitelist). */
export function sanitizeRich(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  return serializeRich(doc.body, true);
}

function serializeRich(root, keepNbsp) {
  let out = '';
  for (const n of root.childNodes) {
    if (n.nodeType === 3) {
      out += n.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, keepNbsp ? '&nbsp;' : ' ');
    } else if (n.nodeType === 1) {
      const tag = n.tagName.toLowerCase();
      if (tag === 'br') { out += '<br>'; continue; }
      if (tag === 'div' || tag === 'p') { out += `${serializeRich(n, keepNbsp)}<br>`; continue; }
      if (!RICH_TAGS.has(tag)) { out += serializeRich(n, keepNbsp); continue; }
      const t = TAG_MAP[tag] || tag;
      let attrs = '';
      for (const a of RICH_ATTRS) {
        if (!n.hasAttribute(a)) continue;
        const v = n.getAttribute(a);
        if (a === 'href' && /^\s*javascript:/i.test(v)) continue;
        attrs += ` ${a}="${v.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
      }
      out += `<${t}${attrs}>${serializeRich(n, keepNbsp)}</${t}>`;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ velden --- */

function wrap(f, extraCls = '') {
  const w = el('div', `pp-field ${extraCls}`.trim());
  if (f.label) w.dataset.fieldLabel = f.label;
  if (f.label || f.badge) {
    const head = el('div', 'pp-field__head');
    if (f.label) head.appendChild(el('label', 'pp-label', escapeHtml(f.label)));
    if (f.badge) head.appendChild(el('span', 'pp-badge', escapeHtml(f.badge)));
    w.appendChild(head);
  }
  return w;
}

function textField(f, ctx) {
  const w = wrap(f);
  const input = el('input', 'pp-input');
  input.type = 'text';
  input.value = f.value == null ? '' : String(f.value);
  if (f.placeholder) input.placeholder = f.placeholder;
  input.addEventListener('input', () => ctx.apply(f, input.value, { redraw: false }));
  w.appendChild(input);
  return w;
}

function numberField(f, ctx) {
  const w = wrap(f);
  const input = el('input', 'pp-input pp-input--num');
  input.type = 'number';
  if (f.min != null) input.min = f.min;
  if (f.max != null) input.max = f.max;
  input.value = String(f.value);
  input.addEventListener('input', () => { if (input.value !== '') ctx.apply(f, input.value, { redraw: false }); });
  w.appendChild(input);
  return w;
}

function textareaField(f, ctx, { mono = false, tools = false } = {}) {
  const w = wrap(f);
  if (tools) {
    const bar = el('div', 'pp-mdtools');
    const mk = (label, title, left, right = left) => {
      const b = el('button', 'pp-mini', label);
      b.type = 'button';
      b.title = title;
      b.addEventListener('click', () => {
        const { selectionStart: s, selectionEnd: e, value } = ta;
        const sel = value.slice(s, e) || 'tekst';
        ta.value = value.slice(0, s) + left + sel + right + value.slice(e);
        ta.focus();
        ta.setSelectionRange(s + left.length, s + left.length + sel.length);
        ctx.apply(f, ta.value, { redraw: false });
      });
      bar.appendChild(b);
    };
    mk('<b>B</b>', 'Vet', '**');
    mk('<i>I</i>', 'Cursief', '*');
    mk('&lt;/&gt;', 'Code', '`');
    w.appendChild(bar);
  }
  const ta = el('textarea', `pp-input pp-textarea${mono ? ' pp-mono' : ''}`);
  ta.value = f.value == null ? '' : String(f.value);
  ta.rows = mono ? 7 : 3;
  if (mono) {
    ta.spellcheck = false;
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const { selectionStart: s, selectionEnd: en } = ta;
        ta.setRangeText('  ', s, en, 'end');
        ta.dispatchEvent(new Event('input'));
      }
    });
  }
  ta.addEventListener('input', () => ctx.apply(f, ta.value, { redraw: false }));
  w.appendChild(ta);
  return w;
}

function richField(f, ctx) {
  const w = wrap(f);
  const bar = el('div', 'pp-mdtools');
  for (const [label, cmd, title] of [['<b>B</b>', 'bold', 'Vet'], ['<i>I</i>', 'italic', 'Cursief'], ['<u>U</u>', 'underline', 'Onderstreept']]) {
    const b = el('button', 'pp-mini', label);
    b.type = 'button';
    b.title = title;
    b.addEventListener('mousedown', (e) => e.preventDefault());
    b.addEventListener('click', () => { document.execCommand(cmd); push(); });
    bar.appendChild(b);
  }
  const box = el('div', 'pp-rich');
  box.contentEditable = 'true';
  box.spellcheck = true;
  box.innerHTML = sanitizeRich(String(f.value || ''));
  const push = () => ctx.apply(f, serializeRich(box, true), { redraw: false });
  box.addEventListener('input', push);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); document.execCommand('insertLineBreak'); }
  });
  box.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  });
  w.append(bar, box);
  return w;
}

function selectField(f, ctx) {
  const w = wrap(f);
  const sel = el('select', 'pp-input');
  for (const [value, label] of f.options) {
    const o = el('option');
    o.value = value;
    o.textContent = label;
    sel.appendChild(o);
  }
  sel.value = f.value == null ? '' : f.value;
  sel.addEventListener('change', () => ctx.apply(f, sel.value, { redraw: true }));
  w.appendChild(sel);
  return w;
}

function toggleField(f, ctx) {
  const w = el('label', 'pp-toggle');
  const input = el('input');
  input.type = 'checkbox';
  input.checked = !!f.value;
  const track = el('span', 'pp-toggle__track');
  const text = el('span', 'pp-toggle__text', escapeHtml(f.label));
  w.append(input, track, text);
  if (f.badge) w.appendChild(el('span', 'pp-badge', escapeHtml(f.badge)));
  input.addEventListener('change', () => ctx.apply(f, input.checked, { redraw: true }));
  return w;
}

function colorField(f, ctx) {
  const w = wrap(f);
  const row = el('div', 'pp-colorrow');
  const color = el('input', 'pp-color');
  color.type = 'color';
  color.value = /^#[0-9a-f]{6}$/i.test(f.value) ? f.value : '#cccccc';
  const hex = el('input', 'pp-input pp-input--hex');
  hex.type = 'text';
  hex.value = f.value || '';
  hex.maxLength = 7;
  color.addEventListener('input', () => { hex.value = color.value; ctx.apply(f, color.value, { redraw: false }); });
  hex.addEventListener('input', () => {
    if (/^#[0-9a-f]{6}$/i.test(hex.value)) { color.value = hex.value; ctx.apply(f, hex.value, { redraw: false }); }
  });
  row.append(color, hex);
  if (f.clearable) {
    const x = el('button', 'pp-mini', 'Wis');
    x.type = 'button';
    x.addEventListener('click', () => ctx.apply(f, '', { redraw: true }));
    row.appendChild(x);
  }
  w.appendChild(row);
  return w;
}

function huesField(f, ctx) {
  const w = wrap(f);
  const row = el('div', 'pp-hues');
  let current = [...f.value];
  for (let i = 0; i < 12; i += 1) {
    const b = el('button', 'pp-hue');
    b.type = 'button';
    b.style.background = `hsl(${i * 30},68%,55%)`;
    b.title = `Kleur ${i + 1}`;
    b.setAttribute('aria-pressed', current.includes(i) ? 'true' : 'false');
    b.addEventListener('click', () => {
      current = current.includes(i) ? current.filter((x) => x !== i) : [...current, i];
      b.setAttribute('aria-pressed', current.includes(i) ? 'true' : 'false');
      ctx.apply(f, current, { redraw: false });
    });
    row.appendChild(b);
  }
  w.appendChild(row);
  return w;
}

function imageField(f, ctx) {
  const w = wrap(f);
  const row = el('div', 'pp-imgrow');
  const input = el('input', 'pp-input');
  input.type = 'text';
  input.value = f.value || '';
  input.addEventListener('input', () => ctx.apply(f, input.value, { redraw: false }));
  row.appendChild(input);
  if (f.upload && ctx.upload) {
    const file = el('input');
    file.type = 'file';
    file.accept = 'image/*';
    file.hidden = true;
    const btn = el('button', 'pp-btn', `${icon('upload', 14)}<span>Upload</span>`);
    btn.type = 'button';
    btn.addEventListener('click', () => file.click());
    file.addEventListener('change', async () => {
      if (!file.files[0]) return;
      btn.disabled = true;
      try {
        const p = await ctx.upload(file.files[0]);
        input.value = p;
        ctx.apply(f, p, { redraw: true });
      } catch (err) {
        window.alert(err.message || 'Upload mislukt');
      } finally {
        btn.disabled = false;
      }
    });
    row.append(btn, file);
  }
  w.appendChild(row);
  return w;
}

function chipsField(f, ctx) {
  const w = el('div', 'pp-chips');
  for (const item of f.items) {
    const b = el('button', 'pp-chip', `${icon(item.icon || 'braces', 14)}<span>${escapeHtml(item.label)}</span>`);
    b.type = 'button';
    b.addEventListener('click', () => ctx.select(item.path));
    w.appendChild(b);
  }
  return w;
}

function repeaterField(f, ctx) {
  const w = el('div', 'pp-repeater');
  if (f.label) w.appendChild(el('div', 'pp-section-title', escapeHtml(f.label)));
  const list = el('div', 'pp-items');
  f.items.forEach((item, i) => {
    const d = el('details', 'pp-item');
    d.open = f.items.length === 1 || i === ctx.openItem;
    if (i === ctx.openItem) d.classList.add('is-focus');
    const sum = el('summary', 'pp-item__head');
    sum.appendChild(el('span', 'pp-item__title', escapeHtml(item.title)));
    const acts = el('span', 'pp-item__acts');
    const act = (ic, title, fn, danger) => {
      const b = el('button', `pp-mini${danger ? ' pp-mini--danger' : ''}`, icon(ic, 13));
      b.type = 'button';
      b.title = title;
      b.setAttribute('aria-label', title);
      b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fn(); });
      acts.appendChild(b);
      return b;
    };
    act('arrow-up', 'Omhoog', () => ctx.repeater(f, 'move', i, -1)).disabled = i === 0;
    act('arrow-down', 'Omlaag', () => ctx.repeater(f, 'move', i, 1)).disabled = i === f.items.length - 1;
    act('trash', 'Verwijderen', () => ctx.repeater(f, 'remove', i, 0), true);
    sum.appendChild(acts);
    d.appendChild(sum);
    d.addEventListener('toggle', () => { if (d.open) ctx.hoverItem && ctx.hoverItem(item.path); });
    const body = el('div', 'pp-item__body');
    renderFields(body, item.fields, { ...ctx, openItem: -1 });
    d.appendChild(body);
    list.appendChild(d);
  });
  w.appendChild(list);
  const add = el('button', 'pp-btn pp-btn--add', `${icon('plus', 14)}<span>${escapeHtml((f.addLabel || '+ Toevoegen').replace(/^\+\s*/, ''))}</span>`);
  add.type = 'button';
  add.addEventListener('click', () => ctx.repeater(f, 'add', -1, 0));
  w.appendChild(add);
  return w;
}

/** Render een lijst veld-specificaties in `container`. */
export function renderFields(container, fields, ctx) {
  for (const f of fields) {
    let node = null;
    switch (f.kind) {
      case 'text': node = textField(f, ctx); break;
      case 'number': node = numberField(f, ctx); break;
      case 'textarea': node = textareaField(f, ctx, { tools: !!f.mdTools }); break;
      case 'rich': node = richField(f, ctx); break;
      case 'code': node = textareaField(f, ctx, { mono: true }); break;
      case 'select': node = selectField(f, ctx); break;
      case 'toggle': node = toggleField(f, ctx); break;
      case 'color': node = colorField(f, ctx); break;
      case 'hues': node = huesField(f, ctx); break;
      case 'image': node = imageField(f, ctx); break;
      case 'chips': node = chipsField(f, ctx); break;
      case 'repeater': node = repeaterField(f, ctx); break;
      case 'section': node = el('div', `pp-section-title${f.first ? ' pp-section-title--first' : ''}`, escapeHtml(f.label)); break;
      default: break;
    }
    if (node) container.appendChild(node);
  }
}

/** Segmented control (bijv. slide-thema). */
export function segmented(options, value, onPick) {
  const w = el('div', 'pp-seg');
  for (const [val, label, ic] of options) {
    const b = el('button', 'pp-seg__btn', `${ic ? icon(ic, 14) : ''}<span>${escapeHtml(label)}</span>`);
    b.type = 'button';
    b.classList.toggle('is-active', val === value);
    b.addEventListener('click', () => onPick(val));
    w.appendChild(b);
  }
  return w;
}

/** Eenvoudig los veld (voor slide-eigenschappen). */
export function simpleField(kind, spec, onChange) {
  const f = { kind, ...spec, apply: null };
  const ctx = { apply: (_f, v) => onChange(v), select() {}, repeater() {}, openItem: -1 };
  const box = document.createElement('div');
  renderFields(box, [f], ctx);
  return box.firstChild;
}

export { el as h };
