/** Gedeelde helpers voor het verplaatsen van decks (MCP-server + Studio). */

/** Aantal mappen onder de repo-root, bv. `presentations/a/b/slides.md` → 3. */
export function deckDepth(deckPath) {
  const parts = String(deckPath).split('/').filter(Boolean);
  return Math.max(parts.length - 1, 0);
}

/**
 * Vervangt de `../`-prefix van de gedeelde assets (`shared/...`) in een deck-shell.
 * Raakt alleen die prefix aan, zodat eigen <style>-blokken behouden blijven.
 */
export function rewriteShellPrefix(html, newDepth) {
  const prefix = '../'.repeat(newDepth);
  return String(html).replace(/((?:\.\.\/)+)(shared\/)/g, `${prefix}$2`);
}
