import assert from 'node:assert/strict';
import test from 'node:test';
import { initialCreateInvoice, createInvoicePayload, nationalContactNumber, contactNumberError, sumServiceMoney } from '../src/features/invoices/utils/createInvoice.js';
import { normalizeInvoice } from '../src/features/invoices/utils/normalizeInvoice.js';
const client = { _id: '6a93023fd4ba863b8c5db060', clientId: '6a93023fd4ba863b8c5db060', companyId: '6a93023fd4ba863b8c5db061', name: 'Example', vatTaxRegistrationNumber: '123', mobileNumber: '971501234567', emailAddress: 'client@example.com' };
test('new create contract uses real IDs, optional omission, fractional quantities and exact banking key', () => {
  const form = initialCreateInvoice(client, 'Operio To Client');
  form.fullAddress = ' Office 1 '; form.dueDate = '2026-11-22'; form.switftBIC = ' CODE ';
  form.service[0] = { itemDescription: ' Filing ', qty: '0.5', govtRate: '0.00', servicePrice: '400.00', taxCode: '5', taxAmount: '10.00', grandTotal: '210.00' };
  const payload = createInvoicePayload(form);
  assert.equal(payload.clientId, client._id); assert.equal(payload.companyId, client.companyId);
  assert.equal(payload.contactNo, '+971501234567'); assert.equal(payload.fullAddress, 'Office 1'); assert.equal(payload.switftBIC, 'CODE');
  assert.equal(payload.service[0].qty, 0.5); assert.equal(payload.service[0].taxCode, 5); assert.equal(payload.service[0].itemDescription, 'Filing');
  assert.equal(payload.service[0].servicePrice, '400.00');
  for (const key of ['client', 'company', 'items', 'currency', 'advanceAmount', 'invoiceNo', 'grandTotalAmount', 'emirate', 'iban', 'accountNo']) assert.equal(key in payload, false);
});
test('service totals preserve exact money and reject invalid decimals', () => {
  assert.equal(sumServiceMoney([{ grandTotal: '9999999999999999.99' }, { grandTotal: '0.01' }], 'grandTotal'), '10000000000000000.00');
  assert.equal(sumServiceMoney([{ grandTotal: '-1' }], 'grandTotal'), null);
});
test('new response renders generated number, populated references and returned totals', () => {
  const result = normalizeInvoice({ invoiceNo: 'OP-2026-0001', clientId: { id: client._id }, companyId: null, service: [{ itemDescription: 'Filing', qty: 0.5, taxCode: 5, grandTotal: { $numberDecimal: '210.00' } }], grandTotalAmount: { $numberDecimal: '210.00' }, grandTotalTaxAmount: { $numberDecimal: '10.00' } });
  assert.equal(result.invoiceNumber, 'OP-2026-0001'); assert.equal(result.totals.total, '210.00'); assert.equal(result.items[0].quantity, 0.5); assert.equal(result.company, null);
  assert.equal(normalizeInvoice(null), null);
});

test('contact input strips UAE prefixes and payload adds exactly one prefix', () => {
  for (const input of ['+971 50 123 4567', '00971501234567', '971501234567', '0501234567', '501234567']) {
    assert.equal(nationalContactNumber(input), '501234567');
    const form = initialCreateInvoice({ ...client, mobileNumber: input }, 'Client To Customer');
    assert.equal(form.contactNo, '501234567');
    assert.equal(form.invoiceType, 'Client To Customer');
    assert.equal(createInvoicePayload(form).contactNo, '+971501234567');
  }
  assert.equal(nationalContactNumber('+971 4 123 4567'), '41234567');
  const form = initialCreateInvoice({ ...client, mobileNumber: '' }, 'Operio To Client');
  assert.equal('contactNo' in createInvoicePayload(form), false);
});

test('invoice contact validation matches API mobile and landline patterns', () => {
  for (const number of ['+971501234567', '0521234567', '00971541234567', '551234567', '561234567', '581234567', '021234567', '+97141234567', '97191234567', '']) assert.equal(contactNumberError(number), '', number);
  for (const number of ['+971805634283', '+971511234567', '50123456', '5012345678', 'abc']) assert.ok(contactNumberError(number), number);
  const form = initialCreateInvoice({ ...client, mobileNumber: '+971501234567' }, 'Operio To Client');
  assert.equal(createInvoicePayload(form).contactNo, '+971501234567');
});
