import { Building2, CalendarDays, ChartNoAxesColumnIncreasing, CircleDollarSign, FileCheck2, Info, Landmark, ReceiptText, Scale, ShieldCheck, WalletCards } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function money(value) {
  const amount = Number(value ?? 0);
  return `AED ${new Intl.NumberFormat("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(amount) ? amount : 0)}`;
}

export function FinanceSummaryCard({ icon: Icon, label, value, description, tone }) {
  const tones = {
    success: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500",
    danger: "bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500",
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500",
  };
  return <Card size="sm" className="flex-row items-center gap-3 border border-border-default bg-surface-primary p-3 shadow-card ring-0"><span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tones[tone])}><Icon aria-hidden="true" className="size-4" /></span><div className="min-w-0"><p className="text-[10px] leading-4 font-semibold text-text-muted">{label}</p><p className="truncate text-[9px] leading-4 text-text-muted">{description}</p></div><p className={cn("ml-auto whitespace-nowrap text-body-sm font-bold", tone === "danger" ? "text-danger-600" : tone === "warning" ? "text-warning-700" : "text-text-primary")} data-numeric>{value}</p></Card>;
}

const inflowIcons = [Building2, ShieldCheck, Landmark, FileCheck2, Scale];
const outflowIcons = [Landmark, ReceiptText, WalletCards, Building2, CircleDollarSign, Scale, FileCheck2];

function StatementGroup({ title, subtitle, categories, total, inflow }) {
  return (
    <section className={cn("overflow-hidden rounded-xl border", inflow ? "border-success-200 dark:border-success-700" : "border-danger-200 dark:border-danger-700")}>
      <header className={cn("flex items-center justify-between gap-3 border-b px-4 py-3", inflow ? "border-success-200 bg-success-50/50 text-success-700 dark:border-success-700 dark:bg-success-700/10 dark:text-success-500" : "border-danger-200 bg-danger-50/50 text-danger-700 dark:border-danger-700 dark:bg-danger-700/10 dark:text-danger-500")}><h3 className="text-[10px] font-bold uppercase">{title}</h3><span className="text-[9px] font-semibold">{subtitle}</span></header>
      <div className="divide-y divide-border-default px-4">
        {categories.map((category, index) => {
          const Icon = (inflow ? inflowIcons : outflowIcons)[index % (inflow ? inflowIcons.length : outflowIcons.length)];
          return <div key={category.category} className="flex items-center gap-3 py-3"><Icon aria-hidden="true" className={cn("size-4 shrink-0", inflow ? "text-success-600" : "text-danger-600")} /><span className="min-w-0 flex-1 truncate text-caption font-medium text-text-secondary">{category.category}</span><span className="whitespace-nowrap text-caption font-semibold text-text-primary" data-numeric>{money(category.amount)}</span></div>;
        })}
      </div>
      <div className={cn("mx-3 mb-3 flex items-center justify-between rounded-lg px-3 py-3 text-[10px] font-bold uppercase", inflow ? "bg-success-50 text-success-700 dark:bg-success-700/10 dark:text-success-500" : "bg-danger-50 text-danger-700 dark:bg-danger-700/10 dark:text-danger-500")}><span>{inflow ? "Total Gross Revenue" : "Total Operating Expenses"}</span><span data-numeric>{money(total)}</span></div>
    </section>
  );
}

export function ProfitLossStatement({ report }) {
  const kpi = report.kpi ?? {};
  const netProfit = Number(kpi.netOperatingProfit ?? 0);
  const isProfit = netProfit >= 0;
  return (
    <Card className="gap-4 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 sm:p-5 sm:py-5">
      <div><h2 className="text-body-sm font-semibold text-text-primary">Profit &amp; Loss Financial Statement (AED)</h2><p className="mt-1 text-[10px] text-text-muted">Comprehensive audit of operating revenues and cost disbursements.</p></div>
      <StatementGroup title="1. Operating Revenue & Package Inflows" subtitle="Gross / Collected (AED)" categories={report.inflows?.categories ?? []} total={report.inflows?.totalGrossRevenue} inflow />
      <StatementGroup title="2. Cost of Operations & Direct Disbursements" subtitle="Total Outflow (AED)" categories={report.outflows?.categories ?? []} total={report.outflows?.totalOperatingExpense} />

      <section className="rounded-xl border border-primary-200 bg-primary-50/30 p-4 dark:border-primary-700 dark:bg-primary-900/10">
        <p className="text-[10px] font-bold uppercase text-primary-700 dark:text-primary-300">3. Net Operating Profit</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem_9rem] sm:items-end">
          <div><p className={cn("text-subsection font-bold", isProfit ? "text-success-700" : "text-danger-600")} data-numeric>{money(kpi.netOperatingProfit)}</p><p className="mt-1 text-[9px] text-text-muted">Calculated as collected inflow minus total outflow.</p></div>
          <div className="rounded-lg border border-border-default bg-surface-primary p-3 text-center"><p className="text-[9px] text-text-muted">Profit Margin</p><p className={cn("mt-1 text-body-sm font-bold", isProfit ? "text-success-700" : "text-danger-600")} data-numeric>{Number(kpi.netOperatingProfitMargin ?? 0).toFixed(1)}%</p></div>
          <div className="rounded-lg border border-border-default bg-surface-primary p-3 text-center"><p className="text-[9px] text-text-muted">Accounts Receivable</p><p className="mt-1 text-body-sm font-bold text-warning-700" data-numeric>{money(kpi.accountReceivable)}</p></div>
        </div>
      </section>

      <div className="grid gap-3 border-t border-border-default pt-4 sm:grid-cols-2 xl:grid-cols-4">
        <FinanceSummaryCard icon={CalendarDays} label="Reporting Period" value={`${report.period?.month ?? "—"}/${report.period?.year ?? "—"}`} description="Selected financial month" tone="primary" />
        <FinanceSummaryCard icon={CircleDollarSign} label="Total Revenue" value={money(kpi.collectedInflow)} description="Collected / realized" tone="success" />
        <FinanceSummaryCard icon={ReceiptText} label="Total Expenses" value={money(kpi.totalOutflow)} description="All operating costs" tone="danger" />
        <FinanceSummaryCard icon={ChartNoAxesColumnIncreasing} label="Net Profit" value={money(kpi.netOperatingProfit)} description="After all expenses" tone={isProfit ? "success" : "danger"} />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-info-200 bg-info-50/50 p-4 text-info-700 dark:border-info-700 dark:bg-info-700/10 dark:text-info-500"><Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><div><p className="text-[10px] font-semibold">Notes</p><p className="mt-1 text-[9px]">All amounts are in AED and include recorded transactions for the selected UTC reporting month.</p></div></div>
    </Card>
  );
}

export function ProfitLossSkeleton() {
  return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-18 rounded-xl" />)}</div><Skeleton className="h-12 rounded-xl" /><Skeleton className="h-150 rounded-xl" /></div>;
}
