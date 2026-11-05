/**
 * Presenter — "Presenteer" (F5): de preview op volledig scherm, vanaf de
 * geselecteerde slide, met toetsenbord-navigatie en fragment-stappen.
 * Esc (of de knop "Sluit (Esc)") keert terug naar de editor.
 */
export class Presenter {
  /**
   * @param {import('./live-preview.js').LivePreviewController} preview
   * @param {{ onExit?: (flatIndex:number)=>void }} opts
   */
  constructor(preview, { onExit } = {}) {
    this.preview = preview;
    this.onExit = onExit;
    this.active = false;
    this.pseudo = false;
    this._onFs = () => { if (this.active && !this.pseudo && !document.fullscreenElement) this.stop(); };
    this._onKey = (e) => { if (this.active && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this.stop(); } };
  }

  async start(index) {
    if (this.active || !this.preview.ready) return;
    const host = this.preview.host;
    this.active = true;
    this.pseudo = false;
    if (!this.exitBtn) {
      this.exitBtn = document.createElement('button');
      this.exitBtn.type = 'button';
      this.exitBtn.className = 'present-exit';
      this.exitBtn.textContent = 'Sluit (Esc)';
      this.exitBtn.addEventListener('click', () => this.stop());
      host.appendChild(this.exitBtn);
    }
    this.preview.setPresenting(true);
    document.addEventListener('fullscreenchange', this._onFs);
    document.addEventListener('keydown', this._onKey, true);
    try {
      await host.requestFullscreen();
    } catch {
      this.pseudo = true; // geen Fullscreen API (of geweigerd): vul het venster
    }
    if (!document.fullscreenElement) this.pseudo = true;
    host.classList.toggle('is-pseudo-fullscreen', this.pseudo);
    this.preview.startAt(index);
    host.setAttribute('tabindex', '-1');
    host.focus({ preventScroll: true });
  }

  stop() {
    if (!this.active) return;
    this.active = false;
    const host = this.preview.host;
    document.removeEventListener('fullscreenchange', this._onFs);
    document.removeEventListener('keydown', this._onKey, true);
    const idx = this.preview.currentFlatIndex();
    host.classList.remove('is-pseudo-fullscreen');
    this.pseudo = false;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    this.preview.setPresenting(false);
    if (this.onExit) this.onExit(idx);
  }
}
