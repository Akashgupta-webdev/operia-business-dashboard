import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const { default: apiClient } = await import('../src/app/apiClient.js');

// Synthetic request fixtures captured from the service before its extraction.
const cases = JSON.parse(readFileSync(new URL('./fixtures/api-contracts.json', import.meta.url)));
for (const contract of cases) {
  test(`API contract: ${contract.name}`, async () => {
    const api = await import(`../src/${contract.module}`);
    const original = apiClient[contract.expected.method];
    const response = { data: { data: { fixture: true } } };
    let actual;
    apiClient[contract.expected.method] = (...args) => {
      actual = { method: contract.expected.method, args };
      return Promise.resolve(response);
    };
    try {
      assert.equal(await api[contract.name](...contract.args), response);
      assert.deepEqual(actual, contract.expected);
    } finally {
      apiClient[contract.expected.method] = original;
    }
  });
}

test('client creation preserves multipart fields, file order, and boundary handling', async () => {
  const { createClient } = await import('../src/features/clients/api/clients.api.js');
  const original = apiClient.post;
  const payload = { name: 'Synthetic upload fixture' };
  const files = [new File(['first'], 'first.txt'), new File(['second'], 'second.txt')];
  let actual;
  apiClient.post = (...args) => { actual = args; return Promise.resolve({ data: {} }); };
  try {
    await createClient({ payload, files });
    assert.equal(actual[0], '/api/v1/client');
    assert.equal(actual[1].get('payload'), JSON.stringify(payload));
    assert.deepEqual(actual[1].getAll('documents').map(file => file.name), ['first.txt', 'second.txt']);
    assert.deepEqual(actual[2], { headers: { 'Content-Type': undefined } });
  } finally {
    apiClient.post = original;
  }
});

