import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { AlertTriangle, Pencil, RefreshCw, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import { DateInput } from "@operio/ui/components/date-input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";
import { Input } from "@operio/ui/components/input";
import useUpdateClient from "@/features/clients/hooks/useUpdateClient";
import useUpdateClientCompany from "@/features/clients/hooks/useUpdateClientCompany";
import useUpdateClientDriver from "@/features/clients/hooks/useUpdateClientDriver";
import useUpdateClientMember from "@/features/clients/hooks/useUpdateClientMember";
import useUpdateClientVehicle from "@/features/clients/hooks/useUpdateClientVehicle";
import { cn } from "@operio/ui/lib/utils";
import { renewalUpdateSchema } from "@/features/clients/schemas/client.schema";

function toDateInputValue(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-");
    return `${year}-${month}-${day}`;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function formatDate(value) {
  const inputValue = toDateInputValue(value);
  if (!inputValue) return "—";
  const [year, month, day] = inputValue.split("-");
  return `${day}/${month}/${year}`;
}

function toApiDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function setPathValue(target, path, value) {
  const segments = path.split(".");
  const lastSegment = segments.pop();
  let parent = target;
  segments.forEach((segment) => {
    parent[segment] ??= {};
    parent = parent[segment];
  });
  parent[lastSegment] = value;
}

function buildRenewalPayload(renewal, values) {
  const payload = {};
  setPathValue(payload, renewal.expiryPath, toApiDate(values.newExpiryDate));
  if (renewal.identifierPath) setPathValue(payload, renewal.identifierPath, values.identifier.trim() || null);
  return payload;
}

function bannerDetails(status) {
  const banners = {
    expired: { title: "Expired — action required", className: "border-danger-200 bg-danger-50/60 text-danger-700 dark:border-danger-700 dark:bg-danger-700/10 dark:text-danger-500" },
    "due-soon": { title: "Renewal due soon", className: "border-warning-200 bg-warning-50/60 text-warning-700 dark:border-warning-700 dark:bg-warning-700/10 dark:text-warning-500" },
    "due-later": { title: "Upcoming renewal", className: "border-info-200 bg-info-50/60 text-info-700 dark:border-info-700 dark:bg-info-700/10 dark:text-info-500" },
    valid: { title: "Currently valid", className: "border-success-200 bg-success-50/60 text-success-700 dark:border-success-700 dark:bg-success-700/10 dark:text-success-500" },
  };
  return banners[status?.state] ?? { title: "Renewal details", className: "border-border-default bg-surface-secondary text-text-secondary" };
}

function DetailField({ label, value, accent = false }) {
  return <div className="min-w-0"><dt className="text-[10px] leading-4 font-semibold uppercase tracking-wide text-text-muted">{label}</dt><dd className={cn("mt-1 truncate text-caption font-semibold", accent ? "text-primary-700 dark:text-primary-300" : "text-text-primary")}>{value || "—"}</dd></div>;
}

export default function RenewalUpdateDialog({ clientId, renewal, open, onOpenChange }) {
  const recordId = renewal?.sourceRecord?.id ?? renewal?.sourceRecord?._id;
  const clientMutation = useUpdateClient(clientId);
  const companyMutation = useUpdateClientCompany(clientId);
  const memberMutation = useUpdateClientMember(recordId, clientId);
  const vehicleMutation = useUpdateClientVehicle(recordId, clientId);
  const driverMutation = useUpdateClientDriver(recordId, clientId);
  const mutations = { client: clientMutation, company: companyMutation, member: memberMutation, vehicle: vehicleMutation, driver: driverMutation };
  const mutation = mutations[renewal?.sourceType];
  const requiresRecordId = ["member", "vehicle", "driver"].includes(renewal?.sourceType);
  const canUpdate = Boolean(mutation && renewal?.expiryPath && clientId && (!requiresRecordId || recordId));
  const banner = bannerDetails(renewal?.status);
  const { formState: { errors }, handleSubmit, register, reset, setError } = useForm({
    resolver: joiResolver(renewalUpdateSchema, { abortEarly: false }),
    defaultValues: { newExpiryDate: "", identifier: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) reset({ newExpiryDate: toDateInputValue(renewal?.expiryDate), identifier: renewal?.identifier ?? "" });
  }, [open, renewal, reset]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation?.isPending) onOpenChange(nextOpen);
  };

  const submit = handleSubmit(async (values) => {
    if (!canUpdate) return;
    try {
      await mutation.mutateAsync(buildRenewalPayload(renewal, values));
      toast.success("Renewal details updated successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];
      details.forEach((detail) => {
        const path = Array.isArray(detail.field || detail.path) ? (detail.field || detail.path).join(".") : (detail.field || detail.path || "");
        if (path.endsWith(renewal.expiryPath)) setError("newExpiryDate", { type: "server", message: detail.issue || detail.message || "This date was rejected." });
        if (renewal.identifierPath && path.endsWith(renewal.identifierPath)) setError("identifier", { type: "server", message: detail.issue || detail.message || "This identifier was rejected." });
      });
      toast.error(response?.error?.message || response?.message || "Unable to update the renewal. Please review the form and try again.");
    }
  }, () => toast.error("Please review the highlighted fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] max-w-3xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border-default px-4 py-3 pr-12 sm:px-4 sm:pr-12">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><RefreshCw aria-hidden="true" className="size-4" /></span>
            <div className="min-w-0"><DialogTitle className="text-base leading-5 font-semibold text-text-primary">Renewal &amp; Expiry Details</DialogTitle><DialogDescription className="mt-1 text-xs leading-4 text-text-secondary">Compliance verification &amp; renewal updater</DialogDescription></div>
          </div>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:px-4">
            <div className={cn("flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center", banner.className)}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-primary"><AlertTriangle aria-hidden="true" className="size-4" /></span>
              <div><p className="text-xs font-bold uppercase">{banner.title}</p><p className="mt-1 text-xs">Expiry Date: <span className="font-bold" data-numeric>{formatDate(renewal?.expiryDate)}</span></p></div>
              <span className="rounded-md bg-surface-primary/70 px-3 py-1.5 text-xs font-semibold sm:ml-auto">{renewal?.category || "Renewal"}</span>
            </div>

            <dl className="grid gap-3 rounded-xl border border-border-default p-4 sm:grid-cols-2">
              <DetailField label="Item title" value={renewal?.item} />
              <DetailField label="Identifier / Number" value={renewal?.identifier} />
              <DetailField label="Company / Entity" value={renewal?.entity} accent />
              <DetailField label="Primary client" value={renewal?.primaryClient} accent />
            </dl>

            <section className="rounded-xl border border-primary-200 bg-primary-50/30 p-4 dark:border-primary-700 dark:bg-primary-900/10">
              <div className="mb-3 flex items-start gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><Pencil aria-hidden="true" className="size-4" /></span><div><h3 className="text-[13px] font-semibold text-text-primary">Update Renewal / Expiry Date</h3><p className="mt-0.5 text-xs text-text-secondary">Update the expiry date and identifier details.</p></div></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label htmlFor="renewal-expiry-date" className="text-xs font-medium text-text-primary">New Expiry Date <span className="text-danger-600">*</span></label><DateInput id="renewal-expiry-date" disabled={!canUpdate} aria-invalid={Boolean(errors.newExpiryDate)} className="mt-1 h-9 bg-surface-primary min-h-9! text-[13px] md:text-[13px] placeholder:text-[13px]" {...register("newExpiryDate")} />{errors.newExpiryDate?.message && <p role="alert" className="mt-1 text-[10px] text-danger-600">{errors.newExpiryDate.message}</p>}</div>
                <div><label htmlFor="renewal-identifier" className="text-xs font-medium text-text-primary">Updated Identifier / Number</label><Input id="renewal-identifier" disabled={!canUpdate || !renewal?.identifierPath} placeholder={renewal?.identifierPath ? "e.g. New Licence / Policy No" : "Not available for this item"} aria-invalid={Boolean(errors.identifier)} className="mt-1 h-9 bg-surface-primary min-h-9! text-[13px] md:text-[13px] placeholder:text-[13px]" {...register("identifier")} />{errors.identifier?.message && <p role="alert" className="mt-1 text-[10px] text-danger-600">{errors.identifier.message}</p>}</div>
              </div>
              {!canUpdate && <p className="mt-3 text-xs text-warning-700">This renewal source does not have an update API configured.</p>}
            </section>
          </div>

          <DialogFooter className="shrink-0 border-t border-border-default bg-surface-primary px-4 py-3 sm:px-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation?.isPending} className="px-3 h-8 text-xs">Cancel</Button>
            <Button type="submit" disabled={!canUpdate || mutation?.isPending} className="gap-2 px-3 font-medium h-8 text-xs"><Save aria-hidden="true" className="size-3.5" />{mutation?.isPending ? "Saving..." : "Save Renewal Update"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
