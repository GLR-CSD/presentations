/**
 * Didactische Coach: regel-gebaseerde, vrijblijvende tips met acties van één klik.
 *
 * Puur (geen DOM): `analyzeSlide()` geeft tips terug en elke actie is een functie
 * `run(body, note) → { body, note, focus? }`. De UI (coach-panel.js) voert die
 * uit via de gewone commit-route en biedt altijd "Ongedaan maken".
 *
 * Principes (zie skill `educational-presentation-nl`):
 *   - Mayer · Segmentatie: progressive disclosure bij 3+ items
 *   - Mayer · Redundantie: lopende tekst hoort in de sprekersnotities
 *   - Mayer · Signalering: regel-focus in langere codeblokken
 *   - Assertion-Evidence: de titel is de conclusie (een stelling)
 */
import * as T from '../blocks/html-tree.js';
import * as B from '../blocks/block-ops.js';
import { bodyToDoc, blockToMarkdown } from '../markdown/bridge.js';
import { classifySlide } from './phases.js';

export const SEGMENT_MIN_ITEMS = 3;
export const REDUNDANCY_WORDS = 55;
export const CODE_MIN_LINES = 8;

const ELEMENT_COMMENT = /\s*<!--\s*\.element:[^>]*-->\s*$/;
const isWord = (w) => /[\p{L}\p{N}]/u.test(w);
export const countWords = (text) => String(text || '').split(/\s+/).filter(isWord).length;
const docBlocks = (body) => bodyToDoc(body || '').content;

/* ------------------------------------------------------------ segmentatie --- */

/** Items van een HTML-container die stapsgewijs kunnen verschijnen. */
function htmlItemsOf(node) {
  const kids = T.elementChildren(node);
  if (T.hasClass(node, 'cards')) return { kind: 'kaarten', items: kids.filter((c) => T.hasClass(c, 'glr-card') || T.hasClass(c, 'card')) };
  if (T.hasClass(node, 'rows')) return { kind: 'stappen', items: kids.filter((c) => T.hasClass(c, 'listrow')) };
  if (node.tag === 'ul' || node.tag === 'ol') return { kind: 'lijstitems', items: kids.filter((c) => c.tag === 'li') };
  return null;
}

/**
 * Alle lijsten/kaartrijen met ≥ 3 items.
 * @returns {Array<{ blockIndex:number, path:number[], kind:string, md:boolean, count:number, fragments:number }>}
 */
export function findSegmentables(body) {
  const out = [];
  docBlocks(body).forEach((node, bi) => {
    if (node.type === 'bulletList' || node.type === 'orderedList') {
      const items = node.content || [];
      const fragments = items.filter((it) => { const p = (it.content || [])[0]; return p && p.type === 'paragraph' && B.hasInlineFragment(p.content); }).length;
      if (items.length >= SEGMENT_MIN_ITEMS) out.push({ blockIndex: bi, path: [], kind: 'lijstitems', md: true, count: items.length, fragments });
      return;
    }
    if (node.type !== 'htmlBlock') return;
    const html = node.attrs.html;
    T.walk(T.parse(html), (el, p) => {
      if (T.hasClass(el, 'footer') || T.hasClass(el, 'timer')) return false;
      const r = htmlItemsOf(el);
      if (r && r.items.length >= SEGMENT_MIN_ITEMS) {
        out.push({ blockIndex: bi, path: p, kind: r.kind, md: false, count: r.items.length, fragments: r.items.filter((it) => T.hasClass(it, 'fragment')).length });
      }
      return true;
    });
  });
  return out;
}

/** Zet `fragment` op alle items van één segmenteerbare container (of haalt hem weg). */
export function setItemsFragment(body, target, on) {
  if (target.md) {
    const block = B.blocksOf(body)[target.blockIndex];
    if (!block || !Array.isArray(block.content)) return body;
    const content = block.content.map((it) => {
      const kids = [...(it.content || [])];
      if (kids[0] && kids[0].type === 'paragraph') kids[0] = { ...kids[0], content: B.setInlineFragment(kids[0].content, on) };
      return { ...it, content: kids };
    });
    return B.replaceBlock(body, target.blockIndex, { ...block, content });
  }
  let html = B.htmlAt(body, target.blockIndex);
  if (html == null) return body;
  const count = (htmlItemsOf(T.nodeAt(T.parse(html), target.path)) || { items: [] }).items.length;
  for (let i = count - 1; i >= 0; i -= 1) {
    const node = T.nodeAt(T.parse(html), target.path);
    const item = node && htmlItemsOf(node).items[i];
    if (item && T.hasClass(item, 'fragment') !== !!on) html = T.setClass(html, item, 'fragment', !!on);
  }
  return B.setHtmlAt(body, target.blockIndex, html);
}

