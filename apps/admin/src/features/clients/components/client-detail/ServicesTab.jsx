import { Link } from "react-router-dom";
import { isVat, money } from "@/features/vat/utils/vat";
import { useVatAccess } from "@/features/vat/hooks/useVat";
import { useMemo, useState } from "react";
import { Archive, BriefcaseBusiness, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, CreditCard, FileText, FolderOpen, LayoutGrid, List, Pencil, Plus, Search, Trash2, WalletCards } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { cn } from "@operio/ui/lib/utils";
import AddServiceDialog from "./AddServiceDialog";
import DeleteServiceDialog from "./DeleteServiceDialog";
import EditServiceDialog from "./EditServiceDialog";

const PAGE_SIZE = 9;

const serviceStatusClasses = {
  "In Progress": "bg-info-50 text-info-700 dark:bg-info-700/20 dark:text-info-500",
  Pending: "bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-500",
  Completed: "bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-500",
  Cancelled: "bg-danger-50 text-danger-700 dark:bg-danger-700/20 dark:text-danger-500",
};

const paymentStatusClasses = {
  Paid: "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-700/20 dark:text-success-500",
  Completed: "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-700/20 dark:text-success-500",
  Partial: "border-warning-200 bg-warning-50 text-warning-700 dark:border-warning-700 dark:bg-warning-700/20 dark:text-warning-500",
  "Partially Paid": "border-warning-200 bg-warning-50 text-warning-700 dark:border-warning-700 dark:bg-warning-700/20 dark:text-warning-500",
  "In Progress": "border-info-200 bg-info-50 text-info-700 dark:border-info-700 dark:bg-info-700/20 dark:text-info-500",
  Unpaid: "border-border-default bg-surface-secondary text-text-secondary",
};

function formatDate(value) {
  if (!value) return "—";
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB").format(date).replaceAll("/", "-");
}

function dateValue(value, fallback = 0) {
  if (!value) return fallback;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  }
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? fallback : timestamp;
}

function formatPrice(value) {
  const amount = value?.$numberDecimal ?? value;
  if (amount === undefined || amount === null || amount === "") return "Price not set";
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return "Price not set";
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(numericAmount);
}

function serviceNotes(service) {
  if (Array.isArray(service.notes)) return service.notes.filter(Boolean).join(" · ");
  return service.notes || "No service notes have been added.";
}

function Metric({ icon: Icon, label, value, tone }) {
  const tones = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
    success: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500",
    info: "bg-info-50 text-info-600 dark:bg-info-700/20 dark:text-info-500",
  };

  return (
    <Card size="sm" className="flex-row items-center gap-3 border border-border-default bg-surface-primary p-3 shadow-card ring-0">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tones[tone])}><Icon aria-hidden="true" className="size-4" /></span>
      <p className="min-w-0 text-[10px] leading-4 font-semibold text-text-muted">{label}</p>
      <p className="ml-auto text-body-sm font-bold text-text-primary" data-numeric>{value}</p>
    </Card>
  );
}

