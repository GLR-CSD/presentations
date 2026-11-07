/**
 * Offline Tech-Logo's & Dev-Iconen catalogus voor de GLR Slide Studio.
 *
 * 32 ingebakken, vereenvoudigde vector-iconen (viewBox 64×64). Elk icoon is
 * een lijst vormen met een kleur-ROL (p = hoofdkleur, a = accent, m = middentint,
 * k = uitsparing/contrast). De kleurvariant bepaalt wat die rollen worden, zodat
 * hetzelfde icoon in merkkleuren, GLR Lime, wit of donker kan worden geleverd.
 * Het resultaat is een zelfstandige SVG (of `data:`-URI) die direct in elk
 * `<figure><img></figure>` werkt — zonder netwerk, zonder bestanden.
 *
 * Let op: dit zijn herkenbare, eigen vereenvoudigde weergaven, geen officiële logo-bestanden.
 */

export const TECH_CATEGORIES = ['Talen', 'Frameworks & Engines', 'Tools & Design', 'Concepten'];

export const ICON_VARIANTS = [
  { id: 'brand', label: 'Merkkleur' },
  { id: 'lime', label: 'GLR Lime' },
  { id: 'white', label: 'Wit' },
  { id: 'dark', label: 'Donker' },
];

const LIME = '#8fe507';

/* ---- vorm-helpers ---- */
const path = (d, r = 'p', o = {}) => ({ t: 'path', d, r, ...o });
const rect = (x, y, w, h, rx = 0, r = 'p', o = {}) => ({ t: 'rect', x, y, w, h, rx, r, ...o });
const circle = (cx, cy, rad, r = 'p', o = {}) => ({ t: 'circle', cx, cy, rad, r, ...o });
const ellipse = (cx, cy, rx, ry, r = 'p', o = {}) => ({ t: 'ellipse', cx, cy, rx, ry, r, ...o });
const text = (str, x, y, size, r = 'k', o = {}) => ({ t: 'text', str, x, y, size, r, ...o });
const tile = (r = 'p') => rect(4, 4, 56, 56, 11, r);
const HEX = 'M32 4 56 18V46L32 60 8 46V18Z';
const SHIELD = 'M10 6h44l-4 44-18 8-18-8Z';

