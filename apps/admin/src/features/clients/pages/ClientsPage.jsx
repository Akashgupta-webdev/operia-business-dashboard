import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid2X2, List, Plus, Search, UsersRound } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { CLIENT_SORT_OPTIONS, CLIENT_STATUS_OPTIONS, CLIENT_TYPE_OPTIONS } from "@/features/clients/constants/client";
import useClients from "@/features/clients/hooks/useClients";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { cn } from "@operio/ui/lib/utils";
import { DashboardPagination } from "@/features/dashboard/components/DashboardPagination";
import ClientResults, { ClientResultsSkeleton } from "../components/ClientResults";

const PAGE_SIZE = 20;

function EmptyState({ filtered }) {
  return (
    <div className="rounded-xl border border-dashed border-border-default bg-surface-primary px-6 py-16 text-center">
      <UsersRound aria-hidden="true" className="mx-auto size-10 text-text-muted" />
      <h2 className="mt-4 text-subsection font-semibold text-text-primary">{filtered ? "No matching clients" : "No clients yet"}</h2>
      <p className="mx-auto mt-1 max-w-md text-body-sm text-text-secondary">{filtered ? "Try changing your search or filters." : "Add your first client to start managing their details and services."}</p>
    </div>
  );
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [clientType, setClientType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("Newest First");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim());

  const query = useClients({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    clientType: clientType === "all" ? undefined : clientType,
    sort,
  });
  const clients = query.data?.clients ?? [];
  const pageInfo = query.data?.page ?? { page, limit: PAGE_SIZE, total: 0, totalPages: 0 };
  const firstResult = pageInfo.total ? (pageInfo.page - 1) * pageInfo.limit + 1 : 0;
  const lastResult = Math.min(pageInfo.page * pageInfo.limit, pageInfo.total);
  const hasFilters = Boolean(debouncedSearch || clientType !== "all" || status !== "all");

  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] bg-app-background px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3"><UsersRound aria-hidden="true" className="size-6 shrink-0 text-primary" strokeWidth={2} /><h1 className="text-section-heading font-bold tracking-tight text-text-primary">Clients</h1></div>
          <p className="mt-1 text-body-md text-text-secondary">Manage your corporate representatives, individual clients, and service agreements.</p>
        </div>
        <Button type="button" size="lg" onClick={() => navigate("/clients/new")} className="h-10 gap-2 self-start px-5 font-semibold shadow-sm"><Plus aria-hidden="true" className="size-4" />Add New Client</Button>
      </header>

      <section aria-label="Client list controls" className="mt-5 flex flex-col gap-4 rounded-xl border border-border-default bg-surface-primary p-4 shadow-card 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="relative w-full 2xl:max-w-lg">
          <label htmlFor="client-search" className="sr-only">Search clients</label>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" />
          <Input id="client-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search by name, email, phone, or company..." className="h-10 border-border-default bg-app-background pr-4 pl-10 text-body-md shadow-none hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={clientType} onValueChange={updateFilter(setClientType)}><SelectTrigger aria-label="Filter by client type" className="h-10 w-full min-w-36 border-border-default bg-app-background px-3 font-medium text-text-primary sm:w-36"><SelectValue /></SelectTrigger><SelectContent align="end">{CLIENT_TYPE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
          <Select value={status} onValueChange={updateFilter(setStatus)}><SelectTrigger aria-label="Filter by client status" className="h-10 w-full min-w-36 border-border-default bg-app-background px-3 font-medium text-text-primary sm:w-36"><SelectValue /></SelectTrigger><SelectContent align="end">{CLIENT_STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
          <div className="flex items-center gap-3">
            <Select value={sort} onValueChange={updateFilter(setSort)}><SelectTrigger aria-label="Sort clients" className="h-10 min-w-40 flex-1 border-border-default bg-app-background px-3 font-medium text-text-primary"><SelectValue /></SelectTrigger><SelectContent align="end">{CLIENT_SORT_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>
            <div className="flex shrink-0 items-center rounded-lg bg-surface-secondary p-1" role="group" aria-label="Client view">
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={cn("size-8 text-text-muted hover:bg-surface-primary hover:text-primary", view === "grid" && "bg-surface-primary text-primary shadow-sm hover:bg-surface-primary")}><Grid2X2 aria-hidden="true" className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={cn("size-8 text-text-muted hover:bg-surface-primary hover:text-primary", view === "list" && "bg-surface-primary text-primary shadow-sm hover:bg-surface-primary")}><List aria-hidden="true" className="size-4" /></Button>
            </div>
          </div>
        </div>
      </section>

      <main className="mt-6" aria-busy={query.isFetching}>
        {!query.isPending && !query.isError && <p className="mb-4 text-body-sm font-medium text-text-secondary" aria-live="polite">Showing <span className="font-semibold text-text-primary" data-numeric>{firstResult}–{lastResult}</span> of <span className="font-semibold text-text-primary" data-numeric>{pageInfo.total}</span> clients</p>}
        {query.isPending && <ClientResultsSkeleton view={view} />}
        {query.isError && <div role="alert" className="rounded-xl border border-danger-200 bg-danger-50 px-6 py-10 text-center dark:bg-destructive-container"><h2 className="font-semibold text-danger-700 dark:text-destructive-container-foreground">Unable to load clients</h2><p className="mt-1 text-body-sm text-text-secondary">{query.error?.response?.data?.error?.message ?? "Please try again."}</p><Button type="button" variant="outline" onClick={() => query.refetch()} className="mt-4">Try again</Button></div>}
        {!query.isPending && !query.isError && clients.length === 0 && <EmptyState filtered={hasFilters} />}
        {!query.isPending && !query.isError && clients.length > 0 && <div className={cn(query.isFetching && "opacity-60 transition-opacity")}><ClientResults clients={clients} view={view} /></div>}
        {!query.isError && pageInfo.totalPages > 1 && <div className="mt-6 flex justify-end"><DashboardPagination page={pageInfo.page} pageCount={pageInfo.totalPages} onPageChange={setPage} /></div>}
      </main>
    </div>
  );
}
