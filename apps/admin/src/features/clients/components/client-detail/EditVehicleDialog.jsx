import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { Save } from "lucide-react";
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
import useUpdateClientVehicle from "@/features/clients/hooks/useUpdateClientVehicle";
import {
  buildClientVehicleUpdatePayload,
  createClientVehicleUpdateDefaultValues,
} from "@/features/clients/utils/clientVehicleUpdate";
import { clientVehicleUpdateSchema } from "@/features/clients/schemas/client.schema";
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
        <DialogHeader className="shrink-0 border-b border-border-default px-4 py-3 pr-12 sm:px-4 sm:py-3 sm:pr-12">
          <DialogTitle className="text-base leading-5 font-semibold text-text-primary">Edit Vehicle</DialogTitle>
          <DialogDescription className="mt-1 text-xs leading-4 text-text-secondary">Update vehicle details.</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-4">
              <VehicleFormFields />
            </div>

            <DialogFooter className="grid shrink-0 gap-3 border-t border-border-default bg-surface-primary px-4 py-3 sm:grid-cols-2 sm:px-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="w-full px-3 h-8 text-xs">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || !vehicleId} className="w-full gap-2 px-3 font-medium h-8 text-xs">
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
