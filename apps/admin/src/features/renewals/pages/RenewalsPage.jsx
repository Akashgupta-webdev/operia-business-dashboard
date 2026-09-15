import { useState } from "react";
import { AlertCircle, CalendarClock, CheckCircle2, Files, RefreshCw, TriangleAlert } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { RENEWALS_PAGE_SIZE } from "@/features/renewals/constants/renewals";
import useClientRenewals from "@/features/renewals/hooks/useClientRenewals";
import { filterRenewals } from "@/features/renewals/utils/renewals";
import SummaryCard from "@/components/SummaryCard";
import RenewalFilters from "../components/RenewalFilters";
import RenewalPagination from "../components/RenewalPagination";
import RenewalTable from "../components/RenewalTable";

export default function RenewalsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", category: "all", status: "all" });
  const query = useClientRenewals(page);
  const items = query.data?.data ?? [];
  const pageInfo = query.data?.page ?? { page, limit: RENEWALS_PAGE_SIZE, total: 0, totalPages: 0 };
  const visibleItems = filterRenewals(items, filters);
  const hasFilters = Boolean(filters.search.trim() || filters.category !== "all" || filters.status !== "all");
  const errorStatus = query.error?.response?.status;
  const errorMessage = errorStatus === 401 ? "Your session has expired. Please sign in again."
    : errorStatus === 403 ? "You do not have permission to view renewals."
      : "The renewal list could not be loaded. Please try again.";

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] space-y-5 bg-app-background px-4 py-5 sm:px-6 lg:px-8">
      <header>
        <div className="flex items-center gap-3"><RefreshCw aria-hidden="true" className="size-6 shrink-0 text-primary-600" /><h1 className="text-section-heading font-bold text-text-primary">Renewals &amp; Expirations Hub</h1></div>
        <p className="mt-1 text-body-md text-text-secondary">Monitor trade licences, establishment cards, identity documents, and vehicle expirations.</p>
      </header>
      <section aria-label="Renewal summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Files} label="Total Items Tracked" value={0} description="All expiry records" tone="primary" />
        <SummaryCard icon={TriangleAlert} label="Total Expired" value={0} description="Action required" tone="danger" />
        <SummaryCard icon={CalendarClock} label="Total Due Soon (30D)" value={0} description="Expiring within 30 days" tone="warning" />
        <SummaryCard icon={CheckCircle2} label="Valid & Active" value={0} description="More than 30 days remaining" tone="success" />
      </section>
      <RenewalFilters filters={filters} onChange={setFilters} />
      <Card id="renewals-list" className="gap-0 overflow-hidden border border-border-default bg-surface-primary py-0 shadow-card ring-0" aria-busy={query.isFetching}>
        {query.isError ? <div role="alert" className="flex flex-col items-center gap-3 px-6 py-12 text-center"><AlertCircle aria-hidden="true" className="size-8 text-danger-600" /><h2 className="text-body-lg font-semibold text-text-primary">Unable to load renewals</h2><p className="text-body-sm text-text-secondary">{errorMessage}</p><Button type="button" variant="outline" onClick={() => query.refetch()}>Try again</Button></div> : <>
          <RenewalTable items={visibleItems} loading={query.isPending} hasFilters={hasFilters} />
          <footer className="flex flex-col gap-3 border-t border-border-default px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <p role="status" className="text-caption text-text-secondary" data-numeric>{query.isFetching ? "Loading renewals..." : "Showing " + visibleItems.length + " of " + items.length + " records on page " + pageInfo.page + " ? " + pageInfo.total + " total records"}</p>
            <RenewalPagination page={pageInfo.page} totalPages={pageInfo.totalPages} disabled={query.isFetching} onPageChange={setPage} />
          </footer>
        </>}
      </Card>
    </div>
  );
}
