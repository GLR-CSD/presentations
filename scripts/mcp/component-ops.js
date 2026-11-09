/**
 * Lezen en wijzigen van GLR-componenten via de bestaande formulier-parsers
 * (admin/src/blocks/parsers.js): dezelfde logica als het Properties Panel.
 *
 * Velden worden aangesproken met een stabiele `key` (= label; bij dubbele labels
 * `label#2`, `label#3`, …). Na elke wijziging wordt de HTML opnieuw geparsed,
 * omdat paden en closures van de oude parse niet meer kloppen.
 */
import * as T from '../../admin/src/blocks/html-tree.js';
import { describe, resolveTarget } from '../../admin/src/blocks/parsers.js';

const EDITABLE = new Set(['text', 'number', 'textarea', 'rich', 'code', 'select', 'toggle', 'color', 'image', 'segmented', 'range', 'focus']);
const clip = (v, n = 400) => (typeof v === 'string' && v.length > n ? `${v.slice(0, n)}…` : v);

/** Geeft elk bewerkbaar veld een unieke key. */
export function keyFields(fields) {
  const seen = new Map();
  const out = [];
  for (const f of fields.filter(Boolean)) {
    if (!EDITABLE.has(f.kind)) continue;
    const base = (f.label || f.badge || f.kind).trim();
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    out.push({ key: n === 1 ? base : `${base}#${n}`, f });
  }
  // Eerste van een dubbel label blijft zonder suffix; dat is bewust (stabiel bij toevoegen achteraan).
  return out;
}

function repeatersOf(fields) {
  const seen = new Map();
  return fields.filter((f) => f && f.kind === 'repeater').map((f) => {
    const base = (f.label || 'items').trim();
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    return { key: n === 1 ? base : `${base}#${n}`, rep: f };
  });
}

const fieldView = ({ key, f }) => {
  const v = { key, kind: f.kind, value: clip(f.value) };
  if (f.kind === 'select' || f.kind === 'segmented') v.options = (f.options || []).map((o) => (Array.isArray(o) ? o[0] : o.value ?? o));
  return v;
};

/** Component-pad bij `elPath` (zoals een klik in de Studio het component kiest). */
export function componentPath(html, elPath = [0]) {
  return resolveTarget(html, elPath).path;
}

/** Leesbare weergave van één component (velden + herhalers). */
export function componentView(html, elPath = [0]) {
  const root = T.parse(html);
  const path = componentPath(html, elPath);
  const node = T.nodeAt(root, path);
  if (!node) return null;
  const d = describe(html, node);
  return {
    elementPath: path,
    id: d.id,
    label: d.label,
    fields: keyFields(d.fields).map(fieldView),
    repeaters: repeatersOf(d.fields).map(({ key, rep }) => ({
      key,
      items: rep.items.map((it, index) => ({ index, title: it.title, fields: keyFields(it.fields).map(fieldView) })),
    })),
  };
}

function fresh(html, path) {
  const node = T.nodeAt(T.parse(html), path);
  if (!node) throw new Error(`Geen element op pad [${path.join(',')}] in dit blok.`);
  return { node, fields: describe(html, node).fields };
}

function coerce(f, value) {
  if (f.kind === 'toggle') return value === true || value === 'true';
  if (f.kind === 'number') return Number(value);
  if (f.kind === 'range') {
    const n = Number(value);
    if (!Number.isFinite(n)) throw new Error(`Ongeldige waarde "${value}" (getal verwacht).`);
    return Math.min(f.max ?? 100, Math.max(f.min ?? 0, n));
  }
  if (f.kind === 'focus') {
    if (!/^(0|50|100)% (0|50|100)%$/.test(String(value))) throw new Error(`Ongeldig focuspunt "${value}". Gebruik bijv. "50% 50%" of "0% 100%".`);
    return String(value);
  }
  if (f.kind === 'select' || f.kind === 'segmented') {
    const allowed = (f.options || []).map((o) => String(Array.isArray(o) ? o[0] : o.value ?? o));
    if (!allowed.includes(String(value))) throw new Error(`Ongeldige keuze "${value}". Toegestaan: ${allowed.map((a) => `"${a}"`).join(', ')}.`);
    return String(value);
  }
  return String(value);
}

