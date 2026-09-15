import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, UserRound } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import {
  DOCUMENT_TYPE_OPTIONS, MAX_DOCUMENTS, MAX_RELATED_ITEMS, MEMBER_TYPE_OPTIONS,
  NATIONALITY_OPTIONS, PAYMENT_METHOD_OPTIONS, PAYMENT_STATUS_OPTIONS,
  REMIND_BEFORE_OPTIONS, REMINDER_PRIORITY_OPTIONS, SERVICE_CATEGORY_OPTIONS,
  SERVICE_PACKAGE_OPTIONS, SERVICE_PAYMENT_STATUS_OPTIONS, SERVICE_STATUS_OPTIONS,
} from "@/features/clients/constants/client";
import { createEmptyDocument, createEmptyDriver, createEmptyMember, createEmptyService, createEmptyVehicle } from "@/features/clients/utils/clientCreation";
import { RepeatableCard, StepHeading, WizardField, WizardFileField, WizardSelect, WizardTextarea } from "./WizardFields";

const Grid = ({ children }) => <div className="grid gap-x-3 gap-y-2.5 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
const AddButton = ({ label, onClick, disabled }) => <Button type="button" size="sm" onClick={onClick} disabled={disabled} className="h-8 px-3 text-caption font-semibold shadow-sm"><Plus className="size-3.5" />{label}</Button>;

export function ClientDetailsStep() {
  return <><StepHeading title="Client details" description="Start with the client's identity and preferred contact information." action={<p className="text-caption text-text-secondary"><span className="text-destructive">*</span> Required fields</p>} />
    <Grid>
      <WizardField name="client.name" label="Full name" placeholder="e.g. Mohammed Ali" required className="xl:col-span-2" />
      <WizardSelect name="client.nationality" label="Nationality" options={NATIONALITY_OPTIONS} placeholder="Select Nationality" />
      <WizardField name="client.mobileNumber" label="Mobile number" placeholder="+971 50 000 0000" type="tel" />
      <WizardField name="client.whatsappNumber" label="WhatsApp number" placeholder="+971 50 000 0000" type="tel" />
      <WizardField name="client.emailAddress" label="Email address" placeholder="client@example.com" type="email" />
      <WizardField name="client.passport.passportNumber" label="Passport number" placeholder="e.g. A1234567" />
      <WizardField name="client.passport.passportIssueDate" label="Passport issue date" type="date" />
      <WizardField name="client.passport.passportExpiryDate" label="Passport expiry date" type="date" />
      <WizardField name="client.emirates.emiratesId" label="Emirates ID (EID)" placeholder="784-YYYY-XXXXXXX-X" />
      <WizardField name="client.emirates.emiratesIssueDate" label="Emirates ID issue date" type="date" />
      <WizardField name="client.emirates.emiratesExpiryDate" label="Emirates ID expiry date" type="date" />
      <WizardField name="client.visa.visaUIDNumber" label="Visa / UID number" placeholder="e.g. 20120231234567" />
      <WizardField name="client.visa.visaIssueDate" label="Visa issue date" type="date" />
      <WizardField name="client.visa.visaExpiryDate" label="Visa expiry date" type="date" />
      <WizardField name="client.healthInsurance.healthInsuranceCardNumber" label="Health insurance policy no." placeholder="e.g. POL-987654321" />
      <WizardField name="client.healthInsurance.healthInsuranceIssueDate" label="Health ins issue date" type="date" />
      <WizardField name="client.healthInsurance.healthInsuranceExpiryDate" label="Health ins expiry date" type="date" />
    </Grid></>;
}

export function CompanyStep() {
  const { setValue, control } = useFormContext();
  const clientType = useWatch({ control, name: "client.clientType" });
  return <><StepHeading title="Company information" description="Connect the client to a registered business, or continue as an individual." />
    <div className="mb-4 inline-flex rounded-lg bg-surface-secondary p-0.5">
      {["INDIVIDUAL", "COMPANY"].map((value) => <Button key={value} type="button" variant="ghost" size="sm" onClick={() => setValue("client.clientType", value, { shouldValidate: true, shouldDirty: true })} className={`h-8 rounded-md px-3 text-caption font-semibold ${clientType === value ? "bg-surface-primary text-primary shadow-sm hover:bg-surface-primary hover:text-primary" : "text-text-secondary"}`}>{value === "INDIVIDUAL" ? "Individual" : "Company"}</Button>)}
    </div>
    {clientType === "COMPANY" ? <Grid>
      <WizardField name="company.companyName" label="Company legal name" placeholder="Registered business name" required className="xl:col-span-2" />
      <WizardField name="company.tradeLicenceNumber" label="Trade licence number" placeholder="Licence number" />
      <WizardField name="company.licenceExpiryDate" label="Licence expiry date" type="date" />
      <WizardField name="company.vatTaxRegistrationNumber" label="VAT TRN" placeholder="Tax registration number" />
      <WizardField name="company.corporateTaxNumber" label="Corporate tax number" placeholder="CT registration" />
    </Grid> : <div className="flex min-h-56 flex-col items-center justify-center text-center"><span className="mb-3 flex size-12 items-center justify-center rounded-lg bg-accent text-primary"><UserRound /></span><h3 className="font-semibold text-text-primary">Individual client</h3><p className="mt-2 text-body-sm text-text-secondary">This record will be saved without a connected business profile.</p></div>}
  </>;
}

