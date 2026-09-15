import Joi from "joi";

export const loginSchema = Joi.object({
  emailAddress: Joi.string().trim().lowercase().email({ tlds: false }).max(254).required().messages({
    "any.required": "Enter your email address.",
    "string.empty": "Enter your email address.",
    "string.email": "Enter a valid email address.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Enter your password.",
    "string.empty": "Enter your password.",
  }),
});
