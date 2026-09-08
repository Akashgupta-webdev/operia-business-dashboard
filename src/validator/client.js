import Joi from "joi";

import {
  DOCUMENT_TYPE_OPTIONS,
  MAX_DOCUMENT_FILE_SIZE,
  MAX_DOCUMENTS,
  MAX_RELATED_ITEMS,
  MEMBER_TYPE_OPTIONS,
  NATIONALITY_OPTIONS,
  PREFERRED_COMMUNICATION_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  REMIND_BEFORE_OPTIONS,
  REMINDER_PRIORITY_OPTIONS,
  SERVICE_CATEGORY_OPTIONS,
  SERVICE_PACKAGE_OPTIONS,
  SERVICE_PAYMENT_STATUS_OPTIONS,
  SERVICE_STATUS_OPTIONS,
} from "@/constants/client";

const optionalText = (max) => Joi.string().trim().max(max).empty("").optional();
const optionalDate = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .empty("")
  .optional()
  .messages({ "string.pattern.base": "Use a valid date." });
const optionalDecimal = Joi.string()
  .pattern(/^\d+(?:\.\d{1,2})?$/)
  .empty("")
  .optional()
  .messages({ "string.pattern.base": "Enter a non-negative amount with up to two decimals." });

const identitySchema = Joi.object({
  passportNumber: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]\d{7}$/)
    .empty("")
    .optional()
    .messages({ "string.pattern.base": "Use one letter followed by seven digits." }),
  passportIssueDate: optionalDate,
  passportExpiryDate: optionalDate,
}).unknown(false);

const emiratesSchema = Joi.object({
  emiratesId: Joi.string()
    .trim()
    .pattern(/^784-\d{4}-\d{7}-\d$/)
    .empty("")
    .optional()
    .messages({ "string.pattern.base": "Use the format 784-YYYY-XXXXXXX-X." }),
  emiratesIssueDate: optionalDate,
  emiratesExpiryDate: optionalDate,
}).unknown(false);

const visaSchema = Joi.object({
  visaUIDNumber: Joi.string()
    .trim()
    .pattern(/^\d{9,15}$/)
    .empty("")
    .optional()
    .messages({ "string.pattern.base": "Enter a 9 to 15 digit UID number." }),
  visaIssueDate: optionalDate,
  visaExpiryDate: optionalDate,
}).unknown(false);

const healthInsuranceSchema = Joi.object({
  healthInsuranceCardNumber: optionalText(200),
  healthInsuranceIssueDate: optionalDate,
  healthInsuranceExpiryDate: optionalDate,
}).unknown(false);

const companySchema = Joi.object({
  companyName: optionalText(200),
  tradeLicenceNumber: optionalText(100),
  licenceExpiryDate: optionalDate,
  vatTaxRegistrationNumber: optionalText(100),
  corporateTaxNumber: optionalText(100),
}).unknown(false);

const memberSchema = Joi.object({
  memberType: Joi.string().valid(...MEMBER_TYPE_OPTIONS).empty("").optional(),
  name: optionalText(200),
  passport: identitySchema,
  emirates: emiratesSchema,
  visa: visaSchema,
  healthInsurance: healthInsuranceSchema,
}).unknown(false);

const vehicleSchema = Joi.object({
  registrationNumer: optionalText(100),
  tcNumber: optionalText(100),
  policyNumber: optionalText(100),
  registrationExpiry: optionalDate,
  insuranceExpiry: optionalDate,
}).unknown(false);

const driverSchema = Joi.object({
  name: optionalText(200),
  licenceIssueDate: optionalDate,
  licenceExpiryDate: optionalDate,
}).unknown(false);

