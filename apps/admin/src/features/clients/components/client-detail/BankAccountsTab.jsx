import { Landmark, Plus } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";

export default function BankAccountsTab() {
  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-primary p-4 shadow-card ring-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Landmark aria-hidden="true" className="size-4 shrink-0 text-primary" />
            Corporate &amp; Personal Bank Accounts
          </h2>
          <p className="mt-1 text-xs text-text-secondary">Manage banking records, IBANs, and settlement details.</p>
        </div>
        <Button type="button" disabled className="h-8 shrink-0 rounded-full px-4 text-xs" title="Bank account creation is not available yet.">
          <Plus aria-hidden="true" className="size-3.5" />Add Bank Account
        </Button>
      </Card>
      <Card className="min-h-60 items-center justify-center gap-0 rounded-2xl border border-border-default bg-surface-primary px-4 py-10 text-center shadow-card ring-0">
        <Landmark aria-hidden="true" className="mb-4 size-9 text-neutral-300" />
        <h3 className="text-sm font-semibold text-text-primary">No bank accounts added</h3>
        <p className="mt-1 text-xs text-text-secondary">Add corporate or individual bank accounts directly to this client.</p>
        <Button type="button" disabled className="mt-4 h-8 rounded-full px-4 text-xs" title="Bank account creation is not available yet.">
          <Plus aria-hidden="true" className="size-3.5" />Add Bank Account Now
        </Button>
      </Card>
    </div>
  );
}
