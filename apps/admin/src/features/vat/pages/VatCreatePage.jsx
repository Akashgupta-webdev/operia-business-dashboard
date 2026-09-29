import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@operio/ui/components/button";
import useClient from "@/features/clients/hooks/useClient";
import { useVatCompanies, useVatMutation } from "../hooks/useVat";
import { createPayload } from "../schemas/vat";
import { errorInfo, idOf } from "../utils/vat";
import { ErrorNotice, Field, FeeFields, Panel, PeriodFields, VatGuard } from "../components/VatCommon";
function CreateForm() {
  const [params] = useSearchParams();
  const clientId = params.get("client");
  const client = useClient(clientId);
  const [search, setSearch] = useState(""); const [page, setPage] = useState(1);
  const companies = useVatCompanies({ page, limit: 20, ...(search.trim() ? { search: search.trim() } : {}) }, !clientId);
  const options = clientId ? (client.data?.companies ?? []).map((c) => ({ ...c, client: clientId })) : companies.data?.data ?? [];
  const [selected, setSelected] = useState(null);
  const [values, setValues] = useState({}); const [error, setError] = useState(null); const [blocked, setBlocked] = useState(false);
  const set = (key, value) => setValues((previous) => ({ ...previous, [key]: value }));
  const inFlight = useRef(false);
  const mutation = useVatMutation(); const navigate = useNavigate();
  const errors = Object.fromEntries((errorInfo(error).details ?? []).map((d) => [d.field, d.issue]));
  const submit = async (event) => {
    event.preventDefault(); if (inFlight.current || blocked) return;
    inFlight.current = true;
    try { setError(null); const payload = createPayload(values, selected); const result = await mutation.mutateAsync({ kind: "create", companyClient: idOf(selected.client), payload }); navigate(`/vat-filings/${result.id}`); }
    catch (caught) { setError(caught); if (errorInfo(caught).uncertain || errorInfo(caught).code === "VAT_PERIOD_EXISTS") setBlocked(true); }
    finally { inFlight.current = false; }
  };
  return <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6"><Link to="/vat-filings" className="text-primary underline">VAT filings</Link><Panel title="Create VAT filing"><p className="text-sm text-text-secondary">Copy the actual period and statutory deadline from EmaraTax. Dates are not inferred from the package label. Upload evidence after creation.</p><form onSubmit={submit} className="space-y-5"><fieldset disabled={mutation.isPending} className="space-y-5">{!clientId && <Field title="Search companies by name" maxLength={100} value={search} onChange={(value) => { setSearch(value); setPage(1); }} />}{(clientId ? client.isPending : companies.isPending) && <p role="status">Loading companies…</p>}<ErrorNotice error={clientId ? client.error : companies.error} reload={clientId ? client.refetch : companies.refetch} /><Field title="Company / client" value={idOf(selected) ?? ""} onChange={(value) => setSelected(options.find((c) => idOf(c) === value) ?? null)} options={[...(selected && !options.some((c) => idOf(c) === idOf(selected)) ? [selected] : []), ...options].map((c) => ({ value: idOf(c), label: `${c.companyName} — ${c.clientName || client.data?.client?.name || c.client}` }))} error={errors.company} />{!clientId && <div className="flex items-center gap-3"><Button type="button" variant="outline" disabled={page === 1 || companies.isFetching} onClick={() => setPage(page - 1)}>Previous companies</Button><span>Page {page}</span><Button type="button" variant="outline" disabled={page >= (companies.data?.page?.totalPages ?? 1) || companies.isFetching} onClick={() => setPage(page + 1)}>Next companies</Button></div>}<p className="text-sm">Company TRN: <strong>{selected?.vatTaxRegistrationNumber || "Not recorded"}</strong></p>{selected && !/^\d{15}$/.test(selected.vatTaxRegistrationNumber ?? "") && <p role="alert" className="text-destructive">A valid 15-digit TRN is required in company master data. For clients with multiple companies, resolve the company-specific update with your administrator.</p>}<PeriodFields values={values} set={set} errors={errors} /><FeeFields values={values} set={set} errors={errors} /><p className="text-caption text-text-muted">The filing starts unassigned. You can assign it to yourself after creation. Other Admin assignments require staff-directory support.</p></fieldset><ErrorNotice error={error} company={idOf(selected)} />{blocked && <div className="space-y-3"><Link className="underline" to={`/vat-filings?company=${idOf(selected)}`}>Check existing periods, including cancelled filings</Link><p>Creation may already have succeeded. Check the company queue before retrying.</p><Button type="button" variant="outline" onClick={() => setBlocked(false)}>I checked the queue; allow another attempt</Button></div>}<Button disabled={mutation.isPending || blocked || !/^\d{15}$/.test(selected?.vatTaxRegistrationNumber ?? "")} type="submit">{mutation.isPending ? "Creating…" : "Create filing"}</Button></form></Panel></div>;
}
export default function VatCreatePage() { return <VatGuard><CreateForm /></VatGuard>; }
