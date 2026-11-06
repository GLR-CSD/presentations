/**
 * GLR Login Gate — een voltallige overlay die de Studio verbergt totdat de
 * docent is geauthenticeerd.
 *
 * Twee routes:
 *   a. Online: GitHub Personal Access Token (`github_pat_…`) → de Studio
 *      valideert het token via Octokit (`GET /repos/{owner}/{repo}`) en pas na
 *      succes verdwijnt de gate.
 *   b. Offline: "Offline werken (Lokale bestand/map openen)" voor als er op
 *      school geen internet is.
 *
 * De gate is puur presentatie: de Studio levert de callbacks die het token
 * valideren of de offline-modus starten.
 */
import { icon } from './icons.js';

/** Template-URL naar GitHub's fine-grained PAT-scherm (pre-filled, net als Sveltia CMS). */
const PAT_URL = 'https://github.com/settings/personal-access-tokens/new?name=GLR%20Slide%20Studio&target_name=GLR-CSD&contents=write&actions=read';

export class AuthGate {
  /**
   * @param {HTMLElement} host  container (`#auth-gate`)
   * @param {{ onSubmitToken: (token: string, remember: boolean) => void, onOffline: () => void }} handlers
   */
  constructor(host, { onSubmitToken, onOffline } = {}) {
    this.host = host;
    this.onSubmitToken = onSubmitToken;
    this.onOffline = onOffline;
    this.build();
  }

  build() {
    this.host.classList.add('auth-gate');
    this.host.innerHTML = `
      <div class="auth-gate__glow" aria-hidden="true"></div>
      <div class="auth-card" role="dialog" aria-modal="true" aria-label="Inloggen bij GLR Slide Studio">
        <div class="auth-card__brand"><span class="studio-brand__dot"></span>GLR Slide Studio</div>
        <h1 class="auth-card__title">Welkom terug</h1>
        <p class="auth-card__lead">Log in met je GitHub-token om presentaties te openen en op te slaan, of werk offline verder.</p>

        <form class="auth-card__form" novalidate>
          <label class="auth-field">
            <span class="auth-field__label">GitHub Personal Access Token</span>
            <span class="auth-field__control">
              <span class="auth-field__ic">${icon('key', 16)}</span>
              <input type="password" name="token" autocomplete="off" spellcheck="false"
                     placeholder="github_pat_…" aria-describedby="auth-token-hint" />
            </span>
          </label>

          <label class="auth-check">
            <input type="checkbox" name="remember" checked />
            <span>Onthoud op dit apparaat</span>
          </label>

          <p class="auth-error" role="alert" hidden></p>

          <button type="submit" class="auth-btn auth-btn--primary">
            <span class="auth-btn__ic">${icon('lock', 16)}</span>
            <span class="auth-btn__label">Inloggen</span>
            <span class="auth-btn__spin" aria-hidden="true"></span>
          </button>
        </form>

        <div class="auth-divider"><span>of</span></div>

        <button type="button" class="auth-btn auth-btn--ghost" data-offline>
          <span class="auth-btn__ic">${icon('folder-open', 16)}</span>
          <span class="auth-btn__label">Offline werken (Lokale bestand/map openen)</span>
        </button>

        <p class="auth-card__hint" id="auth-token-hint">
          Kies bij <strong>Resource owner</strong> de organisatie <strong>GLR-CSD</strong> (niet je eigen account); een beheerder moet het token mogelijk goedkeuren.
          Maak een <em>Fine-Grained</em> token aan voor de repository
          <code>GLR-CSD/presentations</code> met <strong>Contents: read &amp; write</strong> (en optioneel <strong>Actions: read</strong> voor de live build-status).
          <a class="auth-card__link" href="${PAT_URL}" target="_blank" rel="noopener noreferrer">Token aanmaken op GitHub</a>
        </p>
      </div>`;

    this.form = this.host.querySelector('form');
    this.input = this.host.querySelector('input[name="token"]');
    this.remember = this.host.querySelector('input[name="remember"]');
    this.errorEl = this.host.querySelector('.auth-error');
    this.primaryBtn = this.host.querySelector('.auth-btn--primary');
    this.offlineBtn = this.host.querySelector('[data-offline]');

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.onSubmitToken) this.onSubmitToken(this.input.value.trim(), this.remember.checked);
    });
    this.offlineBtn.addEventListener('click', () => { if (this.onOffline) this.onOffline(); });
  }

  show() { this.host.hidden = false; }
  hide() { this.host.hidden = true; }

  setToken(token) { if (this.input) this.input.value = token || ''; }

  setLoading(loading) {
    this.host.classList.toggle('is-loading', !!loading);
    this.primaryBtn.disabled = !!loading;
    this.offlineBtn.disabled = !!loading;
  }

  setError(message) {
    if (!message) {
      this.errorEl.hidden = true;
      this.errorEl.textContent = '';
      return;
    }
    this.errorEl.hidden = false;
    this.errorEl.textContent = message;
  }

  reset() {
    this.setError('');
    this.setLoading(false);
  }
}
