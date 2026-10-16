import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { default: client } = await import('../src/app/apiClient.js');
const { createFiling, updateFiling, deleteFiling } = await import('../src/features/tax-compliance/api/filings.api.js');
import { initialFilingForm, filingPayload, payablePreview } from '../src/features/tax-compliance/utils/filingForm.js';

test('VAT and TAX writes use company IDs for creation, filing IDs for edits and deletes', async () => {
  const original = { post: client.post, patch: client.patch, delete: client.delete };
  const calls = [];
  const result = { id: 'filing-id', version: 1 };
  for (const method of Object.keys(original)) client[method] = async (...args) => { calls.push([method, ...args]); return { data: { data: result }, headers: { etag: '1' } }; };
  try {
    for (const type of ['VAT', 'TAX']) {
      const payload = { periodStart: '01-2026', periodEnd: '03-2026', input: '9007199254740993.01', output: '40.00', nextDueDate: '2026-04-28' };
      assert.deepEqual(await createFiling({ type, companyId: 'company-id', payload }), result);
      assert.deepEqual(calls.at(-1), ['post', '/api/v1/client/createFiling' + type + '/company-id', payload]);
      assert.deepEqual(await updateFiling({ type, id: 'filing-id', payload: { status: 'Paid' } }), result);
      assert.deepEqual(calls.at(-1), ['patch', '/api/v1/client/updateFiling' + type + '/filing-id', { status: 'Paid' }]);
      await deleteFiling({ type, id: 'filing-id' });
      assert.deepEqual(calls.at(-1), ['delete', '/api/v1/client/deleteFiling' + type + '/filing-id']);
    }
    for (const status of [401, 403, 404, 409, 422]) {
      const error = { response: { status } };
      for (const method of Object.keys(original)) client[method] = async () => { throw error; };
      for (const write of [createFiling, updateFiling, deleteFiling]) await assert.rejects(write({ type: 'VAT', id: 'filing-id', companyId: 'company-id', payload: {} }), (failure) => failure === error);
    }
  } finally { Object.assign(client, original); }
});

test('filing form preserves decimal strings, month format, optional dates and PATCH omissions', () => {
  const initial = initialFilingForm({ periodStart: '01-2026', periodEnd: '03-2026', status: 'pending', input: { $numberDecimal: '9007199254740993.01' }, output: { $numberDecimal: '40.00' }, filingDate: null, nextDueDate: '2026-04-28T00:00:00.000Z' });
  assert.equal(initial.periodStart, '2026-01');
  assert.equal(initial.status, 'Pending');
  assert.deepEqual(filingPayload(initial), { periodStart: '01-2026', periodEnd: '03-2026', status: 'Pending', input: '9007199254740993.01', output: '40.00', nextDueDate: '2026-04-28' });
  assert.deepEqual(filingPayload({ ...initial, status: 'Paid' }, initial), { status: 'Paid' });
  assert.deepEqual(filingPayload(initial, initial), {});
  assert.deepEqual(filingPayload({ ...initial, filingDate: '2026-04-01' }, initial), { filingDate: '2026-04-01' });
});

test('payable preview computes input minus output without floating point loss', () => {
  assert.equal(payablePreview('100.00', '40.00'), '60.00');
  assert.equal(payablePreview('250000', '300000'), '-50,000.00');
  assert.equal(payablePreview('9007199254740993.01', '0.02'), '9,007,199,254,740,992.99');
  assert.equal(payablePreview('0.3', '0.1'), '0.20');
  assert.equal(payablePreview('-1.001', '0.009'), '-1.010');
});
