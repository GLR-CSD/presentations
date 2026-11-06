/**
 * Didactische les-flows voor de "+ Nieuwe Presentatie"-wizard.
 *
 * Elk model levert een complete `slides.md` (frontmatter + slides) in exact de
 * verliesvrije structuur van de Studio: Markdown-koppen + HTML-blokken zonder
 * lege regels, zodat elk onderdeel meteen met de formulieren uit `parsers.js`
 * te bewerken is. Elke slide krijgt een richtinggevende `Note:` voor de docent.
 *
 * Naamgeving en opbouw volgen de skills `educational-presentation-nl`
 * (Gagné, Mayer, Assertion-Evidence, ABT, Sparkline) en `reveal-slide-builder`.
 * Een start-model is altijd vrijblijvend: daarna is alles vrij te wijzigen.
 */
import { escapeHtml, SUBJECT_PREFIXES } from '../ui/util.js';
import { timerHtml, footerHtml, evidenceRowHtml, workedRowHtml, quizCardsHtml } from '../blocks/templates.js';

export const FRAMEWORKS = [
  {
    id: 'vrij',
    label: 'Vrije opbouw (standaard)',
    short: 'Titelslide + één inhoudsslide. Je bepaalt zelf de opbouw.',
    outline: ['Titel', 'Inhoud'],
  },
  {
    id: 'gagne',
    label: "Gagné's 9 instructiestappen (volledige les)",
    short: 'Een complete les volgens de 9 instructiegebeurtenissen van Gagné.',
    outline: ['Aandacht', 'Leerdoelen', 'Voorkennis', 'Nieuwe stof (AE)', 'Worked example', 'Zelf toepassen', 'Feedback', 'Begripscheck', 'Transfer'],
  },
  {
    id: 'abt',
    label: 'ABT-model: En, Maar, Daarom (korte instructie / pitch)',
    short: 'Eén verhaallijn: de bekende basis (EN), het probleem (MAAR), de oplossing (DAAROM).',
    outline: ['Titel', 'EN', 'MAAR', 'DAAROM'],
  },
  {
    id: 'sparkline',
    label: "Duarte's Sparkline (project kick-off)",
    short: 'Contrast tussen "wat is" en "wat kan zijn", met een concrete call to action.',
    outline: ['Titel', 'Wat is', 'Wat kan zijn', 'De stappen', 'Call to action'],
  },
  {
    id: 'agile',
    label: 'GLR Agile stand-up & werkles',
    short: 'Sprintdoel, planning, stand-up met werkblok en oplevering.',
    outline: ['Sprint & doel', 'Planning', 'Stand-up & werkblok', 'Oplevering & commit'],
  },
];

export const frameworkById = (id) => FRAMEWORKS.find((f) => f.id === id) || FRAMEWORKS[0];

const HERO_ATTRS = '<!-- .slide: class="bleed dark" data-background-color="#111111" -->';

/** Eén slide: body + `Note:`-docentnotitie (zelfde formaat als `slide.setNote`). */
const slide = (body, note) => (note ? `${body}\n\nNote:\n${note}` : body);

/** `<p class="kicker">` + `## titel` + HTML-blok(ken) + footer. */
const content = ({ kicker, title, blocks = [], footer }) => [
  ...(kicker ? [`<p class="kicker">${escapeHtml(kicker)}</p>`, ''] : []),
  `## ${title}`,
  '',
  ...blocks.flatMap((b) => [b, '']),
  footer,
].join('\n');

