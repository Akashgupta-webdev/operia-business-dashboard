import assert from 'node:assert/strict';
import test from 'node:test';
import { blankService, calculateService, createInvoicePayload, initialCreateInvoice } from '../src/features/invoices/utils/createInvoice.js';
test('blank prices keep calculated amounts empty', () => {
  const line = blankService();
  for (const key of ['govtRate', 'servicePrice', 'taxAmount', 'grandTotal']) assert.equal(line[key], '');
  assert.equal(calculateService(line).taxAmount, '');
});
test('tax excludes government rate and totals account for quantity and tax changes', () => {
  const line = { ...blankService(), servicePrice: '400.00', govtRate: '100.00', qty: '2' };
  assert.equal(calculateService(line).taxAmount, '40.00');
  assert.equal(calculateService(line).grandTotal, '1040.00');
  assert.equal(calculateService({ ...line, taxCode: '0' }).grandTotal, '1000.00');
  assert.equal(calculateService({ ...line, qty: '0.5' }).grandTotal, '260.00');
  assert.equal(calculateService({ ...line, servicePrice: '' }).taxAmount, '');
});
test('rounds decimal fractions exactly and supports exponent quantities', () => {
  const line = { ...blankService(), servicePrice: '0.10' };
  assert.equal(calculateService(line).taxAmount, '0.01');
  assert.equal(calculateService(line).grandTotal, '0.11');
  assert.equal(calculateService({ ...line, qty: '5e-1' }).grandTotal, '0.05');
  assert.equal(calculateService({ ...line, qty: '0' }).grandTotal, '');
});
test('payload calculates fresh totals and sends blank government rate as zero', () => {
  const form = initialCreateInvoice({ _id: 'client', companyId: 'company' }, 'Operio To Client');
  form.service = [{ ...blankService(), itemDescription: 'Service', servicePrice: '400.00', taxAmount: '999.00', grandTotal: '999.00' }];
  const line = createInvoicePayload(form).service[0];
  assert.equal(line.govtRate, '0.00'); assert.equal(line.taxAmount, '20.00'); assert.equal(line.grandTotal, '420.00');
});
