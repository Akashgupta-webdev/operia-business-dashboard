import { useVatAccess } from "@/features/vat/hooks/useVat";
import { useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  AlertCircle,
  Building2,
  CalendarClock,
  Car,
  Clock3,
  FileCheck2,
  FileText,
  IdCard,
  Landmark,
  ListTodo,
  LoaderCircle,
  ShieldCheck,
  SlidersHorizontal,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { DateInput } from "@operio/ui/components/date-input";
import { CLIENT_DASHBOARD_TYPES } from "@/features/dashboard/constants/dashboard";
import useClientDashboardKPI from "@/features/dashboard/hooks/useClientDashboardKPI";
import { cn } from "@operio/ui/lib/utils";
import { dashboardFilterSchema } from "@/features/dashboard/schemas/dashboard.schema";
import {
  CategoryBreakdown,
  DashboardMetricCard,
  DashboardSkeleton,
  DueSoonBreakdown,
  RenewalStatusOverview,
} from "../components/KpiDashboardSections";

function inputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function apiDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function currentMonth() {
  const today = new Date();
  return {
    fromDate: inputDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    toDate: inputDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
  };
}

const initialDates = currentMonth();

export default function DashboardPage() {
  const vatAccess = useVatAccess();
  const [filters, setFilters] = useState({ type: "all", fromDate: apiDate(initialDates.fromDate), toDate: apiDate(initialDates.toDate) });
  const { formState: { errors }, handleSubmit, register } = useForm({
    resolver: joiResolver(dashboardFilterSchema, { abortEarly: false }),
    defaultValues: initialDates,
    mode: "onSubmit",
  });
  const query = useClientDashboardKPI(filters);
  const data = query.data;
  const todayLabel = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).format(new Date());

  const applyDates = handleSubmit((values) => {
    setFilters((current) => ({ ...current, fromDate: apiDate(values.fromDate), toDate: apiDate(values.toDate) }));
  });

  const selectType = (type) => setFilters((current) => ({ ...current, type }));

  const primaryMetrics = data ? [
    { icon: FileText, label: "Total Renewals Tracked", value: data.totalRenewalsTracked, helper: "Licences, visas & fleet", href: "/renewals", tone: "primary" },
    { icon: TriangleAlert, label: "Total Expired", value: data.totalExpired, helper: "Action required", href: "/renewals", tone: "danger" },
    { icon: Clock3, label: "Total Due Soon (0–60d)", value: data.totalDueSoon, helper: "Due for renewal", href: "/renewals", tone: "warning" },
    { icon: ShieldCheck, label: "Valid & Compliant", value: data.validAndCompliant, helper: "Compliant records", href: "/renewals", tone: "success" },
  ] : [];
  const inventoryMetrics = data ? [
    { icon: Users, label: "Total Clients", value: data.totalClients, helper: "View clients", href: "/clients", tone: "info" },
    { icon: Building2, label: "Active Companies", value: data.activeCompanies, helper: "View companies", href: "/companies", tone: "info" },
    { icon: Landmark, label: "Finance and P&L", value: data.financeAndPL, helper: "View finance", href: "/finance", tone: "primary" },
    { icon: ListTodo, label: "Pending Actions & Tasks", value: data.pendingActionsAndTasks, helper: "View reminders", href: "/reminders", tone: "warning" },
  ] : [];
  const categories = data ? [
    { icon: FileCheck2, label: "VAT Due", href: vatAccess.allowed ? "/vat-filings" : undefined, value: data.vatDue, badge: data.vatDue ? "Due" : "Clear", tone: data.vatDue ? "warning" : "success" },
    { icon: Landmark, label: "Corporate Tax", value: data.corporateTax, badge: "Tracked", tone: "primary" },
    { icon: IdCard, label: "Visa / EID / Passport", value: data.visaEidPassport, badge: "Identity", tone: "primary" },
    { icon: Car, label: "Insurance & Fleet", value: data.insuranceAndFleet, badge: "Fleet/Health", tone: "success" },
    { icon: FileCheck2, label: "Trade Licences & Est.", value: data.tradeLicense, badge: "Registered", tone: "primary" },
  ] : [];
  const rootError = errors.root?.message || errors[""]?.message;

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] bg-app-background px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div><h1 className="text-section-heading font-bold text-text-primary">Business Dashboard</h1><p className="mt-1 text-caption text-text-secondary">Renewal, compliance, client and fleet performance at a glance.</p></div>
        <div className="flex items-center gap-2 text-caption text-text-secondary sm:ml-auto"><CalendarClock aria-hidden="true" className="size-4 text-primary-600" /><span>Today, {todayLabel}</span>{query.isFetching && <LoaderCircle aria-label="Refreshing dashboard" className="size-3.5 animate-spin text-primary-600" />}</div>
      </header>

      <Card className="mb-5 gap-4 border border-border-default bg-surface-primary p-3 py-3 shadow-card ring-0 sm:p-4 sm:py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(30rem,auto)] lg:items-center">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-1">
            {CLIENT_DASHBOARD_TYPES.map(({ label, value }) => <Button key={value} type="button" variant="ghost" size="sm" aria-pressed={filters.type === value} onClick={() => selectType(value)} className={cn("h-8 px-3 text-[11px]", filters.type === value && "bg-primary-700 text-neutral-0 hover:bg-primary-700 hover:text-neutral-0")}>{label}</Button>)}
          </div>
        </div>
        <form onSubmit={applyDates} noValidate className="grid items-start gap-3 md:grid-cols-[minmax(10rem,1fr)_auto_minmax(10rem,1fr)_auto] lg:ml-auto lg:w-full lg:max-w-2xl">
          <div><label htmlFor="dashboard-from-date" className="sr-only">From date</label><DateInput id="dashboard-from-date" aria-invalid={Boolean(errors.fromDate || rootError)} className="h-10 bg-surface-primary" {...register("fromDate")} />{errors.fromDate?.message && <p className="mt-1 text-[10px] text-danger-600">{errors.fromDate.message}</p>}</div>
          <span className="hidden self-center text-caption text-text-muted md:block">to</span>
          <div><label htmlFor="dashboard-to-date" className="sr-only">To date</label><DateInput id="dashboard-to-date" aria-invalid={Boolean(errors.toDate || rootError)} className="h-10 bg-surface-primary" {...register("toDate")} />{errors.toDate?.message && <p className="mt-1 text-[10px] text-danger-600">{errors.toDate.message}</p>}</div>
          <Button type="submit" disabled={query.isFetching} className="h-10 gap-2 px-4"><SlidersHorizontal aria-hidden="true" className="size-3.5" />Filter</Button>
          {rootError && <p role="alert" className="text-[10px] text-danger-600 md:col-span-4">{rootError}</p>}
        </form>
      </Card>

      {query.isPending && <DashboardSkeleton />}
      {query.isError && !data && (
        <Card role="alert" className="items-center gap-3 border border-danger-200 bg-danger-50 px-6 py-12 text-center ring-0">
          <AlertCircle aria-hidden="true" className="size-8 text-danger-600" /><h2 className="text-body-lg font-semibold text-danger-700">Unable to load dashboard KPIs</h2><p className="text-caption text-text-secondary">{query.error?.response?.data?.error?.message ?? "The dashboard request could not be completed."}</p><Button type="button" variant="outline" onClick={() => query.refetch()}>Try again</Button>
        </Card>
      )}

      {data && (
        <div className={cn("space-y-5 transition-opacity", query.isFetching && "opacity-70")}>
          {query.isError && <div role="alert" className="flex items-center gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-caption text-warning-700"><AlertCircle aria-hidden="true" className="size-4" />Unable to refresh KPIs. Showing the last available results.</div>}
          <section aria-label="Renewal KPIs" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{primaryMetrics.map((metric) => <DashboardMetricCard key={metric.label} {...metric} />)}</section>
          <section aria-label="Inventory KPIs" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{inventoryMetrics.map((metric) => <DashboardMetricCard key={metric.label} {...metric} />)}</section>
          <CategoryBreakdown items={categories} />
          <div className="grid items-stretch gap-4 xl:grid-cols-2"><RenewalStatusOverview data={data} /><DueSoonBreakdown breakdown={data.dueSoonBreakdown} totalDueSoon={data.totalDueSoon ?? 0} /></div>
        </div>
      )}
    </div>
  );
}