function ServiceCard({ service, listView, onDelete, onEdit }) {
  const vatAccess = useVatAccess();
  const paymentStatus = service.paymentStatus || (isVat(service) ? "Not recorded" : "Unpaid");
  const serviceId = service.id ?? service._id;
  const detailRows = [
    {
      icon: Clock3,
      iconClassName: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500",
      label: "Status",
      value: (
        <span className={cn("inline-flex max-w-full rounded-md px-2 py-0.5 text-[9px] font-semibold", serviceStatusClasses[service.status] ?? "bg-surface-secondary text-text-secondary")}>
          {service.status || "Unknown"}
        </span>
      ),
    },
    {
      icon: CalendarDays,
      iconClassName: "bg-info-50 text-info-600 dark:bg-info-700/20 dark:text-info-500",
      label: "Target Date",
      value: <span data-numeric>{formatDate(service.targetCompletionDate)}</span>,
    },
    {
      icon: WalletCards,
      iconClassName: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500",
      label: "Package Price",
      value: <span data-numeric>{isVat(service) ? money(service.packagePrice) : formatPrice(service.packagePrice)}</span>,
    },
    {
      icon: CreditCard,
      iconClassName: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
      label: "Payment Status",
      value: (
        <span className={cn("inline-flex max-w-full rounded-md border px-2 py-0.5 text-[9px] font-semibold", paymentStatusClasses[paymentStatus] ?? paymentStatusClasses.Unpaid)}>
          {paymentStatus}
        </span>
      ),
    },
  ];

  return (
    <Card size="sm" className={cn("gap-0 overflow-hidden border border-border-default bg-surface-primary p-3 py-3 shadow-card ring-0", listView && "mx-auto w-full max-w-5xl")}>
      <div className="flex min-w-0 items-start gap-3 border-b border-border-default px-1 pb-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><BriefcaseBusiness aria-hidden="true" className="size-4" /></span>
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-caption font-semibold leading-4 text-text-primary">{service.package || "Custom client service"}</h3>
          <span className="mt-1 inline-flex max-w-full rounded-md bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{service.category || "General service"}</span>
        </div>
      </div>

      <dl>
        {detailRows.map(({ icon: Icon, iconClassName, label, value }) => (
          <div key={label} className="grid grid-cols-[2rem_minmax(0,0.9fr)_0.5rem_minmax(0,1.1fr)] items-center gap-x-2 border-b border-border-default py-2.5">
            <span className={cn("flex size-8 items-center justify-center rounded-lg", iconClassName)}><Icon aria-hidden="true" className="size-3.5" /></span>
            <dt className="truncate text-[9px] leading-4 font-medium text-text-secondary">{label}</dt>
            <span aria-hidden="true" className="text-[9px] text-text-secondary">:</span>
            <dd className="min-w-0 overflow-hidden text-[9px] leading-4 font-semibold text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-start gap-2 rounded-lg border border-border-default bg-surface-secondary/30 p-3">
        <FileText aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-text-secondary" />
        <p className="text-[10px] leading-4 text-text-secondary">{serviceNotes(service)}</p>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        {isVat(service) ? (vatAccess.allowed ? <Link to={`/vat-filings/${serviceId}`} className="text-primary underline text-sm">Open VAT filing</Link> : <span className="text-caption">VAT workflow requires an active Admin</span>) : <>
        <Button type="button" variant="outline" size="icon-sm" disabled={!serviceId} onClick={() => onEdit(service)} aria-label={`Edit ${service.package || "service"}`} title={serviceId ? `Edit ${service.package || "service"}` : "Service ID is unavailable"}><Pencil aria-hidden="true" className="size-3.5" /></Button>
        <Button type="button" variant="outline" size="icon-sm" disabled={!serviceId} onClick={() => onDelete(service)} aria-label={`Delete ${service.package || "service"}`} title={serviceId ? `Delete ${service.package || "service"}` : "Service ID is unavailable"} className="border-danger-200 text-danger-600 hover:bg-danger-50 hover:text-danger-700 dark:border-danger-700 dark:hover:bg-danger-700/20"><Trash2 aria-hidden="true" className="size-3.5" /></Button></>}
      </div>
    </Card>
  );
}

export default function ServicesTab({ clientId, services = [] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [editingService, setEditingService] = useState(null);
  const [deletingService, setDeletingService] = useState(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  const metrics = useMemo(() => ({
    total: services.length,
    active: services.filter((service) => !["Completed", "Cancelled"].includes(service.status)).length,
    pending: services.filter((service) => service.status === "Pending").length,
    completed: services.filter((service) => service.status === "Completed").length,
  }), [services]);

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    return services
      .filter((service) => status === "all" || service.status === status)
      .filter((service) => !term || [service.package, service.category, service.status, serviceNotes(service)].some((value) => value?.toLowerCase().includes(term)))
      .sort((a, b) => {
        if (sort === "oldest") return dateValue(a.createdAt) - dateValue(b.createdAt);
        if (sort === "target") return dateValue(a.targetCompletionDate, Number.MAX_SAFE_INTEGER) - dateValue(b.targetCompletionDate, Number.MAX_SAFE_INTEGER);
        return dateValue(b.createdAt) - dateValue(a.createdAt);
      });
  }, [search, services, sort, status]);

  const pageCount = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleServices = filteredServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstResult = filteredServices.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastResult = Math.min(currentPage * PAGE_SIZE, filteredServices.length);

  return (
    <Card className="gap-5 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 sm:p-5 sm:py-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><BriefcaseBusiness aria-hidden="true" className="size-5" /></span><div><h2 className="text-body-lg font-bold text-text-primary">Client Services &amp; Operational Packages</h2><p className="mt-1 text-caption text-text-secondary">Manage all service packages and operational setups for this client.</p></div></div>
        <Button type="button" disabled={!clientId} onClick={() => setIsAddServiceOpen(true)} title={clientId ? "Add package or service" : "Client ID is unavailable"} className="shrink-0 gap-2 px-4 sm:ml-auto"><Plus aria-hidden="true" className="size-4" />Add Package / Service</Button>
      </header>

      <section aria-label="Service summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={FolderOpen} label="Total Packages" value={metrics.total} tone="primary" />
        <Metric icon={CheckCircle2} label="Active Packages" value={metrics.active} tone="success" />
        <Metric icon={Clock3} label="Pending Packages" value={metrics.pending} tone="warning" />
        <Metric icon={Archive} label="Completed Packages" value={metrics.completed} tone="info" />
      </section>

      <section aria-label="Service controls" className="grid gap-3 rounded-xl border border-border-default bg-surface-primary p-3 lg:grid-cols-[minmax(15rem,1fr)_12rem_13rem_auto]">
        <div className="relative"><Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" /><Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search packages or services..." aria-label="Search packages or services" className="h-10 border-border-default bg-surface-primary pl-9 shadow-none" /></div>
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}><SelectTrigger aria-label="Filter services by status" className="h-10 w-full border-border-default bg-surface-primary px-3"><SelectValue /></SelectTrigger><SelectContent>{["all", "In Progress", "Pending", "Completed", "Cancelled"].map((value) => <SelectItem key={value} value={value}>{value === "all" ? "Status: All" : value}</SelectItem>)}</SelectContent></Select>
        <Select value={sort} onValueChange={(value) => { setSort(value); setPage(1); }}><SelectTrigger aria-label="Sort services" className="h-10 w-full border-border-default bg-surface-primary px-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Sort: Newest First</SelectItem><SelectItem value="oldest">Sort: Oldest First</SelectItem><SelectItem value="target">Sort: Target Date</SelectItem></SelectContent></Select>
        <div className="grid grid-cols-2 rounded-lg border border-border-default p-0.5"><Button type="button" variant="ghost" size="icon" onClick={() => setView("grid")} aria-pressed={view === "grid"} aria-label="Grid view" className={cn("size-9", view === "grid" && "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300")}><LayoutGrid aria-hidden="true" /></Button><Button type="button" variant="ghost" size="icon" onClick={() => setView("list")} aria-pressed={view === "list"} aria-label="List view" className={cn("size-9", view === "list" && "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300")}><List aria-hidden="true" /></Button></div>
      </section>

      {visibleServices.length ? <div className={cn("grid gap-4", view === "grid" ? "md:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1")}>{visibleServices.map((service) => <ServiceCard key={service.id ?? service._id} service={service} listView={view === "list"} onEdit={setEditingService} onDelete={setDeletingService} />)}</div> : <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-default bg-surface-secondary/30 px-6 py-12 text-center"><BriefcaseBusiness aria-hidden="true" className="size-8 text-text-muted" /><h3 className="text-body-sm font-semibold text-text-primary">{services.length ? "No matching services" : "No services assigned"}</h3><p className="text-caption text-text-muted">{services.length ? "Try changing your search or status filter." : "Add a package or operational service to this client."}</p></div>}

      <footer className="flex flex-col gap-3 rounded-xl border border-border-default px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-caption text-text-secondary" data-numeric>Showing {firstResult} to {lastResult} of {filteredServices.length} packages</p><div className="flex items-center gap-2"><Button type="button" variant="outline" size="icon-sm" onClick={() => setPage((current) => current - 1)} disabled={currentPage === 1} aria-label="Previous page"><ChevronLeft aria-hidden="true" /></Button><span className="flex h-7 min-w-7 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 px-2 text-caption font-semibold text-primary-700" aria-current="page" data-numeric>{currentPage}</span><span className="text-caption text-text-muted" data-numeric>of {pageCount}</span><Button type="button" variant="outline" size="icon-sm" onClick={() => setPage((current) => current + 1)} disabled={currentPage === pageCount} aria-label="Next page"><ChevronRight aria-hidden="true" /></Button></div></footer>
      <EditServiceDialog clientId={clientId} service={editingService} open={Boolean(editingService)} onOpenChange={(open) => { if (!open) setEditingService(null); }} />
      <DeleteServiceDialog clientId={clientId} service={deletingService} open={Boolean(deletingService)} onOpenChange={(open) => { if (!open) setDeletingService(null); }} />
      <AddServiceDialog clientId={clientId} open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen} />
    </Card>
  );
}
