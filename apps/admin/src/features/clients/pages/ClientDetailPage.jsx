import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@operio/ui/components/breadcrumb";
import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Skeleton } from "@operio/ui/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@operio/ui/components/tabs";
import useClient from "@/features/clients/hooks/useClient";
import { getClientRenewalItems } from "@/features/clients/utils/clientRenewals";
import ClientProfileCard from "../components/client-detail/ClientProfileCard";
import CompaniesTab from "../components/client-detail/CompaniesTab";
import DocumentsTab from "../components/client-detail/DocumentsTab";
import EditClientDialog from "../components/client-detail/EditClientDialog";
import OverviewTab from "../components/client-detail/OverviewTab";
import PortalAccessTab from "../components/client-detail/PortalAccessTab";
import RenewalsTab from "../components/client-detail/RenewalsTab";
import ServicesTab from "../components/client-detail/ServicesTab";
import TaskActionsTab from "../components/client-detail/TaskActionsTab";

const tabs = [
  ["overview", "Overview"],
  ["companies", "Companies", "companies"],
  ["services", "Services", "services"],
  ["documents", "Documents", "documents"],
  ["renewals", "Renewals", "renewals"],
  ["account", "Account"],
  ["invoice", "Invoice"],
  ["filing-vat", "Filing VAT"],
  ["portal-access", "Portal Access"],
  ["activity", "Activity"],
];

function DetailPageSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <Skeleton className="h-152 rounded-xl" />
      <div className="space-y-4"><Skeleton className="h-12 rounded-xl" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 rounded-xl" />)}</div><Skeleton className="h-120 rounded-xl" /></div>
    </div>
  );
}

export default function ClientDetailPage() {
  const { id } = useParams();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const query = useClient(id);
  const data = query.data;
  const initialTab = searchParams.get("tab") === "companies" ? "companies" : "overview";

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] bg-app-background px-4 py-5 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-5">
        <BreadcrumbList className="text-caption">
          <BreadcrumbItem><BreadcrumbLink render={<Link to="/clients" />}>Clients</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage className="max-w-72 truncate font-semibold">{data?.client?.name || "Client details"}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {query.isPending && <DetailPageSkeleton />}
      {query.isError && (
        <Card role="alert" className="items-center gap-3 border border-danger-200 bg-danger-50 px-6 py-12 text-center ring-0">
          <AlertCircle aria-hidden="true" className="size-8 text-danger-600" />
          <h1 className="text-subsection font-semibold text-danger-700">Unable to load client details</h1>
          <p className="text-body-sm text-text-secondary">{query.error?.response?.data?.error?.message ?? "The client may no longer exist, or the request could not be completed."}</p>
          <Button type="button" variant="outline" onClick={() => query.refetch()}>Try again</Button>
        </Card>
      )}

      {data?.client && (
        <div className="grid items-start gap-5 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
          <ClientProfileCard client={data.client} onEditClient={() => setIsEditDialogOpen(true)} />
          <Tabs defaultValue={initialTab} className="min-w-0 gap-4">
            <div className="overflow-x-auto rounded-xl border border-border-default bg-surface-primary p-1 shadow-card scrollbar-none [&::-webkit-scrollbar]:hidden">
              <TabsList className="w-max min-w-full border-b-0">
                {tabs.map(([value, label, countKey]) => {
                  const count = countKey === "renewals" ? getClientRenewalItems(data).length : countKey ? (data[countKey]?.length ?? 0) : 0;
                  return (
                    <TabsTrigger key={value} value={value} className="group h-8 gap-1.5 px-3 text-[11px] transition-opacity hover:text-inherit hover:opacity-80 data-active:rounded-lg data-active:bg-primary-700 data-active:text-neutral-0 data-active:hover:text-neutral-0 data-active:after:hidden">
                      {label}
                      {countKey && <span className="rounded-md bg-primary-50 px-1.5 py-0.5 text-[9px] font-semibold text-primary-700 group-data-active:bg-neutral-0/20 group-data-active:text-neutral-0">{count}</span>}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            <TabsContent value="overview"><OverviewTab data={data} onEditClient={() => setIsEditDialogOpen(true)} /></TabsContent>
            <TabsContent value="companies"><CompaniesTab data={data} /></TabsContent>
            <TabsContent value="tasks"><TaskActionsTab reminders={data.reminders} /></TabsContent>
            <TabsContent value="services"><ServicesTab clientId={data.client.id ?? data.client._id} services={data.services} /></TabsContent>
            <TabsContent value="documents"><DocumentsTab clientId={data.client.id ?? data.client._id} documents={data.documents} /></TabsContent>
            <TabsContent value="renewals"><RenewalsTab data={data} /></TabsContent>
            <TabsContent value="account">
              <Card className="gap-2 border border-border-default bg-surface-primary px-6 py-12 text-center shadow-card ring-0">
                <h2 className="text-subsection font-semibold text-text-primary">Account</h2>
                <p className="text-body-sm text-text-muted">Client account details are coming soon.</p>
              </Card>
            </TabsContent>
            <TabsContent value="invoice">
              <Card className="gap-2 border border-border-default bg-surface-primary px-6 py-12 text-center shadow-card ring-0">
                <h2 className="text-subsection font-semibold text-text-primary">Invoice</h2>
                <p className="text-body-sm text-text-muted">Client invoices are coming soon.</p>
              </Card>
            </TabsContent>
            <TabsContent value="filing-vat">
              <Card className="gap-2 border border-border-default bg-surface-primary px-6 py-12 text-center shadow-card ring-0">
                <h2 className="text-subsection font-semibold text-text-primary">Filing VAT</h2>
                <p className="text-body-sm text-text-muted">Client VAT filing details are coming soon.</p>
              </Card>
            </TabsContent>
            <TabsContent value="portal-access">
              <PortalAccessTab key={id} client={data.client} clientId={id} />
            </TabsContent>
            <TabsContent value="activity">
              <Card className="gap-2 border border-border-default bg-surface-primary px-6 py-12 text-center shadow-card ring-0">
                <h2 className="text-subsection font-semibold text-text-primary">Activity</h2>
                <p className="text-body-sm text-text-muted">Client activity is coming soon.</p>
              </Card>
            </TabsContent>
          </Tabs>
          <EditClientDialog client={data.client} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
        </div>
      )}
    </div>
  );
}
