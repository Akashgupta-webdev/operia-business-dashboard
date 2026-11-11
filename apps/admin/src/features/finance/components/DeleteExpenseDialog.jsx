import { toast } from "sonner";
import { Button } from "@operio/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";
import useDeleteExpense from "../hooks/useDeleteExpense";

export default function DeleteExpenseDialog({ expense, onClose, onDeleted }) {
  const mutation = useDeleteExpense();
  const remove = async () => {
    try {
      await mutation.mutateAsync(expense.id);
      toast.success("Expense deleted successfully.");
      onDeleted();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || "Unable to delete the expense. Please try again.");
      if (error?.response?.status === 404) {
        onDeleted();
        onClose();
      }
    }
  };
  return <Dialog open={Boolean(expense)} onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}>
    <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
      <DialogHeader className="gap-2 px-5 pt-5 pb-4 pr-12">
        <DialogTitle className="text-base font-semibold">Delete expense</DialogTitle>
        <DialogDescription className="text-sm leading-6 break-words">Permanently delete {expense?.expenseTitle}? This cannot be undone and will update the Profit &amp; Loss totals.</DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 border-t border-border-default px-5 py-4">
        <Button type="button" variant="outline" disabled={mutation.isPending} onClick={onClose}>Cancel</Button>
        <Button type="button" variant="destructive" disabled={mutation.isPending || !expense} onClick={remove}>{mutation.isPending ? "Deleting..." : "Delete expense"}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
