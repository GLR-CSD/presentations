/** De 4 MCP-prompts. */
import { z } from 'zod';
import { buildLessonPrompt } from '../../admin/src/pedagogy/ai-prompt.js';
import { frameworkById, resolveFrameworkId, FRAMEWORK_INPUTS } from '../../admin/src/pedagogy/frameworks.js';

const user = (text) => ({ messages: [{ role: 'user', content: { type: 'text', text } }] });

const lessonArgs = {
  onderwerp: z.string().describe('Onderwerp / titel van de les.'),
  prefix: z.string().optional().describe('Vak-prefix, bijv. design1 of beroeps1.'),
  leerjaar: z.string().optional(), periode: z.string().optional(),
  brontekst: z.string().optional().describe('Optionele brontekst of aantekeningen.'),
};

const lesson = (frameworkId) => (a) => user([
  buildLessonPrompt({ frameworkId, title: a.onderwerp, prefix: a.prefix || 'custom', leerjaar: a.leerjaar || 1, periode: a.periode || 1, sourceText: a.brontekst }),
  '',
  '---',
  'Werkwijze met de GLR-tools: schrijf de complete slides.md en sla hem op met `create_presentation` (parameter `markdown`). Draai daarna `analyze_presentation_pedagogy` en pas zinvolle tips toe met `apply_pedagogical_fix`. Vat aan het eind kort samen wat je gemaakt hebt. Publiceer pas naar GitHub als de docent dat vraagt.',
].join('\n'));

export function registerPrompts(server) {
  server.registerPrompt('van-input-naar-presentatie', {
    title: 'Van input-document naar presentatie',
    description: 'Leest een bronbestand uit input/ en maakt er een didactisch onderbouwde presentatie van.',
    argsSchema: {
      bestand: z.string().describe('Bestandsnaam in input/.'), framework: z.enum(FRAMEWORK_INPUTS).optional(),
      prefix: z.string().optional(), leerjaar: z.string().optional(), periode: z.string().optional(),
    },
  }, (a) => {
    const fw = frameworkById(a.framework || 'gagne');
    return user([
      `Maak een lespresentatie op basis van het bronbestand "${a.bestand}" in de map input/.`,
      '',
      '1. Lees het bestand met `read_input_document`. Lukt dat niet omdat input/ niet lokaal beschikbaar is, vraag de docent dan de tekst in de chat te plakken.',
      '2. Lees de resources `glr://components/catalog` en `glr://pedagogy/guidelines`.',
      `3. Kies het model "${fw.label}" (${fw.outline.join(' → ')}). Haal onderwerp, leerdoelen en kernbegrippen uit het bronbestand.`,
      `4. Schrijf de complete slides.md in de GLR-structuur en sla hem op met \`create_presentation\` (parameter \`markdown\`; prefix "${a.prefix || 'custom'}", leerjaar ${a.leerjaar || 1}, periode ${a.periode || 1}).`,
      '5. Draai `analyze_presentation_pedagogy`, pas zinvolle tips toe met `apply_pedagogical_fix` en geef een korte samenvatting.',
      '6. Publiceer alleen naar GitHub als de docent dat uitdrukkelijk vraagt (`publish_deck_to_github`, daarna `check_github_build_status`).',
    ].join('\n'));
  });

  server.registerPrompt('maak-theorieles-gagne', {
    title: 'Theorieles volgens Gagné', description: 'Complete theorieles met de 9 instructiegebeurtenissen van Gagné.', argsSchema: lessonArgs,
  }, lesson('gagne'));

  server.registerPrompt('maak-werkles-standup', {
    title: 'Werkles met stand-up', description: 'Agile werkles: sprintdoel, planning, stand-up, werkblok en oplevering.', argsSchema: lessonArgs,
  }, lesson(resolveFrameworkId('standup')));

  server.registerPrompt('didactische-les-review', {
    title: 'Didactische review van een les', description: 'Analyseert een bestaande presentatie en doet concrete verbetervoorstellen.',
    argsSchema: { path: z.string().describe('Pad of mapnaam van het deck.') },
  }, (a) => user([
    `Doe een didactische review van de presentatie "${a.path}".`,
    '',
    '1. Haal het deck op met `get_presentation` en draai `analyze_presentation_pedagogy`.',
    '2. Beoordeel: balans theorie/interactie, Mayer (segmentatie, redundantie, signalering), Assertion-Evidence-titels, ritme van checks en of er leerdoelen en een afsluiting zijn.',
    '3. Maak een geprioriteerd verbeterplan (max. 5 punten, per punt het slidenummer en wat je zou veranderen).',
    '4. Vraag de docent welke verbeteringen je mag doorvoeren; pas die daarna toe met `apply_pedagogical_fix`, `update_slide_component` en `add_slide`.',
  ].join('\n')));
}
