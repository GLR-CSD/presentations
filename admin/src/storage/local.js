/**
 * Lokale, offline opslag via de File System Access API + een download-fallback
 * voor browsers zonder die API (bijv. Firefox).
 */

export function supportsFileSystemAccess() {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';
}

/** Laat de gebruiker de presentatiemap (repo-root of presentations/) kiezen. */
export async function pickDirectory() {
  if (!supportsFileSystemAccess()) throw new Error('File System Access API wordt niet ondersteund in deze browser.');
  return window.showDirectoryPicker({ mode: 'readwrite' });
}

/** Leest een bestand op een relatief pad binnen een gekozen map. */
export async function readFileFromDir(dirHandle, relativePath) {
  const parts = relativePath.split('/').filter(Boolean);
  let dir = dirHandle;
  for (const part of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(part);
  const fileHandle = await dir.getFileHandle(parts[parts.length - 1]);
  const file = await fileHandle.getFile();
  return file.text();
}

/** Schrijft een bestand op een relatief pad binnen een gekozen map. */
export async function writeFileToDir(dirHandle, relativePath, content) {
  const parts = relativePath.split('/').filter(Boolean);
  let dir = dirHandle;
  for (const part of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(part, { create: true });
  const fileHandle = await dir.getFileHandle(parts[parts.length - 1], { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

/** Schrijft binaire data (bijv. een afbeelding) op een relatief pad. */
export async function writeBlobToDir(dirHandle, relativePath, blob) {
  const parts = relativePath.split('/').filter(Boolean);
  let dir = dirHandle;
  for (const part of parts.slice(0, -1)) dir = await dir.getDirectoryHandle(part, { create: true });
  const fileHandle = await dir.getFileHandle(parts[parts.length - 1], { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}

/** Download-fallback: biedt de tekst aan als bestand. */
export function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Laadt een lokaal gekozen bestand via een <input type="file">. */
export function pickLocalFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,text/markdown';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      resolve(file ? { name: file.name, text: await file.text() } : null);
    };
    input.click();
  });
}

/**
 * Opent een lokaal .md-bestand en behoudt (indien de browser het toestaat) het
 * FileSystemFileHandle, zodat "Opslaan" direct naar hetzelfde bestand kan
 * wegschrijven. Valt terug op `pickLocalFile` (zonder handle) in browsers
 * zonder File System Access API (bijv. Firefox).
 */
export async function pickLocalFileForWrite() {
  if (typeof window !== 'undefined' && typeof window.showOpenFilePicker === 'function') {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md', '.markdown'] } }],
      });
      const file = await handle.getFile();
      return { name: file.name, text: await file.text(), handle };
    } catch {
      return null;
    }
  }
  return pickLocalFile();
}

/** Schrijft tekst weg naar een eerder geopend FileSystemFileHandle. */
export async function writeLocalFile(handle, content) {
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}


const TEXT_INPUT = /\.(md|txt|html?|csv|json)$/i;

/**
 * Bestanden in de `input/`-map van de gekoppelde repo-map.
 * Gooit als er geen `input/` is. `readable=false` voor PDF/PPTX (alleen via MCP).
 * @returns {Promise<Array<{name:string, readable:boolean}>>}
 */
export async function listInputFiles(dirHandle) {
  const input = await dirHandle.getDirectoryHandle('input');
  const out = [];
  for await (const [name, handle] of input.entries()) {
    if (handle.kind !== 'file' || name.startsWith('.')) continue;
    out.push({ name, readable: TEXT_INPUT.test(name) });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, 'nl'));
}

/** Leest een tekstbestand uit `input/`; HTML wordt omgezet naar platte tekst. */
export async function readInputText(dirHandle, name) {
  const input = await dirHandle.getDirectoryHandle('input');
  const file = await (await input.getFileHandle(name)).getFile();
  const text = await file.text();
  if (!/\.html?$/i.test(name)) return text;
  const doc = new DOMParser().parseFromString(text, 'text/html');
  doc.querySelectorAll('script,style').forEach((n) => n.remove());
  return (doc.body.innerText || doc.body.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
}
