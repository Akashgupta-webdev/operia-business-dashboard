import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { cn } from "@operio/ui/lib/utils";
import RenewalPagination from "@/features/renewals/components/RenewalPagination";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import useInvoiceClients from "../hooks/useInvoiceClients";
import { referenceId } from "../utils/invoice";

export default function InvoiceClientPicker({ onSelect, onCancel }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selectedId, setSelectedId] = useState("");
  const debounced = useDebouncedValue(search.trim());
  const query = useInvoiceClients({ page, limit: pageSize, search: debounced });
  const clients = query.data?.clients || [];
  const selected = clients.find((client) => referenceId(client) === selectedId);
  const total = query.data?.page?.total || 0;
  const totalPages = query.data?.page?.totalPages || 0;
  const limit = query.data?.page?.limit || pageSize;
  const waiting = query.isFetching || search.trim() !== debounced;
  function changePage(next) { setPage(next); setSelectedId(""); }

  return <div id="invoice-client-list" className="space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative min-w-0 flex-1">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
        <Input autoFocus type="search" aria-label="Search clients" placeholder="Search by client name, company name or mobile number..." value={search} onChange={(event) => { setSearch(event.target.value); changePage(1); }} style={{ borderRadius: 8 }} className="h-10 border-border-default pl-9 text-xs md:text-xs" />
      </div>
    </div>
    <div className="max-h-[42svh] overflow-auto rounded-lg border border-border-default/60" aria-busy={waiting}>
      <table className="w-full min-w-[520px] text-left text-xs">
        <caption className="sr-only">Select the client for this invoice</caption>
        <thead className="sticky top-0 z-10 bg-surface-secondary text-text-secondary">
          <tr><th scope="col" className="w-14 px-5 py-3"><span className="sr-only">Select client</span><span aria-hidden="true" className="block size-4 rounded-full border border-text-muted/60" /></th>{["Client ID", "Client Name", "Company Name"].map((label) => <th key={label} scope="col" className="whitespace-nowrap px-3 py-3 text-[10px] font-semibold uppercase">{label}</th>)}</tr>
        </thead>
        <tbody>
          {query.isPending ? <tr><td colSpan={4} className="h-64 text-center text-text-muted" role="status">Loading clients...</td></tr> : query.isError ? <tr><td colSpan={4} className="h-64 text-center"><div role="alert" className="space-y-3"><p className="text-destructive">Unable to load clients.</p><Button variant="outline" size="sm" onClick={() => query.refetch()}>Retry</Button></div></td></tr> : clients.length ? clients.map((client, index) => {
            const id = referenceId(client);
            const checked = selectedId === id;
            return <tr key={id} onClick={() => { if (!waiting) setSelectedId(id); }} className={cn("border-t border-border-default/60 transition-colors", waiting ? "opacity-60" : "cursor-pointer hover:bg-primary-50/60", checked && "bg-primary-50 hover:bg-primary-50")}>
              <td className="px-5 py-3"><input type="radio" name="invoice-client" checked={checked} disabled={waiting} onChange={() => setSelectedId(id)} aria-label={`Select ${client.name || "client"}`} className="block size-4 cursor-pointer accent-primary" /></td>
              <td className="whitespace-nowrap px-3 py-3 font-medium" title="Display-only client reference">{`OP-2026-${String((page - 1) * limit + index + 1).padStart(4, "0")}`}</td>
              <td className="px-3 py-3 font-medium">{client.name || "Unnamed client"}</td>
              <td className="px-3 py-3">{client.companyName || "—"}</td>

            </tr>;
          }) : <tr><td colSpan={4} className="h-64 text-center text-text-muted">No clients found. Try another search.</td></tr>}
        </tbody>
      </table>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <p className="text-text-secondary">{`Showing ${total ? (page - 1) * limit + 1 : 0}–${Math.min(page * limit, total)} of ${total} clients`}</p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="invoice-client-page-size" className="text-text-secondary">Rows per page</label>
          <Select value={String(pageSize)} onValueChange={(value) => { if (value) { setPageSize(Number(value)); changePage(1); } }} disabled={waiting}>
            <SelectTrigger id="invoice-client-page-size" className="w-20 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent align="end">{[15, 25, 50].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <RenewalPagination page={page} totalPages={totalPages} disabled={waiting || query.isError} onPageChange={changePage} ariaLabel="Client pagination" href="#invoice-client-list" />
      </div>
    </div>
    <footer className="flex justify-end gap-3 pt-2">
      <Button variant="outline" onClick={onCancel} style={{ borderRadius: 8 }} className="h-10 px-5 text-xs">Cancel</Button>
      <Button onClick={() => onSelect(selected)} disabled={!selected || waiting || query.isError} style={{ borderRadius: 8 }} className="h-10 bg-primary-800 px-5 text-xs text-white hover:bg-primary-900">Next</Button>
    </footer>
  </div>;
}
