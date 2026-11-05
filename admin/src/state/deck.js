/**
 * Verliesvrije deck-parser/serializer (Markdown ↔ Slide-model).
 *
 * Doel: een `slides.md` opknippen in frontmatter + losse slides (met hun
 * `<!-- .slide: ... -->`-attributen en `Note:`-sprekersnotities) zó dat
 * `serializeDeck(parseDeck(src)) === src` byte-voor-byte, en dat een bewerkte
 * slide alleen díe slide in de uitvoer verandert.
 *
 * De scheidingstekens en de note-splitsing volgen exact de reveal.js
 * markdown-plugin (data-separator="\n---\n\n", data-separator-vertical="\n--\n\n",
 * data-separator-notes="^Note:"). Dit garandeert dat de editor dezelfde
 * slide-grenzen ziet als de renderer.
 */

import { parseFrontmatter } from './frontmatter.js';

const H_SEP = '---';
const V_SEP = '--';

/* ------------------------------------------------------------ slide-attrs --- */

/**
 * Parseert de inhoud van een `<!-- .slide: ... -->`-comment naar een object.
 * Behoudt de attribuut-volgorde (belangrijk voor verliesvrij terugschrijven).
 */
export function parseSlideAttrs(attrsStr) {
  if (!attrsStr) return {};
  const inner = attrsStr
    .replace(/^<!--[ \t]*\.slide[ \t]*:?/, '')
    .replace(/-->[ \t]*$/, '')
    .trim();
  const out = {};
  const re = /([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*"([^"]*)"|([A-Za-z_:][-A-Za-z0-9_:.]*)/g;
  let m;
  while ((m = re.exec(inner))) {
    if (m[1] !== undefined) out[m[1]] = m[2];
    else if (m[3]) out[m[3]] = '';
  }
  return out;
}

/** Serialiseert een attribuut-object terug naar `<!-- .slide: ... -->`. */
export function serializeSlideAttrs(obj) {
  const parts = [];
  for (const [key, value] of Object.entries(obj || {})) {
    if (value === '' || value == null) parts.push(key);
    else parts.push(`${key}="${value}"`);
  }
  return parts.length ? `<!-- .slide: ${parts.join(' ')} -->` : '';
}

/* ---------------------------------------------------------- slide splitting -- */

/**
 * Vindt de slide-scheidingstekens in de body-regio (na de frontmatter).
 * Regel-gebaseerd zodat we exact dezelfde grenzen vinden als reveal.js: een
 * regel die exact `---` of `--` is, met een lege regel ervoor én erna. De
 * separator beslaat de newline vóór de marker t/m de newline na de lege regel
 * erna (== de regex `\n---\n\n`).
 *
 * @returns {{ texts: string[], separators: string[], fenceWarnings: number[] }}
 */
