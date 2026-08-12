import { ArrowLeft, UserX } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLIENT_DETAIL_TABS } from "@/constants/ClientDetailPage";
import useClient from "@/hooks/useClient";
import { AddCompanyDialog } from "./components/AddCompanyDialog";
import { ClientCompaniesTab } from "./components/ClientCompaniesTab";
import { ClientDetailSkeleton } from "./components/ClientDetailSkeleton";
import {
  ClientPersonalInfo,
  ClientRecentActivity,
  ClientUnavailablePanel,
} from "./components/ClientOverview";
import { ClientProfileHeader } from "./components/ClientProfileHeader";

export default function ClientDetailPage() {
  const { id } = useParams();
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const { data: client, error, isPending, refetch } = useClient(id);

  if (isPending) {
    return (
      <main className="min-h-full bg-background px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-(--container-max-width)">
          <ClientDetailSkeleton />
        </div>
      </main>
    );
  }

  if (error || !client) {
    const isNotFound = error?.response?.status === 404;

    return (
      <main className="min-h-full bg-background px-4 py-6 md:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl rounded-xl border border-border bg-card py-0 shadow-card ring-0">
          <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-destructive-container text-destructive-container-foreground">
              <UserX className="size-5" aria-hidden="true" />
            </span>
            <h1 className="mt-4 font-heading text-headline-md font-semibold text-foreground">
              {isNotFound ? "Client not found" : "Unable to load client"}
            </h1>
            <p className="mt-2 max-w-md text-body-sm text-muted-foreground">
              {isNotFound
                ? "This client may have been removed or the profile link may be invalid."
                : "Please try again. If the problem continues, contact support."}
            </p>
            <div className="mt-5 flex gap-2">
              <Button render={<Link to="/clients" />} variant="outline">
                <ArrowLeft data-icon="inline-start" />
                Back to clients
              </Button>
              {!isNotFound && (
                <Button type="button" onClick={() => refetch()}>Try again</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-(--container-max-width)">
        <ClientProfileHeader client={client} />

        <Tabs defaultValue="personal" className="mt-4">
          <div className="overflow-x-auto">
            <TabsList aria-label="Client profile sections">
              {CLIENT_DETAIL_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="personal" className="pt-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
              <ClientPersonalInfo client={client} />
              <ClientRecentActivity />
            </div>
          </TabsContent>

          <TabsContent value="companies" className="pt-5">
            <ClientCompaniesTab
              clientDatabaseId={client._id}
              onAddCompany={() => setIsAddCompanyOpen(true)}
            />
          </TabsContent>

          {CLIENT_DETAIL_TABS.slice(2).map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="pt-5">
              <ClientUnavailablePanel label={tab.label} />
            </TabsContent>
          ))}
        </Tabs>

        <AddCompanyDialog
          clientDatabaseId={client._id}
          open={isAddCompanyOpen}
          onOpenChange={setIsAddCompanyOpen}
        />
      </div>
    </main>
  );
}
