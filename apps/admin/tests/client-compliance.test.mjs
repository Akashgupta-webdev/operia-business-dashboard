import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient } from '@tanstack/react-query';
const { default: client } = await import('../src/app/apiClient.js');
const { getClientCompliance, getClientFilings } = await import('../src/features/tax-compliance/api/clientCompliance.api.js');
const { complianceKeys } = await import('../src/features/tax-compliance/constants/queryKeys.js');

test('client compliance preserves metrics and filing APIs preserve pagination and Decimal128 values', async () => {
  const original = client.get;
  const signal = new AbortController().signal;
  const calls = [];
  const summary = { data: { name: 'Example', nextVATDue: null }, metrics: { totalFiling: 5, dueSoon: 1, overdue: 1 } };
  const filings = { data: [{ id: 'filing', input: { $numberDecimal: '1000.00' }, payableTax: '700.00', status: 'paid' }], page: { page: 2, limit: 5, total: 8, totalPages: 2 } };
  client.get = async (url, options) => { calls.push([url, options]); return { data: url.endsWith('/compliance') ? summary : filings }; };
  try {
    assert.deepEqual(await getClientCompliance('client-id', signal), summary);
    for (const type of ['VAT', 'TAX']) {
      assert.deepEqual(await getClientFilings('client-id', type, { page: 2, limit: 5, signal }), filings);
      assert.deepEqual(calls.at(-1), [`/api/v1/client/client-id/${type.toLowerCase()}-filings`, { params: { page: 2, limit: 5 }, signal }]);
    }
    assert.equal(filings.data[0].filingDate, undefined);
  } finally { client.get = original; }
});

test('All previews, VAT/TAX pages and other clients have isolated caches', () => {
  const cache = new QueryClient();
  const keys = [complianceKeys.filings('a', 'VAT', 1, 5), complianceKeys.filings('a', 'TAX', 1, 5), complianceKeys.filings('a', 'VAT', 1, 20), complianceKeys.filings('a', 'VAT', 2, 20), complianceKeys.filings('b', 'VAT', 1, 5)];
  try {
    keys.forEach((key, i) => cache.setQueryData(key, i));
    keys.forEach((key, i) => assert.equal(cache.getQueryData(key), i));
    assert.equal(cache.getQueriesData({ queryKey: complianceKeys.detail('a') }).length, 4);
  } finally { cache.clear(); }
});

test('read failures propagate instead of appearing as empty filing lists', async () => {
  const original = client.get;
  try {
    for (const status of [401, 403, 404, 422, 500]) {
      const failure = Object.assign(new Error('request failed'), { response: { status } });
      client.get = async () => { throw failure; };
      await assert.rejects(getClientCompliance('a'), (error) => error === failure);
      await assert.rejects(getClientFilings('a', 'TAX', { page: 1, limit: 5 }), (error) => error === failure);
    }
  } finally { client.get = original; }
});
