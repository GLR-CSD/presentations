/**
 * Helpers voor het klonen van een deck: nieuwe frontmatter voor de kopie.
 * Gedeeld door de Studio en de MCP-server (geen DOM-afhankelijkheden).
 */
import { parseFrontmatter } from './frontmatter.js';

/**
 * Past de frontmatter van `markdown` aan voor een kopie en geeft de nieuwe bron terug.
 * Bestaande velden/volgorde blijven behouden; alleen de opgegeven velden wijzigen,
 * plus `gekloond_van` (pad van het origineel) voor herleidbaarheid.
 * @param {string} markdown bron van het originele deck
 * @param {{title?:string, auteur?:string, cohort?:string, leerjaar?:number|string, periode?:number|string, clonedFrom?:string}} meta
 */
export function cloneMarkdown(markdown, meta = {}) {
  const fm = parseFrontmatter(markdown);
  if (!fm) return markdown;
  const num = (v) => (/^\d+$/.test(String(v)) ? Number(v) : v);
  if (meta.title) fm.set('title', meta.title);
  if (meta.auteur != null && meta.auteur !== '') fm.set('auteur', meta.auteur);
  if (meta.cohort) fm.set('cohort', meta.cohort);
  if (meta.leerjaar != null && meta.leerjaar !== '') fm.set('leerjaar', num(meta.leerjaar));
  if (meta.periode != null && meta.periode !== '') fm.set('periode', num(meta.periode));
  if (meta.clonedFrom) fm.set('gekloond_van', meta.clonedFrom);
  return markdown.replace(fm.block, () => fm.serialize());
}
