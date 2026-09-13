import { useState } from "react";
import { Building2, CalendarDays, Car, Contact, Copy, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddDriverDialog, AddMemberDialog, AddVehicleDialog } from "./AddRelatedRecordDialogs";
import DeleteRelatedRecordDialog from "./DeleteRelatedRecordDialog";
import EditCompanyDialog from "./EditCompanyDialog";
import EditDriverDialog from "./EditDriverDialog";
import EditMemberDialog from "./EditMemberDialog";
import EditVehicleDialog from "./EditVehicleDialog";

function formatDate(value) {
  if (!value) return "—";
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-");
    return `${day}/${month}/${year}`;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB").format(date);
}

function getInitials(name = "Record") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function formatOverviewDate(value) {
  if (!value) return "—";
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB").format(date).replaceAll("/", "-");
}

function formatClientSince(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function DataField({ label, value }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-1 px-2 py-2.5">
      <dt className="truncate text-[9px] leading-4 font-medium text-text-secondary">{label}</dt>
      <dd className="truncate text-[9px] leading-4 font-semibold text-text-primary" data-numeric>{value || "—"}</dd>
    </div>
  );
}

function DataPanel({ rows }) {
  return (
    <dl className="divide-y divide-border-default overflow-hidden rounded-lg border border-border-default bg-surface-secondary/40">
      {rows.map((row) => (
        <div key={row[0].label} className="grid divide-y divide-border-default sm:grid-cols-1 sm:divide-x sm:divide-y-0">
          {row.map((field) => <DataField key={field.label} {...field} />)}
        </div>
      ))}
    </dl>
  );
}

