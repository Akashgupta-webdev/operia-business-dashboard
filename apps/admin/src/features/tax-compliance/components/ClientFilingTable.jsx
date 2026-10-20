import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { formatComplianceDate } from "../utils/complianceDates";

import FilingDialog from "./FilingDialog";
import DeleteFilingDialog from "./DeleteFilingDialog";

const statusStyles = {
  paid: "bg-success-50 text-success-700",
  submitted: "bg-info-50 text-info-700",
  pending: "bg-warning-50 text-warning-700",
  draft: "bg-neutral-100 text-text-secondary",
  overdue: "bg-danger-50 text-danger-700",
  rejected: "bg-danger-50 text-danger-700",
};
const moneyFormatter = new Intl.NumberFormat("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function money(value) {
  const amount = value?.$numberDecimal ?? value;
  return amount != null && amount !== "" && Number.isFinite(Number(amount)) ? moneyFormatter.format(Number(amount)) : "\u2014";
}

export function ComplianceQueryError({ query, label }) {
  return <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg bg-danger-50 p-4 text-xs text-danger-700"><span>{query.error?.response?.status === 404 ? "Client not found." : query.error?.response?.status === 403 ? "You do not have permission to view this client." : `Unable to load ${label}.`}</span><Button variant="outline" size="sm" onClick={() => query.refetch()}>Retry</Button></div>;
}

export default function ClientFilingTable({ clientId, client, type, trn, query, preview, page, limit, onPageChange, onLimitChange, onViewMore }) {
  const [dialog, setDialog] = useState(null);
  function closeDialog(saved) {
    if (saved && !preview && dialog?.action === "delete" && rows.length <= 1 && page > 1) onPageChange(page - 1);
    setDialog(null);
  }
  const rows = query.data?.data ?? [];
  const total = query.data?.page?.total ?? 0;
  const totalPages = query.data?.page?.totalPages ?? 0;
  const currentPage = query.data?.page?.page ?? page;
  const title = type === "VAT" ? "VAT Filings" : "Corporate Tax Filings";
  return <Card className="min-w-0 gap-4 rounded-xl border border-border-default bg-surface-primary p-4 shadow-none ring-0">
    <header className="flex flex-wrap items-center gap-3"><span className="rounded-lg bg-primary-50 p-2 text-primary"><FileText className="size-5" aria-hidden="true" /></span><div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-xs text-text-secondary">UAE {type === "VAT" ? "VAT" : "Corporate Tax"} return filings and payment tracking.</p></div><Button size="sm" className="ml-auto" onClick={() => setDialog({ action: "create" })}><Plus className="size-3.5" aria-hidden="true" />Add {type} Filing</Button></header>
    {query.isPending ? <p role="status" className="p-6 text-center text-sm text-text-muted">Loading filings...</p> : query.isError ? <ComplianceQueryError query={query} label={title.toLowerCase()} /> : <>
      <div className="max-w-full overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><caption className="sr-only">{title}</caption><thead className="bg-primary-50/50 text-text-secondary"><tr>{["#", "TRN Number", "Input (AED)", "Output (AED)", "Payable Tax (AED)", "Filing Date", "Due Date", "Status", "Actions"].map((label) => <th scope="col" key={label} className="whitespace-nowrap px-3 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{rows.slice(0, preview ? 5 : limit).map((filing, index) => <tr key={filing.id || filing._id} className="border-b border-border-default last:border-0">
        <td className="px-3 py-3">{(currentPage - 1) * limit + index + 1}</td>
        <td className="px-3 py-3 tabular-nums">{trn || "\u2014"}</td>
        {[filing.input, filing.output, filing.payableTax].map((amount, i) => <td key={i} className="whitespace-nowrap px-3 py-3 tabular-nums">{money(amount)}</td>)}
        <td className="whitespace-nowrap px-3 py-3">{formatComplianceDate(filing.filingDate)}</td><td className="whitespace-nowrap px-3 py-3">{formatComplianceDate(filing.nextDueDate)}</td>
        <td className="px-3 py-3"><span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium capitalize ${statusStyles[filing.status?.toLowerCase()] || statusStyles.draft}`}>{filing.status || "Unknown"}</span></td>
        <td className="px-3 py-3"><div className="flex gap-1"><Button variant="ghost" size="icon-sm" disabled={!filing.id && !filing._id} aria-label={`Edit ${type} filing ${index + 1}`} onClick={() => setDialog({ action: "update", filing })}><Pencil className="size-3.5" aria-hidden="true" /></Button><Button variant="ghost" size="icon-sm" className="text-destructive" disabled={!filing.id && !filing._id} aria-label={`Delete ${type} filing ${index + 1}`} onClick={() => setDialog({ action: "delete", filing })}><Trash2 className="size-3.5" aria-hidden="true" /></Button></div></td>
      </tr>)}</tbody></table>{!rows.length && <p className="p-8 text-center text-xs text-text-muted">No {type} filings found.</p>}</div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-3 text-xs text-text-secondary">
        <p>Showing {rows.length ? (currentPage - 1) * limit + 1 : 0}&ndash;{Math.min(currentPage * limit, total)} of {total} {type} filings</p>
        {preview ? <Button variant="outline" size="sm" onClick={onViewMore}>View More<span className="sr-only"> {type} filings</span><ArrowRight className="size-3.5" /></Button> : <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">Rows per page<select aria-label={`${type} rows per page`} className="rounded-md border border-border-default bg-surface-primary p-2" value={limit} onChange={(event) => onLimitChange(Number(event.target.value))}>{[5, 10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
          <Button variant="outline" size="icon-sm" aria-label={`Previous ${type} page`} disabled={page <= 1 || query.isFetching} onClick={() => onPageChange(page - 1)}><ChevronLeft className="size-4" /></Button>
          <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
          <Button variant="outline" size="icon-sm" aria-label={`Next ${type} page`} disabled={page >= totalPages || query.isFetching} onClick={() => onPageChange(page + 1)}><ChevronRight className="size-4" /></Button>
        </div>}
      </footer>
    </>}
    {dialog && (dialog.action === "delete" ? <DeleteFilingDialog type={type} filing={dialog.filing} onClose={closeDialog} /> : <FilingDialog clientId={clientId} client={client} type={type} filing={dialog.filing} onClose={closeDialog} />)}
  </Card>;
}
