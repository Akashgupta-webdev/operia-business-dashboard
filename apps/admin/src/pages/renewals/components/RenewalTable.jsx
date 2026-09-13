import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RENEWALS_DUE_SOON_DAYS, RENEWAL_TONES } from "@/constants/renewals";
import { getRenewalCategory, getRenewalClientUrl, getRenewalStatus } from "@/lib/renewals";
import { cn } from "@/lib/utils";

export default function RenewalTable({ items, loading, hasFilters }) {
  return (
    <div className="overflow-x-auto">
      <Table className="text-[11px] leading-4">
        <caption className="sr-only">Client renewals and expirations, ordered by earliest expiry</caption>
        <TableHeader className="bg-surface-secondary">
          <TableRow className="hover:bg-transparent">
            {["Item / Licence / Record", "Category", "Company / Entity", "Client", "Expiry date", "Status", "Actions"].map((label) => <TableHead key={label} className={cn("text-caption font-semibold text-text-secondary", label === "Actions" && "text-right")}>{label}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody className="[&_td]:py-2">
          {loading ? Array.from({ length: 6 }, (_, index) => <TableRow key={index}>{Array.from({ length: 7 }, (_, cell) => <TableCell key={cell}><Skeleton className="h-4 w-24" /></TableCell>)}</TableRow>) : items.length ? items.map((item) => {
            const status = getRenewalStatus(item.expiryDate);
            const clientUrl = getRenewalClientUrl(item);
            return (
              <TableRow key={item.id}>
                <TableCell className="min-w-44 max-w-64 whitespace-normal break-words font-semibold text-text-primary">{item.item || item.recordId}</TableCell>
                <TableCell><span className="inline-flex rounded-md bg-primary-50 px-2 py-1 text-caption font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{getRenewalCategory(item.category)}</span></TableCell>
                <TableCell className="min-w-40 max-w-64 whitespace-normal break-words text-text-secondary">{item.entity || item.clientName || "Not available"}</TableCell>
                <TableCell className="min-w-36 max-w-56 whitespace-normal break-words">{clientUrl ? <Link to={clientUrl} className="font-medium text-primary-700 hover:underline dark:text-primary-300">{item.clientName || "View client"}</Link> : <span className="text-text-muted">{item.clientName || "Client unavailable"}</span>}</TableCell>
                <TableCell><time className="font-medium text-text-primary" dateTime={status.days !== null ? item.expiryDate.split("-").reverse().join("-") : undefined} data-numeric>{item.expiryDate || "Not available"}</time>{status.days !== null && status.days >= 0 && status.days <= RENEWALS_DUE_SOON_DAYS && <p className="mt-1 text-caption text-text-secondary">{status.days === 0 ? "Due today" : "In " + status.days + " days"}</p>}</TableCell>
                <TableCell><span className={cn("inline-flex rounded-md px-2 py-1 text-caption font-medium", RENEWAL_TONES[status.tone])}>{status.label}</span></TableCell>
                <TableCell className="text-right">{clientUrl ? <Button nativeButton={false} render={<Link to={clientUrl} />} variant="outline" size="sm" className="gap-1.5 text-caption"><Eye aria-hidden="true" className="size-3.5" />View client</Button> : <Button variant="outline" size="sm" disabled title="The owning client is unavailable" className="text-caption">View client</Button>}</TableCell>
              </TableRow>
            );
          }) : <TableRow><TableCell colSpan={7} className="px-6 py-14 text-center whitespace-normal"><p className="font-semibold text-text-primary">{hasFilters ? "No matching renewals on this page" : "No renewals found"}</p><p className="mt-1 text-caption text-text-muted">{hasFilters ? "Change the filters or browse another page." : "Records with an expiry date will appear here."}</p></TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}
