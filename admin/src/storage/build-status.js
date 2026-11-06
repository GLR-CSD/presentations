/**
 * Vertaalt een GitHub Actions-run naar een fase + Nederlandse melding.
 * Puur (geen DOM, geen netwerk): gebruikt door de Studio-indicator én de MCP-tool.
 */
export const MESSAGES = {
  queued: 'Opgeslagen in Git — Wachten tot GitHub Pages build start...',
  in_progress: 'GitHub Pages bouwt de presentatie (even geduld, dit duurt ~45-60s)...',
  success: 'Gepubliceerd! De nieuwe versie staat nu live op GitHub Pages',
  failure: 'De GitHub Pages build is mislukt. Bekijk de logs op GitHub.',
  cancelled: 'De GitHub Pages build is geannuleerd.',
  timeout: 'Duurt langer dan verwacht — controleer de voortgang op GitHub.',
};

export const FALLBACK_MESSAGE = 'Opgeslagen op GitHub — GitHub Pages verwerkt nu op de achtergrond de update (~1 minuut bouwtijd).';
export const FALLBACK_DONE_MESSAGE = 'Waarschijnlijk live — de update zou nu op GitHub Pages moeten staan.';
export const FALLBACK_SECONDS = 60;

/** @returns {{ phase:'queued'|'in_progress'|'success'|'failure'|'cancelled', message:string, url:string, final:boolean }} */
export function describeBuildRun(run) {
  if (!run) return { phase: 'queued', message: MESSAGES.queued, url: '', final: false };
  const url = run.html_url || '';
  if (run.status === 'completed') {
    if (run.conclusion === 'success') return { phase: 'success', message: MESSAGES.success, url, final: true };
    if (run.conclusion === 'cancelled') return { phase: 'cancelled', message: MESSAGES.cancelled, url, final: true };
    return { phase: 'failure', message: MESSAGES.failure, url, final: true };
  }
  if (run.status === 'in_progress') return { phase: 'in_progress', message: MESSAGES.in_progress, url, final: false };
  return { phase: 'queued', message: MESSAGES.queued, url, final: false };
}

/** Geeft true als de fout betekent dat het token geen Actions-leesrechten heeft. */
export const isPermissionError = (err) => !!err && (err.status === 403 || err.status === 404);
