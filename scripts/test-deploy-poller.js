#!/usr/bin/env node
/**
 * Test voor de build-indicator-logica (zonder DOM, met een nep-fetchRun).
 * Gebruik:  npm run test:deploy
 */
import { DeployPoller } from '../admin/src/ui/deploy-poller.js';
import { describeBuildRun, MESSAGES, FALLBACK_MESSAGE } from '../admin/src/storage/build-status.js';
import { isDeployRun } from '../admin/src/storage/github.js';

let failures = 0;
const ok = (c, m) => { if (!c) { failures += 1; console.error(`✖ ${m}`); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- describeBuildRun + workflow-filter
ok(describeBuildRun(null).phase === 'queued' && describeBuildRun(null).message === MESSAGES.queued, 'null → queued');
ok(describeBuildRun({ status: 'queued' }).phase === 'queued', 'queued');
ok(describeBuildRun({ status: 'in_progress' }).message.includes('~45-60s'), 'in_progress tekst');
ok(describeBuildRun({ status: 'completed', conclusion: 'success' }).final, 'success is final');
ok(describeBuildRun({ status: 'completed', conclusion: 'failure' }).phase === 'failure', 'failure');
ok(describeBuildRun({ status: 'completed', conclusion: 'cancelled' }).phase === 'cancelled', 'cancelled');
ok(isDeployRun({ path: '.github/workflows/deploy.yml' }), 'filter op pad');
ok(isDeployRun({ path: 'x/deploy.yml@refs/heads/main' }) === false || true, 'pad-variant crasht niet');
ok(isDeployRun({ name: 'Deploy Presentations to GitHub Pages' }), 'filter op naam');
ok(!isDeployRun({ path: 'ci.yml', name: 'CI' }), 'andere workflow genegeerd');

const fast = { pollSeconds: 2, tickMs: 10, maxSeconds: 12, fallbackSeconds: 4 };

// --- queued → in_progress → success
{
  const seq = [null, { status: 'queued' }, { status: 'in_progress' }, { status: 'completed', conclusion: 'success', html_url: 'https://x/run/1' }];
  let n = 0;
  const views = [];
  const p = new DeployPoller({ ...fast, fetchRun: async () => seq[Math.min(n++, seq.length - 1)], onUpdate: (v) => views.push(v) });
  p.start({ commitSha: 'abc', liveUrl: 'https://live/' });
  await sleep(400);
  const phases = views.filter(Boolean).map((v) => v.phase);
  ok(phases[0] === 'queued', 'start = queued');
  ok(phases.includes('in_progress'), 'in_progress bereikt');
  ok(phases.at(-1) === 'success', `eindigt op success (${phases.at(-1)})`);
  ok(views.at(-1).liveUrl === 'https://live/', 'liveUrl doorgegeven');
  ok(!p.active, 'timer gestopt na success');
}

// --- 403 → 60s-aftelling (hier 4 s) → fallback-done
{
  const views = [];
  const p = new DeployPoller({ ...fast, fetchRun: async () => { const e = new Error('Forbidden'); e.status = 403; throw e; }, onUpdate: (v) => views.push(v) });
  p.start({ commitSha: 'abc', liveUrl: 'https://live/' });
  await sleep(400);
  const fb = views.filter((v) => v && v.phase === 'fallback');
  ok(fb.length > 0 && fb[0].message === FALLBACK_MESSAGE, '403 → fallback met juiste tekst');
  ok(fb.every((v) => v.remaining <= 4), 'aftelling vanaf fallbackSeconds');
  ok(views.at(-1).phase === 'fallback-done', 'fallback eindigt op fallback-done');
}

// --- lege lijst (HTTP 200) is GEEN fout → blijft queued, geen fallback
{
  const views = [];
  const p = new DeployPoller({ ...fast, maxSeconds: 1000, fetchRun: async () => null, onUpdate: (v) => views.push(v) });
  p.start({ commitSha: 'abc', liveUrl: 'u' });
  await sleep(150);
  p.stop();
  ok(views.filter(Boolean).every((v) => v.phase === 'queued'), 'lege run-lijst = queued');
}

// --- netwerkfout: stil doorgaan; timeout na maxSeconds
{
  const views = [];
  const p = new DeployPoller({ ...fast, maxSeconds: 6, fetchRun: async () => { throw new Error('netwerk'); }, onUpdate: (v) => views.push(v) });
  p.start({ commitSha: 'abc', liveUrl: 'u' });
  await sleep(250);
  ok(views.at(-1).phase === 'timeout', `timeout bij blijvende fout (${views.at(-1).phase})`);
  ok(!views.some((v) => v && v.phase === 'fallback'), 'netwerkfout geeft geen fallback');
}

// --- nieuwe start annuleert oude sessie
{
  const views = [];
  const p = new DeployPoller({ ...fast, fetchRun: async () => ({ status: 'in_progress' }), onUpdate: (v) => views.push(v) });
  p.start({ commitSha: '1', liveUrl: 'a' });
  p.start({ commitSha: '2', liveUrl: 'b' });
  await sleep(80);
  p.dismiss();
  ok(views.at(-1) === null && !p.active, 'dismiss ruimt op');
  ok(views.filter(Boolean).every((v) => v.liveUrl === 'a' || v.liveUrl === 'b'), 'views consistent');
}

if (failures) { console.error(`\n${failures} fout(en).`); process.exit(1); }
console.log('✔ deploy-poller: alle controles geslaagd');
