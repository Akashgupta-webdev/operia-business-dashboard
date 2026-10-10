import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, FileCheck2, Receipt, Search, ShieldCheck, TriangleAlert } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Input } from "@operio/ui/components/input";
import { cn } from "@operio/ui/lib/utils";

const summaryCards = [
  { label: "Total Tax Filings", description: "Tracked tax cycles", icon: Receipt, iconClass: "bg-primary-50 text-primary-600", valueClass: "text-text-primary", descriptionClass: "text-text-secondary" },
  { label: "Action Required", description: "Due for filing", icon: TriangleAlert, iconClass: "bg-warning-50 text-warning-600", valueClass: "text-warning-600", descriptionClass: "text-warning-600 font-semibold" },
  { label: "Submitted to FTA", description: "Under processing", icon: FileCheck2, iconClass: "bg-info-50 text-info-600", valueClass: "text-info-600", descriptionClass: "text-text-secondary" },
  { label: "Compliant & Paid", description: "Fully reconciled", icon: CheckCircle2, iconClass: "bg-success-50 text-success-600", valueClass: "text-success-600", descriptionClass: "text-success-600 font-semibold" },
];
const statuses = ["All", "Pending", "Submitted", "Paid"];

export default function TaxCompliancePage() {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const hasFilters = status !== "All" || Boolean(search.trim());

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] space-y-3 bg-primary-50/30 p-3 sm:p-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-6 shrink-0 text-primary-600" />
            <h1 className="text-xl font-bold tracking-tight text-text-primary">Compliance &amp; Corporate Tax Hub</h1>
          </div>
          <p className="mt-1 text-xs leading-5 text-text-secondary">Monitor UAE VAT quarterly returns, Federal Tax Authority (FTA) deadlines, and AML filings.</p>
        </div>
        <Button variant="outline" render={<Link to="/renewals" />} className="h-9 self-start rounded-full border-border-default bg-surface-primary px-4 text-xs font-semibold sm:self-auto">
          <Clock3 aria-hidden="true" className="size-3.5 text-text-muted" />Renewals Radar
        </Button>
      </header>

      <section aria-label="Tax compliance summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ label, description, icon: Icon, iconClass, valueClass, descriptionClass }) => (
          <Card key={label} className="flex-row items-center justify-between gap-3 rounded-none border border-primary-100/60 bg-surface-primary p-3 shadow-card ring-0">
            <div className="min-w-0">
              <h2 className="text-[10px] font-bold uppercase tracking-wide text-text-muted">{label}</h2>
              <p className={cn("mt-1 text-xl font-bold leading-6 tabular-nums", valueClass)}>0</p>
              <p className={cn("mt-1 text-xs", descriptionClass)}>{description}</p>
            </div>
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", iconClass)}><Icon aria-hidden="true" className="size-4" /></span>
          </Card>
        ))}
      </section>

      <Card className="flex-col gap-2 rounded-lg border border-primary-100/60 bg-surface-primary p-2 shadow-card ring-0 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by filing status" className="flex flex-wrap gap-2">
          {statuses.map((option) => (
            <Button key={option} type="button" aria-pressed={status === option} onClick={() => setStatus(option)} className={cn("h-8 rounded-full px-4 text-xs font-semibold", status === option ? "bg-primary text-primary-foreground shadow-sm" : "border-primary-100 bg-primary-50 text-primary hover:bg-primary-100")}>
              {option}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-muted" />
          <Input type="search" aria-label="Search by company or TRN" placeholder="Search company, TRN..." value={search} onChange={(event) => setSearch(event.target.value)} className="h-8 min-h-8! rounded-full border-border-default bg-primary-50/20 pl-8 text-xs shadow-none placeholder:text-xs md:text-xs" />
        </div>
      </Card>

      <Card role="status" aria-live="polite" className="min-h-32 items-center justify-center gap-0 rounded-lg border border-primary-100/60 bg-surface-primary px-4 py-6 text-center shadow-card ring-0">
        <ShieldCheck aria-hidden="true" className="mb-2 size-6 text-neutral-300" />
        <h2 className="text-xs font-semibold text-text-primary">{hasFilters ? "No matching compliance records" : "No compliance records found"}</h2>
        <p className="mt-1 text-xs leading-5 text-text-muted">{hasFilters ? "Try another company, TRN, or filing status." : "All tax filings and compliance records are currently up to date."}</p>
      </Card>
    </div>
  );
}
