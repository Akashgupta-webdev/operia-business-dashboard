import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { FormProvider, useForm } from "react-hook-form";
import { Save, UserRoundPen } from "lucide-react";
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
import useUpdateClient from "@/features/clients/hooks/useUpdateClient";
import { buildClientUpdatePayload, createClientUpdateDefaultValues } from "@/features/clients/utils/clientUpdate";
import { clientUpdateSchema } from "@/features/clients/schemas/client.schema";
import EditClientFields from "./EditClientFields";

const normalizeServerPath = (path = "") => (Array.isArray(path) ? path.join(".") : path)
  .replace(/^(body|payload|client)\./, "")
  .replace(/\[(\d+)\]/g, ".$1");

export default function EditClientDialog({ client, open, onOpenChange }) {
  const mutation = useUpdateClient(client?.id);
  const methods = useForm({
    resolver: joiResolver(clientUpdateSchema, { abortEarly: false }),
    defaultValues: createClientUpdateDefaultValues(client),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) methods.reset(createClientUpdateDefaultValues(client));
  }, [client, methods, open]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const submit = methods.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(buildClientUpdatePayload(values));
      toast.success("Client details updated successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];

      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (path) methods.setError(path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
      });

      toast.error(response?.message || response?.error?.message || "Unable to update the client. Please review the form and try again.");
    }
  }, () => toast.error("Please review the highlighted fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] max-w-5xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border-default px-4 py-3 pr-12 sm:px-4 sm:pr-12">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <UserRoundPen aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base leading-5 font-semibold text-text-primary">Edit Client Information &amp; Identity</DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-4 text-text-secondary">Update client details, contact information, and identity documents.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-4">
              <EditClientFields />
            </div>
            <DialogFooter className="shrink-0 border-t border-border-default bg-surface-primary px-4 py-3 sm:px-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="px-3 h-8 text-xs">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || !client?.id} className="gap-2 px-3 font-medium h-8 text-xs">
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
