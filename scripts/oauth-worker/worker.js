/**
 * GLR Slides OAuth-broker (Cloudflare Worker).
 * Routes: GET /health, GET /login, GET /callback, POST /exchange.
 * Geheimen: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET. Vars: STUDIO_URL, ALLOWED_ORIGIN, GITHUB_SCOPE.
 */
const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';
const STATE_COOKIE = 'glr_oauth_state';

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function json(body, status, env, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env), ...extra },
  });
}

function configured(env) {
  return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
}

async function exchangeCode(code, env) {
  const res = await fetch(GITHUB_TOKEN, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (data.error || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Token-uitwisseling mislukt');
  }
  return data.access_token;
}

function safeJs(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function clearCookie() {
  return `${STATE_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=0`;
}

function resultPage(env, { token, error }, status = 200) {
  const studio = env.STUDIO_URL || '';
  const message = token ? { type: 'glr-oauth-token', token } : { type: 'glr-oauth-error', error };
  const hash = token ? `#oauth_token=${encodeURIComponent(token)}` : `#oauth_error=${encodeURIComponent(error)}`;
  const html = `<!doctype html><html lang="nl"><meta charset="utf-8"><title>GitHub-login</title>
<body><p>${token ? 'Ingelogd, dit venster sluit automatisch…' : escapeHtml(error)}</p>
<script>
(function () {
  var message = ${safeJs(message)};
  var targetOrigin = ${safeJs(env.ALLOWED_ORIGIN || '')};
  var fallback = ${safeJs(studio)} + ${safeJs(hash)};
  if (window.opener && targetOrigin) {
    window.opener.postMessage(message, targetOrigin);
    window.close();
  } else {
    location.replace(fallback);
  }
})();
</script></body></html>`;
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': clearCookie(), 'Cache-Control': 'no-store' },
  });
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(env) });

    if (url.pathname === '/health' && request.method === 'GET') {
      return json({ ok: true, configured: configured(env) }, 200, env);
    }

    if (url.pathname === '/login' && request.method === 'GET') {
      if (!configured(env)) return json({ ok: false, error: 'OAuth is niet geconfigureerd' }, 500, env);
      const state = crypto.randomUUID();
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: env.GITHUB_SCOPE || 'repo,workflow',
        state,
        redirect_uri: `${url.origin}/callback`,
      });
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${GITHUB_AUTHORIZE}?${params}`,
          'Set-Cookie': `${STATE_COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=600`,
        },
      });
    }

    if (url.pathname === '/callback' && request.method === 'GET') {
      const ghError = url.searchParams.get('error_description') || url.searchParams.get('error');
      if (ghError) return resultPage(env, { error: ghError }, 400);
      const state = url.searchParams.get('state');
      const code = url.searchParams.get('code');
      if (!state || state !== readCookie(request, STATE_COOKIE)) {
        return resultPage(env, { error: 'Ongeldige state (CSRF-controle mislukt). Probeer opnieuw.' }, 400);
      }
      if (!code) return resultPage(env, { error: 'Geen code ontvangen van GitHub.' }, 400);
      if (!configured(env)) return resultPage(env, { error: 'OAuth is niet geconfigureerd.' }, 500);
      try {
        return resultPage(env, { token: await exchangeCode(code, env) });
      } catch (err) {
        return resultPage(env, { error: err.message }, 502);
      }
    }

    if (url.pathname === '/exchange' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.code) return json({ error: 'code ontbreekt' }, 400, env);
      if (!configured(env)) return json({ error: 'OAuth is niet geconfigureerd' }, 500, env);
      try {
        return json({ access_token: await exchangeCode(body.code, env) }, 200, env);
      } catch (err) {
        return json({ error: err.message }, 502, env);
      }
    }

    return json({ error: 'Niet gevonden' }, 404, env);
  },
};
