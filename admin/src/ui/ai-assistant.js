/**
 * AI Les-Assistent — modal voor collega's die AI in de browser gebruiken
 * (Claude.ai, Gemini, ChatGPT, Copilot) of een desktop-app met MCP.
 *
 * Tab 1: prompt genereren → naar het klembord → AI-uitvoer terugplakken → laden.
 * Tab 2: copy-paste configuratie voor de MCP-server.
 */
import { openModal } from './modal.js';
import { icon } from './icons.js';
import { escapeHtml, SUBJECT_PREFIXES } from './util.js';
import { FRAMEWORKS, frameworkById } from '../pedagogy/frameworks.js';
import { buildLessonPrompt, extractDeckMarkdown, LLM_TARGETS } from '../pedagogy/ai-prompt.js';

export const INPUT_NOTICE = 'Let op: Het `input/` mapje voor brondocumenten kan alleen lokaal worden uitgelezen en is in deze online versie niet beschikbaar. Plak de tekst van je brondocument of aantekeningen hieronder direct in het tekstvak.';

const mcpConfigs = () => {
  const server = { command: 'node', args: ['/VOLLEDIG/PAD/NAAR/presentations/scripts/mcp-server.js'], env: { GITHUB_TOKEN: 'jouw-token-hier (optioneel)' } };
  return [
    { title: 'Claude Desktop', hint: 'Instellingen → Developer → Edit Config (claude_desktop_config.json).', json: { mcpServers: { 'glr-slides': server } } },
    { title: 'Cursor', hint: 'Instellingen → MCP → Add new server (of .cursor/mcp.json in de repo).', json: { mcpServers: { 'glr-slides': server } } },
    { title: 'VS Code', hint: 'Bestand .vscode/mcp.json in de repo.', json: { servers: { 'glr-slides': { type: 'stdio', ...server } } } },
    { title: 'Claude Code', hint: 'Open de repo-map: het bestand .mcp.json staat er al. Je hoeft alleen `npm install` te draaien.', json: { mcpServers: { 'glr-slides': { command: 'node', args: ['scripts/mcp-server.js'] } } } },
  ];
};

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

const h = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};

const row = (label, control, hint = '') => {
  const r = h('label', 'form-row');
  r.append(h('span', 'form-row__label', escapeHtml(label)), control);
  if (hint) r.append(h('span', 'form-row__hint', escapeHtml(hint)));
  return r;
};

const selectOf = (options, value) => {
  const s = document.createElement('select');
  for (const o of options) {
    const op = document.createElement('option');
    op.value = o.value;
    op.textContent = o.label;
    if (String(o.value) === String(value)) op.selected = true;
    s.append(op);
  }
  return s;
};

/**
 * @param {{ hasLocalFolder?:boolean, listInputFiles?:(()=>Promise<Array<{name:string,readable:boolean}>>)|null, readInputText?:((name:string)=>Promise<string>)|null, onLoadDeck:(markdown:string, info:{title:string,prefix:string})=>boolean|void }} ctx
 */
