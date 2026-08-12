import { IdCard, Mail, MessageCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CLIENT_PROFILE_IMAGE,
  CLIENT_STATUS_STYLES,
} from "@/constants/ClientDetailPage";
import { cn } from "@/lib/utils";

const getInitials = (name = "") => name
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0])
  .join("")
  .toUpperCase() || "CL";

const formatStatus = (status = "") => status.charAt(0) + status.slice(1).toLowerCase();

export function ClientProfileHeader({ client }) {
  const whatsappDigits = client.whatsappNumber?.replace(/\D/g, "");

  return (
    <header className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between md:p-6">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar className="size-16 sm:size-20">
          <AvatarImage src={CLIENT_PROFILE_IMAGE} alt={`${client.name} profile`} />
          <AvatarFallback className="text-body-lg font-semibold">{getInitials(client.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate font-heading text-headline-md font-semibold text-foreground sm:text-headline-lg">
              {client.name}
            </h1>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm font-semibold",
                CLIENT_STATUS_STYLES[client.clientStatus] ?? "bg-muted text-muted-foreground"
              )}
            >
              <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
              {formatStatus(client.clientStatus)}
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-body-sm text-muted-foreground">
            <IdCard className="size-3.5 text-outline" aria-hidden="true" />
            <span>ID: {client.clientId}</span>
          </p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 sm:self-start">
        {whatsappDigits ? (
          <Button
            render={<a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer" />}
            size="lg"
            className="flex-1 px-4 sm:flex-none"
          >
            <MessageCircle data-icon="inline-start" />
            WhatsApp
          </Button>
        ) : (
          <Button size="lg" className="flex-1 px-4 sm:flex-none" disabled>
            <MessageCircle data-icon="inline-start" />
            WhatsApp
          </Button>
        )}

        {client.emailAddress ? (
          <Button
            render={<a href={`mailto:${client.emailAddress}`} />}
            variant="outline"
            size="lg"
            className="flex-1 border-primary/50 bg-transparent px-4 text-primary hover:border-primary hover:bg-accent hover:text-accent-foreground sm:flex-none dark:bg-transparent"
          >
            <Mail data-icon="inline-start" />
            Email
          </Button>
        ) : (
          <Button variant="outline" size="lg" className="flex-1 px-4 sm:flex-none" disabled>
            <Mail data-icon="inline-start" />
            Email
          </Button>
        )}
      </div>
    </header>
  );
}
