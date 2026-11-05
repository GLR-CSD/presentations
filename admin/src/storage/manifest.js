/**
 * Laadt het statische deck-manifest dat `scripts/build-index.js` bij de build
 * genereert. Hierdoor vult de "Deck openen"-lijst zich direct — zonder GitHub-
 * token en zonder mapselectie — en kan elk deck meteen via fetch() geladen
 * worden (offline, vanaf GitHub Pages of een lokale server).
 */

const CANDIDATES = ['./presentations-manifest.json', '../presentations-manifest.json'];

export async function loadManifest() {
  for (const url of CANDIDATES) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.presentations)) return data;
      }
    } catch {
      /* probeer de volgende */
    }
  }
  return { presentations: [] };
}

/** Bepaalt de fetch-URL voor een manifest-entry (relatief t.o.v. admin/). */
export function manifestFileUrl(entry, which = 'md') {
  const rel = which === 'html' ? entry.html : entry.md;
  if (!rel) return null;
  return `../${rel}`;
}

/** Haalt de tekst van een deck op via het manifest. */
export async function fetchDeckMarkdown(entry) {
  const url = manifestFileUrl(entry, 'md');
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Kon ${url} niet laden (${res.status}).`);
  return res.text();
}

/** Haalt de deck-specifieke <style> uit de index.html (voor de preview). */
export async function fetchDeckCss(entry) {
  if (!entry.html) return '';
  try {
    const res = await fetch(manifestFileUrl(entry, 'html'), { cache: 'no-store' });
    if (!res.ok) return '';
    // Commentaar eerst weg: een `<style>`-woord in een HTML-commentaar verstoort anders de extractie.
    const html = (await res.text()).replace(/<!--[\s\S]*?-->/g, '');
    const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
    return styles.join('\n');
  } catch {
    return '';
  }
}
