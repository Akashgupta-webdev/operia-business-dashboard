import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDeleteService } from "@/hooks/useServiceMutations";

export function DeleteServiceDialog({ categoryLabel, clientDatabaseId, onOpenChange, open, service }) {
  const deleteService = useDeleteService(clientDatabaseId);

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen && deleteService.isPending) return;
    onOpenChange(nextOpen);
  };

  const handleDelete = async () => {
    try {
      await deleteService.mutateAsync(service.id);
      toast.success("Service deleted successfully.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "We couldn't delete the service. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 sm:max-w-md">
        <DialogHeader className="px-6 pt-6 pr-14">
          <span className="mb-2 flex size-11 items-center justify-center rounded-full bg-destructive-container text-destructive-container-foreground">
            <TriangleAlert className="size-5" aria-hidden="true" />
          </span>
          <DialogTitle>Delete service?</DialogTitle>
          <DialogDescription>
            {categoryLabel} and all of its recorded information will be permanently deleted. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5 border-t bg-surface-container-low px-6 py-4">
          <Button type="button" variant="outline" disabled={deleteService.isPending} onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button type="button" variant="destructive" disabled={deleteService.isPending} onClick={handleDelete}>
            {deleteService.isPending ? "Deleting…" : "Delete service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
