import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ClientsHeader({
  search,
  onSearchChange,
  onQuickAdd,
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="font-heading text-headline-md font-semibold tracking-tight text-foreground">
        Clients
      </h1>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={search}
            maxLength={100}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search clients"
            aria-label="Search clients"
            className="h-9 bg-card pl-9 shadow-card"
          />
        </div>
        <Button type="button" size="lg" onClick={onQuickAdd} className="h-9 bg-primary px-4 text-primary-foreground hover:bg-primary/90">
          <Plus data-icon="inline-start" />
          Quick Add
        </Button>
      </div>
    </header>
  );
}
