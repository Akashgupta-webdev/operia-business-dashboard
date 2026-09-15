import {
  Activity,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckSquare,
  CreditCard,
  FileBadge,
  FileText,
  HeartPulse,
  Pencil,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@operio/ui/components/card";
import { cn } from "@operio/ui/lib/utils";

function parseDate(value) {
  if (!value) return null;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date) : "—";
}

function daysRemaining(value) {
  const date = parseDate(value);
  return date ? Math.ceil((date.getTime() - Date.now()) / 86400000) : null;
}

function StatCard({ icon: Icon, label, value, tone = "primary" }) {
  const tones = {
    primary: "text-primary-600 bg-primary-50",
    info: "text-info-600 bg-info-50",
    success: "text-success-600 bg-success-50",
    danger: "text-danger-600 bg-danger-50",
  };

  return (
    <Card size="sm" className="flex-row items-center gap-3 border border-border-default bg-surface-primary p-3 shadow-card ring-0">
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tones[tone])}>
        <Icon aria-hidden="true" className="size-4" />
      </div>
      <p className="min-w-0 text-[10px] leading-4 font-semibold text-text-muted">{label}</p>
      <p className={cn("ml-auto text-body-sm font-bold", tone === "danger" ? "text-danger-600" : "text-text-primary")} data-numeric>{value}</p>
    </Card>
  );
}

function DocumentCard({ icon: Icon, iconClassName, title, number, issueDate, expiryDate }) {
  const remaining = daysRemaining(expiryDate);
  const expiryLabel = remaining === null ? null : remaining < 0 ? "Expired" : `${remaining}d remaining`;
  const expiryTone = remaining !== null && remaining < 0
    ? "bg-danger-50 text-danger-700"
    : remaining !== null && remaining <= 90
      ? "bg-warning-50 text-warning-700"
      : "bg-success-50 text-success-700";

  return (
    <div className="rounded-lg border border-border-default bg-app-background/60 p-3">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className={cn("size-4", iconClassName)} />
        <h4 className="min-w-0 text-[11px] leading-4 font-semibold text-text-primary">{title}</h4>
        {expiryLabel && <span className={cn("ml-auto shrink-0 rounded-md px-1.5 py-0.5 text-[9px] leading-3 font-semibold", expiryTone)}>{expiryLabel}</span>}
      </div>
      <p className="mt-3 truncate rounded-md border border-border-default bg-surface-primary px-2 py-2 font-mono text-[11px] leading-4 font-semibold text-text-primary">{number || "Not registered"}</p>
      <dl className="mt-3 grid grid-cols-2 gap-3">
        <div><dt className="text-[10px] leading-4 text-text-muted">Issue date</dt><dd className="mt-0.5 text-[11px] leading-4 font-medium text-text-secondary">{formatDate(issueDate)}</dd></div>
        <div className="text-right"><dt className="text-[10px] leading-4 text-text-muted">Expiry date</dt><dd className="mt-0.5 text-[11px] leading-4 font-medium text-text-secondary">{formatDate(expiryDate)}</dd></div>
      </dl>
    </div>
  );
}

function buildActivities(data) {
  const sources = [
    [data.companies, "Company record updated"],
    [data.services, "Service record updated"],
    [data.documents, "Document record updated"],
    [data.reminders, "Task or reminder updated"],
    [data.payments, "Payment record updated"],
  ];
  return sources.flatMap(([items = [], title]) => items.map((item) => ({ id: item._id ?? item.id, title, date: item.updatedAt, detail: item.companyName || item.package || item.documentTitle || item.notes?.[0] || item.paymentStatus }))).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
}

