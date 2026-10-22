import { decimalString } from "./invoice.js";

// Keep the server DTO and provide the existing table/detail presentation fields.
export function normalizeInvoice(invoice, { numeric = false } = {}) {
  if (!invoice || !Array.isArray(invoice.service)) return invoice;
  const monetaryValue = numeric ? (value) => value : decimalString;
  const total = monetaryValue(invoice.grandTotalAmount);
  return { ...invoice, invoiceNumber: invoice.invoiceNo, client: invoice.clientId, company: invoice.companyId, invoiceDate: invoice.issueDate, currency: "AED",
    items: invoice.service.map((line) => ({ item: { name: line.itemDescription }, quantity: line.qty, governmentRate: line.govtRate, servicePrice: line.servicePrice, taxCode: line.taxCode, taxRate: String(line.taxCode), taxAmount: line.taxAmount })),
    totals: { total, subtotal: total, taxAmount: monetaryValue(invoice.grandTotalTaxAmount), lineTotals: invoice.service.map((line) => monetaryValue(line.grandTotal)) },
    issuer: { accountNumber: invoice.accountNo, swiftBic: invoice.switftBIC, iban: invoice.iban },
  };
}

// The list endpoint returns a compact DTO, not a populated invoice detail.
export function normalizeInvoiceListItem(invoice) {
  if (!invoice || !("invoiceId" in invoice)) {
    const legacy = normalizeInvoice(invoice);
    return legacy && { ...legacy, clientName: legacy.client?.name, customerName: legacy.customerName };
  }
  return {
    ...invoice,
    id: invoice._id,
    invoiceNumber: invoice.invoiceId,
    invoiceDate: invoice.issueDate,
    currency: "AED",
    totals: { total: decimalString(invoice.grandTotalAmount) },
  };
}
