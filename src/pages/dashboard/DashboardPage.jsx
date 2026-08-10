import { useMemo, useState } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { MetricCards } from "./components/MetricCards";
import { UpcomingActionsTable } from "./components/UpcomingActionsTable";
import { dashboardActions, dashboardMetrics } from "./data/dashboardData";

const PAGE_SIZE = 4;

export default function DashboardPage() {
  const [period, setPeriod] = useState("today");
  const [expiry, setExpiry] = useState("30");
  const [service, setService] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filteredActions = useMemo(() => {
    return dashboardActions.filter((action) => {
      const matchesPeriod = period === "all" || action.period === period;
      const matchesExpiry = expiry === "all" || action.daysUntilDue <= Number(expiry);
      const matchesService = service === "all" || action.service === service;
      const matchesStatus = status === "all" || action.statusKey === status;

      return matchesPeriod && matchesExpiry && matchesService && matchesStatus;
    });
  }, [expiry, period, service, status]);

  const pageCount = Math.max(1, Math.ceil(filteredActions.length / PAGE_SIZE));

  const visibleActions = filteredActions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-full bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-(--container-max-width) flex-col gap-5">
        <DashboardHeader
          period={period}
          expiry={expiry}
          service={service}
          status={status}
          onPeriodChange={(value) => {
            setPeriod(value);
            setPage(1);
          }}
          onExpiryChange={(value) => {
            setExpiry(value);
            setPage(1);
          }}
          onServiceChange={(value) => {
            setService(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />

        <MetricCards metrics={dashboardMetrics} />

        <UpcomingActionsTable
          actions={visibleActions}
          totalActions={filteredActions.length}
          page={page}
          pageCount={pageCount}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
