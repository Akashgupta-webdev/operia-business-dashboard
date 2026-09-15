import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { BriefcaseBusiness, Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";
import useCreateClientService from "@/features/clients/hooks/useCreateClientService";
import { buildClientServiceCreatePayload, createClientServiceCreateDefaultValues } from "@/features/clients/utils/clientServiceCreate";
import { clientServiceCreateSchema } from "@/features/clients/schemas/client.schema";
import { ServiceFormFields } from "./EditServiceDialog";

const normalizeServerPath = (path = "") => (Array.isArray(path) ? path.join(".") : path)
  .replace(/^(body|payload|service)\./, "")
  .replace(/\[(\d+)\]/g, ".$1");

export default function AddServiceDialog({ clientId, open, onOpenChange }) {
  const mutation = useCreateClientService(clientId);
  const methods = useForm({
    resolver: joiResolver(clientServiceCreateSchema, { abortEarly: false }),
    defaultValues: createClientServiceCreateDefaultValues(),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) methods.reset(createClientServiceCreateDefaultValues());
  }, [methods, open]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const submit = methods.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(buildClientServiceCreatePayload(values));
      toast.success("Service created successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];
      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (path) methods.setError(path.startsWith("notes.") ? "notes" : path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
      });
      toast.error(response?.message || response?.error?.message || "Unable to create the service. Please review the form and try again.");
    }
  }, () => toast.error("Enter at least one value and review the highlighted fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border-default px-5 py-5 pr-14 sm:px-6 sm:pr-14">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><BriefcaseBusiness aria-hidden="true" className="size-5" /></span>
            <div className="min-w-0"><DialogTitle className="text-body-lg font-semibold text-text-primary">Add Service</DialogTitle><DialogDescription className="mt-0.5 text-caption text-text-secondary">Add a new service package to this client.</DialogDescription></div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6"><ServiceFormFields /></div>
            <DialogFooter className="shrink-0 border-t border-border-default bg-surface-primary px-5 py-4 sm:px-6">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="px-5">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || !clientId} className="gap-2 px-5 font-semibold"><Plus aria-hidden="true" className="size-3.5" />{mutation.isPending ? "Creating..." : "Add Service"}</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
