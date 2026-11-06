/**
 * Herkent de didactische fase van een slide (voor de rustige badges in de
 * Slide Sorter) en de balans theorie ↔ interactie van het hele deck.
 *
 * Puur en heuristisch: het is een hulpmiddel om het ritme van een les te zien
 * en geen oordeel. Onderbouwing staat in de skills: "elke 5 inhoudelijke slides een
 * actieve verwerkingsopdracht" (reveal-slide-builder) en "elke 10–15 minuten
 * een Peer Instruction-checkpoint" (educational-presentation-nl).
 */

export const PHASES = {
  hero: { id: 'hero', label: 'Hero', group: 'neutral' },
  doelen: { id: 'doelen', label: 'Doelen', group: 'neutral' },
  agenda: { id: 'agenda', label: 'Agenda', group: 'neutral' },
  pauze: { id: 'pauze', label: 'Pauze', group: 'neutral' },
  theorie: { id: 'theorie', label: 'Theorie', group: 'theory' },
  code: { id: 'code', label: 'Code', group: 'theory' },
  opdracht: { id: 'opdracht', label: 'Opdracht', group: 'interaction' },
  check: { id: 'check', label: 'Check', group: 'interaction' },
};

const strip = (s) => String(s || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

/** Tekst van de (eerste) kicker. */
function kickerOf(body) {
  const m = /<p class="kicker[^"]*"[^>]*>([\s\S]*?)<\/p>/.exec(body);
  return m ? strip(m[1]) : '';
}

/** Tekst van de eerste h1/h2 (Markdown of HTML). */
export function headingOf(body) {
  const md = /^#{1,2}[ \t]+(.+)$/m.exec(body);
  const html = /<h([12])\b[^>]*>([\s\S]*?)<\/h\1>/.exec(body);
  if (md && (!html || md.index < html.index)) return strip(md[1].replace(/<!--[\s\S]*?-->/g, ''));
  return html ? strip(html[2]) : '';
}

const hasCls = (body, cls) => new RegExp(`class="[^"]*\\b${cls}\\b`).test(body);

/**
 * @param {{ body:string, attrsData?:object }} slide
 * @returns {{ id:string, label:string, group:string }}
 */
export function classifySlide(slide) {
  const body = (slide && slide.body) || '';
  const attrs = (slide && slide.attrsData) || {};
  const slideCls = String(attrs.class || '').split(/\s+/);
  const kicker = kickerOf(body).toLowerCase();
  const heading = headingOf(body).toLowerCase();
  const label = `${kicker} ${heading}`;

  if (attrs['data-state'] === 'pauze' || /\bpauze\b/.test(kicker)) return PHASES.pauze;
  if (slideCls.includes('bleed') || hasCls(body, 'title--xl') || /^#[ \t]/m.test(body) || /<h1\b/.test(body)) return PHASES.hero;
  if (/\bfragment custom\b/.test(body) || /check|quiz|toets|\bstem|voorkennis|terugblik|denk\s*[–-]/.test(kicker)) return PHASES.check;
  if (/leerdoel|na deze les|aan het einde van deze les/.test(label)) return PHASES.doelen;
  if (hasCls(body, 'opcard') || hasCls(body, 'timer')) return PHASES.opdracht;
  if (/^[ \t]*```/m.test(body) || hasCls(body, 'terminal-window') || /<pre\b/.test(body)) return PHASES.code;
  if (hasCls(body, 'listrow--time') || /agenda|planning|programma/.test(kicker)) return PHASES.agenda;
  return PHASES.theorie;
}

/**
 * Verhouding theorie (Theorie + Code) ↔ interactie (Opdracht + Check).
 * Neutrale slides (Hero, Doelen, Agenda, Pauze) tellen niet mee.
 */
export function deckBalance(slides) {
  let theory = 0;
  let interaction = 0;
  for (const s of slides || []) {
    const g = classifySlide(s).group;
    if (g === 'theory') theory += 1;
    else if (g === 'interaction') interaction += 1;
  }
  const total = theory + interaction;
  const pct = total ? Math.round((theory / total) * 100) : 0;
  return {
    theory,
    interaction,
    total,
    theoryPct: total ? pct : 0,
    interactionPct: total ? 100 - pct : 0,
    // Vrijblijvende hint: ongeveer elke 5 inhoudelijke slides één actief moment.
    lowInteraction: theory >= 5 && interaction < Math.floor(theory / 5),
  };
}
