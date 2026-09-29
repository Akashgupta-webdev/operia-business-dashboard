import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@operio/ui/components/button";
import { useVatList, useVatCompanies } from "../hooks/useVat";
import { STAGES } from "../constants/vat";
import { apiDate, label, money, overdue, showDate, idOf } from "../utils/vat";
import { ErrorNotice, Field, Panel, VatGuard } from "../components/VatCommon";

export function VatQueue({ clientId, companies = [], clientName }) {
  const [params] = useSearchParams();
  const cache = useQueryClient();
  const references = useVatCompanies({ page: 1, limit: 100 }, !clientId);
  const knownClients = cache.getQueriesData({ queryKey: ["client-detail"] }).map(([, data]) => data).filter(Boolean);
  const companyReferences = [...companies, ...(references.data?.data ?? []), ...knownClients.flatMap((data) => data.companies ?? [])];
  const [filters, setFilters] = useState(() => ({ client: clientId || params.get("client") || "", company: params.get("company") || "", assignedTo: "", status: "", stage: "", fromDate: "", toDate: "" }));
  const [page, setPage] = useState(1);
  const change = (key, value) => { setFilters((previous) => ({ ...previous, [key]: value })); setPage(1); };
  const invalid = ["client", "company", "assignedTo"].some((key) => filters[key] && !/^[a-f\d]{24}$/i.test(filters[key])) || (filters.fromDate && filters.toDate && filters.fromDate > filters.toDate);
  const request = Object.fromEntries(Object.entries(filters).filter(([, value]) => value).map(([key, value]) => [key, key.endsWith("Date") ? apiDate(value) : value]));
  if (clientId) request.client = clientId;
  const query = useVatList({ ...request, page, limit: 25 }, !invalid);
  const rows = query.data?.data ?? [];
  return <div className="space-y-5"><header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-section-heading font-bold">VAT filings</h1><p className="text-caption text-text-secondary">Explicit periods, retained evidence, and manually recorded returns.</p></div><Link className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground" to={`/vat-filings/new${clientId ? `?client=${clientId}` : ""}`}>New filing</Link></header>
    <Panel title="Work queue"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{!clientId && <Field title="Client ID" value={filters.client} onChange={(v) => change("client", v)} />}{["company", "assignedTo"].map((key) => <Field key={key} title={key === "company" ? "Company ID" : "Assignee Admin ID"} value={filters[key]} onChange={(v) => change(key, v)} />)}<Field title="Filing stage" options={STAGES} value={filters.stage} onChange={(v) => change("stage", v)} /><Field title="Service status" options={["Pending", "In Progress", "Completed", "Cancelled"]} value={filters.status} onChange={(v) => change("status", v)} />{["fromDate", "toDate"].map((key) => <Field key={key} title={key === "fromDate" ? "Deadline from" : "Deadline through"} type="date" value={filters[key]} onChange={(v) => change(key, v)} />)}</div><p className="text-caption text-text-muted">Sorted by statutory deadline. Blank status includes cancelled and completed filings. Due-today filings are not overdue.</p>{invalid && <p role="alert">Use 24-character hexadecimal IDs and an ordered deadline range.</p>}
    {query.isFetching && <p role="status">Loading filings…</p>}<ErrorNotice error={query.error} reload={query.refetch} />
    {!invalid && !query.isFetching && !query.isError && (rows.length ? <div className="overflow-x-auto"><table className="w-full min-w-240 text-left text-caption"><thead><tr>{["Company / Client", "TRN / period", "Deadline", "Progress / assignee", "VAT settlement", "Service fee", ""].map((title) => <th key={title} className="border-b p-3">{title}</th>)}</tr></thead><tbody>{rows.map((s) => { const company = companyReferences.find((c) => idOf(c) === s.company); return <tr key={s.id} className="border-b"><td className="p-3">{company?.companyName || s.company}<br /><Link to={`/clients/${s.client}?tab=filing-vat`} className="text-primary underline">{clientName || company?.clientName || knownClients.find((data) => idOf(data.client) === s.client)?.client?.name || s.client}</Link></td><td className="p-3">{s.details?.vat?.trn}<br />{showDate(s.details?.vat?.periodStart)} – {showDate(s.details?.vat?.periodEnd)}</td><td className="p-3">{showDate(s.dueDate)}{overdue(s) && <strong className="block text-destructive">Overdue</strong>}</td><td className="p-3">{s.status} · {label(s.details?.vat?.stage)}<br />{s.assignedTo || "Unassigned"}</td><td className="p-3">{label(s.details?.vat?.settlement?.status)}<br />{money(s.details?.vat?.calculation?.netVat)}</td><td className="p-3">{money(s.packagePrice)}<br />{s.paymentStatus || "Not recorded"}</td><td className="p-3"><Link className="text-primary underline" to={`/vat-filings/${s.id}`}>Open filing</Link></td></tr>; })}</tbody></table></div> : <p>No VAT filings match these filters.</p>)}
    <div className="flex items-center gap-4"><Button variant="outline" disabled={page === 1 || query.isFetching} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {query.data?.page?.number ?? page}</span><Button variant="outline" disabled={!query.data?.page?.hasMore || query.isFetching || Boolean(query.error) || Boolean(invalid)} onClick={() => setPage(page + 1)}>Next</Button></div></Panel></div>;
}
export default function VatListPage() { return <VatGuard><div className="p-4 sm:p-6"><VatQueue /></div></VatGuard>; }
