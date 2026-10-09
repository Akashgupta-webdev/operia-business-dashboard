import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { Contact, Save } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@operio/ui/components/dialog";
import useUpdateClientDriver from "@/features/clients/hooks/useUpdateClientDriver";
import {
  buildClientDriverUpdatePayload,
  createClientDriverUpdateDefaultValues,
} from "@/features/clients/utils/clientDriverUpdate";
import { clientDriverUpdateSchema } from "@/features/clients/schemas/client.schema";
import { DriverFormFields } from "./RelatedRecordFormFields";

const normalizeServerPath = (path = "") => (Array.isArray(path) ? path.join(".") : path)
  .replace(/^(body|payload|driver)\./, "");

export default function EditDriverDialog({ clientId, driver, open, onOpenChange }) {
  const driverId = driver?.id ?? driver?._id;
  const mutation = useUpdateClientDriver(driverId, clientId);
  const methods = useForm({
    resolver: joiResolver(clientDriverUpdateSchema, { abortEarly: false }),
    defaultValues: createClientDriverUpdateDefaultValues(driver),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) methods.reset(createClientDriverUpdateDefaultValues(driver));
  }, [driver, methods, open]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const submit = methods.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(buildClientDriverUpdatePayload(values));
      toast.success("Driver details updated successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];

      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (path) methods.setError(path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
      });

      toast.error(response?.message || response?.error?.message || "Unable to update the driver. Please review the form and try again.");
    }
  }, () => toast.error("Please review the highlighted fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border-default px-4 py-3 pr-12 sm:px-4 sm:py-3 sm:pr-12">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500">
              <Contact aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base leading-5 font-semibold text-text-primary">Edit Driver</DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-4 text-text-secondary">Update driver details.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:px-4">
              <DriverFormFields />
            </div>

            <DialogFooter className="grid shrink-0 gap-3 border-t border-border-default bg-surface-primary px-4 py-3 sm:grid-cols-2 sm:px-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="w-full px-3 h-8 text-xs">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || !driverId} className="w-full gap-2 px-3 font-medium h-8 text-xs">
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
