import { Building2, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const statusClasses = {
  Active: "bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-500",
  Inactive: "bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-500",
  Archived: "bg-danger-50 text-danger-700 dark:bg-danger-700/20 dark:text-danger-500",
  Draft: "bg-neutral-100 text-neutral-600 dark:bg-neutral-700/40 dark:text-neutral-300",
};
const avatarClasses = ["bg-primary-600", "bg-info-600", "bg-success-600", "bg-warning-600", "bg-danger-600", "bg-primary-800"];

function initials(name = "Company") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function avatarClass(name = "Company") {
  const code = name.trim().charAt(0).toUpperCase().charCodeAt(0);
  return avatarClasses[Math.max(0, code - 65) % avatarClasses.length];
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function CompanySummaryCard({ icon: Icon, label, value, description, tone }) {
  const tones = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
    success: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500",
    danger: "bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500",
  };
  return <Card size="sm" className="flex-row items-center gap-3 border border-border-default bg-surface-primary p-3 shadow-card ring-0"><span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tones[tone])}><Icon aria-hidden="true" className="size-4" /></span><div className="min-w-0"><p className="text-[10px] leading-4 font-semibold text-text-muted">{label}</p><p className="truncate text-[9px] leading-4 text-text-muted">{description}</p></div><p className="ml-auto text-body-sm font-bold text-text-primary" data-numeric>{value}</p></Card>;
}

export function CompanyCard({ company }) {
  const clientId = company.client;
  const name = company.companyName || "Unnamed company";
  const detailUrl = clientId ? `/clients/${encodeURIComponent(clientId)}?tab=companies` : null;

  return (
    <Card size="sm" className="min-w-0 gap-0 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3"><span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg text-caption font-bold text-neutral-0", avatarClass(name))}>{initials(name)}</span><span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[9px] font-semibold", statusClasses[company.clientStatus] ?? statusClasses.Draft)}><span aria-hidden="true" className="size-1.5 rounded-full bg-current" />{company.clientStatus || "Unknown"}</span></div>
      <h2 className="mt-3 line-clamp-2 text-caption font-semibold uppercase text-text-primary">{name}</h2>
      <div className="mt-2 space-y-1.5 text-[10px] leading-4 text-text-secondary"><p className="flex items-center gap-2"><UserRound aria-hidden="true" className="size-3.5 shrink-0 text-text-muted" /><span className="truncate">{company.clientName || "Owner not registered"}</span></p><p className="flex items-center gap-2"><Building2 aria-hidden="true" className="size-3.5 shrink-0 text-text-muted" /><span className="truncate">{company.nationality || "Nationality not registered"}</span></p></div>
      <div className="my-3 h-px bg-border-default" />
      <dl className="grid grid-cols-2 gap-3 text-[10px] leading-4 text-text-secondary"><div><dt className="text-text-muted">Trade licence</dt><dd className="mt-0.5 truncate font-semibold text-text-primary">{company.tradeLicenceNumber || "—"}</dd></div><div className="text-right"><dt className="text-text-muted">Added on</dt><dd className="mt-0.5 font-semibold text-text-primary" data-numeric>{formatDate(company.createdAt)}</dd></div></dl>
      <div className="mt-3 flex items-center border-t border-border-default pt-3">
        {detailUrl ? <Link to={detailUrl} className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "gap-1.5 px-0 text-[10px] font-semibold text-primary-700 hover:bg-transparent hover:text-primary-800")}><Eye aria-hidden="true" className="size-3.5" />View Details</Link> : <Button type="button" variant="ghost" size="xs" disabled className="gap-1.5 px-0"><Eye aria-hidden="true" className="size-3.5" />View Details</Button>}
        <Button type="button" variant="ghost" size="icon-xs" disabled title="Company edit is available from the client record" aria-label={`Edit ${name}`} className="ml-auto opacity-100"><Pencil aria-hidden="true" className="size-3" /></Button>
        <Button type="button" variant="ghost" size="icon-xs" disabled title="Delete company API is not configured" aria-label={`Delete ${name}`} className="text-danger-600 opacity-100"><Trash2 aria-hidden="true" className="size-3" /></Button>
      </div>
    </Card>
  );
}

export function CompanyGridSkeleton() {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-60 rounded-xl" />)}</div>;
}

export function CompanyPagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => {
    const start = Math.min(Math.max(1, page - 2), Math.max(1, pageCount - 4));
    return start + index;
  });
  return <nav aria-label="Company pagination" className="flex items-center gap-2"><Button type="button" variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous company page"><ChevronLeft aria-hidden="true" className="size-3.5" /></Button>{pages.map((pageNumber) => <Button key={pageNumber} type="button" variant={pageNumber === page ? "default" : "outline"} size="icon-sm" onClick={() => onPageChange(pageNumber)} aria-current={pageNumber === page ? "page" : undefined}>{pageNumber}</Button>)}<Button type="button" variant="outline" size="icon-sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next company page"><ChevronRight aria-hidden="true" className="size-3.5" /></Button></nav>;
}
