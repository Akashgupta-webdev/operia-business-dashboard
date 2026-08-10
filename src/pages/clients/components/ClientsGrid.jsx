import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientCard } from "./ClientCard";

export function ClientsGrid({ clients, error, isLoading, onRetry, search }) {
  if (isLoading) {
    return (
      <section aria-label="Loading clients" className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-72 rounded-xl" />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div role="alert" className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-destructive/30 bg-card px-6 text-center shadow-card">
        <h2 className="font-heading text-body-lg font-semibold text-foreground">Unable to load clients</h2>
        <p className="mt-1 text-body-sm text-muted-foreground">Please try again. If the problem continues, contact support.</p>
        <Button type="button" variant="outline" onClick={onRetry} className="mt-4">Try again</Button>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center shadow-card">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Users className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-heading text-body-lg font-semibold text-foreground">No clients found</h2>
        <p className="mt-1 text-body-sm text-muted-foreground">
          {search ? "Try a different name, ID, email, or phone number." : "Add a client to get started."}
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Client directory" className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {clients.map((client) => (
        <ClientCard key={client.clientId} client={client} />
      ))}
    </section>
  );
}
