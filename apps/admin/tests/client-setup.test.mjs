import "./setup.mjs";
import test from "node:test";
import assert from "node:assert/strict";
const { clientCreationSchema } = await import("../src/features/clients/schemas/client.schema.js");
import { createClientDefaultValues, buildClientCreationRequest } from "../src/features/clients/utils/clientCreation.js";
test("Company is the default and requires company details", () => {
 const values = createClientDefaultValues();
 values.client.name = "Test Client";
 assert.equal(values.client.clientType, "COMPANY");
 assert.ok(clientCreationSchema.validate(values).error);
 values.company.companyName = "Test Company";
 assert.equal(clientCreationSchema.validate(values).error, undefined);
});
test("Individual ignores stale company data and omits it from payload", () => {
 const values = createClientDefaultValues();
 values.client.name = "Test Client";
 values.client.clientType = "INDIVIDUAL";
 values.company.licenceExpiryDate = "invalid stale value";
 const result = clientCreationSchema.validate(values);
 assert.equal(result.error, undefined);
 assert.equal(result.value.company, undefined);
 assert.equal(buildClientCreationRequest(result.value).payload.company, undefined);
});

test("member insurance fields are retained in the creation payload", () => {
 const values = createClientDefaultValues();
 values.client.name = "Test Client";
 values.client.clientType = "INDIVIDUAL";
 Object.assign(values.members[0], { insuranceCompany: "Test Insurer", premium: "1250.50", note: "Annual cover" });
 values.members[0].healthInsurance.healthInsuranceExpiryDate = "2027-10-10";
 const result = clientCreationSchema.validate(values);
 assert.equal(result.error, undefined);
 const member = buildClientCreationRequest(result.value).payload.members[0];
 assert.equal(member.insuranceCompany, "Test Insurer");
 assert.equal(member.premium, "1250.50");
 assert.equal(member.note, "Annual cover");
 assert.equal(member.healthInsurance.healthInsuranceExpiryDate, "10-10-2027");
 values.members[0].premium = "-1";
 assert.ok(clientCreationSchema.validate(values).error);
});
