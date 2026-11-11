import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@operio/ui/components/table";
import { FINANCE_MONTHS } from "../constants/finance";
import useMonthlyProfitLoss from "../hooks/useMonthlyProfitLoss";

const currency = new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 2 });
const amount = (value) => value == null ? "—" : currency.format(Number(value));

export default function MonthlyFinancialTrajectory({ year }) {
  const queries = useMonthlyProfitLoss(year);
  const failed = queries.filter((query) => query.isError);

  return (
    <Card className="gap-0 overflow-hidden border border-border-default bg-surface-primary py-0 shadow-card ring-0">
      <div className="border-b border-border-default px-5 py-4">
        <h2 className="text-body-sm font-semibold text-text-primary">Monthly Profitability Trend</h2>
      </div>
      {failed.length > 0 && <div role="alert" className="flex items-center justify-between gap-3 px-5 py-3 text-caption text-danger-600">Some monthly reports could not be refreshed. Previously loaded values are retained.<Button variant="outline" size="sm" onClick={() => failed.forEach((query) => query.refetch())}>Try again</Button></div>}
      <div className="overflow-x-auto">
        <Table aria-label={`Monthly profitability for ${year}`}>
          <TableHeader><TableRow className="bg-surface-secondary/50">
            {["Period Month", "Total Revenue (AED)", "Total Expenses (AED)", "Net Profit (AED)", "Margin %"].map((label, index) => <TableHead key={label} className={`text-[10px] font-bold uppercase text-text-muted ${index === 4 ? "text-right" : ""}`}>{label}</TableHead>)}
          </TableRow></TableHeader>
          <TableBody>{queries.map((query, index) => {
            const kpi = query.data?.kpi;
            return <TableRow key={FINANCE_MONTHS[index].value} className="border-border-default text-caption font-semibold">
              <TableCell>{FINANCE_MONTHS[index].label.slice(0, 3)} {year}</TableCell>
              {query.isPending ? <TableCell colSpan={4} className="text-text-muted" role="status">Loading month...</TableCell> : !kpi ? <TableCell colSpan={4} className="text-text-muted">{query.isError ? "Unable to load month" : "No report available"}</TableCell> : <>
                <TableCell className="text-success-600 tabular-nums">{amount(kpi.collectedInflow)}</TableCell>
                <TableCell className="text-danger-600 tabular-nums">{amount(kpi.totalOutflow)}</TableCell>
                <TableCell className="text-text-primary tabular-nums">{amount(kpi.netOperatingProfit)}</TableCell>
                <TableCell className="text-right text-primary-600 tabular-nums">{kpi.netOperatingProfitMargin == null ? "—" : `${Number(kpi.netOperatingProfitMargin).toFixed(1)}%`}</TableCell>
              </>}
            </TableRow>;
          })}</TableBody>
        </Table>
      </div>
    </Card>
  );
}
