import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RENEWAL_CATEGORIES, RENEWAL_STATUSES } from "@/constants/renewals";

export default function RenewalFilters({ filters, onChange }) {
  const choose = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <Card className="gap-2 border border-border-default bg-surface-primary p-3 shadow-card ring-0">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-lg">
          <label htmlFor="renewal-search" className="sr-only">Search renewals on this page</label>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input id="renewal-search" type="search" value={filters.search} onChange={(event) => choose("search", event.target.value)} placeholder="Search item, entity, or client on this page..." className="h-8 border-border-default bg-surface-primary pl-9 text-caption" />
        </div>
        <div role="group" aria-label="Filter this page by status" className="flex flex-wrap gap-1.5">
          {RENEWAL_STATUSES.map(({ value, label }) => <Button key={value} type="button" size="sm" variant={filters.status === value ? "default" : "outline"} aria-pressed={filters.status === value} onClick={() => choose("status", value)} className="text-[11px] leading-4 aria-pressed:bg-primary-700 aria-pressed:text-neutral-0 aria-pressed:hover:bg-primary-800">{label}</Button>)}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 border-t border-border-default pt-2" role="group" aria-label="Filter this page by category">
        {RENEWAL_CATEGORIES.map(({ value, label }) => <Button key={value} type="button" size="sm" variant={filters.category === value ? "default" : "secondary"} aria-pressed={filters.category === value} onClick={() => choose("category", value)} className="text-[11px] leading-4 aria-pressed:bg-primary-700 aria-pressed:text-neutral-0 aria-pressed:hover:bg-primary-800">{label}</Button>)}
      </div>
    </Card>
  );
}
