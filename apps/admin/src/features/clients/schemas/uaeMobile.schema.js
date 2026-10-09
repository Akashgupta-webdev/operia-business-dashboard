import Joi from "joi";

// UAE mobile prefixes: https://tdra.gov.ae/en/consumer-tool-hub/topics/porting-numbers
export const uaeMobileSchema = Joi.string().trim().empty("").optional().custom((value, helpers) => {
  const national = value.replace(/[\s()-]/g, "").replace(/^(?:\+971|00971|971|0)/, "");
  if (!/^5[024568]\d{7}$/.test(national)) return helpers.error("any.invalid");
  return `+971${national}`;
}).messages({ "any.invalid": "Enter a valid UAE mobile number, e.g. 50 123 4567." });
