import { useMemo, useState } from "react";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Eye,
  FileBadge,
  FileText,
  Plane,
  Search,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@operio/ui/components/dropdown-menu";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { cn } from "@operio/ui/lib/utils";
import { getClientRenewalItems, parseClientDate } from "@/features/clients/utils/clientRenewals";
import RenewalUpdateDialog from "./RenewalUpdateDialog";

const categoryClasses = {
  "E-Visa": "border-info-200 bg-info-50 text-info-700 dark:border-info-700 dark:bg-info-700/20 dark:text-info-500",
  "Vehicle Registration": "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-700/20 dark:text-success-500",
  "Vehicle Insurance": "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-700/20 dark:text-success-500",
  "Trade Licence": "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  "Driving Licence": "border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-700/40 dark:text-neutral-300",
  "Emirates ID": "border-info-200 bg-info-50 text-info-700 dark:border-info-700 dark:bg-info-700/20 dark:text-info-500",
  "Health Insurance": "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-700/20 dark:text-success-500",
  Passport: "border-warning-200 bg-warning-50 text-warning-700 dark:border-warning-700 dark:bg-warning-700/20 dark:text-warning-500",
};

const categoryIcons = {
  "E-Visa": Plane,
  "Vehicle Registration": FileBadge,
  "Vehicle Insurance": ShieldCheck,
  "Trade Licence": FileText,
  "Driving Licence": FileBadge,
  "Emirates ID": FileBadge,
  "Health Insurance": ShieldCheck,
  Passport: FileText,
};

function formatDate(value) {
  const date = parseClientDate(value);
  return date ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date) : "—";
}

function getRenewalStatus(value) {
  const expiry = parseClientDate(value);
  if (!expiry) return { label: "Unknown", state: "unknown", days: null, className: "bg-neutral-100 text-neutral-600 dark:bg-neutral-700/40 dark:text-neutral-300" };
  const days = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
  if (days < 0) return { label: "Expired", state: "expired", days, className: "bg-danger-50 text-danger-700 dark:bg-danger-700/20 dark:text-danger-500" };
  if (days <= 30) return { label: "Due Soon", state: "due-soon", days, className: "bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-500" };
  if (days <= 60) return { label: "Due Later", state: "due-later", days, className: "bg-info-50 text-info-700 dark:bg-info-700/20 dark:text-info-500" };
  return { label: "Valid", state: "valid", days, className: "bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-500" };
}

function SummaryCard({ icon: Icon, label, value, description, tone }) {
  const tones = {
    danger: "bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500",
    success: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500",
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
  };

  return (
    <Card size="sm" className="flex-row items-center gap-3 border border-border-default bg-surface-primary p-3 shadow-card ring-0">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tones[tone])}><Icon aria-hidden="true" className="size-4" /></span>
      <div className="min-w-0"><p className="text-[10px] leading-4 font-semibold text-text-muted">{label}</p><p className="truncate text-[9px] leading-4 text-text-muted">{description}</p></div>
      <p className="ml-auto text-body-sm font-bold text-text-primary" data-numeric>{value}</p>
    </Card>
  );
}

