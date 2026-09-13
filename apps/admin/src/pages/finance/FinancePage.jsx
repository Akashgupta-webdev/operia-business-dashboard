import { useState } from "react";
import { AlertCircle, CalendarDays, Download, FileText, Link2, Plus, Printer, ReceiptText, TrendingDown, TrendingUp, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FINANCE_MONTHS } from "@/constants/finance";
import useProfitLoss from "@/hooks/useProfitLoss";
import { cn } from "@/lib/utils";
import { FinanceSummaryCard, ProfitLossSkeleton, ProfitLossStatement } from "./components/ProfitLossStatement";
import RecordExpenseDialog from "./components/RecordExpenseDialog";
import RevenueInflows from "./components/RevenueInflows";

function money(value) {
  const amount = Number(value ?? 0);
  return `AED ${new Intl.NumberFormat("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(amount) ? amount : 0)}`;
}

function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function exportReport(report) {
  const rows = [
    ["Profit and Loss Report", `${report.period.month}/${report.period.year}`],
    [],
    ["KPI", "Amount"],
    ["Collected Inflow", report.kpi.collectedInflow],
    ["Total Outflow", report.kpi.totalOutflow],
    ["Net Operating Profit", report.kpi.netOperatingProfit],
    ["Net Operating Profit Margin", report.kpi.netOperatingProfitMargin],
    ["Accounts Receivable", report.kpi.accountReceivable],
    [],
    ["Revenue Category", "Amount"],
    ...(report.inflows?.categories ?? []).map(({ category, amount }) => [category, amount]),
    ["Total Gross Revenue", report.inflows?.totalGrossRevenue],
    [],
    ["Expense Category", "Amount"],
    ...(report.outflows?.categories ?? []).map(({ category, amount }) => [category, amount]),
    ["Total Operating Expense", report.outflows?.totalOperatingExpense],
  ];
  const blob = new Blob([rows.map((row) => row.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `profit-loss-${report.period.year}-${String(report.period.month).padStart(2, "0")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function FinancePage() {
  const today = new Date();
  const [period, setPeriod] = useState({ month: today.getMonth() + 1, year: 2026 });
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profit-loss");
  const query = useProfitLoss(period);
  const report = query.data;
  const netProfit = Number(report?.kpi?.netOperatingProfit ?? 0);
  const selectedMonth = FINANCE_MONTHS.find((month) => Number(month.value) === period.month)?.label;

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] bg-app-background px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <div className="min-w-0"><h1 className="text-section-heading font-bold text-text-primary">{activeTab === "revenue-inflows" ? "Revenue Inflows" : "Finance — Profit & Loss (P&L)"}</h1><p className="mt-1 text-body-md text-text-secondary">{activeTab === "revenue-inflows" ? "Track client service package inflows and payment status." : "Track client fee revenues, operating disbursements and net profit margins."}</p></div>
        {activeTab === "profit-loss" && <div className="flex flex-wrap items-center gap-2 xl:ml-auto">
          <div className="flex items-center gap-2" aria-label="Profit and loss period filters">
            <label htmlFor="finance-month" className="sr-only">Reporting month</label>
            <Select value={String(period.month)} onValueChange={(value) => setPeriod((current) => ({ ...current, month: Number(value) }))}>
              <SelectTrigger id="finance-month" size="sm" className="h-8 w-32 bg-surface-primary text-[11px]">
                <SelectValue>{selectedMonth}</SelectValue>
              </SelectTrigger>
              <SelectContent>{FINANCE_MONTHS.map((month) => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}</SelectContent>
            </Select>
            <label htmlFor="finance-year" className="sr-only">Operating year</label>
            <Select value={String(period.year)} onValueChange={(value) => setPeriod((current) => ({ ...current, year: Number(value) }))}>
              <SelectTrigger id="finance-year" size="sm" className="h-8 w-24 bg-surface-primary text-[11px]">
                <SelectValue>2026</SelectValue>
              </SelectTrigger>
              <SelectContent><SelectItem value="2026">2026</SelectItem></SelectContent>
            </Select>
          </div>
          <Button type="button" size="sm" variant="outline" disabled={!report} onClick={() => window.print()} className="h-8 gap-1.5 px-3 text-[10px]"><Printer aria-hidden="true" className="size-3.5" />Print P&amp;L</Button>
          <Button type="button" size="sm" variant="outline" disabled={!report} onClick={() => exportReport(report)} className="h-8 gap-1.5 px-3 text-[10px]"><Download aria-hidden="true" className="size-3.5" />Export CSV</Button>
          <Button type="button" size="sm" onClick={() => setExpenseDialogOpen(true)} className="h-8 gap-1.5 px-3 text-[10px]"><Plus aria-hidden="true" className="size-3.5" />Record Expense</Button>
        </div>}
      </header>

      {report && <section aria-label="Finance summary" className={cn("mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 transition-opacity", query.isFetching && "opacity-60")}>
        <FinanceSummaryCard icon={TrendingUp} label="Collected Inflow" value={money(report.kpi?.collectedInflow)} description="Realized package revenue" tone="success" />
        <FinanceSummaryCard icon={TrendingDown} label="Total Outflows" value={money(report.kpi?.totalOutflow)} description="Operating expenses" tone="danger" />
        <FinanceSummaryCard icon={WalletCards} label="Net Operating Profit" value={money(report.kpi?.netOperatingProfit)} description={`Margin: ${Number(report.kpi?.netOperatingProfitMargin ?? 0).toFixed(1)}%`} tone={netProfit >= 0 ? "success" : "danger"} />
        <FinanceSummaryCard icon={ReceiptText} label="Accounts Receivable" value={money(report.kpi?.accountReceivable)} description="Pending client collections" tone="warning" />
      </section>}

      <Card className="mt-5 border border-border-default bg-surface-primary p-3 py-3 shadow-card ring-0 sm:p-4 sm:py-4">
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Button type="button" size="sm" variant={activeTab === "profit-loss" ? "default" : "ghost"} onClick={() => setActiveTab("profit-loss")} className="h-8 shrink-0 gap-2 px-3 text-[10px]"><FileText aria-hidden="true" className="size-3.5" />P&amp;L Statement</Button>
          <Button type="button" variant={activeTab === "revenue-inflows" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("revenue-inflows")} className="h-8 shrink-0 gap-2 px-3 text-[10px]"><Link2 aria-hidden="true" className="size-3.5" />Revenue Inflows</Button>
          <Button type="button" variant="ghost" size="sm" disabled className="h-8 shrink-0 gap-2 px-3 text-[10px] opacity-100"><ReceiptText aria-hidden="true" className="size-3.5" />Operating Expenses</Button>
          <Button type="button" variant="ghost" size="sm" disabled className="h-8 shrink-0 gap-2 px-3 text-[10px] opacity-100"><CalendarDays aria-hidden="true" className="size-3.5" />Monthly Financial Trajectory</Button>
        </div>
      </Card>

      <main className="mt-5">
        {activeTab === "profit-loss" && <>{query.isPending && <ProfitLossSkeleton />}
          {query.isError && !report && <Card role="alert" className="items-center gap-3 border border-danger-200 bg-danger-50 px-6 py-12 text-center ring-0"><AlertCircle aria-hidden="true" className="size-8 text-danger-600" /><h2 className="text-body-lg font-semibold text-danger-700">Unable to load the P&amp;L report</h2><p className="text-caption text-text-secondary">{query.error?.response?.data?.error?.message ?? "The financial report request could not be completed."}</p><Button type="button" variant="outline" onClick={() => query.refetch()}>Try again</Button></Card>}
          {query.isError && report && <div role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-caption text-warning-700"><AlertCircle aria-hidden="true" className="size-4" />Unable to refresh the report. Showing the last available period.</div>}
          {report && <div className={cn("transition-opacity", query.isFetching && "opacity-60")}><ProfitLossStatement report={report} /></div>}</>}
        {activeTab === "revenue-inflows" && <RevenueInflows />}
      </main>

      <RecordExpenseDialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen} />
    </div>
  );
}
