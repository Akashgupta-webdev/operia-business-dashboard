import Joi from "joi";

import { EXPENSE_CATEGORIES, EXPENSE_PAYMENT_METHODS } from "@/features/finance/constants/finance";

export const profitLossFilterSchema = Joi.object({
  month: Joi.number().integer().min(1).max(12).required().messages({
    "number.base": "Select a valid reporting month.",
    "number.min": "Select a valid reporting month.",
    "number.max": "Select a valid reporting month.",
  }),
  year: Joi.number().integer().min(2000).max(9999).required().messages({
    "number.base": "Enter a valid operating year.",
    "number.min": "The operating year must be 2000 or later.",
    "number.max": "Enter a four-digit operating year.",
  }),
}).unknown(false);

const optionalTrimmedString = (maximum) => Joi.string().trim().max(maximum).allow("");

export const expenseCreateSchema = Joi.object({
  expenseTitle: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Enter an expense title or purpose.",
    "string.max": "The expense title must be 200 characters or fewer.",
    "any.required": "Enter an expense title or purpose.",
  }),
  expenseCategory: Joi.string().valid(...EXPENSE_CATEGORIES).required().messages({
    "any.only": "Select a supported expense category.",
    "any.required": "Select an expense category.",
  }),
  expenseAmount: Joi.string().trim().pattern(/^\d+(?:\.\d{1,2})?$/).required().messages({
    "string.empty": "Enter the expense amount.",
    "string.pattern.base": "Enter a non-negative amount with up to two decimal places.",
    "any.required": "Enter the expense amount.",
  }),
  expenseDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).isoDate().allow("").messages({
    "string.pattern.base": "Use the YYYY-MM-DD date format.",
    "string.isoDate": "Enter a valid expense date in YYYY-MM-DD format.",
  }),
  paymentMethod: Joi.string().valid(...EXPENSE_PAYMENT_METHODS).allow("").messages({
    "any.only": "Select a supported payment method.",
  }),
  vendorName: optionalTrimmedString(200),
  receiptReference: optionalTrimmedString(200),
  notes: optionalTrimmedString(2000),
}).unknown(false);
