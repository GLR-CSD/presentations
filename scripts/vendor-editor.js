#!/usr/bin/env node
/**
 * Bundelt de GLR Slide Studio (admin/) offline-first naar `admin/vendor/`.
 *
 * Net als `vendor-reveal.js` en `vendor-plugins.js` is dit een build-stap die
 * alleen bij `npm run vendor` draait; de output is een gegenereerd artefact en
 * staat in .gitignore. De studio laadt daarna **geen enkele externe CDN**: alle
 * libraries (Tiptap/ProseMirror, CodeMirror 6, SortableJS, markdown-it) zitten
 * in de bundel. Octokit (alleen nodig bij GitHub-sync) wordt als los chunk
 * gebundeld en pas bij gebruik dynamisch geladen.
 *
 * Gebruik:  npm run vendor
 */
import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'admin', 'src');
const outDir = path.join(root, 'admin', 'vendor');

const entryStudio = path.join(srcDir, 'studio.js');
if (!fs.existsSync(entryStudio)) {
  console.error('✖ admin/src/studio.js niet gevonden.');
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [entryStudio, path.join(srcDir, 'studio.css')],
  outdir: outDir,
  bundle: true,
  format: 'esm',
  splitting: true, // lazy chunks (o.a. octokit) via dynamische import()
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  entryNames: '[name]',
  chunkNames: 'chunks/[name]-[hash]',
  loader: { '.ttf': 'file', '.woff2': 'file', '.svg': 'file' },
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'info',
});

console.log('✔ GLR Slide Studio gebundeld naar admin/vendor/ (offline, geen CDN).');
