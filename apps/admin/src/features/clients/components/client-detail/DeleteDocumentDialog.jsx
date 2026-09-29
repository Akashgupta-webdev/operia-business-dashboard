import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";
import useDeleteClientDocument from "@/features/clients/hooks/useDeleteClientDocument";

const isDocumentId = (value) => /^[a-f\d]{24}$/i.test(value || "");

export default function DeleteDocumentDialog({ clientId, document, open, onOpenChange }) {
  const mutation = useDeleteClientDocument(clientId);
  const documentId = document?.id ?? document?._id;
  const canDelete = isDocumentId(documentId) && !document?.service;

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const deleteDocument = async () => {
    if (!canDelete) return;
    try {
      await mutation.mutateAsync(documentId);
      toast.success("Document deleted successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      toast.error(response?.error?.message || response?.message || "Document deletion failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b border-border-default px-5 py-5 pr-14">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500"><AlertTriangle aria-hidden="true" className="size-5" /></span>
            <div className="min-w-0">
              <DialogTitle className="text-body-lg font-semibold text-text-primary">Delete document</DialogTitle>
              <DialogDescription className="mt-1 text-caption text-text-secondary">This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 py-5 text-body-sm text-text-secondary">
          Are you sure you want to permanently delete <span className="font-semibold text-text-primary">{document?.documentTitle || "this document"}</span>? The uploaded file will also be removed.
        </div>

        <DialogFooter className="border-t border-border-default bg-surface-primary px-5 py-4">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="px-5">Cancel</Button>
          <Button type="button" variant="destructive" onClick={deleteDocument} disabled={mutation.isPending || !canDelete} title={canDelete ? "Permanently delete document" : "Document ID is invalid"} className="gap-2 px-5 font-semibold">
            <Trash2 aria-hidden="true" className="size-3.5" />
            {mutation.isPending ? "Deleting..." : "Delete document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
