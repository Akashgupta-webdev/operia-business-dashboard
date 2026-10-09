import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { Plus } from "lucide-react";
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

const normalizeServerPath = (path = "") => (Array.isArray(path) ? path.join(".") : path)
  .replace(/^(body|payload|member|vehicle|driver)\./, "")
  .replace(/\[(\d+)\]/g, ".$1");

export default function CreateRelatedRecordDialog({
  buildPayload,
  children,
  clientId,
  defaultValues,
  description,
  entityName,
  icon: Icon,
  iconClassName,
  mutation,
  onOpenChange,
  open,
  schema,
  title,
  widthClassName = "max-w-2xl",
}) {
  const methods = useForm({
    resolver: joiResolver(schema, { abortEarly: false }),
    defaultValues: defaultValues(),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) methods.reset(defaultValues());
  }, [defaultValues, methods, open]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const submit = methods.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(buildPayload(values));
      toast.success(`${entityName} created successfully.`);
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];

      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (path) methods.setError(path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
      });

      toast.error(response?.message || response?.error?.message || `Unable to create the ${entityName.toLowerCase()}. Please review the form and try again.`);
    }
  }, () => toast.error("Enter at least one value and review the highlighted fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`flex max-h-[calc(100svh-2rem)] ${widthClassName} flex-col overflow-hidden p-0`}>
        <DialogHeader className="shrink-0 border-b border-border-default px-4 py-3 pr-12 sm:px-4 sm:py-3 sm:pr-12">
          <div className="flex items-start gap-3">
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base leading-5 font-semibold text-text-primary">{title}</DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-4 text-text-secondary">{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:px-4">{children}</div>
            <DialogFooter className="grid shrink-0 gap-3 border-t border-border-default bg-surface-primary px-4 py-3 sm:grid-cols-2 sm:px-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="w-full px-3 h-8 text-xs">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || !clientId} className="w-full gap-2 px-3 font-medium h-8 text-xs">
                <Plus aria-hidden="true" className="size-3.5" />
                {mutation.isPending ? "Creating..." : `Add ${entityName}`}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