const serviceSchema = Joi.object({
  category: Joi.string().valid(...SERVICE_CATEGORY_OPTIONS).empty("").optional(),
  package: Joi.string().valid(...SERVICE_PACKAGE_OPTIONS).empty("").optional(),
  status: Joi.string().valid(...SERVICE_STATUS_OPTIONS).empty("").optional(),
  packagePrice: optionalDecimal,
  paymentStatus: Joi.string().valid(...SERVICE_PAYMENT_STATUS_OPTIONS).empty("").optional(),
  targetCompletionDate: optionalDate,
  notes: optionalText(1000),
}).unknown(false);

const documentSchema = Joi.object({
  documentTitle: optionalText(200),
  documentType: Joi.string().valid(...DOCUMENT_TYPE_OPTIONS).empty("").optional(),
  issueDate: optionalDate,
  expiryDate: optionalDate,
  file: Joi.any()
    .custom((value, helpers) => {
      const file = value?.[0];
      const document = helpers.state.ancestors[0] ?? {};
      const hasMetadata = [
        document.documentTitle,
        document.documentType,
        document.issueDate,
        document.expiryDate,
      ].some((item) => typeof item === "string" && item.trim());

      if (!file && hasMetadata) {
        return helpers.message({ "any.custom": "Select a file for this document." });
      }

      if (file && file.size > MAX_DOCUMENT_FILE_SIZE) {
        return helpers.message({ "any.custom": "File size must not exceed 10 MiB." });
      }

      return value;
    })
    .optional(),
}).unknown(false);

const paymentSchema = Joi.object({
  totalBilled: optionalDecimal,
  amountReceived: optionalDecimal,
  paymentStatus: Joi.string().valid(...PAYMENT_STATUS_OPTIONS).empty("").optional(),
  paymentMethod: Joi.string().valid(...PAYMENT_METHOD_OPTIONS).empty("").optional(),
  notes: optionalText(1000),
}).unknown(false);

const reminderSchema = Joi.object({
  followupDate: optionalDate,
  remindBefore: Joi.string().valid(...REMIND_BEFORE_OPTIONS).empty("").optional(),
  priority: Joi.string().valid(...REMINDER_PRIORITY_OPTIONS).empty("").optional(),
  notes: optionalText(1000),
}).unknown(false);

export const clientCreationSchema = Joi.object({
  client: Joi.object({
    name: Joi.string().trim().min(2).max(200).required().messages({
      "any.required": "Full name is required.",
      "string.empty": "Full name is required.",
      "string.min": "Full name must contain at least 2 characters.",
    }),
    nationality: Joi.string().valid(...NATIONALITY_OPTIONS).empty("").optional(),
    mobileNumber: optionalText(30),
    whatsappNumber: optionalText(30),
    emailAddress: Joi.string().trim().lowercase().email({ tlds: false }).max(254).empty("").optional(),
    clientType: Joi.string().valid("INDIVIDUAL", "COMPANY").required(),
    passport: identitySchema,
    emirates: emiratesSchema,
    visa: visaSchema,
    healthInsurance: healthInsuranceSchema,
  }).required().unknown(false),
  company: Joi.when("client.clientType", {
    is: "COMPANY",
    then: companySchema
      .fork("companyName", (field) => field.required())
      .required()
      .messages({ "any.required": "Company information is required." }),
    otherwise: companySchema.optional(),
  }),
  members: Joi.array().items(memberSchema).max(MAX_RELATED_ITEMS).required(),
  vehicles: Joi.array().items(vehicleSchema).max(MAX_RELATED_ITEMS).required(),
  drivers: Joi.array().items(driverSchema).max(MAX_RELATED_ITEMS).required(),
  services: Joi.array().items(serviceSchema).max(MAX_RELATED_ITEMS).required(),
  documents: Joi.array().items(documentSchema).max(MAX_DOCUMENTS).required(),
  payments: Joi.array().items(paymentSchema).max(MAX_RELATED_ITEMS).required(),
  reminders: Joi.array().items(reminderSchema).max(MAX_RELATED_ITEMS).required(),
}).unknown(false);