function RepeatedStep({ name, heading, description, addLabel, createItem, title, children, max = MAX_RELATED_ITEMS }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  return <><StepHeading title={heading} description={description} action={<AddButton label={addLabel} onClick={() => append(createItem())} disabled={fields.length >= max} />} />
    <div className="space-y-3">{fields.map((field, index) => <RepeatableCard key={field.id} number={index + 1} title={title} onRemove={fields.length > 1 ? () => remove(index) : undefined}>{children(index)}</RepeatableCard>)}</div></>;
}

export function PersonnelStep() { return <RepeatedStep name="members" heading="Personnel & Members" description="Add employees, partners or members for this client/company." addLabel="Add member" createItem={createEmptyMember} title="Member Details">
  {(i) => <Grid><WizardSelect name={`members.${i}.memberType`} label="Member Type / Role" options={MEMBER_TYPE_OPTIONS} /><WizardField name={`members.${i}.name`} label="Full Legal Name" placeholder="Enter full name" /><WizardField name={`members.${i}.passport.passportNumber`} label="Passport Number" placeholder="e.g. A1234567" /><WizardField name={`members.${i}.passport.passportIssueDate`} label="Passport Issue Date" type="date" /><WizardField name={`members.${i}.passport.passportExpiryDate`} label="Passport Expiry Date" type="date" /><WizardField name={`members.${i}.emirates.emiratesId`} label="Emirates ID" placeholder="784-YYYY-XXXXXXX-X" /><WizardField name={`members.${i}.emirates.emiratesExpiryDate`} label="EID Expiry" type="date" /><WizardField name={`members.${i}.visa.visaExpiryDate`} label="E-Visa Expiry" type="date" /></Grid>}
  </RepeatedStep>; }

export function VehiclesStep() { return <RepeatedStep name="vehicles" heading="Vehicles" description="Track company vehicles or fleet registration." addLabel="Add vehicle" createItem={createEmptyVehicle} title="Vehicle Details">
  {(i) => <Grid><WizardField name={`vehicles.${i}.registrationNumer`} label="Reg No" /><WizardField name={`vehicles.${i}.tcNumber`} label="T.C. No" /><WizardField name={`vehicles.${i}.policyNumber`} label="Policy No" /><WizardField name={`vehicles.${i}.registrationExpiry`} label="Reg Expiry" type="date" /><WizardField name={`vehicles.${i}.insuranceExpiry`} label="Ins Expiry" type="date" /></Grid>}
  </RepeatedStep>; }

export function DriversStep() { return <RepeatedStep name="drivers" heading="Drivers" description="Record the drivers associated with this client or fleet." addLabel="Add driver" createItem={createEmptyDriver} title="Driver Details">
  {(i) => <Grid><WizardField name={`drivers.${i}.name`} label="Driver name" placeholder="Full legal name" /><WizardField name={`drivers.${i}.licenceIssueDate`} label="Licence issue date" type="date" /><WizardField name={`drivers.${i}.licenceExpiryDate`} label="Licence expiry date" type="date" /></Grid>}
  </RepeatedStep>; }

export function ServicesStep() { return <RepeatedStep name="services" heading="Services" description="Add the work requirements and commercial details for this client." addLabel="Add service" createItem={createEmptyService} title="Service Details">
  {(i) => <Grid><WizardSelect name={`services.${i}.category`} label="Service category" options={SERVICE_CATEGORY_OPTIONS} /><WizardSelect name={`services.${i}.package`} label="Service package" options={SERVICE_PACKAGE_OPTIONS} /><WizardSelect name={`services.${i}.status`} label="Status" options={SERVICE_STATUS_OPTIONS} /><WizardField name={`services.${i}.packagePrice`} label="Package price (AED)" placeholder="0.00" inputMode="decimal" /><WizardSelect name={`services.${i}.paymentStatus`} label="Payment status" options={SERVICE_PAYMENT_STATUS_OPTIONS} /><WizardField name={`services.${i}.targetCompletionDate`} label="Target completion date" type="date" /><WizardTextarea name={`services.${i}.notes`} label="Service notes" placeholder="Requirements, scope, or internal notes..." className="md:col-span-2 xl:col-span-3" /></Grid>}
  </RepeatedStep>; }

