import { useState } from "react";
import { Copy, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@operio/ui/components/dialog";
import useComplianceCompany from "../hooks/useComplianceCompany";
import { useFilingMutation } from "../hooks/useFilingMutations";
import { filingStatuses } from "../constants/filings";
import { decimalPattern, initialFilingForm, filingPayload, payablePreview } from "../utils/filingForm";

export default function FilingDialog({ clientId, client, type, filing, onClose }) {
  const editing = Boolean(filing);
  const [initial] = useState(() => initialFilingForm(filing));
  const [form, setForm] = useState(initial);
  const { companyId, details } = useComplianceCompany(clientId, client, !editing);
  const mutation = useFilingMutation(editing ? "update" : "create");
  const trn = type === "VAT" ? client.vatTaxRegistrationNumber : client.corporateTaxNumber;
  const payload = filingPayload(form, editing ? initial : undefined);
  const filingId = filing?.id || filing?._id;
  const canSave = (editing ? filingId && Object.keys(payload).length > 0 : companyId) && !mutation.isPending;
  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    mutation.reset();
  };
  async function save(event) {
    event.preventDefault();
    if (!canSave) return;
    try {
      await mutation.mutateAsync({ type, companyId, id: filingId, payload });
      toast.success(type + " filing " + (editing ? "updated" : "created"));
      onClose(true);
    } catch { /* Keep the form open for correction or retry. */ }
  }
  async function copyTrn() {
    try { await navigator.clipboard.writeText(trn); toast.success("TRN copied"); }
    catch { toast.error("Unable to copy TRN"); }
  }
  const inputClass = "h-9 rounded-md border-border-default text-xs md:text-xs";
  return <Dialog open onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}>
    <DialogContent className="max-h-[90svh] max-w-[520px] overflow-y-auto rounded-xl border-border-default bg-surface-primary p-5" showCloseButton={!mutation.isPending}>
      <div className="mb-5 flex items-center gap-3 pr-7">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary"><FileText className="size-5" aria-hidden="true" /></span>
        <div><DialogTitle className="text-sm font-semibold">{editing ? "Edit" : "Add"} {type} Filing</DialogTitle><DialogDescription className="mt-1 text-xs">{editing ? "Update the" : "Add a new"} {type} return filing for {client.name || "this client"}.</DialogDescription></div>
      </div>
      <form onSubmit={save} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="filing-trn" className="text-xs font-semibold">TRN Number</label>
          <div className="relative"><Input id="filing-trn" readOnly value={trn || "Not recorded"} className={inputClass + " pr-10"} /><Button type="button" variant="ghost" size="icon-sm" aria-label="Copy TRN number" disabled={!trn} onClick={copyTrn} className="absolute top-0.5 right-1"><Copy className="size-3.5" /></Button></div>
          <p className="text-[10px] text-text-muted">{type} TRN is pre-filled from client details.</p>
        </div>
        <fieldset disabled={mutation.isPending} className="grid gap-4 sm:grid-cols-2">
          <FormField label="Period Start" name="periodStart" required><Input id="filing-periodStart" type="month" required autoFocus value={form.periodStart} max={form.periodEnd || undefined} onChange={update("periodStart")} className={inputClass} /></FormField>
          <FormField label="Period End" name="periodEnd" required><Input id="filing-periodEnd" type="month" required value={form.periodEnd} min={form.periodStart || undefined} onChange={update("periodEnd")} className={inputClass} /></FormField>
          <div className="sm:col-span-2"><FormField label="Status" name="status" required><select id="filing-status" required value={form.status} onChange={update("status")} className="h-9 w-full rounded-md border border-border-default bg-surface-primary px-3 text-xs focus-visible:outline-primary">{filingStatuses.map((status) => <option key={status}>{status}</option>)}</select></FormField></div>
          <FormField label="Input (AED)" name="input" required><Input id="filing-input" required inputMode="decimal" pattern={decimalPattern} title="Enter a decimal amount without commas" value={form.input} onChange={update("input")} placeholder="0.00" className={inputClass} /></FormField>
          <FormField label="Output (AED)" name="output" required><Input id="filing-output" required inputMode="decimal" pattern={decimalPattern} title="Enter a decimal amount without commas" value={form.output} onChange={update("output")} placeholder="0.00" className={inputClass} /></FormField>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-primary-50/70 p-3 sm:col-span-2"><div><p className="text-[11px] text-text-secondary">Payable Tax (AED)</p><output className="mt-1 block text-sm font-semibold tabular-nums" aria-live="polite">{payablePreview(form.input, form.output)}</output></div><p className="text-[10px] text-text-muted">Input - Output</p></div>
          <FormField label="Filing Date" name="filingDate" required={editing && Boolean(initial.filingDate)}><Input id="filing-filingDate" type="date" required={editing && Boolean(initial.filingDate)} value={form.filingDate} onChange={update("filingDate")} className={inputClass} /></FormField>
          <FormField label="Due Date" name="nextDueDate" required><Input id="filing-nextDueDate" type="date" required value={form.nextDueDate} onChange={update("nextDueDate")} className={inputClass} /></FormField>
        </fieldset>
        {!editing && !companyId && (details.isPending ? <p role="status" className="text-xs text-text-secondary">Loading company...</p> : <div role="alert" className="space-y-2 text-xs text-destructive"><p>{details.isError ? "Unable to load company details." : "Unable to identify the company for this compliance record."}</p>{details.isError && <Button type="button" variant="outline" size="sm" onClick={() => details.refetch()}>Try again</Button>}</div>)}
        {mutation.isError && <p role="alert" className="text-xs text-destructive">{mutation.error?.response?.data?.error?.message || "Unable to save this filing. Please try again."}</p>}
        <DialogFooter className="pt-2"><Button type="button" variant="outline" className="h-9 rounded-md px-5 text-xs" disabled={mutation.isPending} onClick={() => onClose()}>Cancel</Button><Button type="submit" className="h-9 rounded-md px-4 text-xs" disabled={!canSave}>{mutation.isPending ? "Saving..." : editing ? "Update " + type + " Filing" : "Save " + type + " Filing"}</Button></DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}

function FormField({ label, name, required, children }) {
  return <div className="space-y-1.5"><label htmlFor={"filing-" + name} className="text-xs font-semibold">{label} {required ? <span className="text-destructive" aria-hidden="true">*</span> : <span className="font-normal text-text-muted">(Optional)</span>}</label>{children}</div>;
}
