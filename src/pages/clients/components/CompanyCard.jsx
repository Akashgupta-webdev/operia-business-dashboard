import { Building2, Mail, MapPin, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusStyles = {
  ACTIVE: "bg-success-container text-success-container-foreground",
  UNDER_FORMATION: "bg-warning-container text-warning-container-foreground",
  SUSPENDED: "bg-warning-container text-warning-container-foreground",
  EXPIRED: "bg-destructive-container text-destructive-container-foreground",
  CLOSED: "bg-muted text-muted-foreground",
};

const formatEnum = (value = "") => value
  .toLowerCase()
  .split("_")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(" ");

function CompanyDetail({ icon: Icon, value }) {
  if (!value) return null;

  return (
    <div className="flex min-w-0 items-start gap-2 text-body-sm text-muted-foreground">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-outline" aria-hidden="true" />
      <span className="min-w-0 break-words">{value}</span>
    </div>
  );
}

export function CompanyCard({ company }) {
  const displayName = company.tradeName || company.legalName;

  return (
    <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-card ring-0">
      <CardHeader className="gap-0 px-5 pt-5 pb-0 md:px-6 md:pt-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm font-semibold",
            statusStyles[company.companyStatus] ?? "bg-muted text-muted-foreground"
          )}>
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            {formatEnum(company.companyStatus)}
          </span>
        </div>

        <CardTitle className="mt-4 text-body-lg font-semibold text-foreground">
          {company.companyName}
        </CardTitle>
        <p className="mt-1 text-label-sm font-medium tracking-wide text-muted-foreground uppercase">
          {company.companyId} · {formatEnum(company.companyType)}
        </p>
        {displayName && displayName !== company.companyName && (
          <p className="mt-2 line-clamp-2 text-body-sm text-muted-foreground">{displayName}</p>
        )}
      </CardHeader>

      <CardContent className="mt-4 space-y-2.5 border-t border-border px-5 py-5 md:px-6">
        <CompanyDetail icon={Mail} value={company.companyEmail} />
        <CompanyDetail icon={Phone} value={company.companyMobile} />
        <CompanyDetail icon={MapPin} value={company.address} />
        {!company.companyEmail && !company.companyMobile && !company.address && (
          <p className="text-body-sm text-muted-foreground">No contact information recorded.</p>
        )}
      </CardContent>
    </Card>
  );
}
