#!/usr/bin/env node
/**
 * Test: commitFiles probeert opnieuw bij "not a fast forward" (gestubde Octokit).
 * Gebruik:  npm run test:commit
 */
import { commitFiles, _setClientForTests } from '../admin/src/storage/github.js';

let failures = 0;
const ok = (c, m) => { if (!c) { failures += 1; console.error(`✖ ${m}`); } };

function makeApi(updateFailures, failWith = { status: 422, message: 'Update is not a fast forward' }) {
  const calls = { getRef: 0, createBlob: 0, updateRef: 0, createCommit: 0 };
  let tip = 0;
  const api = { rest: { git: {
    getRef: async () => { calls.getRef += 1; tip += 1; return { data: { object: { sha: `tip${tip}` } } }; },
    getCommit: async ({ commit_sha }) => ({ data: { tree: { sha: `tree-${commit_sha}` } } }),
    createBlob: async () => { calls.createBlob += 1; return { data: { sha: 'blob1' } }; },
    createTree: async () => ({ data: { sha: 'newtree' } }),
    createCommit: async ({ parents }) => { calls.createCommit += 1; return { data: { sha: `commit-on-${parents[0]}` } }; },
    updateRef: async () => {
      calls.updateRef += 1;
      if (calls.updateRef <= updateFailures) throw Object.assign(new Error(failWith.message), failWith);
      return {};
    },
  } } };
  return { api, calls };
}

const files = [{ path: 'shared/img/uploads/a.png', content: 'AAAA', encoding: 'base64' }];

{ // 1 conflict → retry op nieuwe tip, blob maar één keer
  const { api, calls } = makeApi(1);
  _setClientForTests(api);
  const sha = await commitFiles('m', files);
  ok(calls.getRef === 2, 'getRef 2x');
  ok(calls.createBlob === 1, 'blob 1x');
  ok(sha === 'commit-on-tip2', 'tweede commit heeft nieuwe tip als parent');
}
{ // blijvend conflict → gooit na 3 pogingen
  const { api, calls } = makeApi(99);
  _setClientForTests(api);
  let err = null;
  try { await commitFiles('m', files); } catch (e) { err = e; }
  ok(err && err.status === 422 && calls.updateRef === 3, 'stopt na 3 pogingen');
}
{ // andere fout → geen retry
  const { api, calls } = makeApi(99, { status: 403, message: 'Forbidden' });
  _setClientForTests(api);
  let err = null;
  try { await commitFiles('m', files); } catch (e) { err = e; }
  ok(err && err.status === 403 && calls.updateRef === 1, '403 niet opnieuw geprobeerd');
}

if (failures) { console.error(`${failures} test(s) mislukt`); process.exit(1); }
console.log('✓ github commit-retry tests ok');
