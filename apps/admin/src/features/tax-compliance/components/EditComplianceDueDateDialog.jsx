import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";
import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@operio/ui/components/dialog";
import useComplianceCompany from "../hooks/useComplianceCompany";
import { useUpdateComplianceDueDate } from "../hooks/useClientCompliance";

export default function EditComplianceDueDateDialog({ clientId, client, field, onClose }) {
  const label = field === "nextVATDue" ? "Next VAT Due" : "Next TAX Due";
  const type = field === "nextVATDue" ? "VAT" : "TAX";
  const trn = field === "nextVATDue" ? client.vatTaxRegistrationNumber : client.corporateTaxNumber;
  const initials = client.name?.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("") || "?";
  const [date, setDate] = useState(() => client[field]?.slice(0, 10) || "");
  const { companyId, details } = useComplianceCompany(clientId, client);
  const mutation = useUpdateComplianceDueDate();

  async function save(event) {
    event.preventDefault();
    if (!date || !companyId || mutation.isPending) return;
    try {
      await mutation.mutateAsync({ companyId, payload: { [field]: date } });
      toast.success(`${label} updated`);
      onClose();
    } catch { /* Keep the date available for correction or retry. */ }
  }

  return <Dialog open onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}>
    <DialogContent className="max-h-[90svh] max-w-[440px] overflow-y-auto rounded-xl border-border-default bg-surface-primary p-5" showCloseButton={!mutation.isPending}>
      <div className="mb-4 flex items-center gap-3 pr-7">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500"><CalendarDays className="size-5" aria-hidden="true" /></span>
        <div className="min-w-0">
          <DialogTitle className="text-sm font-semibold leading-5">Update {label} Date</DialogTitle>
          <DialogDescription className="mt-1 text-xs leading-4">Update the next {type} filing due date for this client.</DialogDescription>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-orange-50/60 p-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary" aria-hidden="true">{initials}</span>
          <div className="min-w-0"><p className="truncate text-xs font-semibold text-text-primary">{client.name || "Unnamed client"}</p><p className="mt-0.5 truncate text-[11px] text-text-secondary">{client.companyName || "No company recorded"}</p></div>
        </div>
        <div className="min-w-0"><p className="text-[10px] text-text-secondary">{type === "VAT" ? "VAT TRN" : "Corporate Tax TRN"}</p><p className="mt-0.5 break-all text-[11px] font-semibold tabular-nums text-text-primary">{trn || "Not recorded"}</p></div>
      </div>
      <form onSubmit={save} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="compliance-due-date" className="text-xs font-semibold">{label} Date <span className="text-destructive" aria-hidden="true">*</span></label>
          <Input id="compliance-due-date" type="date" required autoFocus value={date} disabled={mutation.isPending} className="h-9 rounded-md border-border-default text-xs md:text-xs" onChange={(event) => { setDate(event.target.value); mutation.reset(); }} />
        </div>
        {!companyId && (details.isPending ? <p role="status" className="text-xs text-text-secondary">Loading company...</p> : <div role="alert" className="space-y-2 text-xs text-destructive"><p>{details.isError ? "Unable to load company details." : "Unable to identify the company for this compliance record."}</p>{details.isError && <Button type="button" variant="outline" size="sm" onClick={() => details.refetch()}>Try again</Button>}</div>)}
        {mutation.isError && <p role="alert" className="text-xs text-destructive">{mutation.error?.response?.data?.error?.message || "Unable to update the due date. Please try again."}</p>}
        <DialogFooter className="pt-1">
          <Button type="button" variant="outline" className="h-9 rounded-md px-5 text-xs" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button type="submit" className="h-9 rounded-md px-4 text-xs" disabled={!date || !companyId || mutation.isPending}>{mutation.isPending ? "Updating..." : "Update Due Date"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}
