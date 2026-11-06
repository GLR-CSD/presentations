/**
 * Lokale `input/`-map: lijst + tekstextractie (md/txt/html/csv/json, pptx, pdf).
 */
import fs from 'node:fs';
import path from 'node:path';
import { unzipSync, strFromU8 } from 'fflate';

export const INPUT_UNAVAILABLE = 'De `input/` map kan alleen lokaal worden uitgelezen; dat kan niet in een online omgeving of zonder lokale kopie van de repository. Plak de brontekst (of de inhoud van je document) direct in de chat.';

const TEXT_EXT = /\.(md|txt|csv|json)$/i;
const HTML_EXT = /\.html?$/i;

export function xmlDecode(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');
}

export function htmlToText(html) {
  return xmlDecode(String(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6]|tr|section)>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Tekst uit een DrawingML-slide: alinea's (`a:p`) met hun `a:t`-runs. */
export function drawingText(xml) {
  const paras = [];
  for (const p of xml.match(/<a:p[ >][\s\S]*?<\/a:p>/g) || []) {
    const t = (p.match(/<a:t(?: [^>]*)?>([\s\S]*?)<\/a:t>/g) || [])
      .map((r) => xmlDecode(r.replace(/<[^>]+>/g, ''))).join('');
    if (t.trim()) paras.push(t.trim());
  }
  return paras.join('\n');
}

/** Pptx → [{ slide, text, notes }], numeriek gesorteerd op slidenummer. */
export function extractPptx(buffer) {
  const files = unzipSync(new Uint8Array(buffer));
  const numbered = (re) => Object.keys(files)
    .map((name) => ({ name, m: re.exec(name) }))
    .filter((x) => x.m)
    .map((x) => ({ name: x.name, n: Number(x.m[1]) }))
    .sort((a, b) => a.n - b.n);
  const notes = new Map(numbered(/^ppt\/notesSlides\/notesSlide(\d+)\.xml$/).map((f) => [f.n, drawingText(strFromU8(files[f.name]))]));
  return numbered(/^ppt\/slides\/slide(\d+)\.xml$/).map((f) => ({
    slide: f.n, text: drawingText(strFromU8(files[f.name])), notes: notes.get(f.n) || '',
  }));
}

export class InputDocs {
  constructor(workspace) { this.ws = workspace; }

  status() {
    try {
      const st = fs.statSync(this.ws.inputDir);
      if (!st.isDirectory()) return { available: false, message: INPUT_UNAVAILABLE };
      fs.readdirSync(this.ws.inputDir);
      return { available: true, dir: this.ws.inputDir };
    } catch {
      return { available: false, message: INPUT_UNAVAILABLE };
    }
  }

  list() {
    const st = this.status();
    if (!st.available) return st;
    const files = fs.readdirSync(this.ws.inputDir, { withFileTypes: true })
      .filter((e) => e.isFile() && !e.name.startsWith('.'))
      .map((e) => {
        const size = fs.statSync(path.join(this.ws.inputDir, e.name)).size;
        const ext = path.extname(e.name).toLowerCase().slice(1);
        return { name: e.name, type: ext, size, readable: TEXT_EXT.test(e.name) || HTML_EXT.test(e.name) || ext === 'pptx' || ext === 'pdf' };
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'nl'));
    return { available: true, files };
  }

  async read(name, maxChars = 40000) {
    const st = this.status();
    if (!st.available) return st;
    if (!name || name !== path.basename(name)) throw new Error('Geef alleen een bestandsnaam uit input/ op (geen pad).');
    const abs = path.join(this.ws.inputDir, name);
    if (!fs.existsSync(abs)) throw new Error(`Bestand niet gevonden in input/: ${name}. Gebruik list_input_documents.`);
    const buf = fs.readFileSync(abs);
    let text;
    let format;
    if (/\.pptx$/i.test(name)) {
      format = 'pptx';
      text = extractPptx(buf).map((s) => `## Slide ${s.slide}\n${s.text}${s.notes ? `\n\nNotities: ${s.notes}` : ''}`).join('\n\n');
    } else if (/\.pdf$/i.test(name)) {
      format = 'pdf';
      const { extractText, getDocumentProxy } = await import('unpdf');
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      const { text: pages } = await extractText(pdf, { mergePages: false });
      text = pages.map((t, i) => `## Pagina ${i + 1}\n${t.trim()}`).join('\n\n');
    } else if (HTML_EXT.test(name)) {
      format = 'html';
      text = htmlToText(buf.toString('utf8'));
    } else if (TEXT_EXT.test(name)) {
      format = 'text';
      text = buf.toString('utf8');
    } else {
      throw new Error(`Bestandstype niet ondersteund: ${name}. Ondersteund: .md .txt .csv .json .html .pptx .pdf. Plak anders de tekst in de chat.`);
    }
    const truncated = text.length > maxChars;
    return { available: true, name, format, chars: text.length, truncated, text: truncated ? text.slice(0, maxChars) : text };
  }
}
