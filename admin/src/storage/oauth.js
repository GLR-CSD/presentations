/**
 * Pure helpers voor de GitHub OAuth-flow (geen DOM, dus testbaar in Node).
 * De Worker-URL komt uit `studio-config.json` (build-time, env GLR_OAUTH_URL).
 */

/** Leest `oauth_token` / `oauth_error` uit een URL-hash; `rest` is de overige hash. */
export function parseOAuthHash(hash) {
  const raw = String(hash || '').replace(/^#/, '');
  if (!raw) return { token: null, error: null, rest: '' };
  const params = new URLSearchParams(raw);
  const token = params.get('oauth_token');
  const error = params.get('oauth_error');
  params.delete('oauth_token');
  params.delete('oauth_error');
  return { token: token || null, error: error || null, rest: params.toString() };
}

/** Accepteert alleen berichten van de Worker-origin met een bekend type. */
export function isOAuthMessage(event, workerUrl) {
  if (!event || !event.data || !workerUrl) return false;
  let origin;
  try { origin = new URL(workerUrl).origin; } catch { return false; }
  if (event.origin !== origin) return false;
  const { type } = event.data;
  return (type === 'glr-oauth-token' && typeof event.data.token === 'string')
    || (type === 'glr-oauth-error');
}

export function loginUrl(workerUrl) {
  return `${String(workerUrl).replace(/\/+$/, '')}/login`;
}

/** Laadt `studio-config.json`; valt terug op `{ oauthUrl: null }`. */
export async function loadStudioConfig(fetchImpl = globalThis.fetch) {
  try {
    const res = await fetchImpl('./studio-config.json', { cache: 'no-store' });
    if (!res.ok) return { oauthUrl: null };
    const data = await res.json();
    return { oauthUrl: data && data.oauthUrl ? String(data.oauthUrl) : null };
  } catch {
    return { oauthUrl: null };
  }
}
