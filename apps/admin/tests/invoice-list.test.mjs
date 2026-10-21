import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { default: client } = await import('../src/app/apiClient.js');
const { getInvoices, getInvoice, deleteInvoice } = await import('../src/features/invoices/api/invoices.api.js');
const { referenceId } = await import('../src/features/invoices/utils/invoice.js');
const dto = { _id: '68ad00000000000000000004', invoiceId: 'OP-2026-0001', clientName: 'Example Client', customerName: 'Example Customer', invoiceType: 'Operio To Client', grandTotalAmount: { $numberDecimal: '9007199254740993.01' }, issueDate: '2026-10-22T00:00:00.000Z', dueDate: '2026-11-22T00:00:00.000Z' };
test('invoice list maps compact DTO while retaining pagination, search, signal and exact amounts', async () => {
  const original = client.get;
  const signal = new AbortController().signal;
  const params = { page: 2, limit: 8, search: 'Example' };
  const response = { data: [dto], page: { page: 2, limit: 8, total: 9, totalPages: 2 }, meta: { correlationId: 'request' } };
  client.get = async (url, options) => { assert.equal(url, '/api/v1/client/invoices'); assert.deepEqual(options, { params, signal }); return { data: response }; };
  try {
    const result = await getInvoices(params, signal);
    assert.deepEqual(result.page, response.page); assert.deepEqual(result.meta, response.meta);
    const row = result.data[0];
    assert.equal(row.invoiceNumber, dto.invoiceId); assert.equal(referenceId(row), dto._id);
    assert.equal(row.clientName, dto.clientName); assert.equal(row.customerName, dto.customerName);
    assert.equal(row.invoiceDate, dto.issueDate); assert.equal(row.dueDate, dto.dueDate);
    assert.equal(row.totals.total, '9007199254740993.01');
    assert.equal(row.items, undefined); assert.equal(row.version, undefined);
    response.data = []; assert.deepEqual((await getInvoices(params, signal)).data, []);
  } finally { client.get = original; }
});
test('invoice actions use database ID and retrieve version from detail, not list', async () => {
  const original = { get: client.get, delete: client.delete };
  client.get = async (url) => { assert.equal(url, `/api/v1/client/invoices/${dto._id}`); return { data: { data: { id: dto._id, version: 4 } } }; };
  client.delete = async (url, options) => { assert.equal(url, `/api/v1/client/invoices/${dto._id}`); assert.deepEqual(options.params, { expectedVersion: 4 }); return { data: { data: { deleted: true } } }; };
  try { const detail = await getInvoice(dto._id); assert.deepEqual(await deleteInvoice({ id: referenceId(detail), version: detail.version }), { deleted: true }); }
  finally { Object.assign(client, original); }
});
