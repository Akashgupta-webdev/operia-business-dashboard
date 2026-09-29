import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, Download, Eye, FileText, Plus, Search, SlidersHorizontal, Trash2, TriangleAlert } from "lucide-react";

import { Button, buttonVariants } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { DOCUMENT_TYPE_OPTIONS } from "@/features/clients/constants/client";
import { cn } from "@operio/ui/lib/utils";
import AddDocumentDialog from "./AddDocumentDialog";
import DeleteDocumentDialog from "./DeleteDocumentDialog";

const EXPIRING_SOON_DAYS = 30;

function parseDate(value) {
  if (!value) return null;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date) : "—";
}

function formatAddedDate(value) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date) : null;
}

function getDocumentStatus(expiryDate) {
  const expiry = parseDate(expiryDate);
  if (!expiry) return { label: "No expiry", detail: null, state: "no-expiry", className: "bg-neutral-100 text-neutral-600 dark:bg-neutral-700/40 dark:text-neutral-300", detailClassName: "text-text-muted" };

  const remainingDays = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
  if (remainingDays < 0) {
    const elapsedDays = Math.abs(remainingDays);
    return { label: "Expired", detail: `Expired ${elapsedDays} day${elapsedDays === 1 ? "" : "s"} ago`, state: "expired", className: "bg-danger-50 text-danger-700 dark:bg-danger-700/20 dark:text-danger-500", detailClassName: "text-danger-600" };
  }
  if (remainingDays <= EXPIRING_SOON_DAYS) return { label: "Expiring Soon", detail: `in ${remainingDays} day${remainingDays === 1 ? "" : "s"}`, state: "expiring", className: "bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-500", detailClassName: "text-warning-600" };
  return { label: "Valid", detail: `in ${remainingDays} days`, state: "valid", className: "bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-500", detailClassName: "text-text-muted" };
}

function SummaryCard({ icon: Icon, label, value, description, tone }) {
  const tones = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
    success: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500",
    danger: "bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500",
  };
  return (
    <Card size="sm" className="flex-row items-center gap-3 border border-border-default bg-surface-primary p-3 shadow-card ring-0">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tones[tone])}><Icon aria-hidden="true" className="size-4" /></span>
      <div className="min-w-0"><p className="text-[10px] leading-4 font-semibold text-text-muted">{label}</p><p className="truncate text-[9px] leading-4 text-text-muted">{description}</p></div>
      <p className="ml-auto text-body-sm font-bold text-text-primary" data-numeric>{value}</p>
    </Card>
  );
}

function DocumentActions({ document, onDelete }) {
  const title = document.documentTitle || "document";
  const documentId = document.id ?? document._id;
  return (
    <div className="flex items-center justify-end gap-1.5">
      {document.documentURL && <a href={document.documentURL} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "text-text-secondary hover:text-info-600")} aria-label={`View ${title}`} title={`View ${title}`}><Eye aria-hidden="true" className="size-3.5" /></a>}
      {document.documentURL && <a href={document.documentURL} download className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "text-primary-600")} aria-label={`Download ${title}`} title={`Download ${title}`}><Download aria-hidden="true" className="size-3.5" /></a>}
      {!document.service && <Button type="button" variant="outline" size="icon-sm" disabled={!documentId} onClick={() => onDelete(document)} title={documentId ? `Delete ${title}` : "Document ID is unavailable"} className="border-danger-200 text-danger-600 hover:bg-danger-50 hover:text-danger-700 dark:border-danger-700 dark:hover:bg-danger-700/20" aria-label={`Delete ${title}`}><Trash2 aria-hidden="true" className="size-3.5" /></Button>}{document.service && <span className="text-caption text-text-muted">Retained evidence</span>}
    </div>
  );
}

function EmptyDocuments({ hasDocuments }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <FileText aria-hidden="true" className="size-8 text-text-muted" />
      <h3 className="text-body-sm font-semibold text-text-primary">{hasDocuments ? "No matching documents" : "No documents uploaded yet"}</h3>
      <p className="text-caption text-text-muted">{hasDocuments ? "Try changing your search or document type filter." : "Uploaded client documents will appear here."}</p>
    </div>
  );
}

