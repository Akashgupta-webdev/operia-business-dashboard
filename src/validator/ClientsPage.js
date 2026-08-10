import Joi from "joi";

const optionalString = (max) => Joi.string().trim().min(1).max(max).empty("");

export const createClientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name must be 200 characters or fewer.",
    "any.required": "Name is required.",
  }),
  mobileNumber: optionalString(30),
  whatsappNumber: optionalString(30),
  emailAddress: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .max(254)
    .lowercase()
    .empty("")
    .messages({
      "string.email": "Enter a valid email address.",
      "string.max": "Email address must be 254 characters or fewer.",
    }),
  nationality: optionalString(120),
  emiratesIdNumber: optionalString(30),
  passportNumber: optionalString(30),
  address: optionalString(500),
  preferredCommunicationMethod: Joi.string()
    .valid("EMAIL", "WHATSAPP", "CALL")
    .required()
    .messages({
      "any.only": "Select a preferred communication method.",
      "any.required": "Select a preferred communication method.",
      "string.empty": "Select a preferred communication method.",
    }),
  notes: optionalString(5000),
  clientStatus: Joi.string()
    .valid("ACTIVE", "INACTIVE", "PROSPECT", "ARCHIVED")
    .default("ACTIVE"),
})
  .or("mobileNumber", "whatsappNumber", "emailAddress")
  .messages({
    "object.missing": "Provide at least one mobile, WhatsApp, or email contact.",
  });
