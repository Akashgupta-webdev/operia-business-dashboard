import { useVatAccess } from "@/features/vat/hooks/useVat";
import { useEffect, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  Car,
  Clock3,
  FileCheck2,
  FileText,
  Landmark,
  LoaderCircle,
  SlidersHorizontal,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";

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
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const [filters, setFilters] = useState({ type: "all", fromDate: apiDate(initialDates.fromDate), toDate: apiDate(initialDates.toDate) });
  const { control, formState: { errors }, handleSubmit, register, setValue } = useForm({
    resolver: joiResolver(dashboardFilterSchema, { abortEarly: false }),
    defaultValues: initialDates,
    mode: "onSubmit",
  });
  const fromDate = useWatch({ control, name: "fromDate" });

  const handleFromDateChange = (event) => {
    const value = event.target.value;
    if (!value) return;
    const [year, month] = value.split("-").map(Number);
    setValue("toDate", inputDate(new Date(year, month, 0)), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  const query = useClientDashboardKPI(filters);
  const data = query.data;
  const dateParts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const parts = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]));
  const hour = Number(parts.hour);
  const greeting = hour >= 5 && hour < 12 ? "Good Morning" : hour >= 12 && hour < 17 ? "Good Noon" : hour >= 17 && hour < 21 ? "Good Evening" : "Good Night";
  const todayLabel = `${parts.hour}:${parts.minute}, Today, ${parts.weekday}, ${parts.day} ${parts.month}, ${parts.year} (UAE Timezone)`;

  const applyDates = handleSubmit((values) => {
    setFilters((current) => ({ ...current, fromDate: apiDate(values.fromDate), toDate: apiDate(values.toDate) }));
  });

  const selectType = (type) => setFilters((current) => ({ ...current, type }));

  const primaryMetrics = data ? [
    { icon: FileText, label: "Total Renewals Tracked", value: data.totalRenewalsTracked, helper: "Licences, visas & fleet", href: "/renewals", tone: "primary" },
    { icon: TriangleAlert, label: "Total Expired", value: data.totalExpired, helper: "Action required", href: "/renewals", tone: "danger" },
    { icon: Clock3, label: "Total Due Soon (0–60d)", value: data.totalDueSoon, helper: "Due for renewal", href: "/renewals", tone: "warning" },

    { icon: Users, label: "Total Clients", value: data.totalClients, helper: "View clients", href: "/clients", tone: "info" },
  ] : [];
  const categories = data ? [
    { icon: FileCheck2, label: "VAT Due", href: vatAccess.allowed ? "/vat-filings" : undefined, value: data.vatDue, badge: data.vatDue ? "Due" : "Clear", tone: data.vatDue ? "warning" : "success" },
    { icon: Landmark, label: "Corporate Tax", value: data.corporateTax, badge: "Tracked", tone: "primary" },
    { icon: Car, label: "Insurance & Fleet", value: data.insuranceAndFleet, badge: "Fleet/Health", tone: "success" },
    { icon: FileCheck2, label: "Trade Licences & Est.", value: data.tradeLicense, badge: "Registered", tone: "primary" },
  ] : [];
  const rootError = errors.root?.message || errors[""]?.message;

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] bg-[#f6f7fb] px-4 py-5 dark:bg-app-background sm:px-6">
      <header className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-[28px]">Hello Team, <span className="text-primary-600">{greeting}</span></h1><p className="mt-1 text-xs text-text-muted">Here's what's happening with your compliance today.</p></div>
        <div className="flex items-center gap-2 pt-1 text-[11px] text-text-secondary"><CalendarClock aria-hidden="true" className="size-4 text-primary-600" /><time dateTime={now.toISOString()}>{todayLabel}</time>{query.isFetching && <LoaderCircle aria-label="Refreshing dashboard" className="size-3.5 animate-spin text-primary-600" />}</div>
      </header>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1">
            {CLIENT_DASHBOARD_TYPES.map(({ label, value }) => <Button key={value} type="button" variant="ghost" size="sm" aria-pressed={filters.type === value} onClick={() => selectType(value)} className={cn("h-8 rounded-full border border-border-default/60 bg-surface-primary px-4 text-xs font-medium hover:bg-primary-50", filters.type === value && "border-primary-700 bg-primary-700 text-neutral-0 hover:bg-primary-700 hover:text-neutral-0")}>{label}</Button>)}
          </div>
        </div>
        <form onSubmit={applyDates} noValidate className="grid w-full items-start gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] lg:ml-auto lg:w-auto lg:grid-cols-[9rem_auto_9rem_auto]">
          <div><label htmlFor="dashboard-from-date" className="sr-only">From date</label><DateInput id="dashboard-from-date" aria-invalid={Boolean(errors.fromDate || rootError)} className="h-9 rounded-lg border-border-default/60 bg-surface-primary text-xs" {...register("fromDate", { onChange: handleFromDateChange })} />{errors.fromDate?.message && <p className="mt-1 text-[10px] text-danger-600">{errors.fromDate.message}</p>}</div>
          <span className="hidden self-center text-caption text-text-muted sm:block">to</span>
          <div><label htmlFor="dashboard-to-date" className="sr-only">To date</label><DateInput id="dashboard-to-date" min={fromDate || undefined} aria-invalid={Boolean(errors.toDate || rootError)} className="h-9 rounded-lg border-border-default/60 bg-surface-primary text-xs" {...register("toDate")} />{errors.toDate?.message && <p className="mt-1 text-[10px] text-danger-600">{errors.toDate.message}</p>}</div>
          <Button type="submit" disabled={query.isFetching} className="h-9 gap-2 rounded-lg px-4 text-xs"><SlidersHorizontal aria-hidden="true" className="size-3.5" />Filter</Button>
          {rootError && <p role="alert" className="text-[10px] text-danger-600 sm:col-span-4">{rootError}</p>}
        </form>
      </div>

      {query.isPending && <DashboardSkeleton />}
      {query.isError && !data && (
        <Card role="alert" className="items-center gap-3 border border-danger-200 bg-danger-50 px-6 py-12 text-center ring-0">
          <AlertCircle aria-hidden="true" className="size-8 text-danger-600" /><h2 className="text-body-lg font-semibold text-danger-700">Unable to load dashboard KPIs</h2><p className="text-caption text-text-secondary">{query.error?.response?.data?.error?.message ?? "The dashboard request could not be completed."}</p><Button type="button" variant="outline" onClick={() => query.refetch()}>Try again</Button>
        </Card>
      )}

      {data && (
        <div className={cn("space-y-3 transition-opacity", query.isFetching && "opacity-70")}>
          {query.isError && <div role="alert" className="flex items-center gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-caption text-warning-700"><AlertCircle aria-hidden="true" className="size-4" />Unable to refresh KPIs. Showing the last available results.</div>}
          <section aria-label="Dashboard KPIs" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{primaryMetrics.map((metric) => <DashboardMetricCard key={metric.label} {...metric} />)}</section>
          <CategoryBreakdown items={categories} />
          <div className="grid items-stretch gap-3 lg:grid-cols-2"><RenewalStatusOverview data={data} /><DueSoonBreakdown breakdown={data.dueSoonBreakdown} totalDueSoon={data.totalDueSoon ?? 0} /></div>
          {data.totalDueSoon > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-danger-100 bg-danger-50/60 px-3 py-2.5 dark:bg-danger-700/10">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger-100 text-danger-600"><TriangleAlert aria-hidden="true" className="size-5" /></span>
              <p className="text-xs font-semibold text-text-primary">Needs attention</p>
              <p className="min-w-0 flex-1 text-[11px] text-text-secondary">{data.totalDueSoon} renewals are due within the next 60 days. Keep track and renew on time to avoid interruptions.</p>
              <Link to="/renewals" className="inline-flex items-center gap-2 rounded-lg bg-danger-100/70 px-3 py-2 text-[11px] font-semibold text-primary-700 hover:underline">View renewals<ArrowRight aria-hidden="true" className="size-3" /></Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