const ICONS = [
  /* ------------------------------------------------------------------ Talen */
  { id: 'html5', label: 'HTML5', category: 'Talen', tags: ['html', 'web', 'markup'], brand: { p: '#E34F26', a: '#EF652A' },
    shapes: [path(SHIELD), path('M32 12v40l14-5 3-35Z', 'a'), text('5', 32, 42, 28, 'k', { anchor: 'middle' })] },
  { id: 'css3', label: 'CSS3', category: 'Talen', tags: ['css', 'stijl', 'web', 'styling'], brand: { p: '#1572B6', a: '#33A9DC' },
    shapes: [path(SHIELD), path('M32 12v40l14-5 3-35Z', 'a'), text('3', 32, 42, 28, 'k', { anchor: 'middle' })] },
  { id: 'javascript', label: 'JavaScript', category: 'Talen', tags: ['js', 'script', 'web'], brand: { p: '#F7DF1E', k: '#111111' },
    shapes: [tile(), text('JS', 55, 53, 26, 'k', { anchor: 'end' })] },
  { id: 'typescript', label: 'TypeScript', category: 'Talen', tags: ['ts', 'types', 'web'], brand: { p: '#3178C6' },
    shapes: [tile(), text('TS', 55, 53, 26, 'k', { anchor: 'end' })] },
  { id: 'php', label: 'PHP', category: 'Talen', tags: ['server', 'backend', 'laravel'], brand: { p: '#777BB4' },
    shapes: [ellipse(32, 32, 29, 18), text('php', 32, 38, 19, 'k', { anchor: 'middle' })] },
  { id: 'csharp', label: 'C#', category: 'Talen', tags: ['csharp', 'dotnet', '.net', 'unity'], brand: { p: '#68217A' },
    shapes: [path(`${HEX}`), text('C#', 32, 41, 24, 'k', { anchor: 'middle' })] },
  { id: 'python', label: 'Python', category: 'Talen', tags: ['py', 'script', 'data'], brand: { p: '#3776AB', a: '#FFD43B' },
    shapes: [
      path('M30 5h-4a10 10 0 0 0-10 10v8h20v4H14A10 10 0 0 0 4 37v2a10 10 0 0 0 10 10h4V40a8 8 0 0 1 8-8h12a8 8 0 0 0 8-8V15A10 10 0 0 0 36 5Z'),
      path('M34 59h4a10 10 0 0 0 10-10v-8H28v-4h22a10 10 0 0 0 10-10v-2a10 10 0 0 0-10-10h-4v8a8 8 0 0 1-8 8H26a8 8 0 0 0-8 8v8a10 10 0 0 0 10 10Z', 'a'),
      circle(25, 14, 2.6, 'k'), circle(39, 50, 2.6, 'k')] },
  { id: 'sql', label: 'SQL / Database', category: 'Talen', tags: ['database', 'db', 'mysql', 'postgres', 'data'], brand: { p: '#336791', a: '#4F8CC4' },
    shapes: [
      path('M12 14v36c0 4.4 9 8 20 8s20-3.6 20-8V14Z'), ellipse(32, 14, 20, 8, 'a'),
      path('M12 26c0 4.4 9 8 20 8s20-3.6 20-8M12 38c0 4.4 9 8 20 8s20-3.6 20-8', 'k', { s: 3 })] },
  { id: 'json', label: 'JSON', category: 'Talen', tags: ['data', 'api', 'object'], brand: { p: '#2B2B2B', k: LIME },
    shapes: [tile(), text('{ }', 32, 41, 28, 'k', { anchor: 'middle' })] },

  /* ----------------------------------------------------- Frameworks & Engines */
  { id: 'react', label: 'React', category: 'Frameworks & Engines', tags: ['js', 'ui', 'component', 'frontend'], brand: { p: '#61DAFB' },
    shapes: [
      ellipse(32, 32, 27, 10.5, 'p', { s: 3 }), ellipse(32, 32, 27, 10.5, 'p', { s: 3, rot: 60 }), ellipse(32, 32, 27, 10.5, 'p', { s: 3, rot: 120 }),
      circle(32, 32, 5, 'p')] },
  { id: 'vue', label: 'Vue', category: 'Frameworks & Engines', tags: ['js', 'ui', 'frontend'], brand: { p: '#42B883', a: '#35495E' },
    shapes: [path('M3 8h14l15 26L47 8h14L32 58Z'), path('M17 8h9l6 10.500L38 8h9L32 35Z', 'a')] },
  { id: 'nodejs', label: 'Node.js', category: 'Frameworks & Engines', tags: ['node', 'js', 'server', 'backend', 'npm'], brand: { p: '#5FA04E' },
    shapes: [path(HEX), text('node', 32, 38, 14, 'k', { anchor: 'middle' })] },
  { id: 'tailwind', label: 'Tailwind', category: 'Frameworks & Engines', tags: ['css', 'utility', 'stijl'], brand: { p: '#06B6D4' },
    shapes: [
      path('M27 0c-7.200 0-11.700 3.600-13.500 10.800 2.700-3.600 5.850-4.950 9.450-4.050 2.054.513 3.522 2.004 5.147 3.653C30.744 13.090 33.808 16.200 40.500 16.200c7.200 0 11.700-3.600 13.500-10.800-2.700 3.600-5.850 4.950-9.450 4.050-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.110 33.692 0 27 0ZM13.500 16.200C6.300 16.200 1.800 19.800 0 27c2.700-3.600 5.850-4.950 9.450-4.050 2.054.514 3.522 2.004 5.147 3.653C17.244 29.290 20.308 32.400 27 32.400c7.200 0 11.700-3.600 13.500-10.800-2.700 3.600-5.850 4.950-9.450 4.050-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.310 20.192 16.200 13.500 16.200Z', 'p', { tr: 'translate(5 15.800)' })] },
  { id: 'threejs', label: 'Three.js', category: 'Frameworks & Engines', tags: ['3d', 'webgl', 'kubus', 'cube', 'graphics'], brand: { p: '#049EF4', a: '#0A6FB0', m: '#38B6F8' },
    shapes: [path('M32 5 55 18 32 31 9 18Z'), path('M9 18 32 31V57L9 44Z', 'a'), path('M55 18V44L32 57V31Z', 'm')] },
  { id: 'webxr', label: 'WebXR (VR-bril)', category: 'Frameworks & Engines', tags: ['vr', 'ar', 'xr', 'bril', 'headset', 'immersive'], brand: { p: '#7C3AED' },
    shapes: [path('M6 22a8 8 0 0 1 8-8h36a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H43l-4-6H25l-4 6H14a8 8 0 0 1-8-8Z'), circle(20, 30, 6.500, 'k'), circle(44, 30, 6.500, 'k')] },
  { id: 'unity', label: 'Unity', category: 'Frameworks & Engines', tags: ['game', 'engine', 'csharp', '3d'], brand: { p: '#3A3F47' },
    shapes: [path(HEX), path('M32 32V56M32 32 11 20M32 32l21-12', 'k', { s: 3.500 })] },
  { id: 'gamepad', label: 'Gamepad', category: 'Frameworks & Engines', tags: ['game', 'controller', 'spel', 'input'], brand: { p: '#E11D48' },
    shapes: [
      path('M18 15h28a14 14 0 0 1 14 14l2 15a8 8 0 0 1-14 5l-6-8H22l-6 8a8 8 0 0 1-14-5l2-15A14 14 0 0 1 18 15Z'),
      path('M20 25v12M14 31h12', 'k', { s: 3.500 }), circle(43, 28, 3.200, 'k'), circle(50, 35, 3.200, 'k')] },

  /* ------------------------------------------------------------ Tools & Design */
  { id: 'git', label: 'Git', category: 'Tools & Design', tags: ['versiebeheer', 'branch', 'commit', 'merge'], brand: { p: '#F05032' },
    shapes: [path('M32 3 61 32 32 61 3 32Z'), path('M24 41V22M24 33c0 0 10 0 16-9', 'k', { s: 3.500 }), circle(24, 21, 4.500, 'k'), circle(24, 43, 4.500, 'k'), circle(41, 23, 4.500, 'k')] },
  { id: 'github', label: 'GitHub', category: 'Tools & Design', tags: ['git', 'repo', 'octocat', 'pull request'], brand: { p: '#24292F' },
    shapes: [circle(32, 32, 29), path('M15 22v-4a4.800 4.800 0 0 0-1-3.500c3 0 6-2 6-5.500.08-1.250-.27-2.480-1-3.500.28-1.150.28-2.350 0-3.500 0 0-1 0-3 1.500-2.640-.5-5.360-.5-8 0C6 2 5 2 5 2c-.3 1.150-.3 2.350 0 3.500A5.400 5.400 0 0 0 4 9c0 3.500 3 5.500 6 5.500-.39.490-.68 1.050-.85 1.650-.17.600-.22 1.230-.15 1.850v4M9 18c-4.510 2-5-2-7-2', 'k', { s: 2, tr: 'translate(14.500 14.500) scale(1.500)' })] },
  { id: 'vscode', label: 'VS Code', category: 'Tools & Design', tags: ['editor', 'ide', 'code', 'microsoft'], brand: { p: '#007ACC' },
    shapes: [path('M44 5l15 7v40l-15 7L19 38 9 46l-4-2V20l4-2 10 8Z'), path('M44 20 28 32l16 12Z', 'k')] },
  { id: 'docker', label: 'Docker', category: 'Tools & Design', tags: ['container', 'devops', 'deploy'], brand: { p: '#2496ED', a: '#1D7BC2' },
    shapes: [
      path('M3 34h50c3 0 6-1.500 8-4.500-2.500-1.500-5-1.500-7.500-.5-.8-3-3-4.500-5.500-5.500-1.200 3-.8 5.500.8 7.500H3c0 12 9 22 24 22 16 0 27-8 30-19Z'),
      rect(10, 24, 7, 7, 1, 'a'), rect(19, 24, 7, 7, 1, 'a'), rect(28, 24, 7, 7, 1, 'a'), rect(37, 24, 7, 7, 1, 'a'), rect(19, 16, 7, 7, 1, 'a'), rect(28, 16, 7, 7, 1, 'a')] },
  { id: 'terminal', label: 'Terminal', category: 'Tools & Design', tags: ['cli', 'command', 'shell', 'bash', 'console'], brand: { p: '#2D2D2D', k: LIME },
    shapes: [tile(), path('M16 22l12 10-12 10M34 44h14', 'k', { s: 4 })] },
  { id: 'figma', label: 'Figma', category: 'Tools & Design', tags: ['design', 'ui', 'ux', 'prototype'], brand: { p: '#A259FF' },
    shapes: [
      path('M21 4h11v18H21a9 9 0 0 1 0-18Z', 'p', { bc: '#F24E1E' }), path('M32 4h11a9 9 0 0 1 0 18H32Z', 'm', { bc: '#FF7262' }),
      path('M21 22h11v18H21a9 9 0 0 1 0-18Z', 'p', { bc: '#A259FF' }), circle(43, 31, 9, 'a', { bc: '#1ABCFE' }),
      path('M21 40h11v9a9 9 0 1 1-9-9Z', 'm', { bc: '#0ACF83' })] },
  { id: 'browser', label: 'Browser', category: 'Tools & Design', tags: ['venster', 'window', 'web', 'chrome', 'firefox'], brand: { p: '#2563EB', a: '#93C5FD' },
    shapes: [rect(6, 10, 52, 44, 6, 'p', { s: 4 }), path('M6 24h52', 'p', { s: 4 }), circle(15, 17, 2.200, 'a'), circle(23, 17, 2.200, 'a'), circle(31, 17, 2.200, 'a')] },

  /* --------------------------------------------------------------- Concepten */
  { id: 'rest-api', label: 'REST API', category: 'Concepten', tags: ['api', 'http', 'request', 'endpoint', 'fetch'], brand: { p: '#0EA5E9', a: '#F59E0B' },
    shapes: [path('M8 22h44M43 12l10 10-10 10', 'p', { s: 5 }), path('M56 42H12M21 32 11 42l10 10', 'a', { s: 5 })] },
  { id: 'cloud', label: 'Cloud', category: 'Concepten', tags: ['hosting', 'online', 'opslag', 'deploy'], brand: { p: '#3B82F6' },
    shapes: [path('M17.500 19a4.500 4.500 0 0 0 .5-8.970A6 6 0 0 0 6.340 9.500 4.500 4.500 0 0 0 7 19Z', 'p', { tr: 'translate(3.500 6) scale(2.500)' }), path('M32 47V30M25 37l7-7 7 7', 'k', { s: 3.500 })] },
  { id: 'server', label: 'Server', category: 'Concepten', tags: ['backend', 'hosting', 'rack', 'database'], brand: { p: '#475569' },
    shapes: [rect(8, 8, 48, 20, 6), rect(8, 36, 48, 20, 6), circle(19, 18, 3, 'k'), circle(19, 46, 3, 'k'), path('M30 18h19M30 46h19', 'k', { s: 3 })] },
  { id: 'mobile', label: 'Mobile', category: 'Concepten', tags: ['telefoon', 'app', 'responsive', 'phone'], brand: { p: '#14B8A6' },
    shapes: [rect(17, 4, 30, 56, 7), rect(22, 12, 20, 34, 2, 'k'), circle(32, 53, 2.300, 'k')] },
  { id: 'security', label: 'Security / Lock', category: 'Concepten', tags: ['slot', 'beveiliging', 'privacy', 'wachtwoord', 'lock'], brand: { p: '#10B981' },
    shapes: [path('M20 28v-8a12 12 0 0 1 24 0v8', 'p', { s: 5 }), rect(11, 28, 42, 31, 7), circle(32, 41, 4.500, 'k'), path('M32 44v7', 'k', { s: 3.500 })] },
  { id: 'bug', label: 'Bug', category: 'Concepten', tags: ['fout', 'error', 'debug', 'issue', 'test'], brand: { p: '#EF4444' },
    shapes: [ellipse(32, 38, 14, 19), circle(32, 15, 8), path('M18 30H6M18 42H6M46 30h12M46 42h12M20 22 11 13M44 22l9-9', 'p', { s: 4 }), path('M32 22v33', 'k', { s: 3 })] },
  { id: 'check-badge', label: 'Check-badge', category: 'Concepten', tags: ['goed', 'klaar', 'geslaagd', 'verified', 'vinkje', 'done'], brand: { p: '#22C55E' },
    shapes: [path('M3.850 8.620a4 4 0 0 1 4.780-4.770 4 4 0 0 1 6.740 0 4 4 0 0 1 4.780 4.780 4 4 0 0 1 0 6.740 4 4 0 0 1-4.770 4.780 4 4 0 0 1-6.750 0 4 4 0 0 1-4.780-4.770 4 4 0 0 1 0-6.760Z', 'p', { tr: 'translate(2.500 2.500) scale(2.500)' }), path('m9 12 2 2 4-4', 'k', { s: 2.200, tr: 'translate(2.500 2.500) scale(2.500)' })] },
  { id: 'rocket', label: 'Rocket', category: 'Concepten', tags: ['launch', 'start', 'release', 'deploy', 'snel'], brand: { p: '#F97316', a: '#FACC15' },
    shapes: [path('M32 3c11 7 16 18 14 32l-8 8H26l-8-8C16 21 21 10 32 3Z'), path('M18 35 7 46l12-2ZM46 35l11 11-12-2Z', 'm'), circle(32, 24, 5.500, 'k'), path('M26 48h12l-6 13Z', 'a')] },
];

