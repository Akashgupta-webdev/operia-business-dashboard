import { apiDate, inputDate, minor, today, evidenceFor, idOf } from "../utils/vat.js";
import { VAT_CODE, VAT_PACKAGE } from "../constants/vat.js";

const fail = (field, issue) => { throw Object.assign(new Error(issue), { response: { status: 422, data: { error: { code: "VALIDATION_FAILED", message: issue, details: [{ field, issue }] } } } }); };
const id = (value, field) => /^[a-f\d]{24}$/i.test(value ?? "") ? value : fail(field, "Select a valid resource ID.");
function date(value, field) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "") || value < "1900-01-01" || value > "9999-12-31") fail(field, "Enter a real date between 1900 and 9999.");
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) fail(field, "Enter a real calendar date.");
  return apiDate(value);
}
function text(value, field, max) {
  const result = (value ?? "").trim();
  if (!result || result.length > max) fail(field, `Enter 1–${max} characters.`);
  return result;
}
function amount(value, field, signed = false, digits = 16) {
  if (!new RegExp(`^${signed ? "-?" : ""}\\d{1,${digits}}(\\.\\d{1,2})?$`).test(value ?? "")) fail(field, `Enter ${signed ? "a signed" : "a non-negative"} decimal with up to ${digits} integer digits and two decimals.`);
  return value;
}
function notes(value) {
  const lines = (value ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length > 100 || lines.some((line) => line.length > 1000)) fail("notes", "Use at most 100 notes of 1,000 characters each.");
  return lines;
}
function period(values) {
  const result = Object.fromEntries(["periodStart", "periodEnd", "dueDate"].map((key) => [key, date(values[key], key)]));
  if (values.periodStart > values.periodEnd || values.periodEnd >= values.dueDate) fail("dueDate", "Period start must be on/before period end; deadline must be after period end.");
  return result;
}
export function createPayload(values, company) {
  id(idOf(company), "company"); id(idOf(company?.client), "client");
  if (!/^\d{15}$/.test(company?.vatTaxRegistrationNumber ?? "")) fail("company", "Update company master data with a valid 15-digit TRN before creating a filing. Multi-company records require an unambiguous master-data update.");
  const dates = period(values);
  const payload = { serviceCode: VAT_CODE, category: "Tax & Accounting", package: VAT_PACKAGE, company: idOf(company), status: "Pending", dueDate: dates.dueDate, details: { vat: { periodStart: dates.periodStart, periodEnd: dates.periodEnd } } };
  if (values.packagePrice) payload.packagePrice = amount(values.packagePrice, "packagePrice");
  if (values.paymentStatus) { if (!["Unpaid", "Partial", "Paid"].includes(values.paymentStatus)) fail("paymentStatus", "Select a fee payment state."); payload.paymentStatus = values.paymentStatus; }
  if (values.targetCompletionDate) payload.targetCompletionDate = date(values.targetCompletionDate, "targetCompletionDate");
  if (values.notes) payload.notes = notes(values.notes);
  return payload;
}
export function actionPayload(action, values, service, documents = [], adminId) {
  if (!Number.isInteger(service.version) || service.version < 0) fail("expectedVersion", "Reload a filing with a valid version before saving.");
  const payload = { expectedVersion: service.version };
  const vat = service.details.vat;
  const evidence = (field, purpose) => {
    const selected = id(values[field], field);
    if (!evidenceFor(documents, service.id, purpose).some((d) => idOf(d) === selected)) fail(field, `Select ${purpose} evidence for this filing.`);
    return selected;
  };
  if (["cancel", "return-for-correction", "revise-period"].includes(action)) payload.reason = text(values.reason, "reason", 1000);
  if (["revise-period", "create-next-period"].includes(action)) Object.assign(payload, period(values));
  if (action === "create-next-period" && values.periodStart <= inputDate(vat.periodEnd)) fail("periodStart", "Next period must start after the predecessor period ends.");
  if (action === "prepare") {
    payload.outputVat = amount(values.outputVat, "outputVat", true, 15);
    payload.recoverableInputVat = amount(values.recoverableInputVat, "recoverableInputVat", true, 15);
    payload.workingPaper = evidence("workingPaper", "WORKING_PAPER");
    payload.sourceDocuments = values.sourceDocuments ?? [];
    const available = evidenceFor(documents, service.id, "SOURCE").map(idOf);
    if (!payload.sourceDocuments.length || payload.sourceDocuments.length > 100 || new Set(payload.sourceDocuments).size !== payload.sourceDocuments.length || payload.sourceDocuments.some((v) => !available.includes(v) || !/^[a-f\d]{24}$/i.test(v))) fail("sourceDocuments", "Select 1–100 unique source documents for this filing.");
  }
  if (action === "record-approval") { payload.approverName = text(values.approverName, "approverName", 200); payload.document = evidence("document", "APPROVAL"); }
  if (action === "record-submission") { payload.reference = text(values.reference, "reference", 200); payload.document = evidence("document", "ACKNOWLEDGMENT"); }
  if (["record-submission", "record-tax-payment"].includes(action)) {
    const field = action === "record-submission" ? "submittedOn" : "paidOn";
    payload[field] = date(values[field], field);
    if (values[field] < inputDate(vat.periodEnd) || values[field] > today()) fail(field, "Date must be between period end and today in Dubai.");
  }
  if (action === "record-tax-payment") {
    payload.amountPaid = amount(values.amountPaid, "amountPaid"); payload.document = evidence("document", "TAX_PAYMENT");
    if (minor(payload.amountPaid) > minor(vat.calculation.netVat)) fail("amountPaid", "Cumulative payment cannot exceed net VAT.");
    if (vat.settlement?.document) payload.reason = text(values.reason, "reason", 1000);
  }
  if (action === "assign") payload.assignedTo = id(adminId, "assignedTo");
  if (action === "schedule-reminder") { payload.followupDate = date(values.followupDate, "followupDate"); payload.notes = notes(values.notes); }
  if (action === "fee") {
    payload.packagePrice = values.packagePrice ? amount(values.packagePrice, "packagePrice") : null;
    payload.paymentStatus = values.paymentStatus || null;
    if (payload.paymentStatus && !["Unpaid", "Partial", "Paid"].includes(payload.paymentStatus)) fail("paymentStatus", "Select a fee payment state.");
    payload.targetCompletionDate = values.targetCompletionDate ? date(values.targetCompletionDate, "targetCompletionDate") : null;
    payload.notes = values.notes ? notes(values.notes) : null;
    const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
    if (Object.keys(payload).filter((k) => k !== "expectedVersion").every((k) => same(payload[k], service[k]))) fail("packagePrice", "Make at least one change before saving.");
  }
  return payload;
}
