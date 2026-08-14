import { BriefcaseBusiness, Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICE_STATUS_STYLES } from "@/constants/ClientDetailPage";
import { cn } from "@/lib/utils";

const formatEnum = (value = "") => value
  .toLowerCase()
  .split("_")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(" ");

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

export function ServiceCard({ categoryLabel, clientName, onDelete, onEdit, onView, service }) {
  return (
    <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-card ring-0">
      <CardHeader className="gap-0 px-5 pt-5 pb-0 md:px-6 md:pt-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
          </span>
          <span className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-label-sm font-semibold",
            SERVICE_STATUS_STYLES[service.status] ?? "bg-muted text-muted-foreground"
          )}>
            {formatEnum(service.status)}
          </span>
        </div>

        <p className="mt-4 text-label-sm font-semibold tracking-wide text-muted-foreground uppercase">Service type</p>
        <CardTitle className="mt-1 text-body-lg font-semibold text-foreground">{categoryLabel}</CardTitle>
        <p className="mt-1 truncate text-body-sm text-muted-foreground">{clientName}</p>
      </CardHeader>

      <CardContent className="mt-4 flex items-end justify-between gap-3 border-t border-border px-5 py-4 md:px-6">
        <div>
          <p className="text-label-sm text-muted-foreground">Created at</p>
          <p className="mt-0.5 text-body-sm font-medium text-foreground">{formatDate(service.createdAt)}</p>
        </div>
        <div className="flex shrink-0 gap-1.5" aria-label="Service actions">
          <Button type="button" variant="outline" size="icon-sm" onClick={onView} title="View service">
            <Eye aria-hidden="true" />
            <span className="sr-only">View service</span>
          </Button>
          <Button type="button" variant="outline" size="icon-sm" onClick={onEdit} title="Edit service">
            <Pencil aria-hidden="true" />
            <span className="sr-only">Edit service</span>
          </Button>
          <Button type="button" variant="outline" size="icon-sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onDelete} title="Delete service">
            <Trash2 aria-hidden="true" />
            <span className="sr-only">Delete service</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
