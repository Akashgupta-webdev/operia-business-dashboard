import { useEffect, useRef } from "react";
import { Clock3, Eye, Hourglass, TriangleAlert, Trash2 } from "lucide-react";
import { Button } from "@operio/ui/components/button";
import { NATIONALITIES } from "@/features/clients/constants/nationalities";
import { cn } from "@operio/ui/lib/utils";

import { formatComplianceDate, getComplianceStatus } from "../utils/complianceDates";

const statusStyles = {
  "Overdue": "bg-danger-50 text-danger-600",
  "Due Soon": "bg-warning-50 text-warning-600",
  "Pending": "bg-warning-50 text-warning-600",
  "Not set": "bg-neutral-100 text-text-muted",
};

export default function ComplianceClientTable({ status = "All", query, nationality = "", selectedId, onSelect, onRemove, disabled }) {
  const rootRef = useRef(null);
  const sentinelRef = useRef(null);
  const { fetchNextPage, hasNextPage, isFetching, isError } = query;
  const clients = [...new Map((query.data?.pages.flatMap((page) => page.data) ?? []).map((client) => [client._id, client])).values()];
  const visibleClients = clients.filter((client) => (!nationality || client.nationality === nationality) && (onSelect || status === "All" || getComplianceStatus(client.nextDueDate) === status));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetching && !isError) fetchNextPage();
    }, { root: rootRef.current, rootMargin: "100px" });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isError, visibleClients.length]);

  return (
    <div ref={rootRef} className="max-h-[min(50svh,28rem)] overflow-auto rounded-lg border border-border-default">
      <table className={cn("w-full text-left text-xs", onSelect ? "min-w-[620px]" : "min-w-[940px]")}>
        <thead className="sticky top-0 z-10 bg-neutral-50 text-text-secondary">
          <tr>{onSelect && <th className="w-10 p-3"><span className="sr-only">Select client</span></th>}{!onSelect && <th className="w-10 p-3">#</th>}{(onSelect ? ["Client Name", "Company Name", "Mobile Phone", "Nationality"] : ["Client Name", "Company Name", "TRN No", "Last Filing Date", "Next Due Date", "Status"]).map((label) => <th key={label} className="px-3 py-2.5 font-semibold">{label}</th>)}{onRemove && <th className="p-3">Action</th>}</tr>
        </thead>
        <tbody>
          {visibleClients.map((client, index) => {
            const filingStatus = getComplianceStatus(client.nextDueDate);
            const StatusIcon = filingStatus === "Overdue" ? TriangleAlert : filingStatus === "Pending" ? Hourglass : Clock3;
            const country = NATIONALITIES.find((item) => item.name.toLowerCase() === client.nationality?.toLowerCase() || (client.nationality === "UAE" && item.code === "AE"));
            return <tr key={client._id} onClick={onSelect && !disabled ? () => onSelect(client._id) : undefined} className={cn("border-t border-border-default", onSelect && "cursor-pointer hover:bg-primary-50/50", selectedId === client._id && "bg-primary-50")}>
              {onSelect && <td className="px-3 py-2"><input type="radio" name="compliance-client" aria-label={`Select ${client.name}`} checked={selectedId === client._id} onChange={() => onSelect(client._id)} disabled={disabled} className="size-4 accent-primary" /></td>}
              {!onSelect && <td className="px-3 py-2 text-text-muted">{index + 1}</td>}
              <td className="px-3 py-2"><span className="flex items-center gap-2"><span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-semibold text-primary">{client.name?.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</span>{client.name || "—"}</span></td>
              <td className="px-3 py-2">{client.companyName || "—"}</td>{onSelect ? <><td className="whitespace-nowrap px-3 py-2">{client.mobileNumber || "—"}</td>
              <td className="px-3 py-2"><span className="flex items-center gap-2">{country && <img src={`${import.meta.env.BASE_URL}flags/${country.code.toLowerCase()}.png`} alt="" width={20} height={15} className="h-3.5 w-5 shrink-0 object-contain" />}{client.nationality || "—"}</span></td>
              </> : <>
                <td className="whitespace-nowrap px-3 py-2 tabular-nums">{client.vatTaxRegistrationNumber || "\u2014"}</td>
                <td className="whitespace-nowrap px-3 py-2">{formatComplianceDate(client.lastFilingDate)}</td>
                <td className="whitespace-nowrap px-3 py-2">{formatComplianceDate(client.nextDueDate)}</td>
                <td className="px-3 py-2"><span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium", statusStyles[filingStatus])}><StatusIcon aria-hidden="true" className="size-3" />{filingStatus}</span></td>
              </>}
              {onRemove && <td className="px-3 py-2"><div className="flex items-center gap-1"><Button variant="ghost" size="icon-sm" disabled aria-label={`View ${client.name} (coming soon)`} title="Client compliance details coming soon"><Eye className="size-3.5" /></Button><Button variant="ghost" size="icon-sm" aria-label={`Remove ${client.name} from compliance`} disabled={disabled} onClick={() => onRemove(client._id)}><Trash2 className="size-3.5 text-destructive" /></Button></div></td>}
            </tr>;
          })}
        </tbody>
      </table>
      <div ref={sentinelRef} className="h-1" />
      {query.isFetching && <p role="status" className="p-4 text-center text-xs text-text-muted">Loading clients…</p>}
      {query.isError && <div role="alert" className="p-4 text-center text-xs text-destructive">Unable to load clients. <Button variant="outline" size="sm" onClick={() => query.isFetchNextPageError ? query.fetchNextPage() : query.refetch()}>Retry</Button></div>}
      {!query.isFetching && !query.isError && !visibleClients.length && !query.hasNextPage && <p className="p-6 text-center text-xs text-text-muted">No matching clients found.</p>}
    </div>
  );
}
