import { AlertTriangle, Trash2 } from "lucide-react";
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
import useDeleteClientRelatedRecord from "@/features/clients/hooks/useDeleteClientRelatedRecord";

const RECORD_LABELS = {
  member: "member",
  vehicle: "vehicle",
  driver: "driver",
};

export default function DeleteRelatedRecordDialog({ clientId, record, open, onOpenChange }) {
  const mutation = useDeleteClientRelatedRecord(clientId);
  const recordType = RECORD_LABELS[record?.actionOn] || "record";

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const deleteRecord = async () => {
    if (!record?.id || !RECORD_LABELS[record.actionOn]) return;

    try {
      await mutation.mutateAsync({ recordId: record.id, actionOn: record.actionOn });
      toast.success(`${recordType[0].toUpperCase()}${recordType.slice(1)} deleted successfully.`);
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      toast.error(response?.message || response?.error?.message || `Unable to delete this ${recordType}. Please try again.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b border-border-default px-5 py-5 pr-14">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500">
              <AlertTriangle aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-body-lg font-semibold text-text-primary">Delete {recordType}</DialogTitle>
              <DialogDescription className="mt-1 text-caption text-text-secondary">This action cannot be undone.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 py-5 text-body-sm text-text-secondary">
          Are you sure you want to permanently delete <span className="font-semibold text-text-primary">{record?.label || `this ${recordType}`}</span>?
        </div>

        <DialogFooter className="border-t border-border-default bg-surface-primary px-5 py-4">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="px-5">Cancel</Button>
          <Button type="button" variant="destructive" onClick={deleteRecord} disabled={mutation.isPending || !record?.id} className="gap-2 px-5 font-semibold">
            <Trash2 aria-hidden="true" className="size-3.5" />
            {mutation.isPending ? "Deleting..." : `Delete ${recordType}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
