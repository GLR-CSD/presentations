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

/**
 * Doelmap voor een deck op basis van cohort, leerjaar en slug-prefix:
 * `presentations/<cohort>/jaar-<n>/<vak>/<slug>` (mvi-k09: `<cohort>/vmbo/keuzevak-mvi-k09`).
 * Geeft `null` terug als de locatie niet uit de gegevens af te leiden is
 * (onbekende prefix, ongeldig cohort of leerjaar): dan blijft het deck waar het staat.
 */
export function deckFolder({ cohort, leerjaar, slug }) {
  const c = String(cohort || '').trim();
  const lj = String(leerjaar == null ? '' : leerjaar).trim();
  const s = String(slug || '').trim();
  if (!/^\d{4}-\d{4}$/.test(c) || !SLUG_RE.test(s)) return null;
  const prefix = s.split('_')[0];
  if (/^mvi/.test(prefix)) return `presentations/${c}/vmbo/keuzevak-mvi-k09/${s}`;
  if (!['1', '2', '3'].includes(lj)) return null;
  let vak = null;
  if (/^beroeps/.test(prefix)) vak = 'beroeps';
  else if (/^design/.test(prefix)) vak = 'design';
  else if (/^interface/.test(prefix)) vak = 'interface';
  else if (/^(webxr|immersive)/.test(prefix)) vak = 'minor-immersive-design';
  return vak ? `presentations/${c}/jaar-${lj}/${vak}/${s}` : null;
}

/**
 * Relatief pad van een deck (bijv. `presentations/…/deck/slides.md`) naar een
 * repo-bestand (bijv. `shared/img/glr-logo.svg`). Zonder deck-pad: het publieke
 * absolute pad `/presentations/<pad>` (zoals de uploads).
 */
export function relativeAssetPath(deckPath, repoPath) {
  const target = String(repoPath || '').replace(/^\/+/, '');
  if (!deckPath || !deckPath.includes('/')) return `/presentations/${target}`;
  const from = deckPath.split('/').slice(0, -1);
  const to = target.split('/');
  let i = 0;
  while (i < from.length && i < to.length - 1 && from[i] === to[i]) i += 1;
  return [...Array(from.length - i).fill('..'), ...to.slice(i)].join('/');
}
