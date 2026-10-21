import assert from 'node:assert/strict';
import test from 'node:test';
import { initialForm, invoicePayload, previewTotal, money, referenceId } from '../src/features/invoices/utils/invoice.js';
const invoice = { id: 'invoice', version: 3, invoiceNumber: 'OP-2026-0001', client: { id: 'client' }, company: { id: 'company' }, invoiceDate: '2026-10-21T00:00:00.000Z', items: [{ itemModel: 'ClientService', item: { id: 'service' }, quantity: 2, governmentRate: { $numberDecimal: '0.10' }, servicePrice: { $numberDecimal: '0.20' }, taxAmount: { $numberDecimal: '0.03' }, taxRate: { $numberDecimal: '5.00' }, taxCode: 'TAXABLE' }] };
test('edit normalizes populated references and decimals and excludes response fields', () => {
  const form = initialForm(invoice);
  const payload = invoicePayload(form, 'client', invoice);
  assert.equal(payload.expectedVersion, 3);
  assert.equal(payload.company, 'company');
  assert.equal(payload.items[0].item, 'service');
  assert.equal(payload.items[0].taxCode, 'TAXABLE');
  assert.equal(payload.items[0].governmentRate, '0.10');
  for (const key of ['client', 'invoiceNumber', 'version', 'id', 'totals']) assert.equal(key in payload, false);
  assert.equal('label' in payload.items[0], false);
});
test('creation omits company for unowned items and never sends invoice number', () => {
  const form = initialForm();
  const payload = invoicePayload(form, 'client');
  assert.equal(payload.client, 'client');
  assert.equal('company' in payload, false);
  assert.equal('invoiceNumber' in payload, false);
  assert.equal(invoicePayload(form, 'client', invoice).company, null);
});
test('preview uses exact decimals, total line tax, and negative advances', () => {
  const { items } = initialForm(invoice);
  assert.equal(previewTotal(items, '0.00'), '0.63');
  assert.equal(previewTotal(items, '1.00'), '-0.37');
  assert.equal(previewTotal([{ ...items[0], servicePrice: '9999999999999999.99', quantity: 1 }], '0.00'), '10000000000000000.12');
  assert.equal(previewTotal(items, '-1'), null);
  assert.equal(previewTotal(items, '0.001'), null);
  assert.equal(money('9999999999999999.99'), '9,999,999,999,999,999.99');
});
test('deleted references are safe to normalize', () => {
  assert.equal(referenceId(null), '');
  assert.equal(initialForm({ items: [{ ...invoice.items[0], item: null }] }).items[0].item, '');
});
