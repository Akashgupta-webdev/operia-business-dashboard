import { useState } from "react";
import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import useClient from "@/features/clients/hooks/useClient";
import { useClientFilings } from "@/features/tax-compliance/hooks/useClientCompliance";
import { description, itemModels, referenceId } from "../utils/invoice";

export default function InvoiceItemPicker({ clientId, company, onAdd, disabled }) {
  const [model, setModel] = useState(itemModels[0]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const details = useClient(clientId);
  const filings = useClientFilings(clientId, model === "ClientVATFiling" ? "VAT" : "TAX", page, 20, model !== "ClientService");
  const query = model === "ClientService" ? details : filings;
  const records = model === "ClientService" ? details.data?.services || [] : filings.data?.data || [];
  const recordsForCompany = records.filter((item) => referenceId(item.company ?? item.companyId) === company);
  const options = recordsForCompany.filter((item) => description(item).toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-3 rounded-lg border border-dashed border-primary-200 bg-primary-50/30 p-3">
    <p className="text-xs font-semibold">Add an existing service or filing</p>
    <div className="flex flex-wrap gap-2"><select aria-label="Invoice item type" disabled={disabled} value={model} onChange={(e) => { setModel(e.target.value); setPage(1); }} className="rounded-md border bg-surface-primary p-2 text-xs">{itemModels.map((value) => <option key={value}>{value}</option>)}</select><Input aria-label="Search available items" placeholder="Find an item on this page" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" /></div>
    {query.isPending ? <p role="status" className="text-xs">Loading items…</p> : query.isError ? <p role="alert" className="text-xs">Unable to load items. <Button type="button" variant="outline" onClick={() => query.refetch()}>Retry</Button></p> : <div className="max-h-40 space-y-1 overflow-y-auto">{options.map((item) => <div key={referenceId(item)} className="flex items-center justify-between gap-2 text-xs"><span>{description(item)}</span><Button type="button" size="sm" variant="outline" disabled={disabled} onClick={() => onAdd({ itemModel: model, item: referenceId(item), label: description(item), quantity: 1, governmentRate: "0.00", servicePrice: "0.00", taxCode: "TAXABLE", taxRate: "0.00", taxAmount: "0.00" })}>Add</Button></div>)}{!options.length && <p className="text-xs text-text-muted">No matching items for this company on this page. Select the company associated with the service or filing.</p>}</div>}
    {model !== "ClientService" && <div className="flex items-center gap-3 text-xs"><Button type="button" variant="outline" size="sm" disabled={page === 1 || query.isFetching} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {Math.max(1, filings.data?.page?.totalPages || 0)}</span><Button type="button" variant="outline" size="sm" disabled={page >= (filings.data?.page?.totalPages || 0) || query.isFetching} onClick={() => setPage(page + 1)}>Next</Button></div>}
  </div>;
}