export const clientUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    "any.required": "Full name is required.",
    "string.empty": "Full name is required.",
    "string.min": "Full name must contain at least 2 characters.",
  }),
  nationality: Joi.string().valid(...NATIONALITY_OPTIONS).empty("").optional(),
  mobileNumber: optionalText(30),
  whatsappNumber: optionalText(30),
  emailAddress: Joi.string().trim().lowercase().email({ tlds: false }).max(254).empty("").optional().messages({
    "string.email": "Enter a valid email address.",
  }),
  clientType: Joi.string().valid("INDIVIDUAL", "COMPANY").required(),
  preferredCommunicationMethod: Joi.string().valid(...PREFERRED_COMMUNICATION_OPTIONS).empty("").optional(),
  passport: identitySchema.required(),
  emirates: emiratesSchema.required(),
  visa: visaSchema.required(),
  healthInsurance: healthInsuranceSchema.required(),
}).unknown(false);

export const clientCompanyUpdateSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(200).messages({
    "any.required": "Company name is required.",
    "string.empty": "Company name is required.",
    "string.min": "Company name must contain at least 2 characters.",
  }),
  tradeLicence: Joi.object({
    tradeLicenceNo: optionalText(100).allow(null).default(null),
    tradeLicenceExpiry: optionalDate.allow(null).default(null),
  }).min(1).allow(null).unknown(false),
  establishment: Joi.object({
    establishmentCard: optionalText(100).allow(null).default(null),
    establishmentCardExpiry: optionalDate.allow(null).default(null),
  }).min(1).allow(null).unknown(false),
  vatTaxRegistrationNumber: optionalText(100).allow(null),
  corporateTaxNumber: optionalText(100).allow(null),
}).min(1).required().unknown(false);

export const clientMemberUpdateSchema = Joi.object({
  memberType: Joi.string().valid(...MEMBER_TYPE_OPTIONS).empty("").optional().messages({
    "any.only": "Select a valid member type.",
  }),
  name: optionalText(200),
  passport: identitySchema.required(),
  emirates: emiratesSchema.required(),
  visa: visaSchema.required(),
  healthInsurance: healthInsuranceSchema.required(),
}).unknown(false);

export const clientVehicleUpdateSchema = Joi.object({
  registrationNumer: optionalText(100),
  tcNumber: optionalText(100),
  policyNumber: optionalText(100),
  registrationExpiry: optionalDate,
  insuranceExpiry: optionalDate,
}).unknown(false);

export const clientDriverUpdateSchema = Joi.object({
  name: optionalText(200),
  licenceIssueDate: optionalDate,
  licenceExpiryDate: optionalDate,
}).unknown(false);

const serviceUpdateNotes = Joi.string().allow("").custom((value, helpers) => {
  const notes = value.split("\n").map((note) => note.trim()).filter(Boolean);
  if (notes.length > 100) return helpers.message({ "any.custom": "Enter no more than 100 notes." });
  if (notes.some((note) => note.length > 1000)) return helpers.message({ "any.custom": "Each note must contain no more than 1,000 characters." });
  return value;
});

export const clientServiceUpdateSchema = Joi.object({
  category: Joi.string().valid(...SERVICE_CATEGORY_OPTIONS).empty("").optional(),
  package: Joi.string().valid(...SERVICE_PACKAGE_OPTIONS).empty("").optional(),
  status: Joi.string().valid(...SERVICE_STATUS_OPTIONS).empty("").optional(),
  packagePrice: Joi.string()
    .pattern(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/)
    .empty("")
    .optional()
    .messages({ "string.pattern.base": "Enter a non-negative amount with up to two decimals." }),
  paymentStatus: Joi.string().valid(...SERVICE_PAYMENT_STATUS_OPTIONS).empty("").optional(),
  targetCompletionDate: optionalDate,
  notes: serviceUpdateNotes,
}).unknown(false);

