import Joi from "joi";

import { ACCESS_KEY_LENGTH } from "@/constants/auth";

export const loginSchema = Joi.object({
  accessKey: Joi.string()
    .pattern(/^\d+$/)
    .length(ACCESS_KEY_LENGTH)
    .required()
    .messages({
      "any.required": "Enter your 12-digit access key.",
      "string.empty": "Enter your 12-digit access key.",
      "string.length": "Enter your 12-digit access key.",
      "string.pattern.base": "Access key must contain numbers only.",
    }),
});
