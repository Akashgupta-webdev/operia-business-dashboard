export const VAT_CODE = "VAT_RETURN_FILING";
export const VAT_PACKAGE = "Quarterly VAT Return Filing Package";
export const STAGES = ["AWAITING_DOCUMENTS", "PREPARING", "INTERNAL_REVIEW", "AWAITING_CLIENT_APPROVAL", "READY_TO_FILE", "FILED"];
export const PURPOSES = ["SOURCE", "WORKING_PAPER", "APPROVAL", "ACKNOWLEDGMENT", "TAX_PAYMENT"];
export const vatKeys = {
  all: ["vat-filings"],
  list: (filters) => ["vat-filings", "list", filters],
  detail: (id) => ["vat-filings", "detail", id],
  companies: (filters) => ["vat-companies", filters],
  admin: ["vat-admin"],
};
export const ACTION_LABELS = {
  prepare: "Save preparation", "request-review": "Request internal review", "approve-review": "Approve review",
  "record-approval": "Record client approval", "return-for-correction": "Return for correction",
  "record-submission": "Record submission", "record-tax-payment": "Record VAT payment",
  "revise-period": "Revise period", cancel: "Cancel filing", reopen: "Reopen",
  assign: "Assign to me", "schedule-reminder": "Schedule internal reminder",
  "complete-reminder": "Complete reminder", "create-next-period": "Create next period", fee: "Edit service fee and notes",
};
