import { useState } from "react";
import useExpenses from "../hooks/useExpenses";
import DeleteExpenseDialog from "./DeleteExpenseDialog";
import { Input } from "@operio/ui/components/input";
import { ReceiptText, Trash2 } from "lucide-react";
import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@operio/ui/components/table";

const currency = new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 2 });

const columns = [
  "Expense Title / Reason",
  "Expense Category",
  "Vendor / Authority",
  "Amount (AED)",
  "Date",
  "Payment Method",
  "Action",
];

export default function OperatingExpenses({ period }) {
  const [page, setPage] = useState(1);
  const periodKey = `${period.year}-${period.month}`;
  const [previousPeriod, setPreviousPeriod] = useState(periodKey);
  if (previousPeriod !== periodKey) {
    setPreviousPeriod(periodKey);
    setPage(1);
  }
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const query = useExpenses({ page, limit: 50, ...(search ? { search } : {}), ...period });
  const expenses = query.data?.data ?? [];
  const pageInfo = query.data?.page;
  const dateLabel = (expense) => (expense.expenseDate || expense.createdAt || "").slice(0, 10) || "\u2014";

  return (
    <Card className="gap-0 overflow-hidden border border-border-default bg-surface-primary py-0 shadow-card ring-0">
      <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); }} className="flex flex-wrap items-center gap-3 border-b border-border-default p-4">
        <Input type="search" aria-label="Search expense titles" placeholder="Search expense titles..." maxLength={200} value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="h-9 min-h-9! max-w-xs rounded-[4px] text-xs md:text-xs" />
        <Button type="submit" variant="outline" className="h-9 min-h-9 rounded-[4px] px-4 text-xs">Search</Button>
      </form>
      {query.isError && <div role="alert" className="flex items-center gap-3 px-5 py-4 text-caption text-danger-600">{query.error?.response?.data?.error?.message || "Unable to load expenses."}<Button variant="outline" size="sm" onClick={() => query.refetch()}>Try again</Button></div>}
      {query.isFetching && <p role="status" className="px-5 py-3 text-caption text-text-muted">Loading expenses...</p>}
      <div className="overflow-x-auto">
        <Table aria-label="Operating expenses" className="min-w-[1050px]">
          <TableHeader>
            <TableRow className="border-border-default bg-surface-secondary/50 hover:bg-surface-secondary/50">
              {columns.map((column) => <TableHead key={column} className="h-11 px-5 text-[10px] font-bold tracking-wide text-text-muted uppercase last:text-center">{column}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses?.map((expense) => (
              <TableRow key={expense.id} className="border-border-default text-caption">
                <TableCell className="max-w-64 whitespace-normal px-5 py-4 font-semibold text-text-primary">{expense.expenseTitle}</TableCell>
                <TableCell className="px-5 py-4"><span className="inline-flex rounded border border-danger-100 bg-danger-50 px-2 py-0.5 text-[10px] font-semibold text-danger-600">{expense.expenseCategory}</span></TableCell>
                <TableCell className="max-w-56 whitespace-normal px-5 py-4 text-text-secondary">{expense.vendorName || "\u2014"}</TableCell>
                <TableCell className="px-5 py-4 font-bold text-danger-600 tabular-nums">{currency.format(expense.expenseAmount?.$numberDecimal ?? expense.expenseAmount ?? "0")}</TableCell>
                <TableCell className="px-5 py-4 text-text-secondary tabular-nums">{dateLabel(expense)}</TableCell>
                <TableCell className="px-5 py-4 text-text-muted">{expense.paymentMethod || "\u2014"}</TableCell>
                <TableCell className="px-5 py-4 text-center"><Button type="button" variant="ghost" size="icon" disabled={query.isFetching} onClick={() => setSelectedExpense(expense)} aria-label={`Delete ${expense.expenseTitle}`} className="size-7 text-text-muted hover:text-danger-600"><Trash2 aria-hidden="true" className="size-3.5" /></Button></TableCell>
              </TableRow>
            ))}
            {!query.isPending && !query.isError && !expenses.length && <TableRow className="hover:bg-transparent"><TableCell colSpan={columns.length} className="px-5 py-10 text-center whitespace-normal">
              <ReceiptText aria-hidden="true" className="mx-auto mb-3 size-6 text-text-muted" />
              <p className="text-body-sm font-semibold text-text-primary">No operating expenses found</p>
              <p className="mt-1 text-caption text-text-muted">Try another search or reporting period, or use Record Expense to add an expense.</p>
            </TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border-default px-5 py-3 text-caption text-text-muted">
        <span>{pageInfo ? `${pageInfo.total} expenses | Page ${page} of ${Math.max(1, pageInfo.totalPages)}` : "Expenses"}</span>
        <div className="flex gap-2"><Button size="sm" variant="outline" disabled={page === 1 || query.isFetching} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={query.isFetching || !pageInfo || page >= pageInfo.totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button></div>
      </div>
      <DeleteExpenseDialog expense={selectedExpense} onClose={() => setSelectedExpense(null)} onDeleted={() => { if (expenses.length === 1 && page > 1) setPage((value) => value - 1); }} />
    </Card>
  );
}
