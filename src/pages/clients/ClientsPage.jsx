import { useEffect, useState } from "react";
import { CLIENTS_PAGE_SIZE } from "@/constants/ClientsPage";
import useClients from "@/hooks/useClients";
import { DashboardPagination } from "@/pages/dashboard/components/DashboardPagination";
import { ClientsHeader } from "./components/ClientsHeader";
import { ClientsGrid } from "./components/ClientsGrid";
import { QuickAddClientDialog } from "./components/QuickAddClientDialog";

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { data, error, isFetching, isPending, refetch } = useClients({
    page,
    limit: CLIENTS_PAGE_SIZE,
    search,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const clients = data?.clients ?? [];
  const pageInfo = data?.page;
  const firstResult = pageInfo?.total ? (pageInfo.page - 1) * pageInfo.limit + 1 : 0;
  const lastResult = pageInfo?.total ? Math.min(pageInfo.page * pageInfo.limit, pageInfo.total) : 0;

  return (
    <div className="min-h-full bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-(--container-max-width) flex-col gap-4">
        <ClientsHeader
          search={searchInput}
          onSearchChange={setSearchInput}
          onQuickAdd={() => setIsQuickAddOpen(true)}
        />

        <ClientsGrid
          clients={clients}
          error={error}
          isLoading={isPending}
          onRetry={refetch}
          search={search}
        />

        {pageInfo?.totalPages > 1 && !error && (
          <footer className="flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-card sm:flex-row">
            <p className="text-body-sm text-muted-foreground" aria-live="polite">
              Showing {firstResult}–{lastResult} of {pageInfo.total} clients
              {isFetching && <span className="sr-only">, updating</span>}
            </p>
            <DashboardPagination
              page={pageInfo.page}
              pageCount={pageInfo.totalPages}
              onPageChange={(nextPage) => {
                if (!isFetching) setPage(nextPage);
              }}
            />
          </footer>
        )}

        <QuickAddClientDialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen} />
      </div>
    </div>
  );
}
