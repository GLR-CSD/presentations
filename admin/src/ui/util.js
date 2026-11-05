/**
 * Kleine, herbruikbare UI-helpers voor de GLR Slide Studio (geen afhankelijkheden).
 */

/** Escapecode voor veilige HTML-interpolatie. */
export function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** `Introductie Databases` → `introductie-databases` (slug-veilig). */
export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** `jaar-1` → "Jaar 1", `2026-2027` blijft, `design1_logos` → "Design1 logos". */
export function prettifySegment(segment) {
  if (/^\d{4}\s*[–-]\s*\d{4}$/.test(segment)) return segment;
  const cleaned = String(segment).replace(/^[0-9]+[-_]/, '').replace(/[-_]+/g, ' ').trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : segment;
}

/** Geldige GLR-mapnaam: begint met letter/cijfer, alleen a-z 0-9 _ -. */
export const SLUG_RE = /^[a-z0-9][a-z0-9_-]*$/;

/** Standaard vak/module-prefixes voor nieuwe presentaties. */
export const SUBJECT_PREFIXES = [
  { value: 'beroeps1', label: 'beroeps1 — Beroepsproject Leerjaar 1', subject: 'Beroeps 1' },
  { value: 'beroeps2', label: 'beroeps2 — Beroepsproject Leerjaar 2', subject: 'Beroeps 2' },
  { value: 'design1', label: 'design1 — Design', subject: 'Design' },
  { value: 'interface1', label: 'interface1 — Interface & Front-end', subject: 'Interface' },
  { value: 'mvi-k09', label: 'mvi-k09 — Keuzedeel MVI', subject: 'MVI' },
  { value: 'webxr', label: 'webxr — WebXR', subject: 'WebXR' },
  { value: 'immersive-design', label: 'immersive-design — Immersive Design', subject: 'Immersive Design' },
  { value: 'custom', label: 'custom — Aangepaste prefix', subject: '' },
];

/** Map-prefix van een deck-entry (`design1_logos` → `design1`). */
export function entryPrefix(entry) {
  const rel = entry.md || entry.html || '';
  const parts = rel.split('/');
  const folder = parts[parts.length - 2] || '';
  return folder.split('_')[0] || folder;
}

const SUBJECT_MATCHERS = [
  { re: /^beroeps/, label: 'Beroeps' },
  { re: /^design/, label: 'Design' },
  { re: /^interface/, label: 'Interface' },
  { re: /^mvi/, label: 'MVI' },
  { re: /^webxr/, label: 'WebXR' },
  { re: /^immersive/, label: 'Immersive Design' },
];

/** Vakgebied-label op basis van de map-prefix. */
export function entrySubject(entry) {
  const prefix = entryPrefix(entry);
  const hit = SUBJECT_MATCHERS.find((m) => m.re.test(prefix));
  return hit ? hit.label : 'Overig';
}

/** Leerjaar-label (`Leerjaar 1`) of "Overig". */
export function entryLeerjaar(entry) {
  const lj = String(entry.leerjaar == null ? '' : entry.leerjaar).trim();
  return ['1', '2', '3'].includes(lj) ? `Leerjaar ${lj}` : 'Overig';
}

/** Periode-label (`Periode 1`) of "Overig". */
export function entryPeriode(entry) {
  const p = String(entry.periode == null ? '' : entry.periode).trim();
  return ['1', '2', '3', '4'].includes(p) ? `Periode ${p}` : 'Overig';
}
