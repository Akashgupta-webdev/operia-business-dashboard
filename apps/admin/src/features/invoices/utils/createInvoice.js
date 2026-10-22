import { decimalPattern, referenceId } from "./invoice.js";

export const emirates = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];
export const blankService = () => ({ itemDescription: "", qty: "1", govtRate: "", servicePrice: "", taxCode: "5", taxAmount: "", grandTotal: "" });
// Keep only the national part in the input; add the fixed prefix at submission.
export function nationalContactNumber(value = "") {
  return String(value).replace(/[\s()-]/g, "").replace(/^(?:\+971|00971|971)/, "").replace(/^0/, "");
}
export function initialCreateInvoice(client, invoiceType) {
  return { clientId: referenceId(client.clientId) || referenceId(client), companyId: referenceId(client.companyId), invoiceType,
    customerName: client.name || "", emirate: "", contactNo: nationalContactNumber(client.mobileNumber),
    fullAddress: "", trnNo: client.vatTaxRegistrationNumber || "", emailAddress: client.emailAddress || "",
    issueDate: new Date().toISOString().slice(0, 10), dueDate: "", service: [blankService()], accountNo: "", switftBIC: "", iban: "" };
}
export function createInvoicePayload(form) {
  const payload = Object.fromEntries(["clientId", "companyId", "invoiceType", "customerName", "fullAddress", "trnNo", "emailAddress"].map((key) => [key, form[key].trim()]));
  for (const key of ["emirate", "accountNo", "switftBIC", "iban"]) if (form[key].trim()) payload[key] = form[key].trim();
  const nationalNumber = nationalContactNumber(form.contactNo);
  if (nationalNumber) payload.contactNo = `+971${nationalNumber}`;
  for (const key of ["issueDate", "dueDate"]) payload[key] = `${form[key]}T00:00:00.000Z`;
  payload.service = form.service.map(calculateService).map((line) => ({ itemDescription: line.itemDescription.trim(), qty: Number(line.qty), govtRate: line.govtRate || "0.00", servicePrice: line.servicePrice, taxCode: Number(line.taxCode), taxAmount: line.taxAmount, grandTotal: line.grandTotal }));
  return payload;
}
// Detail amounts are numbers; inputs and the existing write payload use decimal strings.
export function initialEditInvoice(invoice) {
  return {
    ...Object.fromEntries(["invoiceType", "customerName", "emirate", "fullAddress", "trnNo", "emailAddress", "accountNo", "switftBIC", "iban"].map((key) => [key, invoice[key] ?? ""])),
    clientId: referenceId(invoice.clientId), companyId: referenceId(invoice.companyId),
    contactNo: nationalContactNumber(invoice.contactNo),
    issueDate: invoice.issueDate?.slice(0, 10) || "", dueDate: invoice.dueDate?.slice(0, 10) || "",
    service: (invoice.service || []).map((line) => ({ itemDescription: line.itemDescription || "", ...Object.fromEntries(["qty", "govtRate", "servicePrice", "taxCode", "taxAmount", "grandTotal"].map((key) => [key, String(line[key] ?? "")])) })),
  };
}
export function updateInvoicePayload(form, invoice) {
  const before = createInvoicePayload(initialEditInvoice(invoice));
  const after = createInvoicePayload(form);
  const comparable = (key, value) => key === "service"
    ? value.map((line) => ({ ...line, ...Object.fromEntries(["govtRate", "servicePrice", "taxAmount", "grandTotal"].map((field) => {
      const [whole, fraction = ""] = String(line[field]).split(".");
      return [field, `${whole.replace(/^0+(?=\d)/, "")}.${fraction.replace(/0+$/, "")}`];
    })) }))
    : value;
  const changes = {};
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (JSON.stringify(comparable(key, before[key])) !== JSON.stringify(comparable(key, after[key]))) {
      // Empty optional fields must be explicit in PATCH to clear their old values.
      changes[key] = after[key] ?? "";
    }
  }
  return { ...changes, expectedVersion: invoice.version };
}
export function sumServiceMoney(service, key) {
  let total = 0n;
  for (const line of service) {
    if (!new RegExp(`^${decimalPattern}$`).test(line[key])) return null;
    const [whole, fraction = ""] = line[key].split(".");
    total += BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
  }
  return `${total / 100n}.${String(total % 100n).padStart(2, "0")}`;
}

// Calculate in integer cents, rounding half up only at the line level.
export function calculateService(line) {
  const empty = { ...line, taxAmount: "", grandTotal: "" };
  const validMoney = new RegExp(`^${decimalPattern}$`);
  const qty = String(line.qty).match(/^(\d+)(?:\.(\d*))?(?:e([+-]?\d+))?$/i);
  if (!validMoney.test(line.servicePrice) || (line.govtRate !== "" && !validMoney.test(line.govtRate)) || !qty || !Number.isFinite(Number(line.qty)) || Number(line.qty) <= 0 || !["0", "5"].includes(String(line.taxCode))) return empty;
  const cents = (value) => { const [whole, fraction = ""] = (value || "0").split("."); return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0")); };
  const fraction = qty[2] || "";
  const exponent = Number(qty[3] || 0) - fraction.length;
  const numerator = BigInt(qty[1] + fraction) * (exponent > 0 ? 10n ** BigInt(exponent) : 1n);
  const denominator = exponent < 0 ? 10n ** BigInt(-exponent) : 1n;
  const round = (amount, divisor) => (amount * 2n + divisor) / (2n * divisor);
  const format = (amount) => `${amount / 100n}.${String(amount % 100n).padStart(2, "0")}`;
  const tax = round(cents(line.servicePrice) * numerator * BigInt(line.taxCode), denominator * 100n);
  const base = round((cents(line.govtRate) + cents(line.servicePrice)) * numerator, denominator);
  return { ...line, taxAmount: format(tax), grandTotal: format(base + tax) };
}

export function contactNumberError(value) {
  const national = nationalContactNumber(value);
  if (!national || /^(?:5[024568]\d{7}|[234679]\d{7})$/.test(national)) return "";
  return "Enter a valid UAE mobile (50, 52, 54, 55, 56 or 58 + 7 digits) or landline (2, 3, 4, 6, 7 or 9 + 7 digits), or leave this optional field empty.";
}