function RecentActivity({ data }) {
  const activities = buildActivities(data);
  return (
    <Card className="h-full gap-0 border border-border-default bg-surface-primary py-0 shadow-card ring-0">
      <CardHeader className="flex flex-row items-center border-b border-border-default px-5 py-4">
        <Activity aria-hidden="true" className="size-4 text-primary-600" />
        <CardTitle className="text-body-sm font-semibold">Recent Activity</CardTitle>
        <Button type="button" variant="ghost" size="xs" disabled title="The full activity log is not available yet" className="ml-auto text-[10px] font-semibold text-primary-600 opacity-100">View all</Button>
      </CardHeader>
      <CardContent className="flex-1 px-5 py-4">
        {activities.length ? (
          <ol>
            {activities.map((item, index) => (
              <li key={`${item.id ?? item.title}-${index}`} className="relative pb-5 pl-5 last:pb-0 before:absolute before:top-2 before:bottom-0 before:left-[3px] before:w-px before:bg-primary-100 last:before:hidden">
                <span aria-hidden="true" className="absolute top-1.5 left-0 size-2 rounded-full bg-primary-600 ring-4 ring-primary-50" />
                <p className="text-[11px] leading-4 font-semibold text-text-primary">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-text-secondary">{item.detail || "Client-related information was updated."}</p>
                <p className="mt-1 text-[10px] leading-4 text-text-muted">{formatDate(item.date)}</p>
              </li>
            ))}
          </ol>
        ) : <p className="py-10 text-center text-caption text-text-muted">No activity recorded yet.</p>}
      </CardContent>
      <CardFooter className="justify-center border-t-0 bg-transparent px-5 pb-4 pt-0">
        <Button type="button" variant="outline" size="sm" disabled title="The full activity log is not available yet" className="gap-2 px-4 text-[10px] opacity-100">
          Go to full activity log <ArrowRight aria-hidden="true" className="size-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function OverviewTab({ data, onEditClient }) {
  const { client, companies = [], services = [], reminders = [], documents = [] } = data;
  const activeServices = services.filter((service) => !["Completed", "Cancelled"].includes(service.status)).length;
  const expiryDates = [client.passport?.passportExpiryDate, client.emirates?.emiratesExpiryDate, client.visa?.visaExpiryDate, client.healthInsurance?.healthInsuranceExpiryDate, ...documents.map((document) => document.expiryDate)];
  const dueSoon = expiryDates.filter((date) => { const days = daysRemaining(date); return days !== null && days >= 0 && days <= 90; }).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Building2} label="Companies" value={companies.length} />
        <StatCard icon={CheckSquare} label="Pending tasks" value={reminders.length} tone="info" />
        <StatCard icon={ShieldCheck} label="Active services" value={activeServices} tone="success" />
        <StatCard icon={CalendarClock} label="Due soon" value={dueSoon} tone="danger" />
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(16rem,1fr)]">
        <Card className="gap-0 border border-border-default bg-surface-primary py-0 shadow-card ring-0">
          <CardHeader className="flex flex-row items-center border-b border-border-default px-5 py-4">
            <CreditCard aria-hidden="true" className="size-4 text-primary-600" />
            <CardTitle className="text-body-sm font-semibold">Client Information &amp; Identity</CardTitle>
            <Button type="button" variant="ghost" size="sm" disabled={!client.id || !onEditClient} onClick={onEditClient} className="ml-auto gap-1.5 text-primary-600"><Pencil aria-hidden="true" className="size-3.5" />Edit Details</Button>
          </CardHeader>
          <CardContent className="p-5">
            <h3 className="mb-4 text-[10px] leading-4 font-semibold uppercase tracking-wide text-primary-700">Identity Documents &amp; Compliance</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <DocumentCard icon={CreditCard} iconClassName="text-info-600" title="Emirates ID (EID)" number={client.emirates?.emiratesId} issueDate={client.emirates?.emiratesIssueDate} expiryDate={client.emirates?.emiratesExpiryDate} />
              <DocumentCard icon={FileBadge} iconClassName="text-primary-600" title="Passport" number={client.passport?.passportNumber} issueDate={client.passport?.passportIssueDate} expiryDate={client.passport?.passportExpiryDate} />
              <DocumentCard icon={FileText} iconClassName="text-warning-600" title="Visa / Residency Permit" number={client.visa?.visaUIDNumber} issueDate={client.visa?.visaIssueDate} expiryDate={client.visa?.visaExpiryDate} />
              <DocumentCard icon={HeartPulse} iconClassName="text-success-600" title="Health / Medical Insurance" number={client.healthInsurance?.healthInsuranceCardNumber} issueDate={client.healthInsurance?.healthInsuranceIssueDate} expiryDate={client.healthInsurance?.healthInsuranceExpiryDate} />
            </div>
          </CardContent>
        </Card>
        <RecentActivity data={data} />
      </div>
    </div>
  );
}
