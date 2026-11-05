/**
 * GitHub-sync via Octokit — direct naar `main`, geen Pull Requests.
 *
 * Meerdere gewijzigde bestanden (bijv. slides.md + een geüploade afbeelding)
 * worden als **één atomaire commit** weggeschreven via de Git Data API
 * (blob → tree → commit → ref-update), zodat de deploy-workflow maar één keer
 * draait. Octokit wordt pas geladen wanneer je daadwerkelijk synchroniseert
 * (dynamische import → aparte chunk, offline niet nodig).
 */
import { parseFrontmatter } from '../state/frontmatter.js';

const DEFAULT_REPO = { owner: 'GLR-CSD', repo: 'presentations', branch: 'main' };

let octokit = null;

/** Maakt (of hergebruikt) de Octokit-client met een PAT. */
export async function connect(token) {
  const { Octokit } = await import('octokit');
  octokit = new Octokit({ auth: token });
  return octokit;
}

/**
 * Valideert een token door de repository op te vragen (`GET /repos/{owner}/{repo}`).
 * Gooit een fout bij een ongeldig token (401) of ontbrekende repo-toegang (404).
 * @returns {Promise<object>} de repo-metadata (o.a. `full_name`, `private`).
 */
export async function validateToken(token, opts = {}) {
  const { owner, repo } = { ...DEFAULT_REPO, ...opts };
  const api = await connect(token);
  const res = await api.rest.repos.get({ owner, repo });
  return res.data;
}


function client() {
  if (!octokit) throw new Error('Niet verbonden met GitHub. Voer eerst een token in.');
  return octokit;
}

/** Leest de volledige bestandsboom en leidt daar de decks uit af. */
export async function listDecks(opts = {}) {
  const { owner, repo, branch } = { ...DEFAULT_REPO, ...opts };
  const ref = await client().rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const tree = await client().rest.git.getTree({ owner, repo, tree_sha: ref.data.object.sha, recursive: 'true' });
  const files = tree.data.tree.filter((t) => t.type === 'blob');

  const decks = [];
  for (const f of files) {
    if (!/^presentations\/.*\.md$/i.test(f.path)) continue;
    const base = f.path.replace(/\.md$/i, '');
    const isSlides = /\/slides\.md$/i.test(f.path);
    const htmlPath = isSlides ? `${f.path.replace(/\/slides\.md$/i, '')}/index.html` : `${base}.html`;
    const hasHtml = files.some((x) => x.path === htmlPath);
    // Alleen echte decks (slides.md of een .md met frontmatter) — we lezen de
    // frontmatter niet hier (te veel requests); slides.md is altijd een deck.
    if (!isSlides) continue;
    decks.push({
      md: f.path,
      html: hasHtml ? htmlPath : null,
      title: f.path.replace(/^presentations\//, '').replace(/\/slides\.md$/, '').split('/').pop(),
      family: 'markdown',
      source: 'github',
    });
  }
  return decks;
}

/** Leest één bestand uit de repo (tekst). */
export async function readTextFile(path, opts = {}) {
  const { owner, repo, branch } = { ...DEFAULT_REPO, ...opts };
  const res = await client().rest.repos.getContent({ owner, repo, path, ref: branch });
  const data = res.data;
  if (Array.isArray(data) || !data.content) throw new Error(`${path} is geen bestand.`);
  return { text: decodeBase64(data.content), sha: data.sha };
}

/** Haalt de frontmatter-metadata van een deck op (zonder het hele bestand te tonen). */
export async function readDeckMeta(path, opts = {}) {
  const { text } = await readTextFile(path, opts);
  const fm = parseFrontmatter(text);
  return fm ? fm.toObject() : {};
}

/**
 * Schrijft meerdere bestanden in één atomaire commit naar de branch.
 * @param {string} message commit-message
 * @param {Array<{path:string,content:string,encoding?:'utf-8'|'base64'}>} files
 */
export async function commitFiles(message, files, opts = {}) {
  const { owner, repo, branch } = { ...DEFAULT_REPO, ...opts };
  const api = client();

  const ref = await api.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const baseSha = ref.data.object.sha;
  const baseCommit = await api.rest.git.getCommit({ owner, repo, commit_sha: baseSha });

  const blobs = [];
  for (const f of files) {
    const res = await api.rest.git.createBlob({
      owner, repo,
      content: f.encoding === 'base64' ? f.content : f.content,
      encoding: f.encoding || 'utf-8',
    });
    blobs.push({ path: f.path, mode: '100644', type: 'blob', sha: res.data.sha });
  }

  const tree = await api.rest.git.createTree({ owner, repo, base_tree: baseCommit.data.tree.sha, tree: blobs });
  const commit = await api.rest.git.createCommit({ owner, repo, message, tree: tree.data.sha, parents: [baseSha] });
  await api.rest.git.updateRef({ owner, repo, ref: `heads/${branch}`, sha: commit.data.sha });
  return commit.data.sha;
}

/** Uploadt een afbeelding (base64) naar shared/img/uploads/. */
export function uploadImageBase64(filename, base64) {
  return { path: `shared/img/uploads/${filename}`, content: base64, encoding: 'base64' };
}

function decodeBase64(b64) {
  const clean = b64.replace(/\n/g, '');
  const binary = atob(clean);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export { DEFAULT_REPO };
