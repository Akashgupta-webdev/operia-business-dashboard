import { useState } from "react";
import { FilePlus2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@operio/ui/components/dialog";
import { Button } from "@operio/ui/components/button";
import { useInvoice, useInvoiceMutation } from "../hooks/useInvoices";
import { dateLabel, description, errorMessage, money } from "../utils/invoice";
import InvoiceClientPicker from "./InvoiceClientPicker";
import CreateInvoiceForm from "./CreateInvoiceForm";
import InvoiceForm from "./InvoiceForm";

export default function InvoiceDialog({ action, id, type, onClose }) {
  const query = useInvoice(id);
  const mutation = useInvoiceMutation(true);
  const [client, setClient] = useState(null);
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const invoice = query.data;
  const conflict = mutation.error?.response?.status === 409;
  async function reload() { const result = await query.refetch(); if (result.isSuccess) { mutation.reset(); setRevision((value) => value + 1); } }
  async function remove() {
    try { await mutation.mutateAsync({ id, version: invoice.version }); toast.success("Invoice deleted"); onClose(true); } catch { /* Show backend error and allow review on conflict. */ }
  }
  return <Dialog open onOpenChange={(open) => { if (!open && !busy && !mutation.isPending) onClose(); }}><DialogContent showCloseButton={!busy && !mutation.isPending} className={`max-h-[90svh] overflow-y-auto rounded-lg border-border-default bg-surface-primary p-5 ${action === "create" ? client ? "max-w-6xl" : "max-w-3xl" : action === "edit" && invoice?.service ? "max-w-6xl" : "max-w-4xl"}`}>
    {action === "create" ? <>
      <header className="flex items-center gap-4 pr-8">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-100/70 text-primary-600"><FilePlus2 aria-hidden="true" className="size-7" /></span>
        <div><DialogTitle className="text-lg font-bold tracking-tight">Create Invoice - {client ? "Invoice Details" : "Select Client"}</DialogTitle><DialogDescription className={client ? "sr-only" : "mt-1 text-xs text-text-secondary"}>{client ? "Invoice details" : "Select a client to create a new invoice. You'll be taken to the invoice form next."}</DialogDescription></div>
      </header>
      <ol aria-label="Invoice creation progress" className="mx-auto flex max-w-md items-center gap-3 py-6 text-xs sm:gap-5">
        <li aria-current={!client ? "step" : undefined} className="flex shrink-0 items-center gap-2 font-medium text-primary"><span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">1</span>Select Client</li>
        <li aria-hidden="true" className="h-px flex-1 bg-border-default"><div className={client ? "h-px w-full bg-primary" : "h-px w-1/2 bg-primary"} /></li>
        <li aria-current={client ? "step" : undefined} className={`flex shrink-0 items-center gap-2 ${client ? "font-medium text-primary" : "text-text-secondary"}`}><span className={`flex size-5 items-center justify-center rounded-full text-[10px] text-white ${client ? "bg-primary" : "bg-neutral-400"}`}>2</span>Invoice Details</li>
      </ol>
    </> : <><DialogTitle>{action === "edit" ? "Edit Invoice - Invoice Details" : action === "delete" ? "Delete invoice" : "Invoice details"}</DialogTitle><DialogDescription>Review the latest invoice information.</DialogDescription></>}

    {id && (query.isPending) ? <p role="status">Loading invoice…</p> : id && query.isError ? <div role="alert">{errorMessage(query.error)} <Button variant="outline" onClick={reload}>Retry</Button></div> : action === "create" && !client ? <InvoiceClientPicker onSelect={setClient} onCancel={() => onClose()} /> : action === "create" ? <CreateInvoiceForm client={client} type={type} onClose={onClose} onBusy={setBusy} /> : action === "edit" && invoice?.service ? <CreateInvoiceForm key={revision} client={invoice.clientId} invoice={invoice} onClose={onClose} onBusy={setBusy} onReload={reload} /> : action === "edit" ? <InvoiceForm key={revision} client={invoice?.client || client} invoice={invoice} type={type} onClose={onClose} onReload={reload} onBusy={setBusy} /> : action === "delete" ? <div className="space-y-4"><p className="text-sm">Delete <strong>{invoice.invoiceNumber}</strong> for {invoice.client?.name || "deleted client"}? This cannot be undone.</p>{mutation.isError && <div role="alert" className="text-sm text-destructive">{errorMessage(mutation.error)}{conflict && <Button variant="outline" onClick={reload}>Reload latest invoice to review</Button>}</div>}<div className="flex justify-end gap-2"><Button variant="outline" disabled={mutation.isPending} onClick={() => onClose()}>Cancel</Button><Button variant="destructive" disabled={mutation.isPending || conflict || !Number.isInteger(invoice.version)} onClick={remove}>{mutation.isPending ? "Deleting…" : "Delete invoice"}</Button></div></div> : invoice && <div className="space-y-5">
      <div className="flex flex-wrap justify-between gap-4 rounded-lg bg-primary-50 p-4"><div><h2 className="text-xl font-bold">{invoice.invoiceNumber}</h2><p className="mt-1 text-sm">{invoice.invoiceType}</p><p className="mt-1 text-xs text-text-secondary">{dateLabel(invoice.invoiceDate)}</p></div><div className="text-sm"><p className="font-semibold">{invoice.client?.name || "Deleted client"}</p><p>{invoice.company?.companyName || "No company"}</p><p className="text-text-secondary">{invoice.client?.emailAddress}</p></div></div>
      {invoice.service && <dl className="grid gap-3 text-xs sm:grid-cols-2">{[["Customer", invoice.customerName], ["Address", invoice.fullAddress], ["Emirate", invoice.emirate], ["Contact", invoice.contactNo], ["Email", invoice.emailAddress], ["TRN", invoice.trnNo], ["Due date", dateLabel(invoice.dueDate)]].map(([label, value]) => <div key={label}><dt className="text-text-muted">{label}</dt><dd>{value || "—"}</dd></div>)}</dl>}
      <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="bg-primary-50"><tr>{["Item", "Qty", "Government rate", "Service price", "Tax code / rate", "Line tax", "Total"].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody>{invoice.items?.map((line, index) => <tr key={index} className="border-b border-border-default"><td className="p-3">{description(line.item)}<p className="mt-1 text-text-muted">{line.itemModel}</p></td><td className="p-3">{line.quantity}</td><td className="p-3">{money(line.governmentRate)}</td><td className="p-3">{money(line.servicePrice)}</td><td className="p-3">{line.taxCode} / {money(line.taxRate)}%</td><td className="p-3">{money(line.taxAmount)}</td><td className="p-3">{money(invoice.totals?.lineTotals?.[index])}</td></tr>)}</tbody></table></div>
      <dl className="ml-auto max-w-sm space-y-3 text-sm">{[["Subtotal (including tax)", invoice.totals?.subtotal], ["Total tax", invoice.totals?.taxAmount], ["Advance", invoice.advanceAmount], ["Balance", invoice.totals?.total]].map(([label, value]) => <div key={label} className="flex justify-between gap-4"><dt>{label}</dt><dd className="font-semibold">{invoice.currency} {money(value)}</dd></div>)}</dl>
      {invoice.issuer && <dl className="grid gap-3 rounded-lg border p-3 text-xs sm:grid-cols-2">{Object.entries(invoice.issuer).filter(([key, value]) => value && !["id", "_id"].includes(key)).map(([key, value]) => <div key={key}><dt className="text-text-muted">{key}</dt><dd className="break-all">{String(value)}</dd></div>)}</dl>}
      <Button variant="outline" onClick={() => onClose()}>Close</Button>
    </div>}
  </DialogContent></Dialog>;
}
