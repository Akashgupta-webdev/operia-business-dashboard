import { VAT_CODE } from "../constants/vat.js";

export const isVat = (service) => service?.serviceCode === VAT_CODE;
export const isAdmin = (user) => user?.role === "ADMIN" && user?.status === "ACTIVE";
export const idOf = (value) => typeof value === "string" ? value : value?.id ?? value?._id;
export const label = (value) => value ? value.replaceAll("_", " ").replaceAll("-", " ").toLowerCase().replace(/^./, (c) => c.toUpperCase()) : "Not recorded";
export function normalizeDto(value) {
  if (value == null) return value;
  if (typeof value === "object" && "$numberDecimal" in value) return value.$numberDecimal;
  if (Array.isArray(value)) return value.map(normalizeDto);
  if (typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeDto(v)]));
  return value;
}
export function minor(value) {
  const text = String(value?.$numberDecimal ?? value);
  if (!/^-?\d+(\.\d{1,2})?$/.test(text)) throw new Error("Invalid decimal amount");
  const [whole, fraction = ""] = text.replace("-", "").split(".");
  return (BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"))) * (text.startsWith("-") ? -1n : 1n);
}
export function decimal(cents) {
  const absolute = cents < 0n ? -cents : cents;
  return `${cents < 0n ? "-" : ""}${absolute / 100n}.${String(absolute % 100n).padStart(2, "0")}`;
}
export function money(value) {
  if (value == null || value === "") return "Not recorded";
  try { return `AED ${decimal(minor(value)).replace(/\B(?=(\d{3})+\.)/g, ",")}`; } catch { return "Not recorded"; }
}
export const inputDate = (value) => !value ? "" : /^\d{2}-\d{2}-\d{4}$/.test(value) ? value.split("-").reverse().join("-") : value.slice(0, 10);
export const apiDate = (value) => inputDate(value).split("-").reverse().join("-");
export const showDate = (value) => value ? apiDate(value) : "Not recorded";
export function today(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Dubai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  return ["year", "month", "day"].map((type) => parts.find((p) => p.type === type).value).join("-");
}
export const overdue = (s) => !["Completed", "Cancelled"].includes(s.status) && inputDate(s.dueDate) < today();
export function allowedActions(service, reminder) {
  if (!Number.isInteger(service?.version) || service.version < 0) return [];
  if (service.status === "Cancelled") return ["reopen", "fee"];
  const vat = service.details?.vat ?? {};
  if (vat.stage === "FILED" || service.status === "Completed") return [
    ...(vat.calculation?.netVat != null && minor(vat.calculation.netVat) > 0n ? ["record-tax-payment"] : []), "create-next-period", "assign", "fee",
  ];
  const primary = { PREPARING: vat.calculation ? "request-review" : null, INTERNAL_REVIEW: "approve-review", AWAITING_CLIENT_APPROVAL: "record-approval", READY_TO_FILE: "record-submission" }[vat.stage];
  return [primary, "prepare", "return-for-correction", "revise-period", "cancel", "assign", "schedule-reminder", reminder?.state === "PENDING" ? "complete-reminder" : null, "fee"].filter(Boolean);
}
export const evidenceFor = (documents, serviceId, purpose) => documents.filter((d) => idOf(d.service) === serviceId && d.purpose === purpose);
export function errorInfo(error) {
  const body = error?.response?.data;
  const status = error?.response?.status;
  const code = body?.error?.code;
  const messages = {
    VERSION_CONFLICT: "Another edit changed this filing. Your draft is retained. Reload and review the latest record before applying it.",
    VAT_PERIOD_EXISTS: "This period or successor already exists, including cancelled filings. Find the existing filing before continuing.",
  };
  return { status, code, details: body?.error?.details ?? [], correlationId: body?.meta?.correlationId,
    uncertain: !status || status >= 500,
    message: messages[code] ?? (status === 401 ? "Your session expired. Sign in again." : status === 403 ? "Access denied. An active Admin account is required." : status === 404 ? "Filing or client not found." : status === 429 ? "Too many requests. Try again later." : body?.error?.message ?? "The request could not be confirmed. Reload the record and check history before retrying.") };
}
