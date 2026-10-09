import test from "node:test";
import assert from "node:assert/strict";
import { uaeMobileSchema } from "../src/features/clients/schemas/uaeMobile.schema.js";

test("UAE mobile validation accepts supported prefixes and normalizes dialling formats", () => {
  for (const prefix of ["50", "52", "54", "55", "56", "58"]) {
    const national = prefix + "1234567";
    for (const value of [national, "0" + national, "+971" + national, "00971" + national, "971" + national]) {
      const result = uaeMobileSchema.validate(value);
      assert.equal(result.error, undefined);
      assert.equal(result.value, "+971" + national);
    }
  }
  assert.equal(uaeMobileSchema.validate("050 123 4567").value, "+971501234567");
});

test("UAE mobile validation rejects invalid numbers and keeps optional contacts empty", () => {
  for (const value of ["511234567", "571234567", "50123456", "5012345678", "+441234567890", "501234abc", "+971", "041234567"]) {
    assert.ok(uaeMobileSchema.validate(value).error, value);
  }
  for (const value of ["", "   ", undefined]) {
    const result = uaeMobileSchema.validate(value);
    assert.equal(result.error, undefined);
    assert.equal(result.value, undefined);
  }
});
