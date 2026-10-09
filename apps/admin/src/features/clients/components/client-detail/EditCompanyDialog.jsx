import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { Building2, Save } from "lucide-react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import { DateInput } from "@operio/ui/components/date-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@operio/ui/components/dialog";
import { Input } from "@operio/ui/components/input";
import useUpdateClientCompany from "@/features/clients/hooks/useUpdateClientCompany";
import {
  buildClientCompanyUpdatePayload,
  createClientCompanyUpdateDefaultValues,
} from "@/features/clients/utils/clientCompanyUpdate";
import { clientCompanyUpdateSchema } from "@/features/clients/schemas/client.schema";

function CompanyField({ name, label, required = false, date = false }) {
  const { register, formState: { errors } } = useFormContext();
  const error = name.split(".").reduce((value, key) => value?.[key], errors);
  const errorId = `${name}-error`;
  const FieldComponent = date ? DateInput : Input;

  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-text-primary">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <FieldComponent
        {...register(name)}
        id={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-9 border-border-default bg-surface-primary px-3 shadow-none hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 min-h-9! text-[13px] md:text-[13px] placeholder:text-[13px]"
      />
      {error?.message && <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">{error.message}</p>}
    </div>
  );
}

const normalizeServerPath = (path = "") => (Array.isArray(path) ? path.join(".") : path)
  .replace(/^(body|payload|company)\./, "");

export default function EditCompanyDialog({ clientId, company, open, onOpenChange }) {
  const mutation = useUpdateClientCompany(clientId);
  const methods = useForm({
    resolver: joiResolver(clientCompanyUpdateSchema, { abortEarly: false }),
    defaultValues: createClientCompanyUpdateDefaultValues(company),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) methods.reset(createClientCompanyUpdateDefaultValues(company));
  }, [company, methods, open]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const submit = methods.handleSubmit(async (values) => {
    const payload = buildClientCompanyUpdatePayload(values, methods.formState.dirtyFields);
    if (!Object.keys(payload).length) return;

    try {
      await mutation.mutateAsync(payload);
      toast.success("Company information updated successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];

      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (path) methods.setError(path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
      });

      toast.error(response?.message || response?.error?.message || "Unable to update the company. Please review the form and try again.");
    }
  }, () => toast.error("Please review the highlighted fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border-default px-4 py-3 pr-12 sm:px-4 sm:py-3 sm:pr-12">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Building2 aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base leading-5 font-semibold text-text-primary">Edit Company Information</DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-4 text-text-secondary">Update the company details and registration information.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:px-4">
              <CompanyField name="companyName" label="Company Name" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <CompanyField name="tradeLicence.tradeLicenceNo" label="Trade Licence Number" />
                <CompanyField name="tradeLicence.tradeLicenceExpiry" label="Trade Licence Expiry" date />
                <CompanyField name="establishment.establishmentCard" label="Establishment Card Number" />
                <CompanyField name="establishment.establishmentCardExpiry" label="Establishment Card Expiry" date />
              </div>
              <CompanyField name="vatTaxRegistrationNumber" label="VAT Registration Number" />
              <CompanyField name="corporateTaxNumber" label="Corporate Tax Registration Number" />
            </div>
            <DialogFooter className="shrink-0 border-t border-border-default bg-surface-primary px-4 py-3 sm:px-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="px-3 h-8 text-xs">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || !clientId || !methods.formState.isDirty} className="gap-2 px-3 font-medium h-8 text-xs">
                <Save aria-hidden="true" className="size-3.5" />
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