export function splitSlides(region) {
  const lines = [];
  let start = 0;
  while (start <= region.length) {
    const nl = region.indexOf('\n', start);
    if (nl === -1) {
      lines.push({ start, end: region.length, text: region.slice(start) });
      break;
    }
    lines.push({ start, end: nl + 1, text: region.slice(start, nl) });
    start = nl + 1;
  }

  const separators = [];
  const texts = [];
  const fenceWarnings = [];
  let inFence = false;
  let last = 0;

  for (let k = 0; k < lines.length; k += 1) {
    const text = lines[k].text.replace(/\r$/, '');
    if (/^[ \t]*```/.test(text)) {
      inFence = !inFence;
      continue;
    }
    if (text !== H_SEP && text !== V_SEP) continue;
    // reveal.js eist `\n---\n\n`: een newline vóór de marker (dus niet op de
    // allereerste regel) en een lege regel direct ná de marker. Een lege regel
    // vóór is níet nodig (de note-regel mag direct boven `---` staan).
    if (k === 0) continue;
    const next = k + 1 < lines.length ? lines[k + 1].text.replace(/\r$/, '') : null;
    if (next === null || next.trim() !== '') continue;

    const sepStart = lines[k - 1].end - 1;
    const sepEnd = lines[k + 1].end;
    if (inFence) fenceWarnings.push(k);
    texts.push(region.slice(last, sepStart));
    separators.push(region.slice(sepStart, sepEnd));
    last = sepEnd;
  }
  texts.push(region.slice(last));
  return { texts, separators, fenceWarnings };
}

/* ------------------------------------------------------------------ slide --- */

function makeSlide(text, sep, index) {
  const kind = sep.includes('\n---\n') ? 'horizontal' : sep.includes('\n--\n') ? 'vertical' : 'horizontal';

  // 1. `<!-- .slide: ... -->` aan het begin (alleen als er enkel whitespace vóór staat).
  let lead = '';
  let attrs = '';
  let rest = text;
  const am = /<!--[ \t]*\.slide[ \t]*:[\s\S]*?-->/.exec(text);
  if (am && text.slice(0, am.index).trim() === '') {
    lead = text.slice(0, am.index);
    attrs = am[0];
    rest = text.slice(am.index + am[0].length);
  }

  // 2. `Note:`-sprekersnotitie aan het einde (eerste regel-start `Note:`).
  let note = '';
  let before = rest;
  const nm = /(^|\n)([ \t]*)Note:([\s\S]*)$/.exec(rest);
  if (nm) {
    const noteStart = nm.index + nm[1].length;
    before = rest.slice(0, noteStart);
    note = rest.slice(noteStart);
  }

  // 3. Body + de omringende whitespace (gap1/gap2) apart houden.
  let gap1;
  let gap2;
  let body;
  if (before.trim() === '') {
    gap1 = before;
    gap2 = '';
    body = '';
  } else {
    gap1 = before.match(/^[ \t\r\n]*/)[0];
    gap2 = before.match(/[ \t\r\n]*$/)[0];
    body = before.slice(gap1.length, before.length - gap2.length);
  }

  return {
    index,
    kind,
    sep,
    lead,
    attrs,
    gap1,
    body,
    gap2,
    note,
    dirty: false,
    get attrsData() {
      return parseSlideAttrs(this.attrs);
    },
    /** De exacte tekst van deze slide zoals die in het bestand staat. */
    get raw() {
      return this.lead + this.attrs + this.gap1 + this.body + this.gap2 + this.note;
    },
    serialize() {
      return this.lead + this.attrs + this.gap1 + this.body + this.gap2 + this.note;
    },
    setBody(newBody) {
      this.body = newBody;
      this.dirty = true;
    },
    setAttrs(newAttrs) {
      this.attrs = newAttrs || '';
      this.dirty = true;
    },
    /** Zet de sprekersnotitie (zonder de `Note:`-prefix). */
    setNote(noteText) {
      if (noteText && noteText.trim() !== '') {
        if (!this.note) this.gap2 = '\n\n';
        this.note = `Note:\n${noteText.replace(/\s+$/, '')}`;
      } else {
        this.note = '';
      }
      this.dirty = true;
    },
    get noteText() {
      return this.note ? this.note.replace(/^Note:\r?\n?/, '').replace(/\s+$/, '') : '';
    },
  };
}

/* ------------------------------------------------------------------- deck --- */

/** Parseert een `slides.md`-bron naar een Deck-object. */
export function parseDeck(source) {
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  const frontmatter = parseFrontmatter(source);
  const fmLen = frontmatter ? frontmatter.block.length : 0;
  const bodyRegion = source.slice(fmLen);
  const { texts, separators, fenceWarnings } = splitSlides(bodyRegion);

  const slides = texts.map((text, i) => makeSlide(text, i === 0 ? '' : separators[i - 1], i));

  return {
    eol,
    frontmatter,
    slides,
    fenceWarnings,

    /** Serialiseert het hele deck terug naar Markdown (verliesvrij). */
    serialize() {
      return serializeDeck(this);
    },

    reindex() {
      this.slides.forEach((s, i) => {
        s.index = i;
      });
    },

    moveSlide(from, to) {
      if (from === to || from < 0 || to < 0 || from >= this.slides.length || to >= this.slides.length) return;
      const [s] = this.slides.splice(from, 1);
      this.slides.splice(to, 0, s);
      this.reindex();
    },

    removeSlide(index) {
      if (this.slides.length <= 1) return;
      this.slides.splice(index, 1);
      this.reindex();
    },

    duplicateSlide(index) {
      const src = this.slides[index];
      const copy = makeSlide(src.raw, src.kind === 'vertical' ? '\n--\n\n' : '\n---\n\n', index + 1);
      copy.dirty = true;
      this.slides.splice(index + 1, 0, copy);
      this.reindex();
    },

    /**
     * Voegt een slide toe (standaard horizontaal).
     * @param {number} index
     * @param {{ vertical?: boolean, body?: string|null }} opts  `body` overschrijft
     *   de standaard-inhoud (gebruikt door de "+ Nieuwe Slide"-snelkeuze).
     */
    insertSlide(index, { vertical = false, body = null } = {}) {
      const sep = vertical ? '\n--\n\n' : '\n---\n\n';
      const defaultBody = '<!-- .slide: class="dark" data-background-color="#111111" -->\n\n'
        + '## Nieuwe slide\n\n'
        + `<div class="footer"><span>Vak · Onderwerp</span><span class="num">${String(index + 1).padStart(2, '0')}</span></div>`;
      const fresh = makeSlide(body != null ? body : defaultBody, sep, index);
      fresh.dirty = true;
      this.slides.splice(index, 0, fresh);
      this.reindex();
      return fresh;
    },
  };
}

/** Serialiseert een Deck terug naar Markdown. */
export function serializeDeck(deck) {
  let out = deck.frontmatter ? deck.frontmatter.serialize() : '';
  for (const slide of deck.slides) out += slide.sep + slide.serialize();
  return out;
}

