import { ArrowRight, CalendarClock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@operio/ui/components/card";
import { Skeleton } from "@operio/ui/components/skeleton";
import { cn } from "@operio/ui/lib/utils";

export function DashboardMetricCard({ icon: Icon, label, value, helper, href, tone = "primary" }) {
  const tones = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
    info: "bg-info-50 text-info-600 dark:bg-info-700/20 dark:text-info-500",
    success: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500",
    danger: "bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500",
  };


  const backgrounds = {
    primary: "from-primary-50/70 border-primary-100/60",
    danger: "from-danger-50/70 border-danger-100/60",
    warning: "from-warning-50/80 border-warning-100/60",
    info: "from-info-50/80 border-info-100/60",
    success: "from-success-50/80 border-success-100/60",
  };
  const card = (
    <Card size="sm" className={cn("h-full min-h-28 flex-row items-start gap-4 border bg-gradient-to-br to-surface-primary p-4 shadow-none ring-0 transition-shadow hover:shadow-md", backgrounds[tone])}>
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", tones[tone])}><Icon aria-hidden="true" className="size-6" /></span>
      <div className="min-w-0 flex-1">
        <p className="text-2xl leading-7 font-bold tracking-tight text-text-primary" data-numeric>{value ?? 0}</p>
        <p className="mt-1 text-[11px] leading-4 font-semibold text-text-primary">{label}</p>
        <p className={cn("mt-0.5 text-[10px] leading-4", tone === "danger" ? "text-danger-600" : tone === "warning" ? "text-warning-700" : "text-text-muted")}>{helper}</p>
      </div>
    </Card>
  );

  if (!href) return card;

  return <Link to={href} aria-label={`${label}: ${value ?? 0}. ${helper}`} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">{card}</Link>;
}

