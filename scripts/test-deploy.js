#!/usr/bin/env node
/**
 * Tests voor de OAuth-Worker (scripts/oauth-worker/worker.js) en de OAuth
 * hash-/berichtafhandeling (admin/src/storage/oauth.js). Geen netwerk: fetch is gemockt.
 * Gebruik:  npm run test:oauth
 */
import worker from './oauth-worker/worker.js';
import { parseOAuthHash, isOAuthMessage, loginUrl, loadStudioConfig } from '../admin/src/storage/oauth.js';

let failures = 0;
const ok = (c, m) => { if (!c) { failures += 1; console.error(`✖ ${m}`); } };

const env = {
  GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'sec',
  STUDIO_URL: 'https://studio.example/admin/', ALLOWED_ORIGIN: 'https://studio.example',
};
const call = (path, init, e = env) => worker.fetch(new Request(`https://w.example${path}`, init), e);

// --- /health
{
  const r = await call('/health');
  const b = await r.json();
  ok(r.status === 200 && b.ok === true && b.configured === true, '/health configured true');
  ok(r.headers.get('Access-Control-Allow-Origin') === env.ALLOWED_ORIGIN, '/health CORS');
  const b2 = await (await call('/health', undefined, { ALLOWED_ORIGIN: 'x' })).json();
  ok(b2.configured === false, '/health configured false zonder secrets');
}

// --- /login
let state;
{
  const r = await call('/login');
  const loc = new URL(r.headers.get('Location'));
  state = loc.searchParams.get('state');
  ok(r.status === 302 && loc.origin + loc.pathname === 'https://github.com/login/oauth/authorize', '/login redirect naar GitHub');
  ok(loc.searchParams.get('client_id') === 'cid', '/login client_id');
  ok(loc.searchParams.get('scope') === 'repo,workflow', '/login default scope');
  ok(Boolean(state) && (r.headers.get('Set-Cookie') || '').includes(`glr_oauth_state=${state}`), '/login state-cookie');
  const r2 = await call('/login', undefined, { ...env, GITHUB_SCOPE: 'repo' });
  ok(new URL(r2.headers.get('Location')).searchParams.get('scope') === 'repo', '/login eigen scope');
  ok((await call('/login', undefined, {})).status === 500, '/login zonder config → 500');
}

// --- /callback
const realFetch = globalThis.fetch;
try {
  let seen;
  globalThis.fetch = async (url, init) => { seen = { url, init }; return new Response(JSON.stringify({ access_token: 'gho_tok<en' }), { status: 200 }); };

  const bad = await call(`/callback?code=c&state=${state}`, { headers: { Cookie: 'glr_oauth_state=other' } });
  ok(bad.status === 400, '/callback state mismatch → 400');
  ok(seen === undefined, '/callback mismatch wisselt geen code in');

  const good = await call(`/callback?code=abc&state=${state}`, { headers: { Cookie: `glr_oauth_state=${state}` } });
  const html = await good.text();
  ok(good.status === 200, '/callback OK');
  ok(seen.url === 'https://github.com/login/oauth/access_token', '/callback wisselt in bij GitHub');
  ok(seen.init.headers.Accept === 'application/json', '/callback Accept-header');
  const sent = JSON.parse(seen.init.body);
  ok(sent.client_id === 'cid' && sent.client_secret === 'sec' && sent.code === 'abc', '/callback verstuurt id/secret/code');
  ok(html.includes('window.opener.postMessage') && html.includes('glr-oauth-token') && html.includes('window.close()'), '/callback postMessage + close');
  ok(html.includes('"https://studio.example"') && !html.includes("postMessage(message, '*')"), '/callback targetOrigin = ALLOWED_ORIGIN');
  ok(html.includes('#oauth_token=') && html.includes('location.replace'), '/callback hash-fallback');
  ok(!html.includes('gho_tok<en'), '/callback ontsnapt < in token');

  const err = await call('/callback?error=access_denied');
  ok(err.status === 400 && (await err.text()).includes('glr-oauth-error'), '/callback GitHub-fout wordt doorgegeven');

  // --- /exchange
  const ex = await call('/exchange', { method: 'POST', body: JSON.stringify({ code: 'z' }) });
  const exb = await ex.json();
  ok(ex.status === 200 && exb.access_token === 'gho_tok<en', '/exchange OK');
  ok(ex.headers.get('Access-Control-Allow-Origin') === env.ALLOWED_ORIGIN, '/exchange CORS');
  ok((await call('/exchange', { method: 'POST', body: '{}' })).status === 400, '/exchange zonder code → 400');
  globalThis.fetch = async () => new Response(JSON.stringify({ error: 'bad_verification_code' }), { status: 200 });
  ok((await call('/exchange', { method: 'POST', body: JSON.stringify({ code: 'z' }) })).status === 502, '/exchange GitHub-fout → 502');
} finally {
  globalThis.fetch = realFetch;
}

// --- OPTIONS / 404
{
  const r = await call('/exchange', { method: 'OPTIONS' });
  ok(r.status === 204 && r.headers.get('Access-Control-Allow-Methods').includes('POST'), 'OPTIONS preflight');
  ok((await call('/nope')).status === 404, 'onbekend pad → 404');
}

// --- parseOAuthHash
{
  ok(parseOAuthHash('#oauth_token=abc').token === 'abc', 'hash: token');
  ok(parseOAuthHash(`#oauth_token=${encodeURIComponent('a b/c+d')}`).token === 'a b/c+d', 'hash: encoded token');
  ok(parseOAuthHash('#oauth_error=denied').error === 'denied', 'hash: error');
  const mixed = parseOAuthHash('#oauth_token=t&slide=3');
  ok(mixed.token === 't' && mixed.rest === 'slide=3', 'hash: overige hash blijft');
  const none = parseOAuthHash('');
  ok(!none.token && !none.error && none.rest === '', 'hash: leeg');
  ok(!parseOAuthHash('#slide=2').token, 'hash: zonder token');
}

// --- isOAuthMessage / loginUrl / config
{
  const w = 'https://w.example';
  ok(isOAuthMessage({ origin: w, data: { type: 'glr-oauth-token', token: 't' } }, w), 'bericht: geldig');
  ok(!isOAuthMessage({ origin: 'https://evil.example', data: { type: 'glr-oauth-token', token: 't' } }, w), 'bericht: foute origin');
  ok(!isOAuthMessage({ origin: w, data: { type: 'other' } }, w), 'bericht: fout type');
  ok(!isOAuthMessage({ origin: w, data: { type: 'glr-oauth-token', token: 't' } }, null), 'bericht: geen worker-url');
  ok(loginUrl('https://w.example/') === 'https://w.example/login', 'loginUrl');
  ok((await loadStudioConfig(async () => ({ ok: true, json: async () => ({ oauthUrl: w }) }))).oauthUrl === w, 'config geladen');
  ok((await loadStudioConfig(async () => { throw new Error('x'); })).oauthUrl === null, 'config fallback');
}

if (failures) { console.error(`\n${failures} test(s) mislukt.`); process.exit(1); }
console.log('✔ OAuth-worker en hash-afhandeling: alle tests geslaagd.');