function SectionHeading({ icon: Icon, title, count, actionLabel, onAction, tone }) {
  const tones = {
    primary: {
      icon: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
      action: "border-primary-200 text-primary-600 dark:border-primary-700 dark:text-primary-300",
    },
    success: {
      icon: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500",
      action: "border-success-100 text-success-700 dark:border-success-700 dark:text-success-500",
    },
    warning: {
      icon: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500",
      action: "border-warning-100 text-warning-700 dark:border-warning-700 dark:text-warning-500",
    },
  };
  const theme = tones[tone];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${theme.icon}`}><Icon aria-hidden="true" className="size-4" /></span>
      <h3 className="text-body-md font-semibold text-text-primary">{title}</h3>
      <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-[10px] font-semibold text-text-secondary" data-numeric>{count}</span>
      <Button type="button" variant="outline" size="sm" disabled={!onAction} onClick={onAction} title={onAction ? actionLabel : "Owning client ID is unavailable"} className={`ml-auto gap-1.5 bg-surface-primary text-caption ${theme.action}`}>
        <Plus aria-hidden="true" className="size-3.5" />{actionLabel}
      </Button>
    </div>
  );
}

function EmptyCollection({ label }) {
  return <div className="rounded-lg border border-dashed border-border-default bg-surface-secondary/40 px-4 py-8 text-center text-caption text-text-muted">No {label.toLowerCase()} registered.</div>;
}

function CollectionSection({ children, count, emptyLabel, icon, title, actionLabel, onAction, tone }) {
  return (
    <Card className="gap-0 border border-border-default bg-surface-primary p-4 py-4 shadow-card ring-0 lg:p-5 lg:py-5">
      <SectionHeading icon={icon} title={title} count={count} actionLabel={actionLabel} onAction={onAction} tone={tone} />
      {count ? <div className="mt-4 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">{children}</div> : <div className="mt-4"><EmptyCollection label={emptyLabel} /></div>}
    </Card>
  );
}

function MemberCard({ member, onDelete, onEdit }) {
  const name = member.name || "Unnamed member";
  const memberId = member.id ?? member._id;
  return (
    <Card size="sm" className="gap-4 border border-border-default bg-surface-primary p-3 py-3 ring-0">
      <div className="flex min-w-0 items-center gap-3 px-1">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-body-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{getInitials(name)}</div>
        <div className="min-w-0">
          <h4 className="truncate text-caption font-semibold text-text-primary">{name}</h4>
          <span className="mt-1 inline-block rounded-md bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{member.memberType || "Member"}</span>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="icon-sm" disabled={!memberId} onClick={() => onEdit(member)} aria-label={`Edit ${name}`} title={memberId ? `Edit ${name}` : "Member ID is unavailable"} className="border-border-default text-text-secondary">
            <Pencil aria-hidden="true" className="size-3.5" />
          </Button>
          <Button type="button" variant="outline" size="icon-sm" disabled={!memberId} onClick={() => onDelete({ id: memberId, actionOn: "member", label: name })} aria-label={`Delete ${name}`} title={memberId ? `Delete ${name}` : "Member ID is unavailable"} className="border-danger-100 text-danger-600 dark:border-danger-700">
            <Trash2 aria-hidden="true" className="size-3.5" />
          </Button>
        </div>
      </div>
      <DataPanel rows={[
        [{ label: "Passport No", value: member.passport?.passportNumber }, { label: "Passport Issued", value: formatDate(member.passport?.passportIssueDate) }],
        [{ label: "Passport Expiry", value: formatDate(member.passport?.passportExpiryDate) }, { label: "EID Expiry", value: formatDate(member.emirates?.emiratesExpiryDate) }],
        [{ label: "E-Visa Expiry", value: formatDate(member.visa?.visaExpiryDate) }, { label: "Health Insurance Expiry", value: formatDate(member.healthInsurance?.healthInsuranceExpiryDate) }],
      ]} />
    </Card>
  );
}

function VehicleCard({ vehicle, onDelete, onEdit }) {
  const registrationNumber = vehicle.registrationNumer || "Unregistered";
  const vehicleId = vehicle.id ?? vehicle._id;
  return (
    <Card size="sm" className="gap-4 border border-border-default bg-surface-primary p-3 py-3 ring-0">
      <div className="flex min-w-0 items-center gap-3 px-1">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500"><Car aria-hidden="true" className="size-4" /></div>
        <div className="min-w-0">
          <h4 className="truncate text-caption font-semibold text-text-primary">{registrationNumber}</h4>
          <p className="mt-1 truncate text-[10px] text-text-secondary">Policy: {vehicle.policyNumber || "N/A"}</p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="icon-sm" disabled={!vehicleId} onClick={() => onEdit(vehicle)} aria-label={`Edit ${registrationNumber}`} title={vehicleId ? `Edit ${registrationNumber}` : "Vehicle ID is unavailable"} className="border-border-default text-text-secondary">
            <Pencil aria-hidden="true" className="size-3.5" />
          </Button>
          <Button type="button" variant="outline" size="icon-sm" disabled={!vehicleId} onClick={() => onDelete({ id: vehicleId, actionOn: "vehicle", label: registrationNumber })} aria-label={`Delete ${registrationNumber}`} title={vehicleId ? `Delete ${registrationNumber}` : "Vehicle ID is unavailable"} className="border-danger-100 text-danger-600 dark:border-danger-700">
            <Trash2 aria-hidden="true" className="size-3.5" />
          </Button>
        </div>
      </div>
      <DataPanel rows={[
        [{ label: "TC Number", value: vehicle.tcNumber }, { label: "Reg Expiry", value: formatDate(vehicle.registrationExpiry) }],
        [{ label: "Policy No", value: vehicle.policyNumber }, { label: "INS Expiry", value: formatDate(vehicle.insuranceExpiry) }],
      ]} />
    </Card>
  );
}

function DriverCard({ driver, onDelete, onEdit }) {
  const name = driver.name || "Unnamed driver";
  const driverId = driver.id ?? driver._id;
  return (
    <Card size="sm" className="gap-4 border border-border-default bg-surface-primary p-3 py-3 ring-0">
      <div className="flex min-w-0 items-center gap-3 px-1">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500"><Contact aria-hidden="true" className="size-4" /></div>
        <h4 className="truncate text-caption font-semibold text-text-primary">{name}</h4>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="icon-sm" disabled={!driverId} onClick={() => onEdit(driver)} aria-label={`Edit ${name}`} title={driverId ? `Edit ${name}` : "Driver ID is unavailable"} className="border-border-default text-text-secondary">
            <Pencil aria-hidden="true" className="size-3.5" />
          </Button>
          <Button type="button" variant="outline" size="icon-sm" disabled={!driverId} onClick={() => onDelete({ id: driverId, actionOn: "driver", label: name })} aria-label={`Delete ${name}`} title={driverId ? `Delete ${name}` : "Driver ID is unavailable"} className="border-danger-100 text-danger-600 dark:border-danger-700">
            <Trash2 aria-hidden="true" className="size-3.5" />
          </Button>
        </div>
      </div>
      <DataPanel rows={[[
        { label: "License Issue", value: formatDate(driver.licenceIssueDate) },
        { label: "License Expiry", value: formatDate(driver.licenceExpiryDate) },
      ]]} />
    </Card>
  );
}

function CompanyOverviewField({ label, value, date = false }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] leading-4 font-semibold uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className="mt-2 flex min-w-0 items-center gap-2 text-body-sm font-semibold text-text-primary">
        <span className="truncate">{value || "Not registered"}</span>
        {date && value && value !== "—" && <CalendarDays aria-hidden="true" className="ml-auto size-3.5 shrink-0 text-text-muted" />}
      </dd>
    </div>
  );
}

function CompanyOverviewCard({ company, clientSince, canEdit, onEdit }) {
  const companyId = company.id ?? company.id;

  const copyCompanyId = async () => {
    if (!companyId) return;
    try {
      await navigator.clipboard.writeText(companyId);
      toast.success("Company ID copied.");
    } catch {
      toast.error("Unable to copy the company ID.");
    }
  };

  return (
    <Card className="gap-0 border border-border-default bg-surface-primary py-0 shadow-card ring-0">
      <CardHeader className="flex flex-col gap-4 border-b border-border-default px-5 py-5 sm:flex-row sm:items-center lg:px-6 lg:py-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-body-lg font-bold text-primary-700">{getInitials(company.companyName)}</div>
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <CardTitle className="min-w-0 truncate text-subsection font-bold text-text-primary">{company.companyName}</CardTitle>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary-50 px-2 py-1 text-[11px] leading-4 font-semibold text-primary-700"><Building2 aria-hidden="true" className="size-3.5" />Company</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-text-secondary">
              <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-3.5 text-text-muted" />Client since {formatClientSince(clientSince)}</span>
              <span aria-hidden="true" className="text-text-muted">•</span>
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <span className="truncate">Client ID: {companyId || "Not assigned"}</span>
                {companyId && <Button type="button" variant="ghost" size="icon-xs" onClick={copyCompanyId} aria-label={`Copy company ID for ${company.companyName}`} className="shrink-0 text-text-muted hover:text-primary"><Copy aria-hidden="true" className="size-3.5" /></Button>}
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <Button type="button" variant="outline" size="sm" disabled={!canEdit} title={canEdit ? undefined : "Owning client ID is unavailable"} onClick={() => onEdit(company)} className="flex-1 gap-1.5 border-primary-200 text-primary-600 sm:flex-none"><Pencil aria-hidden="true" className="size-3" />Edit</Button>
          <Button type="button" variant="outline" size="sm" disabled title="Delete company API is not configured" className="flex-1 gap-1.5 border-danger-200 text-danger-600 sm:flex-none"><Trash2 aria-hidden="true" className="size-3" />Delete</Button>
        </div>
      </CardHeader>
      <CardContent className="p-5 lg:p-6">
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <dl className="grid min-w-0 gap-4 rounded-lg bg-surface-secondary/60 p-4">
            <CompanyOverviewField label="Trade licence no." value={company.tradeLicence === undefined ? company.tradeLicenceNumber : company.tradeLicence?.tradeLicenceNo} />
            <CompanyOverviewField label="Licence expiry" value={formatOverviewDate(company.tradeLicence === undefined ? company.licenceExpiryDate : company.tradeLicence?.tradeLicenceExpiry)} date />
          </dl>
          <dl className="grid min-w-0 gap-4 rounded-lg bg-surface-secondary/60 p-4">
            <CompanyOverviewField label="Establishment card" value={company.establishment?.establishmentCard} />
            <CompanyOverviewField label="Establishment card expiry date" value={formatOverviewDate(company.establishment?.establishmentCardExpiry)} date />
          </dl>
          <dl className="grid min-w-0 gap-4 rounded-lg bg-surface-secondary/60 p-4">
            <CompanyOverviewField label="VAT TRN" value={company.vatTaxRegistrationNumber} />
            <CompanyOverviewField label="Corporate no." value={company.corporateTaxNumber} />
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CompaniesTab({ data }) {
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingDriver, setEditingDriver] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [addingRecordType, setAddingRecordType] = useState(null);
  const { client, companies = [], members = [], vehicles = [], drivers = [] } = data;
  const clientId = client?.id ?? client?._id;

  if (!companies.length) return <EmptyCollection label="Companies" />;

  return (
    <div className="space-y-4">
      {companies.map((company) => <CompanyOverviewCard key={company.id ?? company.id} company={company} clientSince={company.createdAt ?? client?.createdAt} canEdit={Boolean(client?.id)} onEdit={setEditingCompany} />)}
      <EditCompanyDialog clientId={client?.id} company={editingCompany} open={Boolean(editingCompany)} onOpenChange={(open) => { if (!open) setEditingCompany(null); }} />

      <CollectionSection icon={UserRound} title="Members" count={members.length} actionLabel="Add Member" emptyLabel="Members" tone="primary" onAction={clientId ? () => setAddingRecordType("member") : undefined}>
        {members.map((member) => <MemberCard key={member.id ?? member._id} member={member} onEdit={setEditingMember} onDelete={setDeletingRecord} />)}
      </CollectionSection>
      <EditMemberDialog clientId={client?.id} member={editingMember} open={Boolean(editingMember)} onOpenChange={(open) => { if (!open) setEditingMember(null); }} />
      <CollectionSection icon={Car} title="Vehicles" count={vehicles.length} actionLabel="Add Vehicle" emptyLabel="Vehicles" tone="success" onAction={clientId ? () => setAddingRecordType("vehicle") : undefined}>
        {vehicles.map((vehicle) => <VehicleCard key={vehicle.id ?? vehicle._id} vehicle={vehicle} onEdit={setEditingVehicle} onDelete={setDeletingRecord} />)}
      </CollectionSection>
      <EditVehicleDialog clientId={client?.id} vehicle={editingVehicle} open={Boolean(editingVehicle)} onOpenChange={(open) => { if (!open) setEditingVehicle(null); }} />
      <CollectionSection icon={Contact} title="Drivers" count={drivers.length} actionLabel="Add Driver" emptyLabel="Drivers" tone="warning" onAction={clientId ? () => setAddingRecordType("driver") : undefined}>
        {drivers.map((driver) => <DriverCard key={driver.id ?? driver._id} driver={driver} onEdit={setEditingDriver} onDelete={setDeletingRecord} />)}
      </CollectionSection>
      <EditDriverDialog clientId={client?.id} driver={editingDriver} open={Boolean(editingDriver)} onOpenChange={(open) => { if (!open) setEditingDriver(null); }} />
      <DeleteRelatedRecordDialog clientId={client?.id} record={deletingRecord} open={Boolean(deletingRecord)} onOpenChange={(open) => { if (!open) setDeletingRecord(null); }} />
      <AddMemberDialog clientId={clientId} open={addingRecordType === "member"} onOpenChange={(open) => { if (!open) setAddingRecordType(null); }} />
      <AddVehicleDialog clientId={clientId} open={addingRecordType === "vehicle"} onOpenChange={(open) => { if (!open) setAddingRecordType(null); }} />
      <AddDriverDialog clientId={clientId} open={addingRecordType === "driver"} onOpenChange={(open) => { if (!open) setAddingRecordType(null); }} />
    </div>
  );
}
