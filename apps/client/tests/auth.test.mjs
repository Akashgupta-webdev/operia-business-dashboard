import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { default: apiClient } = await import('../src/app/apiClient.js');
const { getSession, login, logout } = await import('../src/features/auth/api/auth.api.js');
const { getReturnPath } = await import('../src/features/auth/utils/returnPath.js');
const { loginSchema } = await import('../src/features/auth/schemas/auth.schema.js');

function response(config, data) { return { config, data, status:200, statusText:'OK', headers:{} }; }
function failure(config, status) { return Object.assign(new Error('Synthetic request failure'), { config, response:{status} }); }

test('login uses the established payload and credentialed transport', async () => {
  let captured;
  apiClient.defaults.adapter = async config => { captured = config; return response(config, {}); };
  await login({emailAddress:'client@example.com',password:' client-password '});
  assert.equal(captured.url, '/api/v1/login');
  assert.equal(captured.method, 'post');
  assert.equal(captured.withCredentials, true);
  assert.equal(captured.timeout, 10000);
  assert.deepEqual(JSON.parse(captured.data), {emailAddress:'client@example.com',password:' client-password '});
});

test('session restores the account and treats a revoked session differently from a server outage', async () => {
  const account = {name:'Synthetic Client'};
  apiClient.defaults.adapter = async config => {
    assert.equal(config.url, '/api/v1/session');
    assert.equal(config.method, 'get');
    assert.equal(config.withCredentials, true);
    return response(config,{data:account});
  };
  assert.deepEqual(await getSession(), account);
  const requests = [];
  apiClient.defaults.adapter = async config => { requests.push(config.url); throw failure(config,401); };
  assert.equal(await getSession(), null);
  assert.deepEqual(requests, ['/api/v1/session']);
  apiClient.defaults.adapter = async config => { throw failure(config,503); };
  await assert.rejects(getSession(), error => error.response.status === 503);
});

test('concurrent protected requests rotate cookies once and retry', async () => {
  let refreshes = 0;
  apiClient.defaults.adapter = async config => {
    if (config.url === '/api/v1/refresh-token') {
      assert.equal(config.method, 'post');
      assert.equal(config.withCredentials, true);
      refreshes++;
      await new Promise(resolve => setImmediate(resolve));
      return response(config,{});
    }
    if (!config._retry) throw failure(config,401);
    return response(config,{data:{name:'Synthetic Client'}});
  };
  const results = await Promise.all([apiClient.get('/test/protected'),apiClient.get('/test/protected')]);
  assert.equal(refreshes,1);
  assert.equal(results.length,2);
  results.forEach(result => assert.equal(result.config._retry, true));
});

test('logout allows an already revoked session but reports network/server failures', async () => {
  apiClient.defaults.adapter = async config => { throw failure(config,401); };
  await logout();
  apiClient.defaults.adapter = async config => { throw failure(config,500); };
  await assert.rejects(logout());
});

test('return paths retain deep-link filters and reject external destinations', () => {
  assert.equal(getReturnPath({pathname:'/my-documents',search:'?view=all',hash:'#files'}),'/my-documents?view=all#files');
  for (const pathname of ['https://example.invalid','//example.invalid','/\\example.invalid','/login']) assert.equal(getReturnPath({pathname}),'/dashboard');
  assert.equal(getReturnPath(),'/dashboard');
});

test('login requires an email and password and preserves password whitespace', () => {
  const result = loginSchema.validate({emailAddress:' CLIENT@EXAMPLE.COM ',password:' password '});
  assert.equal(result.error,undefined);
  assert.deepEqual(result.value,{emailAddress:'client@example.com',password:' password '});
  for (const payload of [{}, {emailAddress:'invalid',password:'password'}, {emailAddress:'client@example.com'}, {emailAddress:'client@example.com',password:''}, {accessKey:'123456789012'}]) assert.ok(loginSchema.validate(payload).error);
});

test('invalid login credentials do not trigger session refresh', async () => {
  const requests = [];
  apiClient.defaults.adapter = async config => { requests.push(config.url); throw failure(config,401); };
  await assert.rejects(login({emailAddress:'client@example.com',password:'wrong-password'}));
  assert.deepEqual(requests,['/api/v1/login']);
});


test('session cleanup retains active observers and clears account data', async () => {
  const { QueryClient, QueryObserver } = await import('@tanstack/react-query');
  const { resetSession } = await import('../src/features/auth/utils/resetSession.js');
  const { authKeys } = await import('../src/features/auth/constants/queryKeys.js');
  const cache = new QueryClient();
  cache.setQueryData(authKeys.session, {name:'Synthetic Client'});
  cache.setQueryData(['documents'], [{id:'synthetic'}]);
  const observer = new QueryObserver(cache, {queryKey:authKeys.session, enabled:false});
  const unsubscribe = observer.subscribe(() => {});
  try {
    await resetSession(cache);
    assert.equal(observer.getCurrentResult().data,null);
    assert.equal(observer.getCurrentResult().isPending,false);
    assert.equal(cache.getQueryData(['documents']),undefined);
    cache.setQueryData(authKeys.session,{name:'Next Client'});
    assert.deepEqual(observer.getCurrentResult().data,{name:'Next Client'});
  } finally { unsubscribe();cache.clear(); }
});
