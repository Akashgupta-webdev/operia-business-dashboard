import { Clock3, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-label-sm font-semibold tracking-[0.05em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 break-words text-body-md font-medium text-foreground">
        {value || <span className="font-normal text-muted-foreground">Not available</span>}
      </dd>
    </div>
  );
}

export function ClientPersonalInfo({ client }) {
  return (
    <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-card ring-0">
      <CardHeader className="px-5 pt-5 pb-0 md:px-6 md:pt-6">
        <CardTitle className="flex items-center gap-2 text-body-lg font-semibold">
          <UserRound className="size-5 text-primary" aria-hidden="true" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-10 gap-y-5 px-5 py-5 sm:grid-cols-2 md:px-6 md:py-6">
        <InfoItem label="Full name" value={client.name} />
        <InfoItem label="Nationality" />
        <InfoItem label="Date of birth" />
        <InfoItem label="Gender" />
        <InfoItem label="Emirates ID" value={client.emiratesIdNumber} />
        <InfoItem label="Passport number" />
        <InfoItem label="Unified ID" />
        <InfoItem label="Mobile" value={client.mobileNumber} />
        <InfoItem label="Email" value={client.emailAddress} />
        <InfoItem label="WhatsApp" value={client.whatsappNumber} />
        <div className="sm:col-span-2">
          <InfoItem label="Home address" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ClientRecentActivity() {
  return (
    <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-card ring-0">
      <CardHeader className="px-5 pt-5 pb-0 md:px-6 md:pt-6">
        <CardTitle className="flex items-center gap-2 text-body-lg font-semibold">
          <Clock3 className="size-5 text-primary" aria-hidden="true" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-8 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Clock3 className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-4 font-medium text-foreground">No activity available</p>
        <p className="mt-1 max-w-56 text-body-sm text-muted-foreground">
          Recent client activity is not included in the current API response.
        </p>
      </CardContent>
    </Card>
  );
}

export function ClientUnavailablePanel({ label }) {
  return (
    <Card className="rounded-xl border border-border bg-card py-0 shadow-card ring-0">
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Clock3 className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-heading text-body-lg font-semibold text-foreground">No {label.toLowerCase()} available</h2>
        <p className="mt-1 text-body-sm text-muted-foreground">
          This information is not included in the current client API response.
        </p>
      </CardContent>
    </Card>
  );
}
