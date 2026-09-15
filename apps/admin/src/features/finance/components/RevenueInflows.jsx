import { useMemo, useState } from "react";
import { AlertCircle, Box, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleDollarSign, Search } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { Skeleton } from "@operio/ui/components/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@operio/ui/components/table";
import useRevenueInflows from "@/features/finance/hooks/useRevenueInflows";
import { cn } from "@operio/ui/lib/utils";

const PAYMENT_FILTERS = ["All", "Paid", "Partial", "Unpaid"];

const paymentClasses = {
  Paid: "border-success-100 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-700/20 dark:text-success-500",
  Partial: "border-warning-100 bg-warning-50 text-warning-700 dark:border-warning-700 dark:bg-warning-700/20 dark:text-warning-500",
  Unpaid: "border-danger-100 bg-danger-50 text-danger-700 dark:border-danger-700 dark:bg-danger-700/20 dark:text-danger-500",
};

const serviceClasses = {
  Completed: "bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-500",
  "In Progress": "bg-info-50 text-info-700 dark:bg-info-700/20 dark:text-info-500",
  Pending: "bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-500",
  Cancelled: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
};

function money(value) {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return `AED ${new Intl.NumberFormat("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
}

function RevenueStatus({ status, type }) {
  if (!status) return <span className="text-text-muted">—</span>;
  const classes = type === "payment" ? paymentClasses[status] : serviceClasses[status];
  return <span className={cn("inline-flex rounded-md border border-transparent px-2 py-1 text-[10px] font-semibold", classes)}>{status}</span>;
}

function PaginationButton({ label, disabled, onClick, children }) {
  return <Button type="button" variant="outline" size="icon" aria-label={label} disabled={disabled} onClick={onClick} className="size-9 bg-surface-primary shadow-none">{children}</Button>;
}

function RevenueInflowsSkeleton() {
  return <Card className="gap-0 border border-border-default bg-surface-primary p-0 py-0 shadow-card ring-0"><div className="flex gap-3 border-b border-border-default p-4"><Skeleton className="h-9 w-60" /><Skeleton className="ml-auto h-9 w-80" /></div><Skeleton className="m-4 h-72 rounded-lg" /></Card>;
}

export default function RevenueInflows() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [search, setSearch] = useState("");
  const query = useRevenueInflows({ page, limit });
  const rows = useMemo(() => query.data?.data ?? [], [query.data?.data]);
  const pageInfo = query.data?.page ?? { page, limit, total: 0, totalPages: 0 };

  const counts = useMemo(() => PAYMENT_FILTERS.reduce((result, status) => ({
    ...result,
    [status]: status === "All" ? rows.length : rows.filter((row) => row.paymentStatus === status).length,
  }), {}), [rows]);

  const filteredRows = useMemo(() => {
    const queryText = search.trim().toLocaleLowerCase();
    return rows.filter((row) => {
      const matchesPayment = paymentFilter === "All" || row.paymentStatus === paymentFilter;
      const matchesSearch = !queryText || [row.servicePackage, row.serviceCategory, row.clientName]
        .some((value) => value?.toLocaleLowerCase().includes(queryText));
      return matchesPayment && matchesSearch;
    });
  }, [paymentFilter, rows, search]);

  const firstEntry = pageInfo.total === 0 ? 0 : ((pageInfo.page - 1) * pageInfo.limit) + 1;
  const lastEntry = pageInfo.total === 0 ? 0 : Math.min(pageInfo.page * pageInfo.limit, pageInfo.total);

  if (query.isPending) return <RevenueInflowsSkeleton />;

  if (query.isError && !query.data) {
    return <Card role="alert" className="items-center gap-3 border border-danger-100 bg-danger-50 px-6 py-12 text-center ring-0"><AlertCircle aria-hidden="true" className="size-8 text-danger-600" /><h2 className="text-body-lg font-semibold text-danger-700">Unable to load revenue inflows</h2><p className="text-caption text-text-secondary">{query.error?.response?.data?.error?.message ?? "The revenue inflow request could not be completed."}</p><Button type="button" variant="outline" onClick={() => query.refetch()}>Try again</Button></Card>;
  }

  return (
    <Card className="gap-0 border border-border-default bg-surface-primary p-0 py-0 shadow-card ring-0">
      {query.isError && <div role="alert" className="m-4 mb-0 flex items-center gap-2 rounded-lg border border-warning-100 bg-warning-50 px-3 py-2 text-caption text-warning-700"><AlertCircle aria-hidden="true" className="size-4" />Unable to refresh revenue inflows. Showing the last available data.</div>}

      <div className="flex flex-col gap-4 border-b border-border-default p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filter by payment status">
          {PAYMENT_FILTERS.map((status) => <Button key={status} type="button" variant={paymentFilter === status ? "secondary" : "ghost"} onClick={() => setPaymentFilter(status)} className={cn("h-8 shrink-0 gap-2 px-3 text-[10px]", paymentFilter === status && "bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/40 dark:text-primary-300")} aria-pressed={paymentFilter === status}>{status}<span className={cn("rounded-md bg-surface-secondary px-1.5 py-0.5 text-[9px]", status === "Paid" && "bg-success-50 text-success-700", status === "Partial" && "bg-warning-50 text-warning-700", status === "Unpaid" && "bg-danger-50 text-danger-700")}>{counts[status]}</span></Button>)}
        </div>
        <div className="relative w-full lg:w-88"><Search aria-hidden="true" className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-muted" /><label htmlFor="revenue-search" className="sr-only">Search revenue inflows</label><Input id="revenue-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by package, client or category..." className="h-8 bg-surface-primary pl-9 text-caption" /></div>
      </div>

      <div className={cn("overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", query.isFetching && "opacity-60")}>
        <Table className="min-w-245">
          <TableHeader className="bg-surface-secondary/70 text-[10px] uppercase tracking-wide text-text-muted">
            <TableRow className="hover:bg-transparent"><TableHead className="min-w-72 font-semibold text-text-muted">Package / Service</TableHead><TableHead className="min-w-40 font-semibold text-text-muted">Category</TableHead><TableHead className="min-w-52 font-semibold text-text-muted">Client / Entity</TableHead><TableHead className="min-w-40 text-right font-semibold text-text-muted">Agreed Fee (AED)</TableHead><TableHead className="min-w-40 font-semibold text-text-muted">Payment Status</TableHead><TableHead className="min-w-40 font-semibold text-text-muted">Workflow Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, index) => <TableRow key={`${row.clientName ?? "client"}-${row.servicePackage ?? "service"}-${index}`}>
              <TableCell className="whitespace-normal text-caption"><div className="flex items-start gap-3"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><Box aria-hidden="true" className="size-3.5" /></span><span className="max-w-72 font-semibold leading-5 text-text-primary">{row.servicePackage || "—"}</span></div></TableCell>
              <TableCell><span className="inline-flex max-w-36 whitespace-normal rounded-md bg-primary-50 px-2 py-1 text-[10px] font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{row.serviceCategory || "—"}</span></TableCell>
              <TableCell className="text-caption font-medium text-text-primary">{row.clientName || "—"}</TableCell>
              <TableCell className="text-right text-caption font-semibold text-text-primary" data-numeric>{money(row.packagePrice)}</TableCell>
              <TableCell><RevenueStatus type="payment" status={row.paymentStatus} /></TableCell>
              <TableCell><RevenueStatus type="service" status={row.serviceStatus} /></TableCell>
            </TableRow>)}
            {filteredRows.length === 0 && <TableRow className="hover:bg-transparent"><TableCell colSpan={6} className="h-44 text-center"><CircleDollarSign aria-hidden="true" className="mx-auto size-8 text-text-muted" /><p className="mt-3 font-semibold text-text-primary">No revenue inflows found</p><p className="mt-1 text-caption text-text-muted">{rows.length ? "Try a different search or payment status." : "Revenue inflows will appear here when they are available."}</p></TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 border-t border-border-default p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption text-text-secondary" data-numeric>Showing {firstEntry} to {lastEntry} of {pageInfo.total} entries</p>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={String(limit)} onValueChange={(value) => { setLimit(Number(value)); setPage(1); }}><SelectTrigger className="h-8 w-32 bg-surface-primary text-caption"><SelectValue>{limit} per page</SelectValue></SelectTrigger><SelectContent>{[10, 20, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size} per page</SelectItem>)}</SelectContent></Select>
          <nav aria-label="Revenue inflow pagination" className="flex items-center gap-1.5"><PaginationButton label="First page" disabled={pageInfo.page <= 1} onClick={() => setPage(1)}><ChevronsLeft aria-hidden="true" /></PaginationButton><PaginationButton label="Previous page" disabled={pageInfo.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft aria-hidden="true" /></PaginationButton><span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground" aria-current="page">{pageInfo.page || 1}</span><PaginationButton label="Next page" disabled={pageInfo.page >= pageInfo.totalPages} onClick={() => setPage((current) => current + 1)}><ChevronRight aria-hidden="true" /></PaginationButton><PaginationButton label="Last page" disabled={pageInfo.page >= pageInfo.totalPages} onClick={() => setPage(pageInfo.totalPages)}><ChevronsRight aria-hidden="true" /></PaginationButton></nav>
        </div>
      </div>
    </Card>
  );
}
