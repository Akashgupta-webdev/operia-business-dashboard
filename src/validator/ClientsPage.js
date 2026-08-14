import Joi from "joi";
import { SERVICE_CATEGORIES } from "@/constants/ClientsPage";

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

const requiredText = (label, max = 500) => Joi.string().trim().min(1).max(max).required().messages({
  "string.empty": `${label} is required.`,
  "any.required": `${label} is required.`,
});

export const quickAddClientSchema = Joi.object({
  clientType: Joi.string().valid("INDIVIDUAL", "COMPANY").required(),
  name: requiredText("Name", 200).min(2),
  mobileNumber: requiredText("Mobile number", 30),
  whatsappNumber: requiredText("WhatsApp number", 30),
  emailAddress: Joi.string().trim().email({ tlds: { allow: false } }).max(254).required().messages({
    "string.empty": "Email address is required.",
    "string.email": "Enter a valid email address.",
  }),
  nationality: requiredText("Nationality", 120),
  passportNumber: requiredText("Passport number", 30),
  emiratesIdNumber: requiredText("Emirates ID number", 30),
  preferredCommunicationMethod: Joi.string().valid("EMAIL", "WHATSAPP", "CALL").required().messages({ "any.only": "Select a preferred communication method." }),
  address: optionalString(500),
  notes: optionalString(5000),
  clientStatus: Joi.string().valid("ACTIVE", "INACTIVE", "PROSPECT", "ARCHIVED").required(),
});

export const quickAddCompanySchema = Joi.object({
  companyName: requiredText("Company name", 200),
  companyType: Joi.string().valid("MAINLAND", "FREE_ZONE", "OFFSHORE").required().messages({ "any.only": "Select a company type.", "string.empty": "Select a company type." }),
  licence: Joi.object({
    number: requiredText("Licence number", 100),
    activity: optionalString(500),
    issueDate: optionalString(30),
    expiryDate: requiredText("Licence expiry date", 30),
  }),
  corporateTaxRegistrationNumber: optionalString(100),
  vatTrnNumber: optionalString(100),
  companyEmail: Joi.string().trim().email({ tlds: { allow: false } }).max(254).empty("").messages({ "string.email": "Enter a valid company email." }),
  companyMobile: optionalString(30),
  address: optionalString(500),
  companyStatus: Joi.string().valid("ACTIVE", "UNDER_FORMATION", "SUSPENDED", "EXPIRED", "CLOSED").required(),
});

export const quickAddServiceSchema = Joi.object({
  category: Joi.string().valid(...SERVICE_CATEGORIES.map(({ value }) => value)).required().messages({ "any.only": "Select a service category.", "string.empty": "Select a service category." }),
  status: Joi.string().valid("NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "COMPLETE").required(),
  detail: Joi.object().min(1).required(),
});

export const getServiceDetailSchema = (category) => {
  const fields = SERVICE_CATEGORIES.find((option) => option.value === category)?.fields ?? [];
  return Joi.object(Object.fromEntries(fields.map((field) => {
    let schema = requiredText(field.label);
    if (field.type === "number") {
      schema = Joi.string().trim().pattern(/^\d+(?:\.\d{1,2})?$/).required().messages({
        "string.empty": `${field.label} is required.`,
        "string.pattern.base": `${field.label} must be a non-negative number with up to 2 decimals.`,
      });
    }
    return [field.name, schema];
  }))).required();
};

const amountSchema = (label) => Joi.string().trim().pattern(/^\d+(?:\.\d{1,2})?$/).required().messages({
  "string.empty": `${label} is required.`,
  "string.pattern.base": `${label} must be a non-negative amount with up to 2 decimals.`,
});

export const quickAddPaymentSchema = Joi.object({
  governmentFee: amountSchema("Government fee"),
  serviceFee: amountSchema("Service fee"),
  totalAmount: amountSchema("Total amount"),
  amountReceived: amountSchema("Amount received"),
  paymentMethod: requiredText("Payment method", 50),
  paymentDate: requiredText("Payment date", 30),
  paymentStatus: requiredText("Payment status", 50),
});

export const quickAddReminderSchema = Joi.object({
  dueDate: requiredText("Due date", 30),
  reminderBefore: Joi.number().integer().min(0).required().messages({
    "number.base": "Reminder before must be a whole number of days.",
    "number.min": "Reminder before cannot be negative.",
  }),
  followUpsDate: requiredText("Follow-up date", 30),
  notes: optionalString(5000),
});