function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function exportRenewals(items, filename) {
  const rows = [
    ["Item / Licence / Document", "Category", "Entity / Holder", "Company / Entity", "Expiry Date", "Status"],
    ...items.map(({ item, category, holder, entity, expiryDate, status }) => [item, category, holder, entity, formatDate(expiryDate), status.label]),
  ];
  const blob = new Blob([rows.map((row) => row.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function RenewalEmptyState({ hasItems }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <CalendarClock aria-hidden="true" className="size-8 text-text-muted" />
      <h3 className="text-body-sm font-semibold text-text-primary">{hasItems ? "No matching renewals" : "No renewal dates registered"}</h3>
      <p className="text-caption text-text-muted">{hasItems ? "Try changing your search or filters." : "Expiry-based records will appear here automatically."}</p>
    </div>
  );
}

export default function RenewalsTab({ data }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedRenewal, setSelectedRenewal] = useState(null);
  const renewalItems = useMemo(() => getClientRenewalItems(data).map((item) => ({ ...item, status: getRenewalStatus(item.expiryDate) })), [data]);
  const categories = useMemo(() => [...new Set(renewalItems.map((item) => item.category))].sort(), [renewalItems]);
  const summary = useMemo(() => ({
    dueSoon: renewalItems.filter(({ status }) => status.state === "due-soon").length,
    dueLater: renewalItems.filter(({ status }) => status.state === "due-later").length,
    valid: renewalItems.filter(({ status }) => status.state === "valid").length,
    total: renewalItems.length,
  }), [renewalItems]);
  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return renewalItems.filter((item) => {
      const matchesSearch = !term || [item.item, item.category, item.holder, item.entity].some((value) => value?.toLowerCase().includes(term));
      return matchesSearch && (statusFilter === "all" || item.status.state === statusFilter) && (categoryFilter === "all" || item.category === categoryFilter);
    });
  }, [categoryFilter, renewalItems, search, statusFilter]);
  const hasActiveFilters = Boolean(search.trim()) || statusFilter !== "all" || categoryFilter !== "all";

  return (
    <Card className="gap-5 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 sm:p-5 sm:py-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><CalendarClock aria-hidden="true" className="size-5" /></span>
          <div><h2 className="text-body-lg font-bold text-text-primary">Renewals</h2><p className="mt-1 text-caption text-text-secondary">Track and manage upcoming document and licence renewals.</p></div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button type="button" variant="outline" disabled={!renewalItems.length} className="shrink-0 gap-2 px-4 sm:ml-auto" />}>
            <Download aria-hidden="true" className="size-3.5" />Export<ChevronDown aria-hidden="true" className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem onClick={() => exportRenewals(renewalItems, "client-renewals.csv")}><Download aria-hidden="true" />Export all items</DropdownMenuItem>
            <DropdownMenuItem disabled={!filteredItems.length || !hasActiveFilters} onClick={() => exportRenewals(filteredItems, "filtered-client-renewals.csv")}><Download aria-hidden="true" />Export filtered items</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <section aria-label="Renewal summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Clock3} label="Due Soon" value={summary.dueSoon} description="Within 30 days" tone="danger" />
        <SummaryCard icon={CalendarDays} label="Due Later" value={summary.dueLater} description="31–60 days" tone="warning" />
        <SummaryCard icon={CheckCircle2} label="Valid" value={summary.valid} description="More than 60 days" tone="success" />
        <SummaryCard icon={FileText} label="Total Items" value={summary.total} description="All renewal items" tone="primary" />
      </section>

      <section aria-label="Renewal controls" className="grid items-center gap-3 lg:grid-cols-[minmax(15rem,1fr)_12rem_12rem]">
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by item, entity or holder..." aria-label="Search renewals" className="h-10 border-border-default bg-surface-primary pl-9 shadow-none" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger aria-label="Filter renewals by status" className="h-10 w-full border-border-default bg-surface-primary px-3"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Status: All</SelectItem><SelectItem value="expired">Expired</SelectItem><SelectItem value="due-soon">Due Soon</SelectItem><SelectItem value="due-later">Due Later</SelectItem><SelectItem value="valid">Valid</SelectItem></SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger aria-label="Filter renewals by category" className="h-10 w-full border-border-default bg-surface-primary px-3"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Category: All</SelectItem>{categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent>
        </Select>
      </section>

      <section aria-label="Renewal items" className="overflow-hidden rounded-xl border border-border-default">
        {filteredItems.length ? (
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-230 text-left">
              <thead className="border-b border-border-default bg-surface-secondary text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                <tr><th className="px-5 py-3">Item / Licence / Document</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Entity / Holder</th><th className="px-4 py-3">Expiry date</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {filteredItems.map((item) => {
                  const CategoryIcon = categoryIcons[item.category] ?? FileText;
                  const urgent = ["expired", "due-soon"].includes(item.status.state);
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-surface-secondary/50">
                      <td className="px-5 py-3"><div className="flex min-w-0 items-center gap-3"><span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border", categoryClasses[item.category] ?? "border-neutral-300 bg-neutral-100 text-neutral-700")}><CategoryIcon aria-hidden="true" className="size-3.5" /></span><p className="max-w-72 text-caption font-semibold text-text-primary">{item.item}</p></div></td>
                      <td className="px-4 py-3"><span className={cn("inline-flex rounded-md border px-2 py-1 text-[9px] font-semibold", categoryClasses[item.category] ?? "border-neutral-300 bg-neutral-100 text-neutral-700")}>{item.category}</span></td>
                      <td className="px-4 py-3"><p className="text-caption text-text-secondary">{item.holder || "—"}</p>{item.entity && item.entity !== item.holder && <p className="mt-0.5 max-w-56 truncate text-[10px] leading-4 text-text-muted">{item.entity}</p>}</td>
                      <td className="px-4 py-3" data-numeric><p className={cn("text-[11px] leading-4 font-semibold", urgent ? "text-danger-600" : "text-text-primary")}>{formatDate(item.expiryDate)}</p>{item.status.days !== null && <p className={cn("mt-0.5 text-[8px] leading-3 font-semibold uppercase", urgent ? "text-danger-600" : item.status.state === "due-later" ? "text-warning-600" : "text-text-muted")}>{item.status.days < 0 ? `${Math.abs(item.status.days)} days overdue` : `in ${item.status.days} days`}</p>}</td>
                      <td className="px-4 py-3"><span className={cn("inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[9px] font-semibold", item.status.className)}>{item.status.label}</span></td>
                      <td className="px-5 py-3 text-right"><Button type="button" variant="outline" size="xs" onClick={() => setSelectedRenewal(item)} className="gap-1 border-primary-200 bg-primary-50 px-2 text-[9px] text-primary-700 dark:border-primary-700 dark:bg-primary-900/40 dark:text-primary-300"><Eye aria-hidden="true" className="size-3" />View &amp; Update</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <RenewalEmptyState hasItems={renewalItems.length > 0} />}
      </section>

      <p className="text-caption text-text-secondary" data-numeric>Showing {filteredItems.length} of {renewalItems.length} renewal items</p>
      <RenewalUpdateDialog clientId={data?.client?.id ?? data?.client?._id} renewal={selectedRenewal} open={Boolean(selectedRenewal)} onOpenChange={(open) => { if (!open) setSelectedRenewal(null); }} />
    </Card>
  );
}
