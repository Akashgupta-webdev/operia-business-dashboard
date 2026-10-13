import { useState } from "react";
import { Search, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@operio/ui/components/dialog";
import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import { NATIONALITIES } from "@/features/clients/constants/nationalities";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useComplianceClients, useSetClientCompliance } from "../hooks/useComplianceClients";
import ComplianceClientTable from "./ComplianceClientTable";

export default function AddComplianceClientDialog({ onClose }) {
  const [search, setSearch] = useState("");
  const [nationality, setNationality] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const debouncedSearch = useDebouncedValue(search.trim());
  const query = useComplianceClients({ added: false, search: debouncedSearch });
  const mutation = useSetClientCompliance();
  const clients = query.data?.pages.flatMap((page) => page.data) ?? [];
  const canAdd = clients.some((client) => client._id === selectedId && (!nationality || client.nationality === nationality)) && search.trim() === debouncedSearch && !query.isFetching && !query.isError;

  async function addClient() {
    try {
      await mutation.mutateAsync({ clientId: selectedId, added: true });
      toast.success("Client added to compliance");
      onClose();
    } catch { /* The dialog retains the selection and displays the error. */ }
  }

  return <Dialog open onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}>
    <DialogContent className="flex max-h-[90svh] max-w-4xl flex-col gap-4 overflow-y-auto p-4 sm:p-5" showCloseButton={!mutation.isPending}>
      <div className="flex items-start gap-3 pr-8"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary"><UsersRound className="size-5" /></span><div><DialogTitle className="text-base">Add Client to Compliance</DialogTitle><DialogDescription className="mt-1 text-xs">Select an existing client to add to VAT/Tax compliance tracking.</DialogDescription></div></div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" /><Input autoFocus type="search" aria-label="Search clients" placeholder="Search client name, company name or mobile number..." value={search} disabled={mutation.isPending} onChange={(event) => { setSearch(event.target.value); setSelectedId(null); }} className="h-9 pl-9 text-xs md:text-xs" /></div>
        <select aria-label="Filter by nationality" value={nationality} disabled={mutation.isPending} onChange={(event) => { setNationality(event.target.value); setSelectedId(null); }} className="h-9 rounded-md border border-border-default bg-surface-primary px-3 text-xs sm:max-w-48"><option value="">All Nationalities</option>{NATIONALITIES.map((country) => <option key={country.code} value={country.name}>{country.name}</option>)}</select>
      </div>
      <ComplianceClientTable query={query} nationality={nationality} selectedId={selectedId} onSelect={setSelectedId} disabled={mutation.isPending} />
      {mutation.isError && <p role="alert" className="text-xs text-destructive">Unable to add this client. Please try again.</p>}
      <DialogFooter className="items-center sm:justify-between"><p className="text-xs text-text-muted">{clients.length} of {query.data?.pages[0]?.page.total ?? 0} clients loaded{nationality ? " · Filtered by nationality" : ""}</p><div className="flex gap-2"><Button variant="outline" onClick={onClose} disabled={mutation.isPending}>Cancel</Button><Button onClick={addClient} disabled={!canAdd || mutation.isPending}>{mutation.isPending ? "Adding client…" : "Add Client in Compliance"}</Button></div></DialogFooter>
    </DialogContent>
  </Dialog>;
}
