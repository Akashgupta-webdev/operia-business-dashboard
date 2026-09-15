import { ArrowRight, CalendarClock } from "lucide-react";
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

  const card = (
    <Card size="sm" className={cn("h-full flex-row items-center gap-3 border border-border-default bg-surface-primary p-3 shadow-card ring-0 transition-colors", href && "group-hover:border-primary-300")}>
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tones[tone])}><Icon aria-hidden="true" className="size-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] leading-4 font-semibold text-text-muted">{label}</p>
        {href ? <p className={cn("mt-0.5 flex items-center gap-1 truncate text-[9px] leading-4 font-semibold group-hover:underline", tone === "danger" ? "text-danger-600" : tone === "success" ? "text-success-700" : tone === "warning" ? "text-warning-700" : "text-primary-700")}>{helper}<ArrowRight aria-hidden="true" className="size-2.5" /></p> : <p className="mt-0.5 truncate text-[9px] leading-4 text-text-muted">{helper}</p>}
      </div>
      <p className={cn("ml-auto text-body-sm font-bold", tone === "danger" ? "text-danger-600" : "text-text-primary")} data-numeric>{value ?? 0}</p>
    </Card>
  );

  if (!href) return card;

  return <Link to={href} aria-label={`${label}: ${value ?? 0}. ${helper}`} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">{card}</Link>;
}

export function CategoryBreakdown({ items }) {
  return (
    <Card className="gap-4 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 sm:p-5 sm:py-5">
      <div className="flex items-center justify-between"><h2 className="text-body-sm font-semibold text-text-primary">Category Breakdown</h2><Link to="/renewals" className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary-700 hover:underline">View all<ArrowRight aria-hidden="true" className="size-3" /></Link></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {items.map(({ icon: Icon, label, value, badge, tone = "primary" }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-3">
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tone === "success" ? "bg-success-50 text-success-600" : tone === "warning" ? "bg-warning-50 text-warning-600" : "bg-primary-50 text-primary-600")}><Icon aria-hidden="true" className="size-4" /></span>
            <div className="min-w-0"><p className="truncate text-[10px] leading-4 font-semibold text-text-muted">{label}</p><div className="mt-0.5 flex items-center gap-2"><span className="text-body-sm font-bold text-text-primary" data-numeric>{value ?? 0}</span><span className={cn("rounded-md px-1.5 py-0.5 text-[8px] font-semibold", tone === "success" ? "bg-success-50 text-success-700" : tone === "warning" ? "bg-warning-50 text-warning-700" : "bg-primary-50 text-primary-700")}>{badge}</span></div></div>
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
    <Card className="gap-4 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 sm:p-5 sm:py-5">
      <h2 className="text-body-sm font-semibold text-text-primary">Renewal Status Overview</h2>
      <div className="grid items-center gap-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
        <div className="relative mx-auto size-36 rounded-full" style={{ background: chartBackground }} role="img" aria-label={`${total} total renewal items`}><div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-surface-primary"><span className="text-subsection font-bold text-text-primary" data-numeric>{total}</span><span className="text-[10px] text-text-muted">Total</span></div></div>
        <div className="divide-y divide-border-default">
          {rows.map((row) => <div key={row.label} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2 py-2.5"><span className={cn("size-2.5 rounded-full", row.color)} /><span className="truncate text-[10px] font-semibold text-text-secondary">{row.label}</span><span className="text-caption font-bold text-text-primary" data-numeric>{row.value}</span><span className="w-10 text-right text-[10px] text-text-muted" data-numeric>{total ? `${((row.value / total) * 100).toFixed(1)}%` : "0%"}</span></div>)}
        </div>
      </div>
      <Link to="/renewals" className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary-700 hover:underline">View renewals<ArrowRight aria-hidden="true" className="size-3" /></Link>
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
    <Card className="gap-4 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 sm:p-5 sm:py-5">
      <div className="flex items-center justify-between"><div><h2 className="text-body-sm font-semibold text-text-primary">Due Soon Breakdown</h2><p className="mt-1 text-[10px] text-text-muted">Cumulative renewal counts by deadline</p></div><CalendarClock aria-hidden="true" className="size-5 text-warning-600" /></div>
      <div className="space-y-3">
        {ranges.map(([label, rawValue]) => {
          const value = rawValue ?? 0;
          const percentage = totalDueSoon ? Math.min(100, (value / totalDueSoon) * 100) : 0;
          return <div key={label}><div className="mb-1.5 flex items-center justify-between"><span className="text-[10px] font-semibold text-text-secondary">{label}</span><span className="text-caption font-bold text-text-primary" data-numeric>{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-surface-secondary" role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax={totalDueSoon} aria-valuenow={value}><div className="h-full rounded-full bg-warning-500" style={{ width: `${percentage}%` }} /></div></div>;
        })}
      </div>
      <Link to="/renewals" className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary-700 hover:underline">View all renewals<ArrowRight aria-hidden="true" className="size-3" /></Link>
    </Card>
  );
}

export function DashboardSkeleton() {
  return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="h-18 rounded-xl" />)}</div><Skeleton className="h-34 rounded-xl" /><div className="grid gap-4 xl:grid-cols-2"><Skeleton className="h-72 rounded-xl" /><Skeleton className="h-72 rounded-xl" /></div></div>;
}
