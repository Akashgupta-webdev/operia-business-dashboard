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
        <DialogHeader className="border-b border-border-default px-4 py-3 pr-12">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500"><AlertTriangle aria-hidden="true" className="size-4" /></span>
            <div className="min-w-0">
              <DialogTitle className="text-base leading-5 font-semibold text-text-primary">Delete document</DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-4 text-text-secondary">This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-4 py-3 text-[13px] text-text-secondary">
          Are you sure you want to permanently delete <span className="font-semibold text-text-primary">{document?.documentTitle || "this document"}</span>? The uploaded file will also be removed.
        </div>

        <DialogFooter className="border-t border-border-default bg-surface-primary px-4 py-3">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="px-3 h-8 text-xs">Cancel</Button>
          <Button type="button" variant="destructive" onClick={deleteDocument} disabled={mutation.isPending || !canDelete} title={canDelete ? "Permanently delete document" : "Document ID is invalid"} className="gap-2 px-3 font-medium h-8 text-xs">
            <Trash2 aria-hidden="true" className="size-3.5" />
            {mutation.isPending ? "Deleting..." : "Delete document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
