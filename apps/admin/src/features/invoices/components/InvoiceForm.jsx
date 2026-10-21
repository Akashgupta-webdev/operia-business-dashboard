import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import useClient from "@/features/clients/hooks/useClient";
import { useInvoiceMutation } from "../hooks/useInvoices";
import { decimalPattern, errorMessage, initialForm, invoicePayload, invoiceTypes, money, previewTotal, referenceId, taxCodes } from "../utils/invoice";
import InvoiceItemPicker from "./InvoiceItemPicker";

export default function InvoiceForm({ client, invoice: sourceInvoice, type, onClose, onReload, onBusy }) {
  const [invoice] = useState(sourceInvoice);
  const [form, setForm] = useState(() => initialForm(invoice, type));
  const mutation = useInvoiceMutation();
  const clientId = referenceId(client);
  const details = useClient(clientId);
  const companies = details.data?.companies || [];
  const conflict = mutation.error?.response?.status === 409;
  const uncertain = mutation.isError && !mutation.error?.response && !invoice;
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateLine = (index, key, value) => update("items", form.items.map((line, i) => i === index ? { ...line, [key]: value } : line));
  const preview = previewTotal(form.items, form.advanceAmount);
  async function submit(event) {
    event.preventDefault();
    if (mutation.isPending || conflict || uncertain || !form.items.length || !clientId) return;
    if (form.items.some((line) => !line.item || !Number.isSafeInteger(Number(line.quantity)) || Number(line.quantity) < 1)) return;
    onBusy(true);
    try { await mutation.mutateAsync({ id: referenceId(invoice), payload: invoicePayload(form, clientId, invoice) }); toast.success(invoice ? "Invoice updated" : "Invoice created"); onClose(true); } catch { /* Keep entered data visible. */ } finally { onBusy(false); }
  }
  return <form onSubmit={submit} className="space-y-4">
    <div className="rounded-lg bg-primary-50 p-3"><p className="text-xs text-text-secondary">{invoice ? invoice.invoiceNumber : "2. Invoice details · Number assigned on creation"}</p><p className="mt-1 text-sm font-semibold">{client?.name || "Deleted client"}</p></div>
    <fieldset disabled={mutation.isPending || conflict || uncertain} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs">Invoice type<select className="block h-10 w-full rounded-md border bg-surface-primary px-3" value={form.invoiceType} onChange={(e) => update("invoiceType", e.target.value)}>{invoiceTypes.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="space-y-1 text-xs">Company<select className="block h-10 w-full rounded-md border bg-surface-primary px-3" value={form.company} onChange={(e) => setForm((current) => ({ ...current, company: e.target.value, items: [] }))}><option value="">No company (items without a company)</option>{form.company && !companies.some((company) => referenceId(company) === form.company) && <option value={form.company}>{invoice?.company?.companyName || "Current company"}</option>}{companies.map((company) => <option key={referenceId(company)} value={referenceId(company)}>{company.companyName}</option>)}</select><span className="text-text-muted">Changing company clears invoice lines.</span></label>
        <label className="space-y-1 text-xs">Invoice date<Input type="date" required value={form.invoiceDate} onChange={(e) => update("invoiceDate", e.target.value)} /></label>
        <label className="space-y-1 text-xs">Currency<Input required pattern="[A-Z]{3}" maxLength={3} value={form.currency} onChange={(e) => update("currency", e.target.value.toUpperCase())} /></label>
      </div>
      {details.isError && <p role="alert" className="text-xs text-destructive">Unable to load companies. <Button type="button" variant="outline" onClick={() => details.refetch()}>Retry</Button></p>}
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Invoice lines</h3><span className="text-xs text-text-muted">{form.items.length} / 100</span></div>
      {form.items.map((line, index) => <div key={index} className="space-y-3 rounded-lg border border-border-default p-3"><div className="flex items-center justify-between gap-2"><div><p className="text-xs font-semibold">{index + 1}. {line.label}</p><p className="text-xs text-text-muted">{line.itemModel}</p></div><Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => update("items", form.items.filter((_, i) => i !== index))}>Remove</Button></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="text-xs">Quantity<Input required type="number" min="1" max={Number.MAX_SAFE_INTEGER} step="1" value={line.quantity} onChange={(e) => updateLine(index, "quantity", e.target.value)} /></label>
        {[["governmentRate", "Government rate"], ["servicePrice", "Service price"], ["taxRate", "Tax rate (%)"], ["taxAmount", "Total line tax"]].map(([key, label]) => <label key={key} className="text-xs">{label}<Input required inputMode="decimal" pattern={decimalPattern} title="Non-negative amount, up to 16 integer digits and 2 decimal places" value={line[key]} onChange={(e) => updateLine(index, key, e.target.value)} /></label>)}
        <label className="text-xs">Tax code<select className="h-10 w-full rounded-md border bg-surface-primary px-2" value={line.taxCode} onChange={(e) => updateLine(index, "taxCode", e.target.value)}>{taxCodes.map((code) => <option key={code}>{code}</option>)}</select></label>
      </div></div>)}
      <p className="text-xs text-text-muted">Enter the total tax for each line explicitly. Tax is not calculated from the tax rate.</p>
      <InvoiceItemPicker clientId={clientId} company={form.company} disabled={form.items.length >= 100} onAdd={(line) => update("items", [...form.items, line])} />
      <details className="rounded-lg border border-border-default p-3"><summary className="cursor-pointer text-xs font-semibold">Issuer & bank details (optional)</summary><div className="mt-3 grid gap-3 sm:grid-cols-2">{[["taxRegistrationNumber", "Tax registration number"], ["accountNumber", "Account number"], ["swiftBic", "SWIFT / BIC"], ["iban", "IBAN"]].map(([key, label]) => <label key={key} className="text-xs">{label}<Input value={form.issuer[key] || ""} onChange={(e) => update("issuer", { ...form.issuer, [key]: e.target.value })} /></label>)}</div></details>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-primary-50 p-4"><label className="text-xs">Advance amount<Input required inputMode="decimal" pattern={decimalPattern} value={form.advanceAmount} onChange={(e) => update("advanceAmount", e.target.value)} /></label><div className="text-right"><p className="text-xs text-text-secondary">Estimated balance</p><output className="text-xl font-semibold">{form.currency} {preview === null ? "—" : money(preview)}</output></div></div>
    </fieldset>
    {mutation.isError && <div role="alert" className="space-y-2 text-sm text-destructive"><p>{uncertain ? "The result is uncertain. Close this form and check the invoice list before creating another invoice." : errorMessage(mutation.error)}</p>{conflict && <Button type="button" variant="outline" onClick={onReload}>Reload latest invoice to review</Button>}</div>}
    <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => onClose()}>Cancel</Button><Button type="submit" disabled={mutation.isPending || conflict || uncertain || !form.items.length || !clientId || (invoice && !Number.isInteger(invoice.version))}>{mutation.isPending ? "Saving…" : invoice ? "Save changes" : "Create invoice"}</Button></div>
  </form>;
}

