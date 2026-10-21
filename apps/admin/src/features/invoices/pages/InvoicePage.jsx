import { useState } from "react";
import { CheckCircle2, Clock3, Download, Eye, FileText, Pencil, Plus, Search, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@operio/ui/components/table";
import { Input } from "@operio/ui/components/input";
import { DateInput } from "@operio/ui/components/date-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import RenewalPagination from "@/features/renewals/components/RenewalPagination";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useInvoices } from "../hooks/useInvoices";
import { dateLabel, errorMessage, invoiceTypes, money, referenceId } from "../utils/invoice";
import InvoiceDialog from "../components/InvoiceDialog";

const summaries = [
  { label: "Total Invoices", icon: FileText, tone: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300", background: "bg-[#eae7f2] border-[#e2ddef] dark:bg-primary-900/40 dark:border-primary-800", detail: "Invoices matching your search" },
  { label: "Paid Invoices", icon: CheckCircle2, tone: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500", background: "bg-[#e3f0ec] border-[#d8ebe4] dark:bg-success-700/20 dark:border-success-700/30", detail: "Payment data not available" },
  { label: "Unpaid Invoices", icon: Clock3, tone: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500", background: "bg-[#f2ece3] border-[#eee4d6] dark:bg-warning-700/20 dark:border-warning-700/30", detail: "Payment data not available" },
  { label: "Overdue Invoices", icon: TriangleAlert, tone: "bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500", background: "bg-[#f2e6eb] border-[#efdce3] dark:bg-danger-700/20 dark:border-danger-700/30", detail: "Payment data not available" },
];

export default function InvoicePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dialog, setDialog] = useState(null);
  const debounced = useDebouncedValue(search.trim());
  const limit = 8;
  const query = useInvoices({ page, limit, search: debounced });
  const total = query.data?.page?.total ?? 0;
  const totalPages = query.data?.page?.totalPages ?? 0;
  const rows = (query.data?.data || []).filter((invoice) => (!type || invoice.invoiceType === type) && (!from || invoice.invoiceDate?.slice(0, 10) >= from) && (!to || invoice.invoiceDate?.slice(0, 10) <= to));
  function exportPage() {
    const escape = (value) => `"${String(value ?? "").replace(/^[=+\-@\t\r]/, "'$&").replaceAll('"', '""')}"`;
    const csv = [["Invoice", "Client", "Customer", "Type", "Issue Date", "Due Date", "Currency", "Total"], ...rows.map((invoice) => [invoice.invoiceNumber, invoice.clientName, invoice.customerName, invoice.invoiceType, invoice.invoiceDate, invoice.dueDate, invoice.currency, invoice.totals?.total])].map((row) => row.map(escape).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a"); link.href = url; link.download = `invoices-page-${page}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function closeDialog(saved) { if (saved && dialog?.action === "delete" && query.data?.data?.length === 1 && page > 1) setPage(page - 1); setDialog(null); }
  return <div className="min-h-[calc(100svh-var(--header-height))] min-w-0 space-y-4 bg-app-background px-3 py-4 text-text-primary sm:px-6">
    <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">Invoice Management</h1>
      <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap sm:gap-3">
        <Button onClick={() => setDialog({ action: "create", type: invoiceTypes[0] })} style={{ borderRadius: 8 }} className="h-auto gap-3 bg-success-700 px-4 py-3 text-white hover:bg-success-800"><Plus className="size-6" aria-hidden="true" /><span className="text-left text-xs">Create Invoice</span></Button>
        <Button variant="secondary" onClick={() => setDialog({ action: "create", type: invoiceTypes[1] })} style={{ borderRadius: 8 }} className="h-auto gap-3 bg-primary-100 px-4 py-3 text-primary-800 hover:bg-primary-200"><Plus className="size-6" aria-hidden="true" /><span className="text-left text-xs">Client Invoice</span></Button>
      </div>
    </header>
    <section aria-label="Invoice summary" className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-4">
      {summaries.map(({ label, icon: Icon, tone, background, detail }, index) => (
        <Card key={label} size="sm" className={`h-full min-w-0 flex-row items-start gap-2 border p-3 shadow-sm ring-0 transition-shadow hover:shadow-md sm:gap-3 ${background}`}>
          <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-10 ${tone}`}><Icon className="size-4 sm:size-5" aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xs leading-4 font-semibold text-text-primary">{label}</h2>
            <p className="mt-1 text-2xl leading-7 font-bold tracking-tight text-text-primary" data-numeric>{index === 0 && query.isSuccess ? total : "\u2014"}</p>
            <p className={`mt-0.5 text-xs leading-4 ${index === 3 ? "text-danger-600" : index === 2 ? "text-warning-700" : "text-text-muted"}`}>{detail}</p>
          </div>
        </Card>
      ))}
    </section>
    <Card id="invoices-list" aria-label="Invoices" aria-busy={query.isFetching} className="min-w-0 gap-4 border border-border-default/60 bg-surface-primary p-4 shadow-none ring-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
          <Input type="search" maxLength={200} aria-label="Search invoices by client or company" placeholder="Search client or company..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} style={{ borderRadius: 6 }} className="h-9 w-full border-border-default pl-9 text-xs md:text-xs" />
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          <Select value={type || "all"} onValueChange={(value) => setType(value === "all" ? "" : value)}>
            <SelectTrigger aria-label="Invoice type on this page" className="min-w-36 rounded-md border-border-default text-xs data-[size=default]:h-9"><SelectValue /></SelectTrigger>
            <SelectContent align="end"><SelectItem value="all">All Types</SelectItem>{invoiceTypes.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2"><label htmlFor="invoice-filter-from" className="text-xs text-text-secondary">From</label><DateInput id="invoice-filter-from" max={to || undefined} value={from} onChange={(event) => setFrom(event.target.value)} className="h-9 w-36 rounded-md border-border-default text-xs md:text-xs" /></div>
            <div className="flex items-center gap-2"><label htmlFor="invoice-filter-to" className="text-xs text-text-secondary">To</label><DateInput id="invoice-filter-to" min={from || undefined} value={to} onChange={(event) => setTo(event.target.value)} className="h-9 w-36 rounded-md border-border-default text-xs md:text-xs" /></div>
          </div>
          <Button size="sm" style={{ borderRadius: 6 }} className="h-9 bg-primary text-xs text-primary-foreground shadow-none hover:bg-primary/90" disabled={!rows.length || query.isFetching || query.isError} onClick={exportPage}><Download className="size-4" />Export Page</Button>
        </div>
      </div>
      {query.isPending ? <p role="status" className="p-12 text-center text-sm">Loading invoices…</p> : query.isError ? <div role="alert" className="space-y-3 p-8 text-center text-sm text-destructive"><p>{errorMessage(query.error)}</p><Button variant="outline" onClick={() => query.refetch()}>Retry</Button></div> : <>
        <div className="overflow-x-auto"><Table className="min-w-[1000px] text-[11px]"><caption className="sr-only">Invoices</caption><TableHeader className="bg-surface-secondary"><TableRow>{["#", "Invoice #", "Client / Customer", "Type", "Issue Date", "Due Date", "Amount", "Status", "Action"].map((heading) => <TableHead scope="col" key={heading} className="text-[10px]">{heading}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((invoice) => <TableRow key={referenceId(invoice)} className="[&>td]:py-3"><TableCell className="">{(page - 1) * limit + query.data.data.indexOf(invoice) + 1}</TableCell><TableCell className="whitespace-nowrap font-semibold">{invoice.invoiceNumber}</TableCell><TableCell className=""><div className="flex items-center gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-semibold text-primary-600">{invoice.clientName?.split(/\s+/).slice(0, 2).map((part) => part[0]).join("") || "?"}</span><div><p className="font-medium">{invoice.clientName || "Client unavailable"}</p><p className="mt-1 text-text-secondary">{invoice.customerName || "Customer unavailable"}</p></div></div></TableCell><TableCell className=""><span className={`whitespace-nowrap rounded px-2 py-1 font-medium ${invoice.invoiceType === invoiceTypes[1] ? "bg-info-50 text-info-700" : "bg-primary-50 text-primary"}`}>{invoice.invoiceType === invoiceTypes[1] ? "Client → Customer" : "Operio → Client"}</span></TableCell><TableCell className="whitespace-nowrap text-text-secondary">{dateLabel(invoice.invoiceDate)}</TableCell><TableCell className="text-text-muted">{dateLabel(invoice.dueDate)}</TableCell><TableCell className="whitespace-nowrap font-semibold tabular-nums">{invoice.currency} {money(invoice.totals?.total)}</TableCell><TableCell className=""><span className="whitespace-nowrap rounded-md bg-neutral-100 px-2 py-1 text-text-muted">Not available</span></TableCell><TableCell className=""><div className="flex gap-2">{[["view", Eye, "text-primary bg-primary-50"], ["edit", Pencil, "text-info-700 bg-info-50"], ["delete", Trash2, "text-destructive bg-danger-50"]].map(([action, Icon, color]) => <Button key={action} variant="outline" size="icon-sm" className={color} disabled={action === "edit" && Boolean(invoice.service)} title={action === "edit" && invoice.service ? "Editing this invoice format is not available yet" : undefined} aria-label={`${action} ${invoice.invoiceNumber}`} onClick={() => setDialog({ action, id: referenceId(invoice) })}><Icon className="size-4" /></Button>)}</div></TableCell></TableRow>)}</TableBody></Table>{!rows.length && <div className="space-y-2 p-12 text-center"><FileText className="mx-auto size-8 text-text-muted" /><p className="text-sm font-medium">No invoices found</p><p className="text-xs text-text-secondary">Adjust your filters or create an invoice to get started.</p></div>}</div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-3 text-[10px] text-text-muted"><p>{type || from || to ? `${rows.length} matching invoices on this page · ${total} total search results` : `Showing ${total ? (page - 1) * limit + 1 : 0}–${Math.min(page * limit, total)} of ${total} invoices`}</p><RenewalPagination page={page} totalPages={totalPages} disabled={query.isFetching} onPageChange={setPage} ariaLabel="Invoices pagination" href="#invoices-list" /></footer>
      </>}
    </Card>
    {dialog && <InvoiceDialog {...dialog} onClose={closeDialog} />}
  </div>;
}