function applyOne(html, path, entries, key, value) {
  const { node, fields } = fresh(html, path);
  const hit = entries(fields).find((e) => e.key === key);
  if (!hit) throw new Error(`Veld "${key}" niet gevonden. Beschikbaar: ${entries(fields).map((e) => `"${e.key}"`).join(', ') || '(geen)'}.`);
  const out = hit.f.apply(html, node, coerce(hit.f, value));
  if (typeof out !== 'string') throw new Error(`Veld "${key}" kan niet via fields worden gewijzigd; gebruik de parameter html of markdown.`);
  return out;
}

/**
 * Past veldwaarden en herhaler-bewerkingen toe op het component bij `elPath`.
 * @param {string} html  html van het blok
 * @param {number[]} elPath  component-pad (uit componentPath)
 * @param {{ fields?:Record<string,any>, repeater?:{ label?:string, ops?:Array<{op:'add'|'remove'|'move',index?:number,dir?:number}>, items?:Array<{index:number,fields:Record<string,any>}> } }} spec
 */
export function applyComponentChanges(html, elPath, spec) {
  let cur = html;
  const log = [];
  for (const [key, value] of Object.entries(spec.fields || {})) {
    cur = applyOne(cur, elPath, keyFields, key, value);
    log.push(`veld "${key}"`);
  }
  const rs = spec.repeater;
  if (rs) {
    const pick = (fields) => {
      const reps = repeatersOf(fields);
      const r = rs.label ? reps.find((x) => x.key === rs.label || x.rep.label === rs.label) : reps[0];
      if (!r) throw new Error(`Geen herhaal-onderdeel${rs.label ? ` "${rs.label}"` : ''} in dit component. Beschikbaar: ${reps.map((x) => `"${x.key}"`).join(', ') || '(geen)'}.`);
      return r.rep;
    };
    for (const op of rs.ops || []) {
      const { node, fields } = fresh(cur, elPath);
      const rep = pick(fields);
      const count = rep.items.length;
      if (op.op === 'add') cur = rep.add(cur, node);
      else {
        if (!Number.isInteger(op.index) || op.index < 0 || op.index >= count) throw new Error(`Item ${op.index} bestaat niet (er zijn ${count} items, genummerd vanaf 0).`);
        if (op.op === 'remove') cur = rep.remove(cur, node, op.index);
        else if (op.op === 'move') {
          const dir = op.dir < 0 ? -1 : 1;
          if (op.index + dir < 0 || op.index + dir >= count) throw new Error('Item kan niet verder in die richting.');
          cur = rep.move(cur, node, op.index, dir);
        } else throw new Error(`Onbekende bewerking "${op.op}".`);
      }
      log.push(`${op.op}${op.index != null ? ` item ${op.index}` : ''}`);
    }
    for (const item of rs.items || []) {
      for (const [key, value] of Object.entries(item.fields || {})) {
        const { node, fields } = fresh(cur, elPath);
        const rep = pick(fields);
        const it = rep.items[item.index];
        if (!it) throw new Error(`Item ${item.index} bestaat niet (er zijn ${rep.items.length} items, genummerd vanaf 0).`);
        const hit = keyFields(it.fields).find((e) => e.key === key);
        if (!hit) throw new Error(`Veld "${key}" niet gevonden in item ${item.index}. Beschikbaar: ${keyFields(it.fields).map((e) => `"${e.key}"`).join(', ')}.`);
        const out = hit.f.apply(cur, node, coerce(hit.f, value));
        if (typeof out !== 'string') throw new Error(`Veld "${key}" kan niet worden gewijzigd.`);
        cur = out;
        log.push(`item ${item.index} · "${key}"`);
      }
    }
  }
  return { html: cur, changes: log };
}