export function CategoryBreakdown({ items }) {
  return (
    <Card className="gap-4 border border-border-default/50 bg-surface-primary p-4 shadow-none ring-0">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-sm font-bold text-text-primary">Category Breakdown</h2><p className="mt-1 text-[11px] text-text-muted">Renewals tracked by category</p></div><Link to="/renewals" className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-[10px] font-semibold text-primary-700 hover:underline">View all categories<ArrowRight aria-hidden="true" className="size-3" /></Link></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, value, badge, href, tone = "primary" }) => (
          <div key={label} className="relative flex items-center gap-3 rounded-xl border border-border-default/60 bg-surface-primary p-3">
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tone === "success" ? "bg-success-50 text-success-600" : tone === "warning" ? "bg-warning-50 text-warning-600" : "bg-primary-50 text-primary-600")}><Icon aria-hidden="true" className="size-4" /></span>
            <div className="min-w-0"><p className="truncate text-[10px] leading-4 font-semibold text-text-muted">{href ? <Link to={href} className="after:absolute after:inset-0 after:rounded-xl hover:text-primary-600 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary-500">{label}</Link> : label}</p><div className="mt-0.5 flex items-center gap-2"><span className="text-body-sm font-bold text-text-primary" data-numeric>{value ?? 0}</span><span className={cn("rounded-md px-1.5 py-0.5 text-[8px] font-semibold", tone === "success" ? "bg-success-50 text-success-700" : tone === "warning" ? "bg-warning-50 text-warning-700" : "bg-primary-50 text-primary-700")}>{badge}</span></div></div>
            {href && <ChevronRight aria-hidden="true" className="ml-auto size-4 shrink-0 text-text-muted" />}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function RenewalStatusOverview({ data }) {
  const total = data.totalRenewalsTracked ?? 0;
  const rows = [
    { label: "Valid & Compliant", value: data.validAndCompliant ?? 0, color: "bg-success-500", cssColor: "var(--success-500)" },
    { label: "Due Soon (0–60d)", value: data.totalDueSoon ?? 0, color: "bg-warning-500", cssColor: "var(--warning-500)" },
    { label: "Expired", value: data.totalExpired ?? 0, color: "bg-danger-500", cssColor: "var(--danger-500)" },
  ];
  let cursor = 0;
  const gradientStops = rows.map((row) => {
    const start = cursor;
    cursor += total ? (row.value / total) * 100 : 0;
    return `${row.cssColor} ${start}% ${cursor}%`;
  });
  const chartBackground = total ? `conic-gradient(${gradientStops.join(", ")})` : "var(--neutral-200)";

  return (
    <Card className="gap-3 border border-border-default bg-surface-primary p-3 shadow-card ring-0 transition-[background-color,box-shadow] sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="text-sm font-bold text-text-primary">Renewal Status Overview</h2><p className="mt-1 text-[11px] text-text-muted">Current status of all tracked renewals</p></div><span className="rounded-lg border border-border-default/60 px-3 py-2 text-[10px] text-text-secondary">All Categories</span></div>
      <div className="grid items-center flex-1 gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <div className="relative mx-auto size-36 rounded-full" style={{ background: chartBackground }} role="img" aria-label={`${total} total renewal items`}><div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-surface-primary"><span className="text-subsection font-bold text-text-primary" data-numeric>{total}</span><span className="text-center text-[10px] leading-3 text-text-muted">Total<br />Renewals</span></div></div>
        <div className="divide-y divide-border-default">
          {rows.map((row) => <div key={row.label} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2 py-2.5"><span className={cn("size-2.5 rounded-full", row.color)} /><span className="truncate text-[10px] font-semibold text-text-secondary">{row.label}</span><span className="text-caption font-bold text-text-primary" data-numeric>{row.value}</span><span className="w-10 text-right text-[10px] text-text-muted" data-numeric>{total ? `${((row.value / total) * 100).toFixed(1)}%` : "0%"}</span></div>)}
        </div>
      </div>
      <Link to="/renewals" className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-[10px] font-semibold text-primary-700 hover:underline">View renewals<ArrowRight aria-hidden="true" className="size-3" /></Link>
    </Card>
  );
}

export function DueSoonBreakdown({ breakdown = {}, totalDueSoon = 0 }) {
  const ranges = [
    ["Within 7 days", breakdown.within7Days],
    ["Within 14 days", breakdown.within14Days],
    ["Within 30 days", breakdown.within30Days],
    ["Within 45 days", breakdown.within45Days],
    ["Within 60 days", breakdown.within60Days],
  ];

  return (
    <Card className="gap-4 border border-border-default/50 bg-surface-primary p-4 shadow-none ring-0">
      <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="text-sm font-bold text-text-primary">Due Soon Breakdown</h2><p className="mt-1 text-[10px] text-text-muted">Cumulative renewal counts by deadline</p></div><span className="flex shrink-0 items-center gap-2 rounded-lg border border-border-default/60 px-2 py-2 text-[10px] text-text-secondary"><CalendarClock aria-hidden="true" className="size-3.5 text-primary-600" />Next 60 days</span></div>
      <div className="flex flex-1 flex-col justify-center gap-4 py-2">
        {ranges.map(([label, rawValue]) => {
          const value = rawValue ?? 0;
          const percentage = totalDueSoon ? Math.min(100, (value / totalDueSoon) * 100) : 0;
          return <div key={label} className="grid grid-cols-[5.5rem_minmax(0,1fr)_1.5rem] items-center gap-3"><span className="text-[10px] text-text-secondary">{label}</span><div className="h-2.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-valuetext={value + " of " + totalDueSoon + " renewals"}><div className="h-full rounded-full bg-warning-500" style={{ width: percentage + "%" }} /></div><span className="text-right text-xs font-bold text-text-primary" data-numeric>{value}</span></div>;
        })}
      </div>
      <Link to="/renewals" className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-[10px] font-semibold text-primary-700 hover:underline">View all renewals<ArrowRight aria-hidden="true" className="size-3" /></Link>
    </Card>
  );
}

export function DashboardSkeleton() {
  return <div className="space-y-3"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 rounded-xl" />)}</div><Skeleton className="h-34 rounded-xl" /><div className="grid gap-3 lg:grid-cols-2"><Skeleton className="h-72 rounded-xl" /><Skeleton className="h-72 rounded-xl" /></div></div>;
}
