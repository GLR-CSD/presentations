/**
 * Didactische snel-chips boven de Docentnotities (`Note:`).
 * Eén klik voegt een gestructureerde regel onderaan de huidige notitie toe.
 */

export const NOTE_PROMPTS = [
  { id: 'doel', label: '+ Doel & Tijd', title: 'Tijdsduur en doel van deze slide', text: '⏱ Tijdsduur: 5 min | Doel van deze slide: ' },
  { id: 'vraag', label: '+ Klasvraag', title: 'Een vraag aan de klas met het verwachte antwoord', text: '❓ Vraag aan de klas: "..." -> Verwacht antwoord: ' },
  { id: 'stage', label: '+ Brug naar Stage', title: 'Koppeling met stage en werkveld (leerjaar 3)', text: '🏢 Praktijk / Stage (Jaar 3): In het werkveld zie je dit terug bij... ' },
  { id: 'valkuil', label: '+ Valkuil studenten', title: 'Een veelgemaakte fout om te benoemen', text: '⚠️ Veelgemaakte fout: Studenten vergeten hier vaak... ' },
];

/** Voegt `line` toe op een nieuwe regel onderaan `noteText`. */
export function appendNotePrompt(noteText, line) {
  const cur = String(noteText || '').replace(/\s+$/, '');
  return cur ? `${cur}\n${line}` : line;
}