/* ------------------------------------------------------------ redundantie --- */

const NON_PROSE_CLS = ['footer', 'timer', 'k', 'n', 'kicker', 'terminal-window', 'pill'];
const NON_PROSE_TAG = new Set(['pre', 'code', 'svg', 'h1', 'h2', 'figcaption', 'button', 'script', 'style']);
const skipProse = (el) => NON_PROSE_TAG.has(el.tag) || NON_PROSE_CLS.some((c) => T.hasClass(el, c));

/** Lopende tekst van een HTML-blok (zonder footer, code, labels en titels). */
function htmlProse(html) {
  const root = T.parse(html);
  const cut = [];
  T.walk(root, (el) => { if (skipProse(el)) { cut.push([el.start, el.end]); return false; } return true; });
  let text = '';
  let at = 0;
  for (const [s, e] of cut) { text += html.slice(at, s); at = e; }
  text += html.slice(at);
  return T.decodeEntities(text.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]*>/g, ' '));
}

const PROSE_MD = new Set(['paragraph', 'bulletList', 'orderedList', 'blockquote']);
const mdText = (node) => blockToMarkdown(node).replace(ELEMENT_COMMENT, '').trim();

/** Aantal woorden lopende tekst op de slide (buiten codeblokken, koppen, labels en footer). */
export function proseWordCount(body) {
  let n = 0;
  for (const node of docBlocks(body)) {
    if (PROSE_MD.has(node.type)) n += countWords(mdText(node).replace(/<[^>]*>/g, ' ').replace(/[*_`#>-]/g, ' '));
    else if (node.type === 'htmlBlock') n += countWords(htmlProse(node.attrs.html));
  }
  return n;
}

/**
 * Tekstblokken die naar de notities kunnen: Markdown-alinea/lijst/citaat of een HTML-`<p>`.
 * @returns {Array<{ blockIndex:number, path:number[]|null, text:string, words:number }>}
 */
export function proseCandidates(body) {
  const out = [];
  docBlocks(body).forEach((node, bi) => {
    if (PROSE_MD.has(node.type)) {
      const text = mdText(node);
      if (text) out.push({ blockIndex: bi, path: null, text, words: countWords(text) });
    } else if (node.type === 'htmlBlock') {
      const html = node.attrs.html;
      T.walk(T.parse(html), (el, p) => {
        if (skipProse(el)) return false;
        if (el.tag === 'p') {
          const text = T.textOf(html, el).replace(/\s+/g, ' ').trim();
          if (text) out.push({ blockIndex: bi, path: p, text, words: countWords(text) });
          return false;
        }
        return true;
      });
    }
  });
  return out;
}

/** Kandidaat die bij de huidige selectie hoort (of null). */
export function selectedCandidate(candidates, sel) {
  if (!sel) return null;
  const sameBlock = candidates.filter((c) => c.blockIndex === sel.blockIndex);
  const md = sameBlock.find((c) => c.path === null);
  if (md) return md;
  const paths = [sel.highlight || [], sel.path || []].map((p) => p.join('.'));
  return sameBlock.find((c) => paths.includes(c.path.join('.'))) || null;
}

/** Verplaatst een tekstblok naar de docentnotitie (achteraan). */
export function moveToNotes(body, note, cand) {
  let nextBody;
  if (cand.path === null) nextBody = B.removeBlock(body, cand.blockIndex);
  else {
    const html = B.htmlAt(body, cand.blockIndex);
    const node = html != null && T.nodeAt(T.parse(html), cand.path);
    if (!node) return { body, note };
    const out = T.removeNode(html, node);
    nextBody = T.elementChildren(T.parse(out)).length ? B.setHtmlAt(body, cand.blockIndex, out) : B.removeBlock(body, cand.blockIndex);
  }
  const cur = String(note || '').replace(/\s+$/, '');
  return { body: nextBody, note: cur ? `${cur}\n\n${cand.text}` : cand.text };
}

/* -------------------------------------------------------------- signalering --- */

/** Stelt een stapsgewijze regel-focus voor: per alinea (lege regels), anders in stukken van 4. */
export function suggestRanges(code) {
  const lines = String(code || '').replace(/\n+$/, '').split('\n');
  const groups = [];
  let start = null;
  lines.forEach((l, i) => {
    if (l.trim() === '') { if (start !== null) { groups.push([start, i]); start = null; } }
    else if (start === null) start = i + 1;
  });
  if (start !== null) groups.push([start, lines.length]);
  let ranges = groups;
  if (groups.length <= 1) {
    ranges = [];
    for (let a = 1; a <= lines.length; a += 4) ranges.push([a, Math.min(lines.length, a + 3)]);
  }
  return ranges.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join('|');
}

const lineCount = (code) => String(code || '').replace(/\n+$/, '').split('\n').length;

/**
 * Codeblokken van ≥ 8 regels zonder regel-focus.
 * @returns {Array<{ blockIndex:number, path:number[]|null, selectPath:number[]|null, code:string, lines:number }>}
 */
export function findUnfocusedCode(body) {
  const out = [];
  docBlocks(body).forEach((node, bi) => {
    if (node.type === 'codeBlock') {
      const code = (node.content || []).map((c) => c.text || '').join('');
      if (!node.attrs.highlight && lineCount(code) >= CODE_MIN_LINES) out.push({ blockIndex: bi, path: null, selectPath: null, code, lines: lineCount(code) });
    } else if (node.type === 'htmlBlock') {
      const html = node.attrs.html;
      T.walk(T.parse(html), (el, p) => {
        if (el.tag !== 'code' || !el.parent || el.parent.tag !== 'pre') return true;
        const code = T.rawTextOf(html, el);
        if (!T.hasAttr(el, 'data-line-numbers') && lineCount(code) >= CODE_MIN_LINES) {
          out.push({ blockIndex: bi, path: p, selectPath: p.slice(0, -1), code, lines: lineCount(code) });
        }
        return false;
      });
    }
  });
  return out;
}

/** Zet de regel-focus op een codeblok (Markdown-fence `[..]` of HTML `data-line-numbers`). */
export function applyLineFocus(body, target, ranges) {
  if (target.path === null) {
    const block = B.blocksOf(body)[target.blockIndex];
    if (!block || block.type !== 'codeBlock') return body;
    return B.replaceBlock(body, target.blockIndex, { ...block, attrs: { ...block.attrs, highlight: ranges } });
  }
  const html = B.htmlAt(body, target.blockIndex);
  const node = html != null && T.nodeAt(T.parse(html), target.path);
  return node ? B.setHtmlAt(body, target.blockIndex, T.setAttr(html, node, 'data-line-numbers', ranges)) : body;
}

/* ---------------------------------------------------------- AE-titel --- */

/** Hoofdtitel (eerste h1/h2) van de slide: `{ blockIndex, path, text }` of null. */
export function mainTitle(body) {
  const blocks = docBlocks(body);
  for (let bi = 0; bi < blocks.length; bi += 1) {
    const node = blocks[bi];
    if (node.type === 'heading' && node.attrs.level <= 2) {
      return { blockIndex: bi, path: null, text: blockToMarkdown(node).replace(ELEMENT_COMMENT, '').replace(/^#+\s*/, '').trim() };
    }
    if (node.type === 'htmlBlock') {
      let hit = null;
      T.walk(T.parse(node.attrs.html), (el, p) => {
        if (hit || T.hasClass(el, 'footer')) return false;
        if (el.tag === 'h1' || el.tag === 'h2') { hit = { blockIndex: bi, path: p, text: T.textOf(node.attrs.html, el).trim() }; return false; }
        return true;
      });
      if (hit) return hit;
    }
  }
  return null;
}

/** Geeft de titel-tip als de hoofdtitel van een inhoudsslide maar 1–2 woorden telt. */
export function titleTip(slide) {
  const phase = classifySlide(slide).id;
  if (phase !== 'theorie' && phase !== 'code') return null;
  const t = mainTitle(slide.body);
  if (!t || !t.text) return null;
  const words = countWords(t.text);
  if (words > 2) return null;
  return {
    title: t,
    text: `"${t.text}" is een onderwerp. Maak er een stelling van die de kernboodschap uitspreekt (max. 12–15 woorden). `
      + 'Bijvoorbeeld: niet "Onderzoeksresultaten" maar "Studenten onthouden 40% meer met gesproken uitleg". '
      + 'Voor een sectie-, agenda- of overgangsslide is een onderwerp als titel prima.',
  };
}

/* ---------------------------------------------------------------- analyse --- */

const snippet = (s, n = 48) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/**
 * @param {{ body:string, noteText?:string, attrsData?:object }} slide
 * @param {object|null} selection
 * @returns {Array<{ id:string, principle:string, title:string, text:string, actions:Array<{ label:string, run:(body:string, note:string)=>{body:string,note:string,focus?:object} }> }>}
 */
export function analyzeSlide(slide, selection = null) {
  const body = slide.body || '';
  const tips = [];

  // 1. Segmentatie
  for (const s of findSegmentables(body)) {
    const id = `segment:${s.blockIndex}:${(s.path || []).join('.')}`;
    if (s.fragments === 0) {
      tips.push({
        id, principle: 'Mayer · Segmentatie', title: `${s.count} ${s.kind} tegelijk in beeld`,
        text: 'Laat ze één voor één verschijnen. Dan volgt de klas je verhaal en leest niet vooruit.',
        actions: [{ label: '✨ Laat items één-voor-één verschijnen bij klik', primary: true, run: (b, n) => ({ body: setItemsFragment(b, s, true), note: n }) }],
      });
    } else if (s.fragments === s.count) {
      tips.push({
        id, principle: 'Mayer · Segmentatie', title: `${s.count} ${s.kind} verschijnen stapsgewijs`,
        text: 'Deze items verschijnen al één voor één. Wil je ze toch in één keer tonen?',
        actions: [{ label: 'Toon weer alles tegelijk', run: (b, n) => ({ body: setItemsFragment(b, s, false), note: n }) }],
        quiet: true,
      });
    }
  }

  // 2. Redundantie
  const words = proseWordCount(body);
  if (words > REDUNDANCY_WORDS) {
    const cands = proseCandidates(body);
    const picked = selectedCandidate(cands, selection);
    const longest = cands.slice().sort((a, b) => b.words - a.words)[0];
    const cand = picked || longest;
    tips.push({
      id: 'redundancy', principle: 'Mayer · Redundantie', title: `Veel leestekst (${words} woorden)`,
      text: 'Veel leestekst op één slide kan afleiden van je verhaal. Zet de uitleg in je notities en houd op de slide alleen kernwoorden en beeld.',
      actions: cand ? [{
        label: picked ? 'Verplaats deze alinea naar Docentnotities' : `Verplaats de langste alinea naar Docentnotities ("${snippet(cand.text, 32)}")`,
        run: (b, n) => moveToNotes(b, n, cand),
      }] : [],
      hint: picked ? '' : 'Tip: selecteer een alinea op de slide om precies die te verplaatsen.',
    });
  }

  // 3. Signalering
  for (const c of findUnfocusedCode(body)) {
    const ranges = suggestRanges(c.code);
    tips.push({
      id: `code:${c.blockIndex}:${(c.path || []).join('.')}`, principle: 'Mayer · Signalering', title: `Codeblok van ${c.lines} regels`,
      text: `Loop stap voor stap door de code met regel-focus, bijvoorbeeld ${ranges}. Zo kijkt iedereen naar dezelfde regels.`,
      actions: [{
        label: 'Voeg stapsgewijze regel-focus toe',
        run: (b, n) => ({ body: applyLineFocus(b, c, ranges), note: n, focus: { blockIndex: c.blockIndex, path: c.selectPath, field: 'Regel-highlights' } }),
      }],
    });
  }

  // 4. Assertion-Evidence-titel
  const tt = titleTip(slide);
  if (tt) {
    tips.push({ id: 'ae-title', principle: 'Assertion-Evidence', title: 'Titel als stelling?', text: tt.text, actions: [] });
  }
  return tips;
}
