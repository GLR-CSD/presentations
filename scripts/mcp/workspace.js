/**
 * Werkmap-toegang voor de MCP-server: veilige paden + verliesvrij lezen/schrijven van decks.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDeck, serializeDeck } from '../../admin/src/state/deck.js';

export const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export class Workspace {
  constructor(root = process.env.GLR_REPO_ROOT || DEFAULT_ROOT) {
    this.root = path.resolve(root);
    this.presentations = path.join(this.root, 'presentations');
    this.inputDir = path.join(this.root, 'input');
  }

  /** `design1_logos`, `presentations/x` of `presentations/x/slides.md` → relatief slides.md-pad. */
  deckRel(input) {
    let p = String(input || '').trim().replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\/+/, '');
    if (!p) throw new Error('Geen presentatie-pad opgegeven.');
    if (!p.startsWith('presentations/')) p = `presentations/${p}`;
    if (!/\.md$/i.test(p)) p = `${p.replace(/\/+$/, '')}/slides.md`;
    const abs = path.resolve(this.root, p);
    if (path.relative(this.presentations, abs).startsWith('..') || p.split('/').includes('..')) {
      throw new Error('Ongeldig pad: alleen presentaties onder presentations/ zijn toegestaan.');
    }
    return path.relative(this.root, abs).split(path.sep).join('/');
  }

  abs(rel) { return path.join(this.root, rel); }

  exists(rel) { return fs.existsSync(this.abs(rel)); }

  loadDeck(input) {
    const rel = this.deckRel(input);
    if (!this.exists(rel)) throw new Error(`Presentatie niet gevonden: ${rel}. Gebruik list_presentations voor de beschikbare decks.`);
    const source = fs.readFileSync(this.abs(rel), 'utf8');
    return { rel, source, deck: parseDeck(source) };
  }

  /** Atomair wegschrijven (tmp + rename). */
  writeFile(rel, content) {
    const abs = this.abs(rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    const tmp = `${abs}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, content);
    fs.renameSync(tmp, abs);
  }

  saveDeck(rel, deck) {
    const text = serializeDeck(deck);
    this.writeFile(rel, text);
    return text;
  }

  /** Alle decks onder presentations/ (slides.md, of .md met frontmatter). */
  scanDecks() {
    const out = [];
    const walk = (dir) => {
      if (!fs.existsSync(dir)) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) { walk(full); continue; }
        if (!e.isFile() || !/\.md$/i.test(e.name)) continue;
        let text;
        try { text = fs.readFileSync(full, 'utf8'); } catch { continue; }
        if (e.name !== 'slides.md' && !/^(---|<!--\s*frontmatter)/.test(text)) continue;
        const deck = parseDeck(text);
        const fm = deck.frontmatter ? deck.frontmatter.toObject() : {};
        out.push({
          path: path.relative(this.root, full).split(path.sep).join('/'),
          title: fm.title || path.basename(path.dirname(full)),
          cohort: fm.cohort || '', leerjaar: fm.leerjaar ?? '', periode: fm.periode ?? '',
          auteur: fm.auteur || '', tags: Array.isArray(fm.tags) ? fm.tags : [],
          slides: deck.slides.length,
        });
      }
    };
    walk(this.presentations);
    return out.sort((a, b) => a.path.localeCompare(b.path));
  }
}

/** 1-based slide → slide-object, met duidelijke fout. */
export function slideAt(deck, n) {
  const i = Number(n) - 1;
  if (!Number.isInteger(i) || i < 0 || i >= deck.slides.length) {
    throw new Error(`Slide ${n} bestaat niet (dit deck heeft ${deck.slides.length} slides, genummerd vanaf 1).`);
  }
  return deck.slides[i];
}
