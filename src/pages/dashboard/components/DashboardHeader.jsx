import { FilterSelect } from "./FilterSelect";

const periodOptions = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Activity" },
];

const expiryOptions = [
  { value: "30", label: "Expiring in 30 Days" },
  { value: "60", label: "Expiring in 60 Days" },
  { value: "90", label: "Expiring in 90 Days" },
  { value: "all", label: "All Expiry Dates" },
];

const serviceOptions = [
  { value: "all", label: "Service Type" },
  { value: "vat", label: "VAT Filing" },
  { value: "visa", label: "Visa Renewal" },
  { value: "tax", label: "Tax Compliance" },
  { value: "insurance", label: "Insurance" },
  { value: "documents", label: "Documents" },
];

const statusOptions = [
  { value: "all", label: "Status" },
  { value: "due-soon", label: "Due Soon" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active / Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

export function DashboardHeader({
  period,
  expiry,
  service,
  status,
  onPeriodChange,
  onExpiryChange,
  onServiceChange,
  onStatusChange,
}) {
  return (
    <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <h1 className="font-heading text-headline-lg font-semibold tracking-tight text-foreground">
          Overview
        </h1>
        <p className="mt-1 text-body-md text-muted-foreground">
          Monitor daily operations and upcoming deadlines.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center xl:justify-end">
        <FilterSelect
          label="Activity period"
          value={period}
          options={periodOptions}
          onChange={onPeriodChange}
        />
        <FilterSelect
          label="Expiry window"
          value={expiry}
          options={expiryOptions}
          onChange={onExpiryChange}
          className="sm:min-w-44"
        />
        <FilterSelect
          label="Service type"
          value={service}
          options={serviceOptions}
          onChange={onServiceChange}
        />
        <FilterSelect
          label="Action status"
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
        />
      </div>
    </section>
  );
}
