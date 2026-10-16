import { toast } from "sonner";
import { Button } from "@operio/ui/components/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@operio/ui/components/dialog";
import { useFilingMutation } from "../hooks/useFilingMutations";

export default function DeleteFilingDialog({ type, filing, onClose }) {
  const mutation = useFilingMutation("delete");
  const id = filing.id || filing._id;
  async function remove() {
    if (!id || mutation.isPending) return;
    try {
      await mutation.mutateAsync({ type, id });
      toast.success(type + " filing deleted");
      onClose(true);
    } catch { /* Keep confirmation visible with the API error. */ }
  }
  return <Dialog open onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}>
    <DialogContent className="max-w-md space-y-4 p-5" showCloseButton={!mutation.isPending}>
      <DialogTitle className="pr-8 text-base">Delete {type} Filing?</DialogTitle>
      <DialogDescription className="text-xs">Delete the filing for {filing.periodStart || "Not recorded"} to {filing.periodEnd || "Not recorded"}? This cannot be undone. The company next due date will remain unchanged.</DialogDescription>
      {mutation.isError && <p role="alert" className="text-xs text-destructive">{mutation.error?.response?.data?.error?.message || "Unable to delete this filing. Please try again."}</p>}
      <DialogFooter><Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => onClose()}>Cancel</Button><Button type="button" variant="destructive" disabled={!id || mutation.isPending} onClick={remove}>{mutation.isPending ? "Deleting..." : "Delete Filing"}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