export function DocumentsStep() { return <RepeatedStep name="documents" heading="Supporting documents" description="Register the files associated with this client." addLabel="Add document" createItem={createEmptyDocument} title="Document" max={MAX_DOCUMENTS}>
  {(i) => <Grid><WizardField name={`documents.${i}.documentTitle`} label="Document Title" placeholder="e.g. Passport Copy" className="md:col-span-2 xl:col-span-3" /><WizardSelect name={`documents.${i}.documentType`} label="Document Type" options={DOCUMENT_TYPE_OPTIONS} placeholder="Select Type" /><WizardField name={`documents.${i}.issueDate`} label="Issue Date" type="date" /><WizardField name={`documents.${i}.expiryDate`} label="Expiry Date" type="date" /><WizardFileField name={`documents.${i}.file`} label="Document file" /></Grid>}
  </RepeatedStep>; }

export function PaymentStep() { return <><StepHeading title="Fees & collection" description="Record the payment details for this client's setup." /><Grid><WizardField name="payments.0.totalBilled" label="Total Billed (AED)" placeholder="0.00" inputMode="decimal" /><WizardField name="payments.0.amountReceived" label="Amount Received (AED)" placeholder="0.00" inputMode="decimal" /><WizardSelect name="payments.0.paymentStatus" label="Payment Status" options={PAYMENT_STATUS_OPTIONS} /><WizardSelect name="payments.0.paymentMethod" label="Payment Method" options={PAYMENT_METHOD_OPTIONS} placeholder="Select method" /><WizardTextarea name="payments.0.notes" label="Payment Reference / Notes" placeholder="Transaction ID, Cheque number or notes..." className="md:col-span-2 xl:col-span-3" /></Grid></>; }

export function ReminderStep() { return <><StepHeading title="Dates & follow-up" description="Schedule a follow-up or expiry reminder." /><Grid><WizardField name="reminders.0.followupDate" label="Follow-up Date / Due Date" type="date" /><WizardSelect name="reminders.0.remindBefore" label="Remind me before" options={REMIND_BEFORE_OPTIONS} /><WizardSelect name="reminders.0.priority" label="Priority" options={REMINDER_PRIORITY_OPTIONS} /><WizardTextarea name="reminders.0.notes" label="Reminder Notes" placeholder="What needs to be done?" className="md:col-span-2 xl:col-span-3" /></Grid></>; }

const ReviewRow = ({ label, value }) => <div className="flex items-center justify-between gap-4 border-b border-border-default py-2 last:border-0"><span className="text-body-sm text-text-secondary">{label}</span><span className="text-right text-body-sm font-semibold text-text-primary">{value || "—"}</span></div>;
export function ReviewStep() {
  const { control } = useFormContext(); const values = useWatch({ control });
  const filled = (rows, keys) => rows?.filter((row) => keys.some((key) => row?.[key])).length || 0;
  return <><StepHeading title="Confirm & complete" description="Review the details below before creating this client record." />
    <div className="grid gap-3 md:grid-cols-2"><section className="rounded-lg border border-border-default p-4 md:col-span-2"><h3 className="mb-2 font-semibold text-text-primary">Client Identity</h3><ReviewRow label="Full name" value={values.client?.name} /><ReviewRow label="Contact" value={values.client?.mobileNumber || values.client?.emailAddress} /><ReviewRow label="Client type" value={values.client?.clientType === "COMPANY" ? "Company Representative" : "Individual Client"} /></section>
    <section className="rounded-lg border border-border-default p-4 md:col-span-2"><h3 className="mb-2 font-semibold text-text-primary">Company details</h3><ReviewRow label="Legal name" value={values.company?.companyName} /><ReviewRow label="Trade licence" value={values.company?.tradeLicenceNumber} /></section>
    <section className="rounded-lg border border-border-default p-4"><h3 className="mb-2 font-semibold text-text-primary">Fleet & Personnel</h3><ReviewRow label="Members" value={filled(values.members, ["name"])} /><ReviewRow label="Vehicles" value={filled(values.vehicles, ["registrationNumer", "tcNumber"])} /><ReviewRow label="Drivers" value={filled(values.drivers, ["name"])} /></section>
    <section className="rounded-lg border border-border-default p-4"><h3 className="mb-2 font-semibold text-text-primary">Operations</h3><ReviewRow label="Services" value={filled(values.services, ["category", "package"])} /><ReviewRow label="Documents" value={values.documents?.filter((item) => item.file?.[0]).length || 0} /><ReviewRow label="Payment Status" value={values.payments?.[0]?.paymentStatus} /></section></div></>;
}
