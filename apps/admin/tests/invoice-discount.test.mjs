import test from 'node:test';
import assert from 'node:assert/strict';
import { discountError, discountedTotal } from '../src/features/invoices/utils/invoiceDiscount.js';
import { initialEditInvoice, createInvoicePayload, updateInvoicePayload } from '../src/features/invoices/utils/createInvoice.js';
import { normalizeInvoice } from '../src/features/invoices/utils/normalizeInvoice.js';

const invoice = { version: 3, discount: 10, remark: 'Loyalty discount', grandTotalAmount: 378,
  service: [{ itemDescription: 'Filing', qty: 1, govtRate: 0, servicePrice: 400, taxCode: 5, taxAmount: 20, grandTotal: 420 }] };

test('discount uses exact half-up rounding on the original subtotal', () => {
  assert.equal(discountedTotal('420.00', '10'), '378.00');
  assert.equal(discountedTotal('420.00', '25'), '315.00');
  assert.equal(discountedTotal('0.01', '50'), '0.01');
  assert.equal(discountedTotal('420.00', '100'), '0.00');
  assert.equal(discountedTotal('420.00', ''), '420.00');
  assert.equal(discountedTotal('9999999999999999.99', '0'), '9999999999999999.99');
  for (const value of ['-1', '100.01', '0.001', 'NaN', 'Infinity']) assert.ok(discountError(value));
});

test('discount and remark payloads support omission, clearing and noncompounding edits', () => {
  const form = initialEditInvoice(invoice);
  assert.equal(form.discount, '10');
  assert.equal(form.remark, 'Loyalty discount');
  assert.deepEqual(updateInvoicePayload(form, invoice), { expectedVersion: 3 });
  assert.deepEqual(updateInvoicePayload({ ...form, discount: '25' }, invoice), { expectedVersion: 3, discount: 25 });
  assert.deepEqual(updateInvoicePayload({ ...form, discount: '', remark: '' }, invoice), { expectedVersion: 3, discount: 0, remark: '' });
  const payload = createInvoicePayload({ ...form, remark: '  Thanks  ' });
  assert.equal(payload.discount, 10);
  assert.equal(payload.remark, 'Thanks');
  assert.equal('grandTotalAmount' in payload, false);
  assert.equal(payload.service[0].grandTotal, '420.00');
  const legacy = initialEditInvoice({ ...invoice, discount: undefined, remark: null });
  assert.equal(legacy.discount, '0');
  assert.equal(legacy.remark, '');
  assert.equal('remark' in createInvoicePayload(legacy), false);
  const changedLines = updateInvoicePayload({ ...form, service: [{ ...form.service[0], qty: '2' }] }, invoice);
  assert.equal('discount' in changedLines, false);
});

test('saved invoice shows undiscounted subtotal and server payable for numeric and Decimal128 responses', () => {
  const detail = normalizeInvoice(invoice, { numeric: true });
  assert.equal(detail.totals.subtotal, '420.00');
  assert.equal(detail.totals.total, 378);
  const saved = normalizeInvoice({ ...invoice, grandTotalAmount: { $numberDecimal: '378.00' }, service: [{ ...invoice.service[0], grandTotal: { $numberDecimal: '420.00' } }] });
  assert.equal(saved.totals.total, '378.00');
  assert.equal(saved.totals.subtotal, '420.00');
  const empty = normalizeInvoice({ ...invoice, discount: null, remark: null });
  assert.equal(empty.discount, null);
  assert.equal(empty.remark, null);
});
