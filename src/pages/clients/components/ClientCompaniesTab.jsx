import { Building2, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CLIENT_COMPANIES_PAGE_SIZE } from "@/constants/ClientCompaniesPage";
import useClientCompanies from "@/hooks/useClientCompanies";
import { DashboardPagination } from "@/pages/dashboard/components/DashboardPagination";
import { CompanyCard } from "./CompanyCard";

function CompaniesLoading() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading companies">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-72 rounded-xl" />
      ))}
    </div>
  );
}

export function ClientCompaniesTab({ clientDatabaseId, onAddCompany }) {
  const [page, setPage] = useState(1);
  const { data, error, isFetching, isPending, refetch } = useClientCompanies({
    clientId: clientDatabaseId,
    page,
    limit: CLIENT_COMPANIES_PAGE_SIZE,
  });
  const companies = data?.companies ?? [];
  const pageInfo = data?.page;

  return (
    <section aria-labelledby="client-companies-heading">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="client-companies-heading" className="font-heading text-headline-md font-semibold text-foreground">
            Companies
          </h2>
          <p className="mt-1 text-body-sm text-muted-foreground">Manage companies registered for this client.</p>
        </div>
        <Button type="button" size="lg" onClick={onAddCompany} className="self-start px-4 sm:self-auto">
          <Plus data-icon="inline-start" />
          Add company
        </Button>
      </div>

      {error || !clientDatabaseId ? (
        <Card className="rounded-xl border border-destructive/30 bg-card py-0 shadow-card ring-0">
          <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-destructive-container text-destructive-container-foreground">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-heading text-body-lg font-semibold text-foreground">Unable to load companies</h3>
            <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">
              Please try again. If the problem continues, contact support.
            </p>
            {clientDatabaseId && <Button type="button" variant="outline" onClick={() => refetch()} className="mt-4">Try again</Button>}
          </CardContent>
        </Card>
      ) : isPending ? (
        <CompaniesLoading />
      ) : companies.length === 0 ? (
        <Card className="rounded-xl border border-border bg-card py-0 shadow-card ring-0">
          <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-heading text-body-lg font-semibold text-foreground">No companies to display</h3>
            <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">
              Add a company to begin recording registration, contact, and banking details for this client.
            </p>
            <Button type="button" variant="outline" onClick={onAddCompany} className="mt-4 border-primary/50 text-primary">
              <Plus data-icon="inline-start" />
              Add first company
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
            {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
          </div>

          {pageInfo?.totalPages > 1 && (
            <footer className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-card sm:flex-row">
              <p className="text-body-sm text-muted-foreground">
                {pageInfo.total} {pageInfo.total === 1 ? "company" : "companies"}
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
        </>
      )}
    </section>
  );
}
