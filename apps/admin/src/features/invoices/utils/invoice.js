export const invoiceTypes = ["Operio To Client", "Client To Customer"];
export const itemModels = ["ClientService", "ClientVATFiling", "ClientTAXFiling"];
export const taxCodes = ["TAXABLE", "EXE", "OSCS", "ZERO", "DISB"];
export const decimalPattern = "[0-9]{1,16}(\\.[0-9]{1,2})?";
export const decimalString = (value) => String(value?.$numberDecimal ?? value ?? "0.00");
export const referenceId = (value) => typeof value === "string" ? value : value?.id ?? value?._id ?? "";
export const errorMessage = (error) => error?.response?.data?.error?.message || "The request could not be completed. Please try again.";
export const description = (item) => item?.serviceName || item?.service?.name || item?.name || item?.package || item?.serviceCode || (item?.periodStart ? `${item.periodStart} – ${item.periodEnd || ""}` : referenceId(item) || "Deleted record");
export function money(value) {
  const raw = decimalString(value);
  const [whole, fraction = ""] = raw.split(".");
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction.padEnd(2, "0")}`;
}
export function dateLabel(value) {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date) : "—";
}
export function previewTotal(items, advance) {
  const cents = (value) => { if (!new RegExp(`^${decimalPattern}$`).test(value)) throw new Error(); const [a, b = ""] = value.split("."); return BigInt(a) * 100n + BigInt(b.padEnd(2, "0")); };
  try {
    const total = items.reduce((sum, item) => sum + (cents(item.governmentRate) + cents(item.servicePrice)) * BigInt(item.quantity) + cents(item.taxAmount), 0n) - cents(advance);
    const abs = total < 0n ? -total : total;
    return `${total < 0n ? "-" : ""}${abs / 100n}.${String(abs % 100n).padStart(2, "0")}`;
  } catch { return null; }
}
export function initialForm(invoice, type = invoiceTypes[0]) {
  return {
    company: referenceId(invoice?.company), invoiceType: invoice?.invoiceType || type,
    invoiceDate: invoice?.invoiceDate?.slice(0, 10) || new Date().toISOString().slice(0, 10), currency: invoice?.currency || "AED",
    advanceAmount: decimalString(invoice?.advanceAmount), issuer: invoice?.issuer || {},
    items: (invoice?.items || []).map((line) => ({ ...Object.fromEntries(["governmentRate", "servicePrice", "taxRate", "taxAmount"].map((key) => [key, decimalString(line[key])])), taxCode: line.taxCode, itemModel: line.itemModel, item: referenceId(line.item), quantity: line.quantity, label: description(line.item) })),
  };
}
export function invoicePayload(form, client, invoice) {
  return {
    ...(invoice ? { expectedVersion: invoice.version } : { client }),
    ...(form.company ? { company: form.company } : invoice ? { company: null } : {}),
    invoiceType: form.invoiceType, invoiceDate: `${form.invoiceDate}T00:00:00.000Z`, currency: form.currency,
    issuer: Object.fromEntries(Object.entries(form.issuer).filter(([key, value]) => ["taxRegistrationNumber", "accountNumber", "swiftBic", "iban"].includes(key) && value)), advanceAmount: form.advanceAmount,
    items: form.items.map(({ itemModel, item, quantity, governmentRate, servicePrice, taxCode, taxRate, taxAmount }) => ({ itemModel, item, quantity: Number(quantity), governmentRate, servicePrice, taxCode, taxRate, taxAmount })),
  };
}

