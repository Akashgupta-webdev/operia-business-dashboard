import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { Save } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useUpdateClientVehicle from "@/hooks/useUpdateClientVehicle";
import {
  buildClientVehicleUpdatePayload,
  createClientVehicleUpdateDefaultValues,
} from "@/lib/clientVehicleUpdate";
import { clientVehicleUpdateSchema } from "@/validator/client";
import { VehicleFormFields } from "./RelatedRecordFormFields";

const normalizeServerPath = (path = "") => (Array.isArray(path) ? path.join(".") : path)
  .replace(/^(body|payload|vehicle)\./, "");

export default function EditVehicleDialog({ clientId, vehicle, open, onOpenChange }) {
  const vehicleId = vehicle?.id ?? vehicle?._id;
  const mutation = useUpdateClientVehicle(vehicleId, clientId);
  const methods = useForm({
    resolver: joiResolver(clientVehicleUpdateSchema, { abortEarly: false }),
    defaultValues: createClientVehicleUpdateDefaultValues(vehicle),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) methods.reset(createClientVehicleUpdateDefaultValues(vehicle));
  }, [methods, open, vehicle]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const submit = methods.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(buildClientVehicleUpdatePayload(values));
      toast.success("Vehicle details updated successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];

      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (path) methods.setError(path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
      });

      toast.error(response?.message || response?.error?.message || "Unable to update the vehicle. Please review the form and try again.");
    }
  }, () => toast.error("Please review the highlighted fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border-default px-5 py-5 pr-14 sm:px-6 sm:py-6 sm:pr-14">
          <DialogTitle className="text-subsection font-semibold text-text-primary">Edit Vehicle</DialogTitle>
          <DialogDescription className="text-body-sm text-text-secondary">Update vehicle details.</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              <VehicleFormFields />
            </div>

            <DialogFooter className="grid shrink-0 gap-3 border-t border-border-default bg-surface-primary px-5 py-4 sm:grid-cols-2 sm:px-6">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="w-full px-5">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || !vehicleId} className="w-full gap-2 px-5 font-semibold">
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
