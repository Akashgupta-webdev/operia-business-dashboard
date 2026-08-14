import { BriefcaseBusiness, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SERVICE_FILTER_STATUS_OPTIONS } from "@/constants/ClientDetailPage";
import { SERVICE_CATEGORIES } from "@/constants/ClientsPage";
import useClientServices from "@/hooks/useClientServices";
import { ClientFilterSelect } from "./ClientFilterSelect";
import { DeleteServiceDialog } from "./DeleteServiceDialog";
import { EditServiceDialog } from "./EditServiceDialog";
import { ServiceCard } from "./ServiceCard";
import { ServiceDetailsDialog } from "./ServiceDetailsDialog";

const ALL_CATEGORIES = "ALL";
const categoryOptions = [
  { value: ALL_CATEGORIES, label: "All categories" },
  ...SERVICE_CATEGORIES.map(({ label, value }) => ({ label, value })),
];
const categoryLabels = Object.fromEntries(SERVICE_CATEGORIES.map(({ label, value }) => [value, label]));

const searchableServiceText = (service) => [
  categoryLabels[service.category] ?? service.category,
  service.status,
  JSON.stringify(service.detail ?? {}),
].join(" ").toLowerCase();

function ServicesLoading() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading services">
      {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-64 rounded-xl" />)}
    </div>
  );
}

export function ClientServicesTab({ clientDatabaseId, clientName }) {
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [activeDialog, setActiveDialog] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [status, setStatus] = useState("ALL");
  const { data: services = [], error, isPending, refetch } = useClientServices(clientDatabaseId);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter((service) => (
      (category === ALL_CATEGORIES || service.category === category)
      && (status === "ALL" || service.status === status)
      && (!query || searchableServiceText(service).includes(query))
    ));
  }, [category, search, services, status]);

  const openServiceDialog = (dialog, service) => {
    setSelectedService(service);
    setActiveDialog(dialog);
  };

  const closeServiceDialog = () => {
    setActiveDialog(null);
    setSelectedService(null);
  };

  const selectedCategoryLabel = selectedService
    ? categoryLabels[selectedService.category] ?? selectedService.category
    : "Service details";

  return (
    <section aria-label="Active services">
      <div className="mb-5 flex flex-col justify-end gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Search services"
            className="h-9 bg-card pl-9 shadow-card"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search services..."
            type="search"
            value={search}
          />
        </div>
        <ClientFilterSelect label="Filter by service category" value={category} options={categoryOptions} onChange={setCategory} className="sm:min-w-44" />
        <ClientFilterSelect label="Filter by service status" value={status} options={SERVICE_FILTER_STATUS_OPTIONS} onChange={setStatus} className="sm:min-w-36" />
      </div>

      {error || !clientDatabaseId ? (
        <Card className="rounded-xl border border-destructive/30 bg-card py-0 shadow-card ring-0">
          <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-destructive-container text-destructive-container-foreground">
              <BriefcaseBusiness className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-heading text-body-lg font-semibold text-foreground">Unable to load services</h3>
            <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">Please try again. If the problem continues, contact support.</p>
            {clientDatabaseId && <Button type="button" variant="outline" onClick={() => refetch()} className="mt-4">Try again</Button>}
          </CardContent>
        </Card>
      ) : isPending ? (
        <ServicesLoading />
      ) : filteredServices.length === 0 ? (
        <Card className="rounded-xl border border-border bg-card py-0 shadow-card ring-0">
          <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <BriefcaseBusiness className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-heading text-body-lg font-semibold text-foreground">
              {services.length ? "No matching services" : "No services to display"}
            </h3>
            <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">
              {services.length ? "Try changing the search or filters." : "Services linked to this client will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              categoryLabel={categoryLabels[service.category] ?? service.category}
              clientName={clientName}
              onDelete={() => openServiceDialog("delete", service)}
              onEdit={() => openServiceDialog("edit", service)}
              onView={() => openServiceDialog("view", service)}
              service={service}
            />
          ))}
        </div>
      )}

      <ServiceDetailsDialog
        categoryLabel={selectedCategoryLabel}
        onOpenChange={(open) => { if (!open) closeServiceDialog(); }}
        open={activeDialog === "view"}
        service={selectedService}
      />
      <EditServiceDialog
        clientDatabaseId={clientDatabaseId}
        onOpenChange={(open) => { if (!open) closeServiceDialog(); }}
        open={activeDialog === "edit"}
        service={selectedService}
      />
      <DeleteServiceDialog
        categoryLabel={selectedCategoryLabel}
        clientDatabaseId={clientDatabaseId}
        onOpenChange={(open) => { if (!open) closeServiceDialog(); }}
        open={activeDialog === "delete"}
        service={selectedService}
      />
    </section>
  );
}
