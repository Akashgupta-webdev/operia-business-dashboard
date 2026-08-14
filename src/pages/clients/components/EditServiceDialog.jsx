import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SERVICE_FILTER_STATUS_OPTIONS } from "@/constants/ClientDetailPage";
import { SERVICE_CATEGORIES } from "@/constants/ClientsPage";
import { useUpdateService } from "@/hooks/useServiceMutations";
import { editServiceSchema } from "@/validator/ClientDetailPage";
import { FormField, FieldError } from "./QuickAddFormFields";

const categoryOptions = SERVICE_CATEGORIES.map(({ label, value }) => ({ label, value }));
const statusOptions = SERVICE_FILTER_STATUS_OPTIONS.filter(({ value }) => value !== "ALL");

const formatLabel = (value) => value
  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
  .replaceAll("_", " ")
  .replace(/^./, (letter) => letter.toUpperCase());

const isDateField = (key, value) => (
  /date/i.test(key) || (typeof value === "string" && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value))
);

const normalizeDetailDates = (value, key = "") => {
  if (Array.isArray(value)) return value.map((item) => normalizeDetailDates(item, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, item]) => [
      childKey,
      normalizeDetailDates(item, childKey),
    ]));
  }
  return isDateField(key, value) && typeof value === "string" ? value.slice(0, 10) : value;
};

const flattenDetailFields = (value, path = "detail", labels = []) => {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenDetailFields(item, `${path}.${index}`, [...labels, String(index + 1)]));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => flattenDetailFields(item, `${path}.${key}`, [...labels, key]));
  }
  return [{ key: labels.at(-1) ?? "value", label: labels.map(formatLabel).join(" · "), name: path, value }];
};

const coerceDetailTypes = (value, original) => {
  if (Array.isArray(original)) {
    return original.map((item, index) => coerceDetailTypes(value?.[index], item));
  }
  if (original && typeof original === "object") {
    return Object.fromEntries(Object.entries(original).map(([key, item]) => [
      key,
      coerceDetailTypes(value?.[key], item),
    ]));
  }
  if (typeof original === "number") return Number(value);
  if (typeof original === "boolean") return Boolean(value);
  return value;
};

const getNestedError = (errors, name) => name.split(".").reduce((value, part) => value?.[part], errors);

const getDefaultValues = (service) => ({
  category: service?.category ?? "",
  status: service?.status ?? "NOT_STARTED",
  detail: normalizeDetailDates(service?.detail ?? {}),
});

export function EditServiceDialog({ clientDatabaseId, onOpenChange, open, service }) {
  const updateService = useUpdateService(clientDatabaseId);
  const detailFields = useMemo(() => flattenDetailFields(getDefaultValues(service).detail), [service]);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: getDefaultValues(service),
    resolver: joiResolver(editServiceSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) reset(getDefaultValues(service));
  }, [open, reset, service]);

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen && updateService.isPending) return;
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values) => {
    try {
      await updateService.mutateAsync({
        serviceId: service.id,
        payload: {
          category: values.category,
          status: values.status,
          detail: coerceDetailTypes(values.detail, service.detail),
        },
      });
      toast.success("Service updated successfully.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "We couldn't update the service. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>Edit service</DialogTitle>
          <DialogDescription>Update the service category, status, and category-specific information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
            <FormField control={control} error={errors.category} label="Service category" name="category" options={categoryOptions} type="select" />
            <FormField control={control} error={errors.status} label="Status" name="status" options={statusOptions} type="select" />
            <div className="border-t pt-5 sm:col-span-2">
              <h3 className="text-label-md font-semibold tracking-wide text-primary uppercase">Service details</h3>
              <p className="mt-1 text-body-sm text-muted-foreground">Fields are generated from the information stored for this service.</p>
            </div>

            {detailFields.map((field) => {
              const error = getNestedError(errors, field.name);

              if (typeof field.value === "boolean") {
                const inputId = field.name.replaceAll(".", "-");
                return (
                  <div key={field.name}>
                    <label htmlFor={inputId} className="flex h-9 items-center gap-2 rounded-lg border border-input bg-background px-3 text-body-sm font-medium text-foreground">
                      <Controller
                        name={field.name}
                        control={control}
                        render={({ field: input }) => (
                          <input id={inputId} type="checkbox" checked={Boolean(input.value)} onChange={(event) => input.onChange(event.target.checked)} className="size-4 accent-primary" />
                        )}
                      />
                      {field.label}
                    </label>
                    <FieldError id={`${inputId}-error`} message={error?.message} />
                  </div>
                );
              }

              return (
                <FormField
                  key={field.name}
                  control={control}
                  error={error}
                  label={field.label}
                  name={field.name}
                  required={false}
                  step={typeof field.value === "number" ? "any" : undefined}
                  type={isDateField(field.key, field.value) ? "date" : typeof field.value === "number" ? "number" : "text"}
                />
              );
            })}
          </div>

          <DialogFooter className="border-t bg-surface-container-low px-6 py-4">
            <Button type="button" variant="outline" disabled={updateService.isPending} onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateService.isPending}>
              {updateService.isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