/* ------------------------------------------------------------------ kleuren */

function palette(icon, variantId) {
  if (variantId === 'lime') return { p: LIME, a: LIME, m: LIME, k: '#111111', mono: true };
  if (variantId === 'white') return { p: '#FFFFFF', a: '#FFFFFF', m: '#FFFFFF', k: '#111111', mono: true };
  if (variantId === 'dark') return { p: '#111111', a: '#111111', m: '#111111', k: '#FFFFFF', mono: true };
  const b = icon.brand || {};
  const p = b.p || '#111111';
  return { p, a: b.a || p, m: b.m || p, k: b.k || '#FFFFFF', mono: false };
}

const num = (n) => String(n);
const MONO_OPACITY = { a: 0.55, m: 0.78 };

function shapeToSvg(sh, pal) {
  let color = pal[sh.r];
  if (!pal.mono && sh.bc) color = sh.bc;
  const stroke = sh.s != null;
  const attrs = [];
  if (stroke) attrs.push(`fill="none" stroke="${color}" stroke-width="${num(sh.s)}" stroke-linecap="round" stroke-linejoin="round"`);
  else attrs.push(`fill="${color}"`);
  if (pal.mono && MONO_OPACITY[sh.r]) attrs.push(`${stroke ? 'stroke' : 'fill'}-opacity="${MONO_OPACITY[sh.r]}"`);
  let tr = sh.tr || '';
  if (sh.t === 'ellipse' && sh.rot) tr = `rotate(${sh.rot} ${sh.cx} ${sh.cy}) ${tr}`.trim();
  if (tr) attrs.push(`transform="${tr}"`);
  const a = attrs.join(' ');
  switch (sh.t) {
    case 'path': return `<path d="${sh.d}" ${a}/>`;
    case 'rect': return `<rect x="${sh.x}" y="${sh.y}" width="${sh.w}" height="${sh.h}" rx="${sh.rx}" ${a}/>`;
    case 'circle': return `<circle cx="${sh.cx}" cy="${sh.cy}" r="${sh.rad}" ${a}/>`;
    case 'ellipse': return `<ellipse cx="${sh.cx}" cy="${sh.cy}" rx="${sh.rx}" ry="${sh.ry}" ${a}/>`;
    case 'text': {
      const str = String(sh.str).replace(/&/g, '&amp;').replace(/</g, '&lt;');
      return `<text x="${sh.x}" y="${sh.y}" font-family="Arial, Helvetica, sans-serif" font-weight="${sh.weight || 800}" font-size="${sh.size}" text-anchor="${sh.anchor || 'start'}" ${a}>${str}</text>`;
    }
    default: return '';
  }
}

/* --------------------------------------------------------------- publieke API */

export const TECH_ICONS = ICONS.map(({ id, label, category, tags }) => ({ id, label, category, tags }));

const byId = new Map(ICONS.map((i) => [i.id, i]));

/** Zelfstandige SVG-string van een icoon in de gekozen kleurvariant. */
export function techIconSvg(id, variant = 'brand') {
  const icon = byId.get(id);
  if (!icon) return '';
  const pal = palette(icon, variant);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256" role="img" aria-label="${icon.label}">${icon.shapes.map((s) => shapeToSvg(s, pal)).join('')}</svg>`;
}

/** `data:image/svg+xml;utf8,…`-URI die direct als `<img src>` werkt (100% offline). */
export function techIconDataUri(id, variant = 'brand') {
  const svg = techIconSvg(id, variant);
  return svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : '';
}

/** Zoekt op label, id en tags; optioneel gefilterd op categorie. */
export function searchTechIcons(query = '', category = '') {
  const q = String(query).trim().toLowerCase();
  return TECH_ICONS.filter((i) => (!category || i.category === category)
    && (!q || [i.label, i.id, ...i.tags].some((t) => t.toLowerCase().includes(q))));
}
