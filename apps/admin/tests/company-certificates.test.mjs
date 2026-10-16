import './setup.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { clientCompanyUpdateSchema } = await import('../src/features/clients/schemas/client.schema.js');
const { createClientCompanyUpdateDefaultValues, buildClientCompanyUpdatePayload } = await import('../src/features/clients/utils/clientCompanyUpdate.js');

test('company certificates prefill dates and send only changed fields with API dates', () => {
  const form = createClientCompanyUpdateDefaultValues({ companyName: 'Example LLC', civilDefenceCertificate: { certificationNo: 'LCA0000237232-2026', expiryDate: '31-12-2027' }, commercialTradeLicence: { licenceNo: 'CN-1234567', expiryDate: '2027-06-30T00:00:00.000Z' } });
  assert.equal(form.civilDefenceCertificate.expiryDate, '2027-12-31');
  assert.equal(form.commercialTradeLicence.expiryDate, '2027-06-30');
  assert.deepEqual(buildClientCompanyUpdatePayload(form, { civilDefenceCertificate: { expiryDate: true } }), { civilDefenceCertificate: { expiryDate: '31-12-2027' } });
  form.commercialTradeLicence.licenceNo = '  CN-1234567  ';
  assert.deepEqual(buildClientCompanyUpdatePayload(form, { commercialTradeLicence: { licenceNo: true } }), { commercialTradeLicence: { licenceNo: 'CN-1234567' } });
  form.civilDefenceCertificate.certificationNo = '';
  form.civilDefenceCertificate.expiryDate = '';
  const result = clientCompanyUpdateSchema.validate(form);
  assert.equal(result.error, undefined);
  assert.deepEqual(buildClientCompanyUpdatePayload(result.value, { civilDefenceCertificate: { certificationNo: true, expiryDate: true } }), { civilDefenceCertificate: { certificationNo: null, expiryDate: null } });
  assert.deepEqual(buildClientCompanyUpdatePayload(form, {}), {});
});

test('certificate numbers and expiry dates enforce the company update contract', () => {
  for (const number of ['CN-1234567', ' LCA0000237232-2026 ', 'A1 B2.C3/D4-E5', '1']) {
    assert.equal(clientCompanyUpdateSchema.validate({ commercialTradeLicence: { licenceNo: number } }).error, undefined);
  }
  for (const number of ['ABC', 'A1--B2', 'A1  B2', '-A1', 'A1/', 'A@1', '1'.repeat(101)]) {
    assert.ok(clientCompanyUpdateSchema.validate({ civilDefenceCertificate: { certificationNo: number } }).error, number);
  }
  for (const date of ['1900-01-01', '2028-02-29', '2027-12-31']) {
    assert.equal(clientCompanyUpdateSchema.validate({ civilDefenceCertificate: { expiryDate: date } }).error, undefined);
  }
  for (const date of ['1899-12-31', '2027-02-29', '2027-04-31', '2027-13-01']) {
    assert.ok(clientCompanyUpdateSchema.validate({ commercialTradeLicence: { expiryDate: date } }).error, date);
  }
  const empty = createClientCompanyUpdateDefaultValues({ companyName: 'Example LLC' });
  assert.equal(clientCompanyUpdateSchema.validate(empty).error, undefined);
});
