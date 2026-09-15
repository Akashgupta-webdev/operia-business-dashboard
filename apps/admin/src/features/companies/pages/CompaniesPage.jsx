import { useState } from "react";
import { AlertCircle, Building2, CheckCircle2, FileText, PauseCircle, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { CLIENT_STATUS_OPTIONS } from "@/features/clients/constants/client";
import useClientCompanies from "@/features/companies/hooks/useClientCompanies";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { cn } from "@operio/ui/lib/utils";
import {
  CompanyCard,
  CompanyGridSkeleton,
  CompanyPagination,
  CompanySummaryCard,
} from "../components/CompanyDirectory";

const PAGE_SIZE = 6;

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim());
  const query = useClientCompanies({ page, limit: PAGE_SIZE, search: debouncedSearch || undefined });
  const companies = query.data?.companies ?? [];
  const pageInfo = query.data?.page ?? { page, limit: PAGE_SIZE, total: 0, totalPages: 0 };
  const summary = {
    active: companies.filter((company) => company.clientStatus === "Active").length,
    inactive: companies.filter((company) => company.clientStatus === "Inactive").length,
    other: companies.filter((company) => ["Archived", "Draft"].includes(company.clientStatus)).length,
  };
  const visibleCompanies = status === "all" ? companies : companies.filter((company) => company.clientStatus === status);
  const hasFilters = Boolean(debouncedSearch || status !== "all");

  const changeStatus = (value) => setStatus(value);

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] bg-app-background px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0"><div className="flex items-center gap-3"><Building2 aria-hidden="true" className="size-6 shrink-0 text-primary-600" /><h1 className="text-section-heading font-bold text-text-primary">Companies</h1></div><p className="mt-1 text-body-md text-text-secondary">Manage all registered companies and their client relationships.</p></div>
        <Button type="button" onClick={() => navigate("/clients/new")} className="h-10 shrink-0 gap-2 px-5 font-semibold sm:ml-auto"><Plus aria-hidden="true" className="size-4" />Add Company</Button>
      </header>

      <section aria-label="Company summary" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CompanySummaryCard icon={Building2} label="Total Companies" value={pageInfo.total} description="All registered companies" tone="primary" />
        <CompanySummaryCard icon={CheckCircle2} label="Active Companies" value={summary.active} description="On this page" tone="success" />
        <CompanySummaryCard icon={PauseCircle} label="Inactive Companies" value={summary.inactive} description="On this page" tone="warning" />
        <CompanySummaryCard icon={FileText} label="Archived / Draft" value={summary.other} description="On this page" tone="danger" />
      </section>

      <section aria-label="Company list controls" className="mt-5 grid items-center gap-3 sm:grid-cols-[minmax(15rem,1fr)_12rem]">
        <div className="relative"><label htmlFor="company-search" className="sr-only">Search companies by name</label><Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" /><Input id="company-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search company name..." className="h-10 border-border-default bg-surface-primary pl-9 shadow-none" /></div>
        <Select value={status} onValueChange={changeStatus}><SelectTrigger aria-label="Filter companies by client status" className="h-10 w-full border-border-default bg-surface-primary px-3"><SelectValue /></SelectTrigger><SelectContent>{CLIENT_STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
      </section>

      <main className="mt-4" aria-busy={query.isFetching}>
        {query.isPending && <CompanyGridSkeleton />}
        {query.isError && <Card role="alert" className="items-center gap-3 border border-danger-200 bg-danger-50 px-6 py-12 text-center ring-0"><AlertCircle aria-hidden="true" className="size-8 text-danger-600" /><h2 className="text-body-lg font-semibold text-danger-700">Unable to load companies</h2><p className="text-caption text-text-secondary">{query.error?.response?.data?.error?.message ?? "The company list request could not be completed."}</p><Button type="button" variant="outline" onClick={() => query.refetch()}>Try again</Button></Card>}
        {!query.isPending && !query.isError && !visibleCompanies.length && <div className="rounded-xl border border-dashed border-border-default bg-surface-primary px-6 py-14 text-center"><Building2 aria-hidden="true" className="mx-auto size-9 text-text-muted" /><h2 className="mt-3 text-body-sm font-semibold text-text-primary">{hasFilters ? "No matching companies" : "No companies registered"}</h2><p className="mt-1 text-caption text-text-muted">{status !== "all" && companies.length ? "No companies on this page match the selected status." : hasFilters ? "Try changing your company search or status filter." : "Company records will appear here when clients are registered."}</p></div>}
        {!query.isPending && !query.isError && visibleCompanies.length > 0 && <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", query.isFetching && "opacity-60 transition-opacity")}>{visibleCompanies.map((company) => <CompanyCard key={company.id} company={company} />)}</div>}

        {!query.isError && pageInfo.total > 0 && <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-caption text-text-secondary" data-numeric>Showing {visibleCompanies.length} companies on this page · {pageInfo.total} total</p><CompanyPagination page={pageInfo.page} pageCount={pageInfo.totalPages} onPageChange={setPage} /></footer>}
      </main>
    </div>
  );
}
