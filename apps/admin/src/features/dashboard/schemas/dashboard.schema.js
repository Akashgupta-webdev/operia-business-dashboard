import Joi from "joi";

const optionalDate = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow("").messages({
  "string.pattern.base": "Use a valid date.",
});

export const dashboardFilterSchema = Joi.object({
  fromDate: optionalDate,
  toDate: optionalDate,
}).custom((value, helpers) => {
  if (value.fromDate && value.toDate && value.fromDate > value.toDate) {
    return helpers.message({ "any.custom": "From date must be on or before the to date." });
  }
  return value;
}).unknown(false);
