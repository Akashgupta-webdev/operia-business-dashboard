import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { FileUp, Upload } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import { DateInput } from "@operio/ui/components/date-input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { DOCUMENT_TYPE_OPTIONS } from "@/features/clients/constants/client";
import useAddClientDocument from "@/features/clients/hooks/useAddClientDocument";
import { clientDocumentCreateSchema } from "@/features/clients/schemas/client.schema";

const DEFAULT_VALUES = {
  documentTitle: "",
  documentType: "",
  issueDate: "",
  expiryDate: "",
  documents: null,
};

function apiDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function buildDocumentFormData(values) {
  const formData = new FormData();
  formData.append("documents", values.documents[0]);

  const metadata = {
    documentTitle: values.documentTitle.trim(),
    documentType: values.documentType,
    issueDate: apiDate(values.issueDate),
    expiryDate: apiDate(values.expiryDate),
  };
  Object.entries(metadata).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  return formData;
}

function FieldError({ error }) {
  return error ? <p role="alert" className="mt-1.5 text-[10px] leading-4 text-danger-600">{error.message}</p> : null;
}

const normalizeServerPath = (path = "") => (Array.isArray(path) ? path.join(".") : path)
  .replace(/^(body|payload|document)\./, "")
  .replace(/^file$/, "documents");

export default function AddDocumentDialog({ clientId, open, onOpenChange }) {
  const mutation = useAddClientDocument(clientId);
  const { control, formState: { errors }, handleSubmit, register, reset, setError } = useForm({
    resolver: joiResolver(clientDocumentCreateSchema, { abortEarly: false }),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) reset(DEFAULT_VALUES);
  }, [open, reset]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(buildDocumentFormData(values));
      toast.success("Document uploaded successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];
      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (path) setError(path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
      });
      toast.error(response?.error?.message || response?.message || "Document upload failed. Please review the form and try again.");
    }
  }, () => toast.error("Select a document file and review the highlighted fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 px-5 py-5 pr-14 sm:px-6 sm:pr-14">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300"><FileUp aria-hidden="true" className="size-5" /></span>
            <div className="min-w-0">
              <DialogTitle className="text-body-lg font-semibold text-text-primary">Add / Upload Document</DialogTitle>
              <DialogDescription className="mt-0.5 text-caption text-text-secondary">Upload a new document for the client.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-5 sm:px-6">
            <div>
              <label htmlFor="document-title" className="text-caption font-semibold text-text-primary">Document Title</label>
              <Input id="document-title" placeholder="e.g. Passport Copy" aria-invalid={Boolean(errors.documentTitle)} className="mt-1.5 h-10" {...register("documentTitle")} />
              <FieldError error={errors.documentTitle} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="document-type" className="text-caption font-semibold text-text-primary">Document Type</label>
                <Controller
                  name="documentType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || null} onValueChange={field.onChange}>
                      <SelectTrigger id="document-type" aria-invalid={Boolean(errors.documentType)} className="mt-1.5 h-10 w-full"><SelectValue placeholder="Select Type" /></SelectTrigger>
                      <SelectContent>{DOCUMENT_TYPE_OPTIONS.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                />
                <FieldError error={errors.documentType} />
              </div>
              <div>
                <label htmlFor="document-issue-date" className="text-caption font-semibold text-text-primary">Issue Date</label>
                <DateInput id="document-issue-date" aria-invalid={Boolean(errors.issueDate)} className="mt-1.5 h-10" {...register("issueDate")} />
                <FieldError error={errors.issueDate} />
              </div>
              <div>
                <label htmlFor="document-expiry-date" className="text-caption font-semibold text-text-primary">Expiry Date</label>
                <DateInput id="document-expiry-date" aria-invalid={Boolean(errors.expiryDate)} className="mt-1.5 h-10" {...register("expiryDate")} />
                <FieldError error={errors.expiryDate} />
              </div>
            </div>

            <div>
              <label htmlFor="document-file" className="text-caption font-semibold text-text-primary">Document file <span className="text-danger-600" aria-hidden="true">*</span></label>
              <Input id="document-file" type="file" aria-required="true" aria-invalid={Boolean(errors.documents)} className="mt-1.5 h-10 cursor-pointer py-1.5 file:mr-3 file:rounded-md file:bg-surface-secondary file:px-3 file:py-1 file:text-caption file:font-semibold file:text-text-primary" {...register("documents")} />
              <p className="mt-1.5 text-[10px] leading-4 text-text-muted">Maximum 10 MiB.</p>
              <FieldError error={errors.documents} />
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border-default bg-surface-primary px-5 py-4 sm:px-6">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="min-w-28 px-5">Cancel</Button>
            <Button type="submit" disabled={mutation.isPending || !clientId} className="min-w-36 gap-2 px-5 font-semibold"><Upload aria-hidden="true" className="size-3.5" />{mutation.isPending ? "Uploading..." : "Upload Document"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
