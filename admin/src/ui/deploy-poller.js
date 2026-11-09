/**
 * Live GitHub Pages build-indicator als zwevende overlay in de Studio.
 *
 * `DeployPoller` bevat alleen logica (timers, polling, fasen) en meldt via
 * `onUpdate(view)`; `mountDeployIndicator` tekent dat in de overlay
 * (`#deploy-status`, onderaan gecentreerd). Zo is de
 * logica zonder DOM testbaar (scripts/test-deploy-poller.js).
 *
 * Gedrag: elke 5 s de workflow-run ophalen (max. 3 min). Heeft het token geen
 * leesrechten op /actions/runs (403/404), dan een nette aftelling van 60 s.
 */
import { describeBuildRun, MESSAGES, FALLBACK_MESSAGE, FALLBACK_DONE_MESSAGE, FALLBACK_SECONDS, isPermissionError } from '../storage/build-status.js';
import { icon } from './icons.js';
import { escapeHtml } from './util.js';

export class DeployPoller {
  /**
   * @param {{ fetchRun:(sha:string)=>Promise<object|null>, onUpdate:(view:object)=>void, actionsUrl?:string, pollSeconds?:number, maxSeconds?:number, fallbackSeconds?:number, tickMs?:number }} opts
   */
  constructor({ fetchRun, onUpdate, actionsUrl = '', pollSeconds = 5, maxSeconds = 180, fallbackSeconds = FALLBACK_SECONDS, tickMs = 1000 }) {
    Object.assign(this, { fetchRun, onUpdate, actionsUrl, pollSeconds, maxSeconds, fallbackSeconds, tickMs });
    this.timer = null;
    this.session = 0;
  }

  get active() { return !!this.timer; }

  start({ commitSha, liveUrl }) {
    this.stop();
    const session = this.session;
    const s = { commitSha, liveUrl, elapsed: 0, polling: false, fallbackFrom: null, runUrl: '' };
    this.state = s;
    this.emit({ phase: 'queued', message: MESSAGES.queued }, s);
    this.poll(session);
    this.timer = setInterval(() => this.tick(session), this.tickMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.session += 1;
  }

  dismiss() {
    this.stop();
    this.onUpdate(null);
  }

  emit(partial, s, extra = {}) {
    const fb = s.fallbackFrom != null;
    const remaining = fb ? Math.max(0, this.fallbackSeconds - (s.elapsed - s.fallbackFrom)) : null;
    const progress = fb
      ? remaining / this.fallbackSeconds
      : partial.final ? 1 : Math.min(s.elapsed / 60, 0.95);
    this.onUpdate({
      elapsed: s.elapsed, remaining, progress, liveUrl: s.liveUrl,
      url: partial.url || s.runUrl || this.actionsUrl, ...partial, ...extra,
    });
  }

  tick(session) {
    if (session !== this.session) return;
    const s = this.state;
    s.elapsed += 1;
    if (s.fallbackFrom != null) {
      if (s.elapsed - s.fallbackFrom >= this.fallbackSeconds) {
        this.finish();
        this.emit({ phase: 'fallback-done', message: FALLBACK_DONE_MESSAGE, final: true }, s);
      } else {
        this.emit({ phase: 'fallback', message: FALLBACK_MESSAGE }, s);
      }
      return;
    }
    if (s.elapsed >= this.maxSeconds) {
      this.finish();
      this.emit({ phase: 'timeout', message: MESSAGES.timeout, final: true }, s);
      return;
    }
    if (s.elapsed % this.pollSeconds === 0) this.poll(session);
    else this.emit(s.last || { phase: 'queued', message: MESSAGES.queued }, s);
  }

  finish() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  async poll(session) {
    const s = this.state;
    if (s.polling || s.fallbackFrom != null) return;
    s.polling = true;
    try {
      const run = await this.fetchRun(s.commitSha);
      if (session !== this.session) return;
      const d = describeBuildRun(run);
      s.runUrl = d.url || s.runUrl;
      s.last = d;
      if (d.final) this.finish();
      this.emit(d, s);
    } catch (err) {
      if (session !== this.session) return;
      if (isPermissionError(err)) {
        s.fallbackFrom = s.elapsed;
        this.emit({ phase: 'fallback', message: FALLBACK_MESSAGE }, s);
      }
      // Andere (netwerk)fouten: stil opnieuw proberen bij de volgende ronde.
    } finally {
      s.polling = false;
    }
  }
}

const SPIN_PHASES = new Set(['queued', 'in_progress', 'fallback']);

/** Tekent de indicator in `host` (zwevende overlay onderaan); geeft een `DeployPoller` terug. */
export function mountDeployIndicator(host, { fetchRun, actionsUrl }) {
  let poller;
  const render = (view) => {
    if (!view) { host.hidden = true; host.innerHTML = ''; return; }
    host.hidden = false;
    const done = view.phase === 'success' || view.phase === 'fallback-done';
    const bad = view.phase === 'failure' || view.phase === 'cancelled' || view.phase === 'timeout';
    host.className = `deploy-status deploy-status--${bad ? 'error' : done ? 'success' : view.phase === 'fallback' ? 'fallback' : 'busy'}`;
    const lead = SPIN_PHASES.has(view.phase)
      ? '<span class="deploy-status__spin" aria-hidden="true"></span>'
      : `<span class="deploy-status__ic">${icon(bad ? 'alert' : 'circle-check', 16)}</span>`;
    const counter = view.phase === 'fallback' ? `${view.remaining}s` : (SPIN_PHASES.has(view.phase) ? `${view.elapsed}s` : '');
    let link = '';
    if (done && view.liveUrl) link = `<a href="${escapeHtml(view.liveUrl)}" target="_blank" rel="noopener">Open live presentatie ${icon('external-link', 12)}</a>`;
    else if (bad && view.url) link = `<a href="${escapeHtml(view.url)}" target="_blank" rel="noopener">Bekijk op GitHub ${icon('external-link', 12)}</a>`;
    host.innerHTML = `${lead}<span class="deploy-status__text">${escapeHtml(view.message)}</span>`
      + (counter ? `<span class="deploy-status__time">${counter}</span>` : '')
      + link
      + '<button type="button" class="deploy-status__close" aria-label="Sluiten">×</button>'
      + `<span class="deploy-status__bar"><span style="width:${Math.round((view.progress ?? 0) * 100)}%"></span></span>`;
    host.querySelector('.deploy-status__close').addEventListener('click', () => poller.dismiss());
  };
  poller = new DeployPoller({ fetchRun, onUpdate: render, actionsUrl });
  return poller;
}
