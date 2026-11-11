import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { expenseCreateSchema } = await import('../src/features/finance/schemas/finance.schema.js');

const expense = { expenseTitle: 'Wifi Bill', expenseCategory: 'Government & Authority Fees', expenseAmount: '125' };

test('expense dates remain date-only strings after resolver validation', () => {
  for (const expenseDate of ['2026-11-11', '2028-02-29', '', undefined]) {
    const result = expenseCreateSchema.validate({ ...expense, expenseDate }, { abortEarly: false });
    assert.equal(result.error, undefined);
    assert.equal(result.value.expenseDate, expenseDate);
  }
});

test('expense dates reject impossible dates and non-date-only values', () => {
  for (const expenseDate of ['2026-02-29', '2026-04-31', '2026-13-01', '0000-01-01', '11/11/2026', '2026-11-11T00:00:00.000Z']) {
    assert.ok(expenseCreateSchema.validate({ ...expense, expenseDate }).error, expenseDate);
  }
});