function frontmatter(data) {
  const q = (s) => String(s == null ? '' : s).replace(/"/g, '\\"');
  const tags = (data.tags || []).map((t) => `"${q(t)}"`).join(', ');
  return [
    '<!-- frontmatter',
    `title: "${q(data.title)}"`,
    `cohort: "${q(data.cohort || '2026-2027')}"`,
    `leerjaar: ${data.leerjaar}`,
    `periode: ${data.periode}`,
    `auteur: "${q(data.auteur)}"`,
    `tags: [${tags}]`,
    '-->',
  ].join('\n');
}

function titleSlide(ctx, { kicker, title, lede } = {}) {
  return [
    HERO_ATTRS,
    '',
    '<div class="bar" style="margin-top:28px"></div>',
    `<p class="kicker kicker--lime">${kicker || `${escapeHtml(ctx.subject)} · ${escapeHtml(ctx.cohort)}`}</p>`,
    `<h1 class="title" style="color:#fff;font-size:72px">${title || escapeHtml(ctx.title)}</h1>`,
    `<p class="lede" style="color:#EDEDED;font-size:27px;max-width:1000px">${lede || 'Korte inleiding op deze les.'}</p>`,
    footerHtml(`${ctx.subject} · ${ctx.title}`, 1),
  ].join('\n');
}

/* ------------------------------------------------------------- de modellen --- */

function vrij(ctx) {
  return [
    slide(titleSlide(ctx), 'Welkom en korte context: wat staat er vandaag op het programma?'),
    slide([
      '## Eerste slide',
      '',
      '<p>Begin hier met de inhoud van je les.</p>',
      '',
      footerHtml(ctx.subject, 2),
    ].join('\n'), 'Tip: formuleer de titel van een inhoudsslide als stelling (Assertion-Evidence) en houd lopende tekst in deze notities.'),
  ];
}

function gagne(ctx) {
  const f = (n) => footerHtml(ctx.subject, n);
  return [
    slide(titleSlide(ctx, {
      kicker: `${escapeHtml(ctx.subject)} · ${escapeHtml(ctx.title)}`,
      title: 'Wat gaat er mis als … ?',
      lede: 'Een prikkelende vraag uit de praktijk die nieuwsgierig maakt naar de les van vandaag.',
    }), 'Gagné 1 · Aandacht trekken. Open met een herkenbare praktijkvraag, een verrassend feit of een korte casus. Laat de vraag even hangen en geef nog geen antwoord.'),
    slide(content({
      kicker: 'Leerdoelen',
      title: 'Na deze les kun je …',
      blocks: [[
        '<ul class="check">',
        '  <li>uitleggen wat … is en waarom het werkt (Begrijpen);</li>',
        '  <li>… toepassen in een eigen voorbeeld (Toepassen);</li>',
        '  <li>twee aanpakken vergelijken en je keuze onderbouwen (Analyseren).</li>',
        '</ul>',
      ].join('\n')],
      footer: f(2),
    }), 'Gagné 2 · Leerdoelen communiceren. Benoem de doelen hardop met meetbare werkwoorden (Bloom: uitleggen, toepassen, vergelijken). Kom er aan het eind van de les op terug.'),
    slide(content({
      kicker: 'Voorkennis activeren',
      title: 'Wat weet je nog van vorige les?',
      blocks: [[
        '<div class="callout">',
        '  <span class="dot"></span>',
        '  <div><h3>Terugblik-vraag</h3><p>Noem één ding over … dat je vorige les hebt geleerd. Schrijf het op en vergelijk het met je buur.</p></div>',
        '</div>',
      ].join('\n')],
      footer: f(3),
    }), 'Gagné 3 · Voorkennis activeren. Laat studenten eerst zelf ophalen (retrieval practice) voordat je iets uitlegt. Inventariseer 2–3 antwoorden klassikaal.'),
    slide(content({
      kicker: 'Nieuwe stof · Assertion-Evidence',
      title: 'Schrijf hier je kernboodschap als één volledige stelling',
      blocks: [evidenceRowHtml()],
      footer: f(4),
    }), 'Gagné 4 · Inhoud presenteren. De titel is de conclusie (Assertion-Evidence): één stelling van max. 12–15 woorden. Rechts staat het visuele bewijs (diagram, screenshot of code). Vertel de uitleg vrij en zet hem niet als tekst op de slide (Mayer: redundantie).'),
    slide(content({
      kicker: 'Worked example · Begeleide inoefening',
      title: 'Zo los je het stap voor stap op',
      blocks: [workedRowHtml()],
      footer: f(5),
    }), 'Gagné 5 · Leerbegeleiding bieden. Doe het voor en denk hardop. Loop met de pijltjes door de regel-focus (1-2, daarna 4-6) en vraag tussendoor: "Wat verwacht je dat hier gebeurt?"'),
    slide(content({
      kicker: 'Zelfstandig toepassen · Werkvorm',
      title: 'Aan de slag: pas het nu zelf toe',
      blocks: [[
        '<div class="row">',
        '  <div class="col">',
        '    <div class="opcard"><span class="k">Opdracht · 15 minuten</span><h3>Titel van de opdracht</h3><p>Beschrijf wat de studenten gaan maken of oplossen.</p><ul><li>Stap 1: …</li><li>Stap 2: …</li><li>Klaar? Vergelijk met je buur.</li></ul></div>',
        '  </div>',
        '  <div class="col col--narrow">',
        `    ${timerHtml(15, 'Opdracht')}`,
        '  </div>',
        '</div>',
      ].join('\n')],
      footer: f(6),
    }), 'Gagné 6 · Prestatie uitlokken. Start de timer en loop rond. Let op veelgemaakte fouten en noteer er 1–2 voor de bespreking op de volgende slide.'),
    slide(content({
      kicker: 'Feedback & bespreking',
      title: 'Zo voorkom je de meest gemaakte fout',
      blocks: [[
        '<div class="cards">',
        '  <div class="glr-card"><span class="k">Veelgemaakte fout</span><h3>Wat ging er vaak mis?</h3><p>Beschrijf of toon de fout die je zag.</p></div>',
        '  <div class="glr-card glr-card--accent"><span class="k">Best practice</span><h3>Zo doe je het goed</h3><p>Laat de verbeterde aanpak zien.</p></div>',
        '</div>',
      ].join('\n')],
      footer: f(7),
    }), 'Gagné 7 · Feedback geven. Bespreek een geanonimiseerd voorbeeld uit de klas. Zet de fout naast de best practice en leg uit waarom het verschil ertoe doet.'),
    slide(content({
      kicker: 'Begripscheck · Formatieve check',
      title: 'Welke uitspraak over … klopt?',
      blocks: [quizCardsHtml()],
      footer: f(8),
    }), 'Gagné 8 · Prestatie beoordelen (formatief). Peer Instruction: eerst individueel stemmen (vingers 1-2-3), dan 1 minuut overleggen met iemand met een ander antwoord en daarna opnieuw stemmen. Klik pas daarna om het juiste antwoord te tonen.'),
    slide(content({
      kicker: 'Transfer · Stage & praktijk',
      title: 'Hier kom je dit tegen in leerjaar 3 en op je stage',
      blocks: [[
        '<div class="defbox">',
        '  <span class="k">Praktijk / Stage</span>',
        '  <h3>Zo werkt het in het bedrijfsleven</h3>',
        '  <p>Beschrijf een concrete situatie uit het werkveld of de stage waarin studenten dit nodig hebben.</p>',
        '</div>',
      ].join('\n')],
      footer: f(9),
    }), 'Gagné 9 · Retentie en transfer bevorderen. Vraag: "Waar ga jij dit gebruiken in je eigen project of op stage?" Sluit af met de leerdoelen van slide 2: wat kun je nu?'),
  ];
}

function abt(ctx) {
  const f = (n) => footerHtml(ctx.subject, n);
  return [
    slide(titleSlide(ctx), 'ABT-model (Randy Olson). Formuleer vooraf je kernzin: "… EN …, MAAR …, DAAROM …". Deze titelslide zet het onderwerp neer.'),
    slide(content({
      kicker: 'EN · De bekende basis',
      title: 'Je weet al dat …',
      blocks: ['<p class="lede">Beschrijf de gedeelde context: wat kennen en doen we al?</p>'],
      footer: f(2),
    }), 'EN: de bestaande situatie en gedeelde basiskennis. Houd het kort en herkenbaar, want dit is het fundament waarop de spanning volgt.'),
    slide(content({
      kicker: 'MAAR · Het probleem',
      title: 'Maar met onze huidige aanpak lopen we vast',
      blocks: [[
        '<div class="callout">',
        '  <span class="dot"></span>',
        '  <div><h3>Waar het misgaat</h3><p>Beschrijf het probleem of de kennislacune die de huidige aanpak oplevert.</p></div>',
        '</div>',
      ].join('\n')],
      footer: f(3),
    }), 'MAAR: de spanning. Dit is je openingshaak. Vermijd het En-en-en-patroon (alleen opsommen, geen probleem).'),
    slide(content({
      kicker: 'DAAROM · De oplossing',
      title: 'Daarom gaan we vandaag …',
      blocks: ['<div class="opcard"><span class="k">Opdracht</span><h3>Wat ga je nu doen?</h3><p>Beschrijf de nieuwe aanpak en de directe opdracht.</p></div>'],
      footer: f(4),
    }), 'DAAROM: jouw oplossing en de directe opdracht. Eindig met een concrete eerste stap die studenten meteen kunnen zetten.'),
  ];
}

function sparkline(ctx) {
  const f = (n) => footerHtml(ctx.subject, n);
  return [
    slide(titleSlide(ctx, { lede: 'Kick-off: waar staan we en waar gaan we naartoe?' }), "Duarte's Sparkline. Slinger heen en weer tussen \"wat is\" en \"wat kan zijn\" en eindig met de New Bliss: wat levert het op als je dit omarmt?"),
    slide(content({
      kicker: 'Wat is · De huidige situatie',
      title: 'Zo gaat het nu: …',
      blocks: [[
        '<div class="cards">',
        '  <div class="glr-card"><span class="k">Nu</span><h3>Knelpunt 1</h3><p>Wat gaat er nu mis of kost te veel tijd?</p></div>',
        '  <div class="glr-card"><span class="k">Nu</span><h3>Knelpunt 2</h3><p>Wat merken gebruikers of het team daarvan?</p></div>',
        '</div>',
      ].join('\n')],
      footer: f(2),
    }), 'Wat is: maak de huidige realiteit concreet en herkenbaar, met voorbeelden uit het vorige project of de praktijk.'),
    slide(content({
      kicker: 'Wat kan zijn · De professionele standaard',
      title: 'Zo doen professionals het: …',
      blocks: [[
        '<div class="cards">',
        '  <div class="glr-card glr-card--accent"><span class="k">Straks</span><h3>Professionele aanpak</h3><p>Hoe ziet het eruit als het goed gaat?</p></div>',
        '  <div class="glr-card glr-card--accent"><span class="k">Straks</span><h3>Wat het oplevert</h3><p>Wat wint de gebruiker of het team erbij?</p></div>',
        '</div>',
      ].join('\n')],
      footer: f(3),
    }), 'Wat kan zijn: schets het verhoogde model. Laat het contrast met de vorige slide expliciet zien.'),
    slide(content({
      kicker: 'De stappen',
      title: 'In drie stappen van "wat is" naar "wat kan zijn"',
      blocks: [[
        '<div class="rows">',
        '  <div class="listrow"><span class="n">01</span><div><h3>Eerste stap</h3><p>Wat doe je eerst?</p></div></div>',
        '  <div class="listrow"><span class="n">02</span><div><h3>Tweede stap</h3><p>Wat volgt daarna?</p></div></div>',
        '  <div class="listrow"><span class="n">03</span><div><h3>Derde stap</h3><p>Wanneer ben je klaar?</p></div></div>',
        '</div>',
      ].join('\n')],
      footer: f(4),
    }), 'De stappen: maak de weg overzichtelijk. Tip: laat de stappen één voor één verschijnen (Mayer: segmentatie).'),
    slide(content({
      kicker: 'Call to action',
      title: 'Jouw eerste stap: begin vandaag met …',
      blocks: ['<div class="opcard"><span class="k">Call to action</span><h3>Wat ga je nu doen?</h3><p>Beschrijf de concrete eerste opdracht en wanneer die af moet zijn.</p></div>'],
      footer: f(5),
    }), 'Call to action + New Bliss: eindig met de waarde en impact als het lukt, en een concrete eerste opdracht.'),
  ];
}

function agile(ctx) {
  const f = (n) => footerHtml(ctx.subject, n);
  return [
    slide(titleSlide(ctx, {
      kicker: `Sprint · ${escapeHtml(ctx.subject)}`,
      lede: 'Sprintdoel: na deze sprint werkt …',
    }), 'Sprint & doel. Formuleer het sprintdoel als concreet, toetsbaar resultaat. Koppel het aan het issue-board of de backlog.'),
    slide(content({
      kicker: 'Planning',
      title: 'Zo ziet de werkles eruit',
      blocks: [[
        '<div class="rows">',
        '  <div class="listrow listrow--time"><span class="n">09:00</span><div><h3>Stand-up</h3><p>Wat deed je, wat ga je doen, waar loop je vast?</p></div></div>',
        '  <div class="listrow listrow--time"><span class="n">09:15</span><div><h3>Werkblok</h3><p>Zelfstandig of in je team aan je issues werken.</p></div></div>',
        '  <div class="listrow listrow--time"><span class="n">10:00</span><div><h3>Oplevering</h3><p>Committen, issue bijwerken en een korte demo.</p></div></div>',
        '</div>',
      ].join('\n')],
      footer: f(2),
    }), 'Planning. Pas de tijden aan je rooster aan. Wijs tijdens het werkblok aan wie er hulp nodig heeft.'),
    slide(content({
      kicker: 'Stand-up & werkblok',
      title: 'Stand-up, daarna aan de slag',
      blocks: [[
        '<div class="row">',
        '  <div class="col">',
        '    <div class="opcard"><span class="k">Stand-up · per team</span><h3>Drie vragen</h3><p>Ieder teamlid beantwoordt kort:</p><ul><li>Wat heb ik sinds de vorige keer gedaan?</li><li>Wat ga ik vandaag doen?</li><li>Waar loop ik tegenaan?</li></ul></div>',
        '  </div>',
        '  <div class="col col--narrow">',
        `    ${timerHtml(45, 'Werkblok')}`,
        '  </div>',
        '</div>',
      ].join('\n')],
      footer: f(3),
    }), 'Stand-up (max. 10 min) en daarna het werkblok van 45 minuten. Start de timer na de stand-up.'),
    slide(content({
      kicker: 'Oplevering & commit',
      title: 'Klaar? Check je oplevering',
      blocks: [[
        '<ul class="check">',
        '  <li>Je code is gecommit met een duidelijke commit-message.</li>',
        '  <li>Je issue is bijgewerkt (status, opmerkingen).</li>',
        '  <li>Je kunt in één minuut laten zien wat je hebt gemaakt.</li>',
        '</ul>',
      ].join('\n')],
      footer: f(4),
    }), 'Oplevering. Laat 1–2 teams kort demonstreren. Vraag naar hun commit-messages: zijn ze begrijpelijk voor een collega?'),
  ];
}

const BUILDERS = { vrij, gagne, abt, sparkline, agile };

/**
 * Bouwt de complete `slides.md` voor een nieuw deck.
 * @param {{ title:string, prefix:string, cohort?:string, leerjaar:string|number, periode:string|number, auteur?:string, tags?:string[] }} data
 * @param {string} frameworkId  'vrij' | 'gagne' | 'abt' | 'sparkline' | 'agile'
 */
export function buildDeckMarkdown(data, frameworkId = 'vrij') {
  const subject = (SUBJECT_PREFIXES.find((p) => p.value === data.prefix) || {}).subject || 'Onderwerp';
  const ctx = { subject, title: data.title || '', cohort: data.cohort || '' };
  const build = BUILDERS[frameworkId] || BUILDERS.vrij;
  return `${frontmatter(data)}\n\n${build(ctx).join('\n\n---\n\n')}\n`;
}
