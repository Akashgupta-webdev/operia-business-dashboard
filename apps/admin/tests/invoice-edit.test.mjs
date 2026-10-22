import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { initialEditInvoice, createInvoicePayload, updateInvoicePayload } from '../src/features/invoices/utils/createInvoice.js';
const { default: client } = await import('../src/app/apiClient.js');
const { saveInvoice } = await import('../src/features/invoices/api/invoices.api.js');

test('partial edits omit unchanged fields, clear optional values and replace services only when changed', () => {
  const invoice = { version: 2, customerName: 'Customer', emirate: 'Dubai', service: [{ itemDescription: 'Filing', qty: 1, govtRate: 0, servicePrice: 100, taxCode: 5, taxAmount: 5, grandTotal: 105 }] };
  const form = initialEditInvoice(invoice);
  assert.deepEqual(updateInvoicePayload(form, invoice), { expectedVersion: 2 });
  assert.deepEqual(updateInvoicePayload({ ...form, customerName: 'New customer' }, invoice), { customerName: 'New customer', expectedVersion: 2 });
  assert.deepEqual(updateInvoicePayload({ ...form, emirate: '' }, invoice), { emirate: '', expectedVersion: 2 });
  const formatted = { ...form, service: [{ ...form.service[0], servicePrice: '100.00' }] };
  assert.deepEqual(updateInvoicePayload(formatted, invoice), { expectedVersion: 2 });
  const edited = { ...form, service: [{ ...form.service[0], qty: '1.5' }] };
  const payload = updateInvoicePayload(edited, invoice);
  assert.deepEqual(Object.keys(payload).sort(), ['expectedVersion', 'service']);
  assert.equal(payload.service[0].grandTotal, '157.50');
  assert.deepEqual(updateInvoicePayload({ ...form, service: [] }, invoice), { service: [], expectedVersion: 2 });
});

test('detail numbers and populated references prefill the shared form and preserve fractional quantity', () => {
  const form = initialEditInvoice({ clientId: { id: 'client' }, companyId: { id: 'company' }, invoiceType: 'Operio To Client', customerName: 'Customer', contactNo: '+971501234567', issueDate: '2026-10-23T00:00:00.000Z', dueDate: '2026-11-23T00:00:00.000Z', switftBIC: 'ABDIAEADXXX', service: [{ itemDescription: 'Filing', qty: 1.5, govtRate: 10, servicePrice: 100, taxCode: 5, taxAmount: 7.5, grandTotal: 172.5 }] });
  assert.equal(form.clientId, 'client');
  assert.equal(form.companyId, 'company');
  assert.equal(form.contactNo, '501234567');
  assert.equal(form.issueDate, '2026-10-23');
  assert.equal(form.service[0].taxCode, '5');
  const payload = createInvoicePayload(form);
  assert.equal(payload.service[0].qty, 1.5);
  assert.equal(payload.service[0].grandTotal, '172.50');
  assert.equal(payload.switftBIC, 'ABDIAEADXXX');
  assert.equal(initialEditInvoice({ clientId: null, companyId: null }).clientId, '');
});

test('updates use the requested PATCH route and retain optimistic version', async () => {
  const original = client.patch;
  const id = '68ad00000000000000000004';
  const payload = { expectedVersion: 0, customerName: 'Updated customer' };
  client.patch = async (url, body) => {
    assert.equal(url, `/api/v1/client/invoices/${id}`);
    assert.deepEqual(body, payload);
    return { data: { data: { id, version: 1 } } };
  };
  try { assert.equal((await saveInvoice({ id, payload })).version, 1); }
  finally { client.patch = original; }
});
