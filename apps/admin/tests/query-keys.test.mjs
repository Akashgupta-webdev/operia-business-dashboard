import test from 'node:test';
import assert from 'node:assert/strict';
import { QueryClient } from '@tanstack/react-query';
import { clientKeys } from '../src/features/clients/constants/queryKeys.js';
import { authKeys } from '../src/features/auth/constants/queryKeys.js';
import { companyKeys } from '../src/features/companies/constants/queryKeys.js';
import { dashboardKeys } from '../src/features/dashboard/constants/queryKeys.js';
import { financeKeys } from '../src/features/finance/constants/queryKeys.js';
import { renewalKeys } from '../src/features/renewals/constants/queryKeys.js';

test('query factories retain the pre-migration keys', () => {
  const filters = { page: 2, limit: 10 };
  assert.deepEqual(clientKeys.list(filters), ['clients', filters]);
  assert.deepEqual(clientKeys.detail('fixture'), ['client-detail', 'fixture']);
  assert.deepEqual(authKeys.session, ['auth', 'session']);
  assert.deepEqual(authKeys.currentClient, ['client', 'me']);
  assert.deepEqual(companyKeys.list(filters), ['client-companies', filters]);
  assert.deepEqual(dashboardKeys.kpi(filters), ['client-dashboard-kpi', filters]);
  assert.deepEqual(financeKeys.profitLoss(filters), ['profit-loss', filters]);
  assert.deepEqual(financeKeys.revenueInflows(filters), ['profit-loss', 'revenue-inflow', filters]);
  assert.deepEqual(renewalKeys.list(filters), ['client-renewals', filters]);
});

test('client and finance prefix invalidations retain their scope', async () => {
  const cache = new QueryClient();
  const list = clientKeys.list({ page: 1 });
  const detail = clientKeys.detail('fixture');
  const revenue = financeKeys.revenueInflows({ page: 1 });
  const profitLoss = financeKeys.profitLoss({ month: '9', year: '2026' });
  try {
    for (const key of [list, detail, revenue, profitLoss]) cache.setQueryData(key, {});
    await cache.invalidateQueries({ queryKey: clientKeys.all });
    assert.equal(cache.getQueryState(list).isInvalidated, true);
    assert.equal(cache.getQueryState(detail).isInvalidated, false);
    await cache.invalidateQueries({ queryKey: clientKeys.detail('fixture') });
    assert.equal(cache.getQueryState(detail).isInvalidated, true);
    await cache.invalidateQueries({ queryKey: financeKeys.all });
    assert.equal(cache.getQueryState(revenue).isInvalidated, true);
    assert.equal(cache.getQueryState(profitLoss).isInvalidated, true);
  } finally {
    cache.clear();
  }
});
