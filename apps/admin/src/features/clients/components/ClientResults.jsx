import { useNavigate } from "react-router-dom";
import { Building2, Eye, FileText, Mail, Phone, Users } from "lucide-react";

import { Button, buttonVariants } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Skeleton } from "@operio/ui/components/skeleton";
import { cn } from "@operio/ui/lib/utils";

const statusClasses = {
  Active: "bg-success-50 text-success-700 dark:bg-success-container dark:text-success-container-foreground",
  Inactive: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  Archived: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  Draft: "bg-warning-50 text-warning-700 dark:bg-warning-container dark:text-warning-container-foreground",
};

const avatarClasses = [
  "bg-primary-600", "bg-info-600", "bg-success-600",
  "bg-warning-600", "bg-primary-800", "bg-danger-600",
];

function getInitials(name = "Client") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function getAvatarClass(name = "Client") {
  const code = name.trim().charAt(0).toUpperCase().charCodeAt(0);
  return avatarClasses[Math.max(0, code - 65) % avatarClasses.length];
}

function StatusBadge({ status }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] leading-4 font-semibold", statusClasses[status] ?? statusClasses.Inactive)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {status || "Unknown"}
    </span>
  );
}

function CountItem({ icon: Icon, iconClassName, label, value }) {
  return (
    <div className="min-w-0 flex-1 text-center">
      <div className="flex items-center justify-center gap-0.5 text-[9px] leading-3 font-semibold uppercase tracking-wide text-text-muted">
        <Icon aria-hidden="true" className={cn("size-2.5", iconClassName)} />{label}
      </div>
      <p className="mt-0.5 text-caption font-semibold text-text-primary" data-numeric>{value ?? 0}</p>
    </div>
  );
}

function ContactActions({ client, onView }) {
  return (
    <div className="flex items-center gap-1">
      {client.mobileNumber && <a href={`tel:${client.mobileNumber}`} aria-label={`Call ${client.name}`} className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-text-muted hover:text-primary")}><Phone aria-hidden="true" className="size-4" /></a>}
      {client.emailAddress && <a href={`mailto:${client.emailAddress}`} aria-label={`Email ${client.name}`} className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-text-muted hover:text-primary")}><Mail aria-hidden="true" className="size-4" /></a>}
      <Button type="button" variant="ghost" size="icon-sm" onClick={onView} className="ml-auto cursor-pointer text-text-muted hover:text-primary" aria-label={`View ${client.name}`}><Eye aria-hidden="true" className="size-4" /></Button>
    </div>
  );
}

function CardActions({ client, onView }) {
  const actionClass = "size-7 text-text-muted hover:bg-surface-secondary hover:text-text-primary";

  return (
    <div className="flex items-center gap-0.5">
      <a href={client.mobileNumber ? `tel:${client.mobileNumber}` : undefined} aria-disabled={!client.mobileNumber} aria-label={`Call ${client.name}`} className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), actionClass, !client.mobileNumber && "pointer-events-none opacity-40")}><Phone aria-hidden="true" className="size-3.5 text-info-600" /></a>
      <a href={client.emailAddress ? `mailto:${client.emailAddress}` : undefined} aria-disabled={!client.emailAddress} aria-label={`Email ${client.name}`} className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), actionClass, !client.emailAddress && "pointer-events-none opacity-40")}><Mail aria-hidden="true" className="size-3.5 text-primary-600" /></a>
      <Button type="button" variant="ghost" size="icon-sm" onClick={onView} className={cn("ml-auto cursor-pointer", actionClass)} aria-label={`View ${client.name}`}><Eye aria-hidden="true" className="size-3.5 text-info-600" /></Button>
    </div>
  );
}

function ClientCard({ client }) {
  const navigate = useNavigate();
  const viewClient = () => navigate(`/clients/${client._id}`);

  return (
    <Card size="sm" className="min-w-0 w-full max-w-none gap-0 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg text-caption font-bold text-neutral-0", getAvatarClass(client.name))}>{getInitials(client.name)}</div>
        <StatusBadge status={client.status} />
      </div>
      <button type="button" onClick={viewClient} className="mt-3 text-left focus-visible:rounded-sm"><h2 className="line-clamp-2 text-[12px] leading-4 font-semibold text-text-primary uppercase hover:text-primary">{client.name}</h2></button>
      <p className="mt-1 flex min-w-0 items-center gap-1 text-[11px] leading-4 text-text-secondary">
        <Building2 aria-hidden="true" className="size-3 shrink-0 text-info-600" />
        {client.clientType === "COMPANY" ? "Company" : "Individual client"}
        {client.nationality && <><span aria-hidden="true">·</span>{client.nationality}</>}
      </p>
      {client.companyName && <p className="mt-2 w-fit max-w-full truncate rounded-md bg-primary-50 px-2 py-0.5 text-[9px] leading-4 font-semibold text-primary-700 dark:bg-accent dark:text-accent-foreground"><Building2 aria-hidden="true" className="mr-1 inline size-2.5 text-primary-600" />{client.companyName}{client.companyCount > 1 && ` +${client.companyCount - 1}`}</p>}
      <div className="my-3 h-px bg-border-default" />
      <div className="grid grid-cols-3 divide-x divide-border-default rounded-lg bg-surface-secondary py-1.5">
        <CountItem icon={Building2} iconClassName="text-primary-600" label="Companies" value={client.companyCount} /><CountItem icon={Users} iconClassName="text-info-600" label="Services" value={client.serviceCount} /><CountItem icon={FileText} iconClassName="text-warning-600" label="Docs" value={client.documentCount} />
      </div>
      <div className="mt-2 border-t border-border-default pt-2"><CardActions client={client} onView={viewClient} /></div>
    </Card>
  );
}

function ClientList({ clients }) {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto rounded-xl border border-border-default bg-surface-primary shadow-card">
      <table className="w-full min-w-200 text-left text-body-sm">
        <thead className="border-b border-border-default bg-surface-secondary text-caption font-semibold uppercase tracking-wide text-text-muted"><tr><th className="px-4 py-3">Client</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Related records</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
        <tbody className="divide-y divide-border-default">{clients.map((client) => <tr key={client._id} className="hover:bg-surface-secondary/60">
          <td className="px-4 py-3"><button type="button" onClick={() => navigate(`/clients/${client._id}`)} className="font-semibold text-text-primary hover:text-primary">{client.name}</button><p className="mt-0.5 text-caption text-text-muted">{client.companyName || client.nationality || "—"}</p></td>
          <td className="px-4 py-3 text-text-secondary"><p>{client.mobileNumber || "—"}</p><p className="text-caption">{client.emailAddress || "—"}</p></td>
          <td className="px-4 py-3 text-text-secondary">{client.clientType === "COMPANY" ? "Company" : "Individual"}</td>
          <td className="px-4 py-3 text-text-secondary" data-numeric>{client.companyCount ?? 0} companies · {client.serviceCount ?? 0} services · {client.documentCount ?? 0} docs</td>
          <td className="px-4 py-3"><StatusBadge status={client.status} /></td>
          <td className="px-4 py-3"><ContactActions client={client} onView={() => navigate(`/clients/${client._id}`)} /></td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}

export function ClientResultsSkeleton({ view }) {
  return view === "list" ? <Skeleton className="h-72 w-full rounded-xl" /> : <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:!grid-cols-4">{Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="h-60 min-w-0 rounded-xl" />)}</div>;
}

export default function ClientResults({ clients, view }) {
  if (view === "list") return <ClientList clients={clients} />;
  return <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">{clients.map((client) => <ClientCard key={client._id} client={client} />)}</div>;
}