const requireAtLeastOneCreateValue = (value, helpers) => {
  const hasValue = (item) => {
    if (typeof item === "string") return Boolean(item.trim());
    if (item && typeof item === "object") return Object.values(item).some(hasValue);
    return false;
  };

  return hasValue(value)
    ? value
    : helpers.message({ "any.custom": "Enter at least one value before creating the record." });
};

const createHealthInsuranceSchema = Joi.object({
  healthInsuranceCardNumber: optionalText(100),
  healthInsuranceIssueDate: optionalDate,
  healthInsuranceExpiryDate: optionalDate,
}).unknown(false);

export const clientMemberCreateSchema = Joi.object({
  memberType: Joi.string().valid(...MEMBER_TYPE_OPTIONS).empty("").optional().messages({
    "any.only": "Select a valid member type.",
  }),
  name: optionalText(200),
  passport: identitySchema.optional(),
  emirates: emiratesSchema.optional(),
  visa: visaSchema.optional(),
  healthInsurance: createHealthInsuranceSchema.optional(),
}).unknown(false).custom(requireAtLeastOneCreateValue);

export const clientVehicleCreateSchema = Joi.object({
  registrationNumer: optionalText(100),
  tcNumber: optionalText(100),
  policyNumber: optionalText(100),
  registrationExpiry: optionalDate,
  insuranceExpiry: optionalDate,
}).unknown(false).custom(requireAtLeastOneCreateValue);

export const clientDriverCreateSchema = Joi.object({
  name: optionalText(200),
  licenceIssueDate: optionalDate,
  licenceExpiryDate: optionalDate,
}).unknown(false).custom(requireAtLeastOneCreateValue);

export const clientServiceCreateSchema = Joi.object({
  category: Joi.string().valid(...SERVICE_CATEGORY_OPTIONS).empty("").optional(),
  package: Joi.string().valid(...SERVICE_PACKAGE_OPTIONS).empty("").optional(),
  status: Joi.string().valid(...SERVICE_STATUS_OPTIONS).empty("").optional(),
  packagePrice: Joi.string()
    .pattern(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/)
    .empty("")
    .optional()
    .messages({ "string.pattern.base": "Enter a non-negative amount with up to two decimals." }),
  paymentStatus: Joi.string().valid(...SERVICE_PAYMENT_STATUS_OPTIONS).empty("").optional(),
  targetCompletionDate: optionalDate,
  notes: serviceUpdateNotes,
}).unknown(false).custom(requireAtLeastOneCreateValue);

export const clientDocumentCreateSchema = Joi.object({
  documentTitle: optionalText(200).messages({
    "string.max": "Document title must contain no more than 200 characters.",
  }),
  documentType: Joi.string().valid(...DOCUMENT_TYPE_OPTIONS).empty("").optional().messages({
    "any.only": "Select a valid document type.",
  }),
  issueDate: optionalDate,
  expiryDate: optionalDate,
  documents: Joi.any().custom((value, helpers) => {
    const files = value ? Array.from(value) : [];
    if (files.length !== 1) return helpers.message({ "any.custom": "Select exactly one document file." });
    if (files[0].size > MAX_DOCUMENT_FILE_SIZE) return helpers.message({ "any.custom": "File size must not exceed 10 MiB." });
    return value;
  }).required().messages({ "any.required": "Select a document file." }),
}).unknown(false);

export const renewalUpdateSchema = Joi.object({
  newExpiryDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "any.required": "New expiry date is required.",
      "string.empty": "New expiry date is required.",
      "string.pattern.base": "Use a valid expiry date.",
    }),
  identifier: Joi.string().trim().max(200).allow("").messages({
    "string.max": "Identifier must contain no more than 200 characters.",
  }),
}).unknown(false);

export const CLIENT_STEP_FIELDS = {
  1: ["client"],
  2: ["client.clientType", "company"],
  3: ["members"],
  4: ["vehicles"],
  5: ["drivers"],
  6: ["services"],
  7: ["documents"],
  8: ["payments"],
  9: ["reminders"],
};
