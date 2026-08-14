import Joi from "joi";

import { SERVICE_CATEGORIES } from "@/constants/ClientsPage";

const validCategories = SERVICE_CATEGORIES.map(({ value }) => value);
const optionalText = (max) => Joi.string().trim().min(1).max(max).empty("");

export const editClientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name must be 200 characters or fewer.",
  }),
  emiratesIdNumber: optionalText(30),
  emailAddress: Joi.string().trim().email({ tlds: { allow: false } }).max(254).lowercase().empty("").messages({
    "string.email": "Enter a valid email address.",
    "string.max": "Email address must be 254 characters or fewer.",
  }),
  mobileNumber: optionalText(30),
  whatsappNumber: optionalText(30),
  clientType: Joi.string().valid("INDIVIDUAL", "COMPANY").required(),
  nationality: optionalText(120),
  passportNumber: optionalText(30),
  address: Joi.alternatives().try(Joi.string().trim().min(1).max(500), Joi.valid(null)).empty(""),
  preferredCommunicationMethod: Joi.string().valid("EMAIL", "WHATSAPP", "CALL").required(),
  clientStatus: Joi.string().valid("ACTIVE", "INACTIVE", "PROSPECT", "ARCHIVED").required(),
})
  .or("mobileNumber", "whatsappNumber", "emailAddress")
  .messages({ "object.missing": "Provide at least one mobile, WhatsApp, or email contact." });

export const editServiceSchema = Joi.object({
  category: Joi.string().valid(...validCategories).required().messages({
    "any.only": "Select a service category.",
    "string.empty": "Select a service category.",
  }),
  status: Joi.string().valid("NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "COMPLETE").required(),
  detail: Joi.object().min(1).unknown(true).required().messages({
    "any.required": "Service details are required.",
    "object.base": "Service details must be valid.",
    "object.min": "Service details must contain at least one field.",
  }),
});
