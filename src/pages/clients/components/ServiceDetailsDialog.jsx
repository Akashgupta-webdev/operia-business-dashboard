import { Building2, ClipboardList, CreditCard, History } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const formatLabel = (value = "") => value
  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
  .replaceAll("_", " ")
  .replace(/^./, (letter) => letter.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

const formatAmount = (value) => {
  const decimalValue = value?.$numberDecimal ?? value;
  const amount = Number(decimalValue);
  if (!Number.isFinite(amount)) return "Not available";
  return new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

function DetailItem({ label, value }) {
  return (
    <div className="min-w-0 rounded-lg bg-surface-container-low p-3">
      <dt className="text-label-sm font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-body-sm text-foreground">{formatValue(value)}</dd>
    </div>
  );
}

function SectionHeading({ className, icon: Icon, id, title }) {
  return (
    <h3 id={id} className="mb-3 flex items-center gap-2.5 text-label-md font-semibold tracking-wide text-foreground uppercase">
      <span className={cn("flex size-8 items-center justify-center rounded-lg", className)}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      {title}
    </h3>
  );
}

function EmptySection({ children }) {
  return <p className="rounded-lg bg-surface-container-low p-3 text-body-sm text-muted-foreground">{children}</p>;
}

export function ServiceDetailsDialog({ categoryLabel, onOpenChange, open, service }) {
  const details = service ? Object.entries(service.detail ?? {}) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>{categoryLabel}</DialogTitle>
          <DialogDescription>Complete service information recorded for this client.</DialogDescription>
        </DialogHeader>

        {service && (
          <div className="space-y-6 px-6 py-5">
            <section aria-labelledby="service-details-heading">
              <SectionHeading
                id="service-details-heading"
                icon={ClipboardList}
                title="Service details"
                className="bg-accent text-accent-foreground"
              />
              <dl className="grid gap-3 sm:grid-cols-2">
                {details.map(([key, value]) => <DetailItem key={key} label={formatLabel(key)} value={value} />)}
              </dl>
            </section>

            <section aria-labelledby="service-record-heading">
              <SectionHeading
                id="service-record-heading"
                icon={History}
                title="Service record"
                className="bg-warning-container text-warning-container-foreground"
              />
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="Status" value={formatLabel(service.status)} />
                <DetailItem label="Created" value={formatDateTime(service.createdAt)} />
                <DetailItem label="Last updated" value={formatDateTime(service.updatedAt)} />
              </dl>
            </section>

            <section aria-labelledby="company-information-heading">
              <SectionHeading
                id="company-information-heading"
                icon={Building2}
                title="Company information"
                className="bg-success-container text-success-container-foreground"
              />
              {service.company && typeof service.company === "object" ? (
                <dl className="grid gap-3 sm:grid-cols-2">
                  <DetailItem label="Company ID" value={service.company.companyId} />
                  <DetailItem label="Company name" value={service.company.companyName} />
                  <DetailItem label="Company type" value={formatLabel(service.company.companyType)} />
                  <DetailItem label="Company status" value={formatLabel(service.company.companyStatus)} />
                </dl>
              ) : (
                <EmptySection>No company information is associated with this service.</EmptySection>
              )}
            </section>

            <section aria-labelledby="payment-information-heading">
              <SectionHeading
                id="payment-information-heading"
                icon={CreditCard}
                title="Payment information"
                className="bg-destructive-container text-destructive-container-foreground"
              />
              {service.payment ? (
                <dl className="grid gap-3 sm:grid-cols-2">
                  <DetailItem label="Total amount" value={formatAmount(service.payment.totalAmount)} />
                  <DetailItem label="Payment status" value={formatLabel(service.payment.paymentStatus)} />
                  <DetailItem label="Payment date" value={formatDateTime(service.payment.paymentDate)} />
                </dl>
              ) : (
                <EmptySection>No payment information is associated with this service.</EmptySection>
              )}
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
