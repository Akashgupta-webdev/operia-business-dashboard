import { toast } from "sonner";
import {
  Archive,
  Copy,
  CreditCard,
  FileText,
  Flag,
  Mail,
  Pencil,
  Phone,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function getInitials(name = "Client") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function formatMonthYear(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value));
}

async function copyValue(value, label) {
  if (!value) return;
  await navigator.clipboard.writeText(value);
  toast.success(`${label} copied`);
}

function ProfileField({ icon: Icon, label, value, copyable = false }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-info-600" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
        <p className="mt-0.5 break-words text-caption font-semibold text-text-primary">{value || "Not registered"}</p>
      </div>
      {copyable && value && (
        <Button type="button" variant="ghost" size="icon-xs" onClick={() => copyValue(value, label)} aria-label={`Copy ${label}`} className="text-text-muted hover:text-primary">
          <Copy aria-hidden="true" className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

export default function ClientProfileCard({ client }) {
  return (
    <Card className="gap-0 border border-border-default bg-surface-primary py-0 shadow-card ring-0 lg:sticky lg:top-5">
      <CardContent className="p-5">
        <div className="text-center">
          <div className="mx-auto flex size-18 items-center justify-center rounded-xl bg-primary-700 text-subsection font-bold text-neutral-0 shadow-sm">{getInitials(client.name)}</div>
          <h1 className="mx-auto mt-4 max-w-56 text-body-lg font-bold leading-6 text-text-primary">{client.name}</h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-success-50 px-2 py-1 text-[10px] font-semibold text-success-700"><span className="size-1.5 rounded-full bg-current" />{client.status}</span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border-default bg-surface-secondary px-2 py-1 text-[10px] font-semibold text-text-secondary">ID: {client.id?.slice(-7).toUpperCase()} <Copy aria-hidden="true" className="size-3" /></span>
          </div>
          <p className="mt-2 text-caption text-text-muted">Client since {formatMonthYear(client.createdAt)}</p>
        </div>

        <Separator className="my-5" />
        <div className="space-y-4">
          <ProfileField icon={Phone} label="Mobile phone" value={client.mobileNumber} copyable />
          <ProfileField icon={Mail} label="Email" value={client.emailAddress} copyable />
          <ProfileField icon={Flag} label="Nationality" value={client.nationality} />
          <ProfileField icon={CreditCard} label="Emirates ID" value={client.emirates?.emiratesId} copyable />
          <ProfileField icon={FileText} label="Passport" value={client.passport?.passportNumber} copyable />
        </div>

        <Separator className="my-5" />
        <div className="space-y-2">
          <Button type="button" variant="outline" className="w-full justify-center gap-2"><Pencil aria-hidden="true" className="size-3.5" />Edit Profile</Button>
          <Button type="button" variant="outline" disabled title="Archive API is not configured" className="w-full justify-center gap-2 border-warning-200 bg-warning-50 text-warning-700 opacity-100"><Archive aria-hidden="true" className="size-3.5" />Archive Client</Button>
          <Button type="button" variant="outline" disabled title="Delete API is not configured" className="w-full justify-center gap-2 border-danger-200 bg-danger-50 text-danger-700 opacity-100"><Trash2 aria-hidden="true" className="size-3.5" />Delete Client &amp; Data</Button>
        </div>
      </CardContent>
    </Card>
  );
}