export function openAiAssistant(ctx) {
  const modal = openModal({
    title: 'AI Les-Assistent',
    subtitle: 'Laat Claude, Gemini of ChatGPT een complete presentatie in GLR-huisstijl maken.',
    size: 'xl',
  });

  const tabs = h('div', 'ai-tabs');
  const tabBrowser = h('button', 'ai-tab is-active', `${icon('sparkles', 15)}<span>Werken in de browser</span><small>Claude.ai · Gemini · ChatGPT — geen installatie</small>`);
  const tabMcp = h('button', 'ai-tab', `${icon('terminal', 15)}<span>Koppeling voor desktop-apps</span><small>MCP voor Claude Desktop · Cursor · VS Code</small>`);
  tabBrowser.type = 'button';
  tabMcp.type = 'button';
  tabs.append(tabBrowser, tabMcp);

  const paneBrowser = h('div', 'ai-pane');
  const paneMcp = h('div', 'ai-pane');
  paneMcp.hidden = true;
  const show = (which) => {
    paneBrowser.hidden = which !== 'browser';
    paneMcp.hidden = which !== 'mcp';
    tabBrowser.classList.toggle('is-active', which === 'browser');
    tabMcp.classList.toggle('is-active', which === 'mcp');
  };
  tabBrowser.addEventListener('click', () => show('browser'));
  tabMcp.addEventListener('click', () => show('mcp'));

  /* ---------------------------------------------------------- tab 1 --- */
  const notice = h('div', 'ai-notice');
  const sourceEl = document.createElement('textarea');
  sourceEl.rows = 7;
  sourceEl.placeholder = 'Plak hier de tekst van je brondocument, lesplan of aantekeningen (optioneel).';

  const inputBox = h('div', 'ai-input');
  const setNotice = (html, kind = 'info') => { notice.className = `ai-notice ai-notice--${kind}`; notice.innerHTML = `${icon(kind === 'warn' ? 'alert' : 'info', 16)}<span>${html}</span>`; };

  if (ctx.listInputFiles) {
    ctx.listInputFiles().then((files) => {
      setNotice('Je werkt met een lokale map: kies hieronder een bestand uit <code>input/</code> om de tekst automatisch mee te nemen.', 'info');
      const sel = selectOf([{ value: '', label: '— kies een bestand uit input/ —' }, ...files.map((f) => ({ value: f.name, label: f.readable ? f.name : `${f.name} (alleen via MCP-koppeling)` }))], '');
      [...sel.options].forEach((o, i) => { if (i > 0 && !files[i - 1].readable) o.disabled = true; });
      sel.addEventListener('change', async () => {
        if (!sel.value) return;
        try {
          sourceEl.value = await ctx.readInputText(sel.value);
        } catch (err) {
          setNotice(`Kon ${escapeHtml(sel.value)} niet lezen: ${escapeHtml(err.message)}`, 'warn');
        }
      });
      inputBox.append(row('Bestand uit input/', sel, 'PDF en PowerPoint lees je met de MCP-koppeling (tab 2) of door de tekst te plakken.'));
    }).catch(() => setNotice(escapeHtml(INPUT_NOTICE).replace(/`([^`]+)`/g, '<code>$1</code>'), 'warn'));
  } else {
    setNotice(escapeHtml(INPUT_NOTICE).replace(/`([^`]+)`/g, '<code>$1</code>'), 'warn');
  }

  const frameworkEl = selectOf(FRAMEWORKS.map((f) => ({ value: f.id, label: f.label })), 'gagne');
  const fwInfo = h('p', 'form-row__hint');
  const renderFw = () => { const fw = frameworkById(frameworkEl.value); fwInfo.textContent = `${fw.short} Opbouw: ${fw.outline.join(' → ')}.`; };
  frameworkEl.addEventListener('change', renderFw);
  renderFw();

  const titleEl = document.createElement('input');
  titleEl.placeholder = 'bijv. Introductie Databases';
  const prefixEl = selectOf(SUBJECT_PREFIXES.map((p) => ({ value: p.value, label: p.label })), 'beroeps1');
  const leerjaarEl = selectOf([1, 2, 3].map((n) => ({ value: n, label: `Leerjaar ${n}` })), 1);
  const periodeEl = selectOf([1, 2, 3, 4].map((n) => ({ value: n, label: `Periode ${n}` })), 1);

  const grid = h('div', 'ai-grid');
  const fwRow = row('Didactisch model', frameworkEl);
  fwRow.append(fwInfo);
  fwRow.classList.add('form-row--wide');
  const titleRow = row('Onderwerp / titel *', titleEl);
  titleRow.classList.add('form-row--wide');
  grid.append(titleRow, fwRow, row('Vak / Module prefix', prefixEl), row('Leerjaar', leerjaarEl), row('Periode', periodeEl));

  const copyBtn = h('button', 'studio-btn studio-btn--primary', `${icon('copy', 15)}<span>1. Kopieer Prompt naar Klembord</span>`);
  copyBtn.type = 'button';
  const copyMsg = h('span', 'ai-msg');
  const openers = h('div', 'ai-openers', '<span>Open direct:</span>');
  for (const t of LLM_TARGETS) {
    const a = h('a', 'studio-btn', `${escapeHtml(t.label)} ${icon('external-link', 12)}`);
    a.href = t.url;
    a.target = '_blank';
    a.rel = 'noopener';
    openers.append(a);
  }
  const promptData = () => ({
    frameworkId: frameworkEl.value, title: titleEl.value.trim(), prefix: prefixEl.value,
    leerjaar: leerjaarEl.value, periode: periodeEl.value, sourceText: sourceEl.value,
  });
  copyBtn.addEventListener('click', async () => {
    if (!titleEl.value.trim()) { copyMsg.className = 'ai-msg ai-msg--err'; copyMsg.textContent = 'Vul eerst een onderwerp / titel in.'; titleEl.focus(); return; }
    const ok = await copyText(buildLessonPrompt(promptData()));
    copyMsg.className = `ai-msg ${ok ? 'ai-msg--ok' : 'ai-msg--err'}`;
    copyMsg.textContent = ok ? 'Prompt gekopieerd! Open een AI-chat, plak (Ctrl/Cmd+V) en verstuur.' : 'Kopiëren is mislukt — kopieer de tekst uit het voorbeeld hieronder met de hand.';
    if (!ok) { preview.hidden = false; preview.value = buildLessonPrompt(promptData()); }
  });
  const preview = document.createElement('textarea');
  preview.className = 'ai-code';
  preview.rows = 6;
  preview.readOnly = true;
  preview.hidden = true;

  const outEl = document.createElement('textarea');
  outEl.rows = 8;
  outEl.className = 'ai-code';
  outEl.placeholder = 'Plak hier het antwoord van de AI (de volledige slides.md, met of zonder ```-codeblok).';
  const loadBtn = h('button', 'studio-btn studio-btn--primary', `${icon('play', 15)}<span>2. Laad Presentatie in Studio</span>`);
  loadBtn.type = 'button';
  const result = h('div', 'ai-result');
  loadBtn.addEventListener('click', () => {
    const r = extractDeckMarkdown(outEl.value);
    if (r.errors.length) {
      result.className = 'ai-result ai-result--err';
      result.innerHTML = r.errors.map((e) => `<p>${icon('x-circle', 14)} ${escapeHtml(e)}</p>`).join('');
      return;
    }
    const loaded = ctx.onLoadDeck(r.markdown, { title: r.title, prefix: prefixEl.value });
    if (loaded === false) return;
    modal.close();
  });
  outEl.addEventListener('input', () => {
    if (!outEl.value.trim()) { result.className = 'ai-result'; result.innerHTML = ''; return; }
    const r = extractDeckMarkdown(outEl.value);
    result.className = `ai-result ${r.errors.length ? 'ai-result--err' : 'ai-result--ok'}`;
    result.innerHTML = r.errors.length
      ? r.errors.map((e) => `<p>${icon('x-circle', 14)} ${escapeHtml(e)}</p>`).join('')
      : `<p>${icon('circle-check', 14)} Geldige presentatie: “${escapeHtml(r.title)}” met ${r.slideCount} slides.</p>`
        + r.warnings.map((w) => `<p>${icon('alert', 14)} ${escapeHtml(w)}</p>`).join('');
  });

  const step = (n, title, ...kids) => { const s = h('section', 'ai-step'); s.append(h('h3', null, `<span>${n}</span>${escapeHtml(title)}`), ...kids); return s; };
  paneBrowser.append(
    notice,
    step(1, 'Maak je prompt', grid, inputBox, row('Brontekst (optioneel)', sourceEl), h('div', 'ai-actions'), preview),
    step(2, 'Plak het antwoord van de AI terug', outEl, result, h('div', 'ai-actions')),
  );
  const actions1 = paneBrowser.querySelectorAll('.ai-actions')[0];
  actions1.append(copyBtn, openers, copyMsg);
  paneBrowser.querySelectorAll('.ai-actions')[1].append(loadBtn);

  /* ---------------------------------------------------------- tab 2 --- */
  paneMcp.append(h('div', 'ai-intro', `
    <p><strong>Werk je met Claude Desktop, Claude Code, Cursor of VS Code?</strong> Dan kan je AI-assistent rechtstreeks met de presentaties werken: bronbestanden uit <code>input/</code> lezen, slides maken en aanpassen, de didactiek controleren en publiceren naar GitHub.</p>
    <ol>
      <li>Clone de repository en draai <code>npm install</code> in de map <code>presentations</code>.</li>
      <li>Kopieer het blok voor jouw app en vervang het pad door het volledige pad naar <code>scripts/mcp-server.js</code>.</li>
      <li>Herstart de app. Vraag daarna bijvoorbeeld: “Maak een Gagné-les over CSS Grid op basis van het bestand in input/”.</li>
    </ol>
    <p class="ai-hint">Het token is alleen nodig om te publiceren naar GitHub (rechten: Contents lezen/schrijven, optioneel Actions lezen). Zonder token werkt alles lokaal.</p>`));
  for (const c of mcpConfigs()) {
    const text = JSON.stringify(c.json, null, 2);
    const box = h('section', 'ai-step');
    const head = h('h3', null, escapeHtml(c.title));
    const btn = h('button', 'studio-btn', `${icon('copy', 14)}<span>Kopieer</span>`);
    btn.type = 'button';
    btn.addEventListener('click', async () => { btn.querySelector('span').textContent = (await copyText(text)) ? 'Gekopieerd!' : 'Mislukt'; setTimeout(() => { btn.querySelector('span').textContent = 'Kopieer'; }, 1800); });
    head.append(btn);
    const pre = h('pre', 'ai-code ai-code--block');
    pre.textContent = text;
    box.append(head, h('p', 'form-row__hint', escapeHtml(c.hint)), pre);
    paneMcp.append(box);
  }

  modal.body.append(tabs, paneBrowser, paneMcp);
  return modal;
}
