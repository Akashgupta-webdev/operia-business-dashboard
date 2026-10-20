import { useState } from "react";
import { AlarmClock, ArrowRight, ArrowUpDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Input } from "@operio/ui/components/input";
import { Skeleton } from "@operio/ui/components/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@operio/ui/components/table";
import { cn } from "@operio/ui/lib/utils";
import useClientRenewals from "@/features/renewals/hooks/useClientRenewals";
import RenewalPagination from "@/features/renewals/components/RenewalPagination";
import { getRenewalCategory, getRenewalClientUrl, getRenewalStatus } from "@/features/renewals/utils/renewals";
import { RENEWAL_TONES } from "@/features/renewals/constants/renewals";

const DASHBOARD_PAGE_SIZE = 10;

const ranges = [
  { label: "All", value: "all", matches: () => true },
  { label: "\u2264 7 Days", value: "week", matches: (days) => days !== null && days >= 0 && days <= 7 },
  { label: "8–30 Days", value: "month", matches: (days) => days >= 8 && days <= 30 },
  { label: "31–60 Days", value: "later", matches: (days) => days >= 31 && days <= 60 },
];

export default function DashboardRenewals() {
  const [page, setPage] = useState(1);
  const [range, setRange] = useState("all");
  const [search, setSearch] = useState("");
  const [ascending, setAscending] = useState(true);
  const query = useClientRenewals(page, DASHBOARD_PAGE_SIZE);
  const items = (query.data?.data ?? []).map((item) => ({ ...item, status: getRenewalStatus(item.expiryDate) }));
  const pageInfo = query.data?.page;
  const term = search.trim().toLowerCase();
  const matchingItems = items.filter((item) => [item.clientName, item.entity, item.item, getRenewalCategory(item.category)].some((value) => String(value ?? "").toLowerCase().includes(term)));
  const visibleItems = matchingItems.filter((item) => ranges.find((entry) => entry.value === range).matches(item.status.days)).sort((a, b) => {
    if (a.status.days === null) return b.status.days === null ? 0 : 1;
    if (b.status.days === null) return -1;
    return (a.status.days - b.status.days) * (ascending ? 1 : -1);
  });

  return <Card aria-busy={query.isFetching} className="min-w-0 gap-4 border border-border-default/60 bg-surface-primary p-4 shadow-none ring-0">
    <header className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-sm font-bold text-text-primary"><AlarmClock aria-hidden="true" className="size-5 text-danger-500" />Renewals Requiring Attention</h2><Link to="/renewals" className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary-700 hover:underline">View All <ArrowRight aria-hidden="true" className="size-3" /></Link></header>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2" aria-label="Renewal date filters">{ranges.map((entry) => <Button key={entry.value} size="sm" variant={range === entry.value ? "default" : "outline"} aria-pressed={range === entry.value} onClick={() => setRange(entry.value)} style={{ borderRadius: 6 }} className={cn("h-9 border px-3 text-xs font-medium shadow-none", range === entry.value ? "border-primary-700 bg-primary-700 text-white hover:bg-primary-800" : "border-border-default bg-surface-primary text-text-secondary hover:bg-surface-secondary")}>{entry.label} ({matchingItems.filter((item) => entry.matches(item.status.days)).length})</Button>)}</div>
      <div className="relative w-full sm:ml-auto sm:w-72"><Search aria-hidden="true" className="absolute top-2.5 left-2.5 size-4 text-text-muted" /><Input aria-label="Search renewals by client or type" placeholder="Search client or type..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ borderRadius: 6 }} className="h-9 w-full border-border-default pl-9 text-xs" /></div>
    </div>
    {query.isError ? <div role="alert" className="py-12 text-center text-sm text-text-secondary"><p>Unable to load renewals.</p><Button className="mt-3" variant="outline" onClick={() => query.refetch()}>Try again</Button></div> : <Table className="text-[11px]">
      <caption className="sr-only">Renewals on the current page, sorted by expiry date</caption>
      <TableHeader className="bg-surface-secondary"><TableRow>{["#", "Client Name", "Module"].map((label) => <TableHead key={label} className="text-[10px]">{label}</TableHead>)}<TableHead aria-sort={ascending ? "ascending" : "descending"}><button onClick={() => setAscending(!ascending)} className="flex items-center gap-1 text-[10px]">Expiry Date <ArrowUpDown aria-hidden="true" className="size-3" /></button></TableHead>{["Days Left", "Status", "Action"].map((label) => <TableHead key={label} className="text-[10px]">{label}</TableHead>)}</TableRow></TableHeader>
      <TableBody>
        {query.isPending ? Array.from({ length: DASHBOARD_PAGE_SIZE }, (_, index) => <TableRow key={index}>{Array.from({ length: 7 }, (_, cell) => <TableCell key={cell}><Skeleton className="h-5 w-full min-w-6" /></TableCell>)}</TableRow>) : visibleItems.length ? visibleItems.slice(0, DASHBOARD_PAGE_SIZE).map((item, index) => {
          const { days } = item.status;
          const tone = days === null ? "neutral" : days <= 7 ? "danger" : days <= 60 ? "warning" : "success";
          const label = days === null ? "Unknown" : days < 0 ? "Expired" : days <= 7 ? "Urgent" : days <= 30 ? "Due Soon" : days <= 60 ? "Upcoming" : "Valid";
          const url = getRenewalClientUrl(item);
          const name = item.clientName || item.entity || "Client unavailable";
          return <TableRow key={item.id ?? item.recordId} className="[&>td]:py-3"><TableCell className="text-text-muted">{index + 1 + ((pageInfo?.page ?? page) - 1) * (pageInfo?.limit ?? DASHBOARD_PAGE_SIZE)}</TableCell><TableCell><div className="flex items-center gap-2"><span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-semibold text-primary-600">{name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("")}</span><span className="max-w-44 truncate" title={name}>{name}</span></div></TableCell><TableCell>{getRenewalCategory(item.category) || "—"}</TableCell><TableCell>{item.expiryDate || "—"}</TableCell><TableCell><span className={cn("rounded px-2 py-1 font-medium", RENEWAL_TONES[tone])}>{days === null ? "—" : days < 0 ? `${Math.abs(days)}d overdue` : `${days} Days`}</span></TableCell><TableCell><span className={cn("rounded px-2 py-1 font-medium", RENEWAL_TONES[tone])}>{label}</span></TableCell><TableCell>{url ? <Link to={url} className="rounded bg-primary-50 px-2 py-1 font-semibold text-primary-700 hover:underline" aria-label={`View ${name}`}>View</Link> : <span className="text-text-muted">—</span>}</TableCell></TableRow>;
        }) : <TableRow><TableCell colSpan={7} className="h-52 text-center text-text-muted">{items.length ? "No matching renewals on this page." : "No renewals found."}</TableCell></TableRow>}
      </TableBody>
    </Table>}
    {pageInfo && <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-3"><p className="text-[10px] text-text-muted">Search, counts and filters apply to this page · {pageInfo.total} total records</p><RenewalPagination page={pageInfo.page} totalPages={pageInfo.totalPages} disabled={query.isFetching} onPageChange={setPage} /></footer>}
  </Card>;
}
