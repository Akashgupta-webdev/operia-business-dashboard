import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiClient, installAuthRefreshInterceptor } from '../src/index.js';

function unauthorized(config, status = 401) {
  return Object.assign(new Error('Synthetic HTTP failure'), { config, response: { status } });
}
function fixture({ rejectRefresh = false, rejectRetry = false } = {}) {
  let refreshes = 0;
  let notifications = 0;
  const requests = [];
  const client = createApiClient({
    adapter: async config => {
      requests.push(config);
      if (config.url === '/refresh') {
        refreshes++;
        await new Promise(resolve => setImmediate(resolve));
        if (rejectRefresh) throw unauthorized(config);
      } else if (!config._retry || rejectRetry) {
        throw unauthorized(config, config.url === '/bad-request' ? 422 : 401);
      }
      return { data: 'ok', status: 200, statusText: 'OK', config, headers: {} };
    },
  });
  installAuthRefreshInterceptor(client, {
    refresh: () => client.post('/refresh'),
    shouldRefresh: config => !['/refresh', '/login'].includes(config.url),
    onUnauthorized: () => { notifications++; },
  });
  return { client, requests, refreshes: () => refreshes, notifications: () => notifications };
}

test('concurrent 401s share one refresh and each retry their original request', async () => {
  const state = fixture();
  const results = await Promise.all([state.client.get('/one'), state.client.post('/two', { fixture: true })]);
  assert.deepEqual(results.map(result => result.data), ['ok', 'ok']);
  assert.equal(state.refreshes(), 1);
  assert.equal(state.requests.filter(config => config.url !== '/refresh').length, 4);
  const posts = state.requests.filter(config => config.url === '/two');
  assert.equal(posts[0].data, posts[1].data);
  assert.equal(state.notifications(), 0);
  await state.client.get('/three');
  assert.equal(state.refreshes(), 2);
});

test('login, non-401 errors, and failed retried requests never cause refresh loops', async () => {
  const state = fixture({ rejectRetry: true });
  await assert.rejects(state.client.post('/login'));
  await assert.rejects(state.client.get('/bad-request'));
  assert.equal(state.refreshes(), 0);
  await assert.rejects(state.client.get('/one'));
  assert.equal(state.refreshes(), 1);
  assert.equal(state.notifications(), 0);
});

test('failed refresh rejects waiting requests, notifies, and releases its lock', async () => {
  const state = fixture({ rejectRefresh: true });
  const results = await Promise.allSettled([state.client.get('/one'), state.client.get('/two')]);
  assert.deepEqual(results.map(result => result.status), ['rejected', 'rejected']);
  assert.equal(state.refreshes(), 1);
  assert.equal(state.notifications(), 2);
  await assert.rejects(state.client.get('/three'));
  assert.equal(state.refreshes(), 2);
});

test('errors without a request config are propagated unchanged', async () => {
  const error = new Error('Synthetic transport failure');
  const client = createApiClient({ adapter: async () => { throw error; } });
  installAuthRefreshInterceptor(client, {
    refresh: () => assert.fail('Unexpected refresh'),
    shouldRefresh: () => true,
  });
  await assert.rejects(client.get('/one'), actual => actual === error);
});
