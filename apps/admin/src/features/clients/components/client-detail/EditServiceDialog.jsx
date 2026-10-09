import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { BriefcaseBusiness, Save } from "lucide-react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import { DateInput } from "@operio/ui/components/date-input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { Textarea } from "@operio/ui/components/textarea";
import { SERVICE_CATEGORY_OPTIONS, SERVICE_PACKAGE_OPTIONS, SERVICE_PAYMENT_STATUS_OPTIONS, SERVICE_STATUS_OPTIONS } from "@/features/clients/constants/client";
import useUpdateClientService from "@/features/clients/hooks/useUpdateClientService";
import { buildClientServiceUpdatePayload, createClientServiceUpdateDefaultValues } from "@/features/clients/utils/clientServiceUpdate";
import { clientServiceUpdateSchema } from "@/features/clients/schemas/client.schema";

function FieldError({ error, id }) {
  return error?.message ? <p id={id} role="alert" className="mt-1 text-xs text-destructive">{error.message}</p> : null;
}

function ServiceInput({ name, label, date = false, ...props }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];
  const errorId = `${name}-error`;
  const FieldComponent = date ? DateInput : Input;
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-text-primary">{label}</label>
      <FieldComponent {...register(name)} id={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="h-9 border-border-default bg-surface-primary px-3 shadow-none hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 min-h-9! text-[13px] md:text-[13px] placeholder:text-[13px]" {...props} />
      <FieldError error={error} id={errorId} />
    </div>
  );
}

function ServiceSelect({ name, label, options, wide = false }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];
  const errorId = `${name}-error`;
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-text-primary">{label}</label>
      <Controller name={name} control={control} render={({ field }) => (
        <Select value={field.value || null} onValueChange={(value) => field.onChange(value === "__clear__" ? "" : value)}>
          <SelectTrigger id={name} onBlur={field.onBlur} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="h-9 w-full border-border-default bg-surface-primary px-3 shadow-none hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 min-h-9! text-[13px] md:text-[13px] placeholder:text-[13px]"><SelectValue placeholder={`Select ${label.toLowerCase()}`} /></SelectTrigger>
          <SelectContent align="start" className={wide ? "w-[min(36rem,calc(100vw-2rem))]" : undefined}><SelectItem className="text-[13px]" value="__clear__">Not set</SelectItem>{options.map((option) => <SelectItem className="text-[13px]" key={option} value={option}>{option}</SelectItem>)}</SelectContent>
        </Select>
      )} />
      <FieldError error={error} id={errorId} />
    </div>
  );
}

export function ServiceFormFields({ excludeVat = false }) {
  const { register, formState: { errors } } = useFormContext();
  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        <ServiceSelect name="category" label="Service category" options={SERVICE_CATEGORY_OPTIONS} />
        <ServiceSelect name="package" label="Service package" options={excludeVat ? SERVICE_PACKAGE_OPTIONS.filter((item) => item !== "Quarterly VAT Return Filing Package") : SERVICE_PACKAGE_OPTIONS} wide />
        <ServiceSelect name="status" label="Status" options={SERVICE_STATUS_OPTIONS} />
        <ServiceInput name="packagePrice" label="Package price (AED)" inputMode="decimal" placeholder="0.00" />
        <ServiceSelect name="paymentStatus" label="Payment status" options={SERVICE_PAYMENT_STATUS_OPTIONS} />
        <ServiceInput name="targetCompletionDate" label="Target completion date" date />
      </div>
      <div>
        <label htmlFor="notes" className="mb-1 block text-xs font-medium text-text-primary">Service notes</label>
        <Textarea {...register("notes")} id="notes" rows={2} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "notes-error" : "notes-help"} className="min-h-16! border-border-default bg-surface-primary shadow-none hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-[13px] md:text-[13px] placeholder:text-[13px]" />
        <p id="notes-help" className="mt-1 text-[10px] text-text-muted">Enter one note per line.</p>
        <FieldError error={errors.notes} id="notes-error" />
      </div>
    </>
  );
}

const normalizeServerPath = (path = "") => (Array.isArray(path) ? path.join(".") : path)
  .replace(/^(body|payload|service)\./, "")
  .replace(/\[(\d+)\]/g, ".$1");

export default function EditServiceDialog({ clientId, service, open, onOpenChange }) {
  const serviceId = service?.id ?? service?._id;
  const mutation = useUpdateClientService(serviceId, clientId);
  const methods = useForm({
    resolver: joiResolver(clientServiceUpdateSchema, { abortEarly: false }),
    defaultValues: createClientServiceUpdateDefaultValues(service),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) methods.reset(createClientServiceUpdateDefaultValues(service));
  }, [methods, open, service]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const submit = methods.handleSubmit(async (values) => {
    try {
      if (service?.serviceCode === "VAT_RETURN_FILING") { toast.error("Use the VAT workspace to edit this filing."); return; }
      await mutation.mutateAsync(buildClientServiceUpdatePayload(values));
      toast.success("Service details updated successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];
      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (path) methods.setError(path.startsWith("notes.") ? "notes" : path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
      });
      toast.error(response?.message || response?.error?.message || "Unable to update the service. Please review the form and try again.");
    }
  }, () => toast.error("Please review the highlighted fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border-default px-4 py-3 pr-12 sm:px-4 sm:pr-12">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><BriefcaseBusiness aria-hidden="true" className="size-4" /></span>
            <div className="min-w-0"><DialogTitle className="text-base leading-5 font-semibold text-text-primary">Edit Service</DialogTitle><DialogDescription className="mt-1 text-xs leading-4 text-text-secondary">Update service details and settings.</DialogDescription></div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:px-4">
              <ServiceFormFields />
            </div>
            <DialogFooter className="shrink-0 border-t border-border-default bg-surface-primary px-4 py-3 sm:px-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="px-3 h-8 text-xs">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || !serviceId} className="gap-2 px-3 font-medium h-8 text-xs"><Save aria-hidden="true" className="size-3.5" />{mutation.isPending ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