export default function DocumentsTab({ clientId, documents = [] }) {
  const [search, setSearch] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(null);
  const documentsWithStatus = useMemo(() => documents.map((document) => ({ document, status: getDocumentStatus(document.expiryDate) })), [documents]);
  const summary = useMemo(() => ({
    total: documents.length,
    valid: documentsWithStatus.filter(({ status }) => status.state === "valid").length,
    expiring: documentsWithStatus.filter(({ status }) => status.state === "expiring").length,
    expired: documentsWithStatus.filter(({ status }) => status.state === "expired").length,
  }), [documents, documentsWithStatus]);
  const filteredDocuments = useMemo(() => {
    const term = search.trim().toLowerCase();
    return documentsWithStatus.filter(({ document }) => {
      const type = document.documentType || "Other";
      return (documentType === "all" || type === documentType) && (!term || [document.documentTitle, type].some((value) => value?.toLowerCase().includes(term)));
    });
  }, [documentType, documentsWithStatus, search]);
  const hasActiveFilters = Boolean(search.trim()) || documentType !== "all";
  const clearFilters = () => { setSearch(""); setDocumentType("all"); };

  return (
    <Card className="gap-5 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 sm:p-5 sm:py-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><FileText aria-hidden="true" className="size-5" /></span>
          <div><h2 className="text-body-lg font-bold text-text-primary">Client Documents</h2><p className="mt-1 text-caption text-text-secondary">Manage and track all documents related to the client.</p></div>
        </div>
        <Button type="button" disabled={!clientId} onClick={() => setIsAddDocumentOpen(true)} title={clientId ? "Add document" : "Client ID is unavailable"} className="shrink-0 gap-2 px-4 sm:ml-auto"><Plus aria-hidden="true" className="size-4" />Add Document</Button>
      </header>

      <section aria-label="Document summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={FileText} label="Total Documents" value={summary.total} description="All documents" tone="primary" />
        <SummaryCard icon={CheckCircle2} label="Valid Documents" value={summary.valid} description="Currently valid" tone="success" />
        <SummaryCard icon={Clock3} label="Expiring Soon" value={summary.expiring} description={`Within ${EXPIRING_SOON_DAYS} days`} tone="warning" />
        <SummaryCard icon={TriangleAlert} label="Expired Documents" value={summary.expired} description="Expired" tone="danger" />
      </section>

      <section aria-label="Document controls" className="grid gap-3 lg:grid-cols-[minmax(15rem,1fr)_13rem_auto]">
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search documents..." aria-label="Search documents" className="h-10 border-border-default bg-surface-primary pl-9 shadow-none" />
        </div>
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger aria-label="Filter by document type" className="h-10 w-full border-border-default bg-surface-primary px-3"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Document Type: All</SelectItem>{DOCUMENT_TYPE_OPTIONS.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
        </Select>
        <Button type="button" variant="outline" size="icon-lg" disabled={!hasActiveFilters} onClick={clearFilters} aria-label="Clear document filters" title="Clear filters" className="size-10"><SlidersHorizontal aria-hidden="true" className="size-4" /></Button>
      </section>

      <section aria-label="Documents" className="overflow-hidden rounded-xl border border-border-default">
        {filteredDocuments.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left">
              <thead className="border-b border-border-default bg-surface-secondary text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                <tr><th className="px-5 py-3">Document</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Issue date</th><th className="px-4 py-3">Expiry date</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {filteredDocuments.map(({ document, status }, index) => {
                  const addedDate = formatAddedDate(document.createdAt ?? document.updatedAt);
                  return (
                    <tr key={document.id ?? document._id ?? `${document.documentTitle}-${index}`} className="transition-colors hover:bg-surface-secondary/50">
                      <td className="px-5 py-3"><div className="flex min-w-0 items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><FileText aria-hidden="true" className="size-4" /></span><div className="min-w-0"><p className="max-w-64 truncate text-caption font-semibold text-text-primary">{document.documentTitle || "Untitled document"}</p>{addedDate && <p className="mt-0.5 text-[10px] leading-4 text-text-muted">Added on {addedDate}</p>}</div></div></td>
                      <td className="px-4 py-3"><span className="inline-flex rounded-md bg-primary-50 px-2 py-1 text-[9px] font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{document.documentType || "Other"}</span></td>
                      <td className="px-4 py-3 text-caption text-text-secondary" data-numeric>{formatDate(document.issueDate)}</td>
                      <td className="px-4 py-3" data-numeric><p className="text-caption text-text-primary">{formatDate(document.expiryDate)}</p>{status.detail && <p className={cn("mt-0.5 text-[10px] leading-4", status.detailClassName)}>{status.detail}</p>}</td>
                      <td className="px-4 py-3"><span className={cn("inline-flex rounded-md px-2 py-1 text-[9px] font-semibold", status.className)}>{status.label}</span></td>
                      <td className="px-5 py-3"><DocumentActions document={document} onDelete={setDeletingDocument} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <EmptyDocuments hasDocuments={documents.length > 0} />}
      </section>

      <p className="text-caption text-text-secondary" data-numeric>Showing {filteredDocuments.length} of {documents.length} documents</p>
      <AddDocumentDialog clientId={clientId} open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen} />
      <DeleteDocumentDialog clientId={clientId} document={deletingDocument} open={Boolean(deletingDocument)} onOpenChange={(open) => { if (!open) setDeletingDocument(null); }} />
    </Card>
  );
}
