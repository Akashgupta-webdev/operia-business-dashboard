import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { default: client } = await import('../src/app/apiClient.js');
const { getExpenses, deleteExpense } = await import('../src/features/finance/api/finance.api.js');
const { financeKeys } = await import('../src/features/finance/constants/queryKeys.js');

test('expense list preserves filters, cancellation, Decimal128 and top-level pagination', async () => {
  const original = client.get;
  const params = { page: 2, limit: 50, search: 'rent', month: 8, year: 2026 };
  const signal = new AbortController().signal;
  const response = { data: { data: [{ id: '68ad00000000000000000001', expenseAmount: { $numberDecimal: '12500.00' } }], page: { page: 2, total: 51, totalPages: 2 } } };
  client.get = async (url, config) => {
    assert.equal(url, '/api/v1/profit-loss/expense');
    assert.deepEqual(config, { params, signal });
    return response;
  };
  try { assert.equal(await getExpenses(params, signal), response); }
  finally { client.get = original; }
});

test('expense deletion sends only the ID path and propagates missing-record failures', async () => {
  const original = client.delete;
  const error = { response: { status: 404, data: { error: { code: 'EXPENSE_NOT_FOUND' } } } };
  client.delete = async (...args) => {
    assert.deepEqual(args, ['/api/v1/profit-loss/expense/68ad00000000000000000001']);
    throw error;
  };
  try { await assert.rejects(deleteExpense('68ad00000000000000000001'), (actual) => actual === error); }
  finally { client.delete = original; }
});

test('expense pages and periods have isolated keys under the finance invalidation root', () => {
  const first = financeKeys.expenses({ page: 1, limit: 50 });
  assert.deepEqual(first.slice(0, financeKeys.all.length), financeKeys.all);
  assert.notDeepEqual(first, financeKeys.expenses({ page: 2, limit: 50 }));
  assert.notDeepEqual(first, financeKeys.expenses({ page: 1, limit: 50, month: 8, year: 2026 }));
});
