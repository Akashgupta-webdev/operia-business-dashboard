import Joi from "joi";

const optionalString = (max) => Joi.string().trim().min(1).max(max).empty("");
const optionalDate = Joi.date().iso().empty("").messages({
  "date.format": "Enter a valid date.",
  "date.base": "Enter a valid date.",
});

export const createCompanySchema = Joi.object({
  client: Joi.string().trim().hex().length(24).required().messages({
    "string.empty": "Client database ID is required.",
    "string.hex": "Client database ID must contain only hexadecimal characters.",
    "string.length": "Client database ID must be exactly 24 characters.",
    "any.required": "Client database ID is required.",
  }),
  companyName: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Company name is required.",
    "string.min": "Company name must be at least 2 characters.",
    "string.max": "Company name must be 200 characters or fewer.",
    "any.required": "Company name is required.",
  }),
  tradeName: optionalString(200),
  legalName: optionalString(200),
  companyType: Joi.string().valid("MAINLAND", "FREE_ZONE", "OFFSHORE").required().messages({
    "any.only": "Select a valid company type.",
    "any.required": "Company type is required.",
    "string.empty": "Company type is required.",
  }),
  freeZoneName: optionalString(200),
  licence: Joi.object({
    number: optionalString(100),
    activity: optionalString(500),
    issueDate: optionalDate,
    expiryDate: optionalDate,
  }),
  establishment: Joi.object({
    cardNumber: optionalString(100),
    cardExpiryDate: optionalDate,
  }),
  vatTrnNumber: optionalString(100),
  corporateTaxRegistrationNumber: optionalString(100),
  companyEmail: Joi.string().trim().email({ tlds: { allow: false } }).max(254).lowercase().empty("").messages({
    "string.email": "Enter a valid email address.",
    "string.max": "Email address must be 254 characters or fewer.",
  }),
  companyMobile: optionalString(30),
  address: optionalString(500),
  bankName: optionalString(200),
  accountName: optionalString(200),
  iban: Joi.string().trim().uppercase().min(1).max(34).empty(""),
  accountNumber: optionalString(100),
  companyStatus: Joi.string().valid("ACTIVE", "UNDER_FORMATION", "SUSPENDED", "EXPIRED", "CLOSED").default("ACTIVE"),
  notes: optionalString(5000),
});
