import Joi from "joi";

export const clientCredentialsIdSchema = Joi.string().pattern(/^[a-f\d]{24}$/i).required();

export const clientCredentialsSchema = Joi.object({
  portalAccess: Joi.string().valid("Enable", "Disable"),
  emailAddress: Joi.string().trim().lowercase().email({ tlds: false }).max(254),
  password: Joi.string().min(8).messages({
    "string.min": "Password must contain at least 8 characters."
  }),
}).or("emailAddress", "password", "portalAccess").unknown(false).required();
