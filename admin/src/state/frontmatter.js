/**
 * Verliesvrije YAML-frontmatter voor GLR-decks.
 *
 * De decks openen met een frontmatter-blok tussen HTML-comment-markers:
 *
 *     <!-- frontmatter
 *     title: "Logo's"
 *     cohort: "2026-2027"
 *     leerjaar: 1
 *     periode: 1
 *     auteur: "GLR Media Creative"
 *     tags: ["Design1", "Logo"]
 *     -->
 *
 * Voor oudere decks wordt ook het `--- … ---`-formaat gelezen (net als
 * scripts/build-index.js). We parsen bewust zelf (geen YAML-library) zodat we:
 *   1. de exacte, originele bytes kunnen terugschrijven als er niets wijzigt;
 *   2. alleen gewijzigde waarden vervangen en de rest (volgorde, quoting)
 *      ongemoeid laten.
 */

const COMMENT_RE = /^<!--[ \t]*frontmatter[ \t]*\r?\n([\s\S]*?)\r?\n-->/;
const LEGACY_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, '');
}

/** Zet een ruwe YAML-waarde om naar een JS-waarde. */
function parseValue(raw) {
  const v = String(raw).trim();
  if (v === '') return '';
  if (/^\[.*\]$/.test(v)) {
    return v
      .slice(1, -1)
      .split(',')
      .map((s) => stripQuotes(s.trim()))
      .filter((s) => s !== '');
  }
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (v === 'true') return true;
  if (v === 'false') return false;
  return stripQuotes(v);
}

/** Serialiseer een JS-waarde naar een YAML-waarde (canonieke GLR-stijl). */
function serializeValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(', ')}]`;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return `"${String(value == null ? '' : value).replace(/"/g, '\\"')}"`;
}

/** Parseert de regels van het frontmatter-blok naar velden (met raw-waarde). */
function parseFields(inner) {
  const fields = [];
  for (const line of inner.split(/\r?\n/)) {
    const m = /^([A-Za-z0-9_-]+)[ \t]*:(?:[ \t]*(.*))?$/.exec(line);
    if (!m) {
      fields.push({ key: null, raw: line });
      continue;
    }
    const valueRaw = m[2] == null ? '' : m[2];
    fields.push({ key: m[1], valueRaw, value: parseValue(valueRaw) });
  }
  return fields;
}

/**
 * Leest het frontmatter-blok (indien aanwezig) uit een deck-bron.
 * @returns {null | object} frontmatter-object met `get`, `set`, `toObject`,
 *   `serialize` en `block` (de exacte originele tekst).
 */
export function parseFrontmatter(source) {
  const m = COMMENT_RE.exec(source) || LEGACY_RE.exec(source);
  if (!m) return null;

  const block = m[0];
  const style = block.startsWith('<!--') ? 'comment' : 'yaml';
  const eol = block.includes('\r\n') ? '\r\n' : '\n';
  const fields = parseFields(m[1]);

  const fm = {
    style,
    eol,
    block,
    fields,
    get(key) {
      const f = fields.find((x) => x.key === key);
      return f ? f.value : undefined;
    },
    set(key, value) {
      const f = fields.find((x) => x.key === key);
      if (f) {
        f.value = value;
        f.valueRaw = serializeValue(value);
      } else {
        fields.push({ key, value, valueRaw: serializeValue(value) });
      }
      return fm;
    },
    toObject() {
      const out = {};
      for (const f of fields) if (f.key) out[f.key] = f.value;
      return out;
    },
    serialize() {
      return serializeFrontmatter(fm);
    },
  };
  return fm;
}

/** Bouwt het volledige frontmatter-blok op uit de velden. */
export function serializeFrontmatter(fm) {
  const inner = fm.fields
    .map((f) => (f.key == null ? f.raw : `${f.key}: ${f.valueRaw}`))
    .join(fm.eol);
  return fm.style === 'comment'
    ? `<!-- frontmatter${fm.eol}${inner}${fm.eol}-->`
    : `---${fm.eol}${inner}${fm.eol}---`;
}
