import { Eye, IdCard, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusClasses = {
  ACTIVE: "bg-success-container text-success-container-foreground",
  INACTIVE: "bg-muted text-muted-foreground",
  PROSPECT: "bg-warning-container text-warning-container-foreground",
  ARCHIVED: "bg-surface-container-highest text-on-surface-variant",
};

function DetailRow({ icon: Icon, children }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-body-sm text-muted-foreground">
      <Icon className="size-3.5 shrink-0 text-outline" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </div>
  );
}

export function ClientCard({ client }) {
  return (
    <Card className="gap-0 rounded-xl border border-border bg-card p-6 shadow-card ring-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-heading text-body-lg font-semibold text-card-foreground">
            {client.name}
          </h2>
          <p className="mt-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {client.clientId}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-label-sm font-semibold",
            statusClasses[client.clientStatus]
          )}
        >
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          {client.clientStatus}
        </span>
      </div>

      <div className="my-4 h-px bg-border" />

      <div className="space-y-2.5">
        <DetailRow icon={Mail}>{client.emailAddress || "No email address"}</DetailRow>
        <DetailRow icon={Phone}>{client.mobileNumber || "No mobile number"}</DetailRow>
        <DetailRow icon={MessageCircle}>{client.whatsappNumber || "No WhatsApp number"}</DetailRow>
        <DetailRow icon={IdCard}>{client.emiratesIdNumber || "No Emirates ID"}</DetailRow>
      </div>

      <Button
        render={<Link to={`/clients/${encodeURIComponent(client.clientId)}`} />}
        variant="outline"
        className="mt-4 h-9 w-full border-primary/50 bg-transparent text-primary hover:border-primary hover:bg-accent hover:text-accent-foreground dark:bg-transparent"
        aria-label={`View profile for ${client.name}`}
      >
        <Eye data-icon="inline-start" />
        View Profile
      </Button>
    </Card>
  );
}
