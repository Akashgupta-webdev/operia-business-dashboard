import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Copy, FileText, Mail, Phone, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { cn } from "@operio/ui/lib/utils";
import { NATIONALITIES } from "@/features/clients/constants/nationalities";
import { useClientCompliance, useClientFilings } from "../hooks/useClientCompliance";
import { formatComplianceDate, getComplianceStatus } from "../utils/complianceDates";
import ClientFilingTable, { ComplianceQueryError } from "../components/ClientFilingTable";

export default function ClientTaxCompliancePage() {
  const { id } = useParams();
  const [tab, setTab] = useState("All");
  const [pagination, setPagination] = useState({ VAT: { page: 1, limit: 20 }, TAX: { page: 1, limit: 20 } });
  const clientQuery = useClientCompliance(id);
  const preview = tab === "All";
  const vatQuery = useClientFilings(id, "VAT", preview ? 1 : pagination.VAT.page, preview ? 5 : pagination.VAT.limit, !clientQuery.isError);
  const taxQuery = useClientFilings(id, "TAX", preview ? 1 : pagination.TAX.page, preview ? 5 : pagination.TAX.limit, !clientQuery.isError);
  const client = clientQuery.data?.data;
  const metrics = clientQuery.data?.metrics;
  const vatTotal = vatQuery.data?.page?.total;
  const taxTotal = taxQuery.data?.page?.total;
  const total = vatTotal != null && taxTotal != null ? vatTotal + taxTotal : null;
  const paid = metrics?.totalFiling;
  const country = NATIONALITIES.find((item) => item.name.toLowerCase() === client?.nationality?.toLowerCase() || (client?.nationality === "UAE" && item.code === "AE"));
  function updatePagination(type, change) { setPagination((value) => ({ ...value, [type]: { ...value[type], ...change } })); }
  const summaries = [
    { label: "Total Filings", value: total, detail: `VAT: ${vatTotal ?? "\u2014"} | TAX: ${taxTotal ?? "\u2014"}`, icon: FileText, style: "bg-primary-50 text-primary" },
    { label: "Paid Filings", value: paid, detail: total != null && paid != null ? `${total ? ((paid / total) * 100).toFixed(1) : 0}% of total` : "Completed payments", icon: CheckCircle2, style: "bg-success-50 text-success-700" },
    { label: "Due Soon", value: metrics?.dueSoon, detail: "Within 30 days", icon: Clock3, style: "bg-warning-50 text-warning-700" },
    { label: "Overdue", value: metrics?.overdue, detail: "Needs attention", icon: TriangleAlert, style: "bg-danger-50 text-danger-700" },
  ];
  return <div className="min-h-[calc(100svh-var(--header-height))] space-y-3 bg-primary-50/30 p-3 text-text-primary sm:p-4">
    <header className="flex flex-wrap items-center justify-between gap-3"><nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm"><Link to="/tax-and-compliance" className="inline-flex items-center gap-2 hover:text-primary"><ChevronLeft className="size-4" />Compliance &amp; Corporate Tax Hub</Link><ChevronRight className="size-3" /><h1 className="font-semibold">Client Detail</h1></nav><Button variant="outline" size="sm" render={<Link to="/tax-and-compliance" />}><ChevronLeft className="size-3.5" />Back to List</Button></header>
    {clientQuery.isPending ? <p role="status" className="p-8 text-sm">Loading client compliance...</p> : clientQuery.isError ? <ComplianceQueryError query={clientQuery} label="client compliance" /> : client && <>
      <Card className="grid gap-4 rounded-xl border border-border-default bg-surface-primary p-4 shadow-none ring-0 xl:grid-cols-[1.4fr_.7fr_1.2fr]">
        <div className="flex items-center gap-4"><span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-50 text-2xl font-medium text-primary">{client.name?.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-semibold">{client.name || "Unnamed client"}</h2><span className={cn("rounded-full px-3 py-1 text-[11px]", client.status === "Active" ? "bg-success-50 text-success-700" : "bg-neutral-100 text-text-secondary")}>{client.status || "Unknown"}</span></div><p className="mt-1 text-xs text-text-secondary">{client.companyName || "No company recorded"}</p><div className="mt-3 flex flex-wrap gap-3 text-xs text-text-secondary"><span className="inline-flex items-center gap-2">{country && <img src={`${import.meta.env.BASE_URL}flags/${country.code.toLowerCase()}.png`} alt="" className="h-3 w-4 object-contain" />}{client.nationality || "\u2014"}</span><span className="inline-flex items-center gap-2"><Phone className="size-3.5" />{client.mobileNumber || "\u2014"}</span><span className="inline-flex items-center gap-2 break-all"><Mail className="size-3.5 shrink-0" />{client.emailAddress || "\u2014"}</span></div></div></div>
        <div className="rounded-lg bg-primary-50/60 px-3"><Registration label="VAT TRN" value={client.vatTaxRegistrationNumber} /><Registration label="Corporate Tax TRN" value={client.corporateTaxNumber} /></div>
        <div><h2 className="mb-2 text-xs font-semibold">Important Dates</h2><div className="grid gap-2 sm:grid-cols-2"><Deadline label="Next VAT Due" value={client.nextVATDue} /><Deadline label="Next TAX Due" value={client.nextTAXDue} /></div></div>
      </Card>
      <div role="group" aria-label="Filing type" className="flex gap-2">{["All", "VAT", "TAX"].map((type) => <Button key={type} aria-pressed={tab === type} onClick={() => setTab(type)} className={cn("h-8 min-w-20 rounded-full text-xs", tab === type ? "bg-primary text-primary-foreground" : "border border-primary-100 bg-primary-50 text-primary hover:bg-primary-100")}>{type}</Button>)}</div>
      <section aria-label="Client compliance summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{summaries.map(({ label, value, detail, icon: Icon, style }) => <Card key={label} className="flex-row items-center gap-4 rounded-xl border border-border-default bg-surface-primary p-3 shadow-none ring-0"><span className={cn("rounded-xl p-3", style)}><Icon className="size-6" aria-hidden="true" /></span><div><p className="text-lg font-semibold tabular-nums">{value ?? "\u2014"}</p><h2 className="text-xs font-medium">{label}</h2><p className="mt-1 text-[11px] text-text-muted">{detail}</p></div></Card>)}</section>
      {["VAT", "TAX"].filter((type) => preview || tab === type).map((type) => <ClientFilingTable key={type} type={type} trn={type === "VAT" ? client.vatTaxRegistrationNumber : client.corporateTaxNumber} query={type === "VAT" ? vatQuery : taxQuery} preview={preview} page={preview ? 1 : pagination[type].page} limit={preview ? 5 : pagination[type].limit} onPageChange={(page) => updatePagination(type, { page })} onLimitChange={(limit) => updatePagination(type, { limit, page: 1 })} onViewMore={() => { updatePagination(type, { page: 1 }); setTab(type); }} />)}
    </>}
  </div>;
}

function Registration({ label, value }) {
  async function copy() { try { await navigator.clipboard.writeText(value); toast.success(`${label} copied`); } catch { toast.error("Unable to copy registration number"); } }
  return <div className="flex items-center justify-between gap-2 border-b border-primary-100 py-2 last:border-0"><div><p className="text-[10px] text-text-secondary">{label}</p><p className="mt-1 text-xs font-medium tabular-nums">{value || "\u2014"}</p></div><Button variant="ghost" size="icon-sm" disabled={!value} aria-label={`Copy ${label}`} onClick={copy}><Copy className="size-3.5" /></Button></div>;
}

function Deadline({ label, value }) {
  const status = getComplianceStatus(value);
  return <div className="flex items-start gap-2 rounded-lg border border-border-default p-2"><CalendarDays className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-[10px] text-text-secondary">{label}</p><p className="mt-1 whitespace-nowrap text-xs font-semibold">{formatComplianceDate(value)}</p><span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px]", status === "Overdue" ? "bg-danger-50 text-danger-700" : status === "Due Soon" ? "bg-warning-50 text-warning-700" : "bg-info-50 text-info-700")}>{status === "Pending" ? "Upcoming" : status}</span></div></div>;
}
