/**
 * Schema-Registry voor de pop-over-inspectors.
 *
 * Herkent bekende GLR-componenten in een beschermd HTML-blok en biedt
 * gerichte, veilige parametervelden aan (bijv. `data-timer`). Onbekende HTML
 * valt terug op een rauwe HTML-editor, zodat er nooit iets verloren gaat.
 */

/** Detecteert het componenttype op basis van klassen/attributen. */
export function detectComponent(html) {
  const h = String(html || '');
  const has = (cls) => new RegExp(`class="[^"]*\\b${cls}\\b`).test(h);
  if (has('timer')) return { type: 'timer', label: 'Timer' };
  if (has('harm-wheel')) return { type: 'wheel', label: 'Kleurenwiel' };
  if (has('footer')) return { type: 'footer', label: 'Footer' };
  if (has('defbox')) return { type: 'defbox', label: 'Definitieblok' };
  if (has('opcard')) return { type: 'opcard', label: 'Opdrachtkaart' };
  if (has('terminal-window')) return { type: 'terminal', label: 'Terminalvenster' };
  if (has('glr-columns')) return { type: 'columns', label: 'Twee kolommen' };
  if (has('listrow')) return { type: 'rows', label: 'Genummerde lijst' };
  if (has('glr-card') || has('card')) return { type: 'cards', label: 'Kaarten' };
  if (has('callout')) return { type: 'callout', label: 'Callout' };
  if (has('check')) return { type: 'check', label: 'Checklist' };
  return { type: 'generic', label: 'HTML-blok' };
}

const attrValue = (html, name) => {
  const m = new RegExp(`${name}="([^"]*)"`).exec(html);
  return m ? m[1] : '';
};

/** Geeft de bewerkbare velden voor een component (gericht, veilig). */
export function componentFields(html) {
  const { type } = detectComponent(html);
  switch (type) {
    case 'timer':
      return [
        { key: 'data-timer', label: 'Tijd (MM:SS)', value: attrValue(html, 'data-timer') || '05:00' },
        { key: 'label', label: 'Label', value: innerOf(html, 't-label') },
        { key: 'large', label: 'Groot (timer--lg)', value: /class="[^"]*timer--lg/.test(html) },
      ];
    case 'wheel':
      return [
        { key: 'data-hues', label: 'Hues (0–11, komma)', value: attrValue(html, 'data-hues') || '0,6' },
        { key: 'data-shades', label: 'Monochromatisch', value: /data-shades="1"/.test(html) },
      ];
    case 'footer':
      return [{ key: 'num', label: 'Paginanummer', value: innerOf(html, 'num') }];
    case 'defbox':
      return [{ key: 'k', label: 'Label', value: innerOf(html, 'k') }];
    case 'opcard':
      return [{ key: 'k', label: 'Label', value: innerOf(html, 'k') }];
    default:
      return [];
  }
}

/** Past één veld aan met een gerichte regex (raakt de rest niet aan). */
export function applyField(html, key, value) {
  let out = String(html);
  switch (key) {
    case 'data-timer': {
      out = setAttr(out, 'data-timer', value);
      out = out.replace(/(<span class="t-time">)[^<]*(<\/span>)/, `$1${value}$2`);
      return out;
    }
    case 'data-hues':
      return setAttr(out, 'data-hues', value);
    case 'data-shades':
      return value ? setAttr(out, 'data-shades', '1') : out.replace(/\s*data-shades="1"/, '');
    case 'large': {
      if (value) {
        out = out.replace(/class="([^"]*timer[^"]*)"/, (m, c) => (/\btimer--lg\b/.test(c) ? m : `class="${c} timer--lg"`));
      } else {
        out = out.replace(/(class="[^"]*)\s*timer--lg\b/, '$1').replace(/class="\s+/, 'class="');
      }
      return out;
    }
    case 'label':
      return out.replace(/(<span class="t-label">)[^<]*(<\/span>)/, `$1${escapeHtml(value)}$2`);
    case 'num':
      return out.replace(/(<span class="num">)[^<]*(<\/span>)/, `$1${escapeHtml(value)}$2`);
    case 'k':
      return out.replace(/(<span class="k">)[^<]*(<\/span>)/, `$1${escapeHtml(value)}$2`);
    default:
      return out;
  }
}

/* ------------------------------------------------------------- helpers --- */

function setAttr(html, name, value) {
  const re = new RegExp(`${name}="[^"]*"`);
  if (re.test(html)) return html.replace(re, `${name}="${value}"`);
  // Attribuut nog niet aanwezig: invoegen na de eerste class-attribuut.
  return html.replace(/(class="[^"]*")/, `$1 ${name}="${value}"`);
}

function innerOf(html, cls) {
  const m = new RegExp(`<[a-z0-9]+ class="${cls}"[^>]*>([^<]*)<`).exec(html);
  return m ? m[1].trim() : '';
}

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
