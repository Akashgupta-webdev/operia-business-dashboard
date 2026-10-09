import { AlertTriangle } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";

export default function DeleteClientDialog({ client, onOpenChange }) {
  return (
    <Dialog open={Boolean(client)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <DialogHeader className="border-b border-border-default px-4 py-3 pr-12">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-600"><AlertTriangle aria-hidden="true" className="size-4" /></span>
            <div>
              <DialogTitle className="text-base font-semibold">Delete client</DialogTitle>
              <DialogDescription className="mt-1 text-xs">Review this action carefully before deleting a client.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-2 px-4 py-3 text-xs text-text-secondary">
          <p>You selected <strong className="font-medium text-text-primary">{client?.name}</strong> for deletion.</p>
          <p>Client deletion is not connected yet. No records have been deleted.</p>
        </div>
        <DialogFooter className="border-t border-border-default px-4 py-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-8 px-3 text-xs">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
