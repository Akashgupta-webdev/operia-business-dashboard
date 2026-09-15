import { Controller, useFormContext } from "react-hook-form";
import { CreditCard, FileBadge, FileText, HeartPulse } from "lucide-react";

import { DateInput } from "@operio/ui/components/date-input";
import { Input } from "@operio/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@operio/ui/components/select";
import {
  CLIENT_EDIT_TYPE_OPTIONS,
  NATIONALITY_OPTIONS,
  PREFERRED_COMMUNICATION_OPTIONS,
} from "@/features/clients/constants/client";
import { cn } from "@operio/ui/lib/utils";

const getNestedError = (errors, name) => name
  .split(".")
  .reduce((current, key) => current?.[key], errors);

function EditField({ name, label, type = "text", placeholder, className, ...props }) {
  const { register, formState: { errors } } = useFormContext();
  const error = getNestedError(errors, name);
  const errorId = `${name.replaceAll(".", "-")}-error`;
  const FieldComponent = type === "date" ? DateInput : Input;

  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={name} className="mb-1.5 block text-[11px] leading-4 font-medium text-text-secondary">{label}</label>
      <FieldComponent
        {...register(name)}
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-9 border-border-default bg-surface-primary px-3 text-caption shadow-none placeholder:text-caption hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
        {...props}
      />
      {error?.message && <p id={errorId} role="alert" className="mt-1 text-[10px] leading-4 text-destructive">{error.message}</p>}
    </div>
  );
}

function EditSelect({ name, label, options, placeholder = "Select an option" }) {
  const { control, formState: { errors } } = useFormContext();
  const error = getNestedError(errors, name);
  const errorId = `${name.replaceAll(".", "-")}-error`;

  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-[11px] leading-4 font-medium text-text-secondary">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value || null} onValueChange={field.onChange}>
            <SelectTrigger
              aria-label={label}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="h-9 w-full border-border-default bg-surface-primary px-3 text-caption text-text-primary hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent align="start">
              {options.map((option) => {
                const value = typeof option === "string" ? option : option.value;
                const optionLabel = typeof option === "string" ? option : option.label;
                return <SelectItem key={value} value={value}>{optionLabel}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        )}
      />
      {error?.message && <p id={errorId} role="alert" className="mt-1 text-[10px] leading-4 text-destructive">{error.message}</p>}
    </div>
  );
}

function IdentitySection({ icon: Icon, iconClassName, title, numberField, numberLabel, issueField, expiryField }) {
  return (
    <fieldset className="rounded-lg border border-border-default bg-app-background/40 p-4">
      <legend className="sr-only">{title}</legend>
      <div className="mb-4 flex items-center gap-2">
        <Icon aria-hidden="true" className={cn("size-4", iconClassName)} />
        <h3 className="text-body-sm font-semibold text-text-primary">{title}</h3>
      </div>
      <EditField name={numberField} label={numberLabel} placeholder="Not registered" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <EditField name={issueField} label="Issue Date" type="date" />
        <EditField name={expiryField} label="Expiry Date" type="date" />
      </div>
    </fieldset>
  );
}

export default function EditClientFields() {
  return (
    <div className="space-y-6">
      <section aria-labelledby="basic-information-heading">
        <h2 id="basic-information-heading" className="mb-4 text-body-sm font-semibold text-text-primary">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <EditField name="name" label="Full Legal Name" />
          <EditSelect name="clientType" label="Client Type" options={CLIENT_EDIT_TYPE_OPTIONS} />
          <EditSelect name="nationality" label="Nationality" options={NATIONALITY_OPTIONS} />
          <EditSelect name="preferredCommunicationMethod" label="Preferred Communication" options={PREFERRED_COMMUNICATION_OPTIONS} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <EditField name="mobileNumber" label="Mobile Number" inputMode="tel" />
          <EditField name="whatsappNumber" label="WhatsApp Number" inputMode="tel" />
          <EditField name="emailAddress" label="Email Address" type="email" />
        </div>
      </section>

      <section aria-labelledby="identity-documents-heading">
        <h2 id="identity-documents-heading" className="mb-4 text-body-sm font-semibold text-text-primary">Identity Documents</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <IdentitySection icon={CreditCard} iconClassName="text-info-600" title="Emirates ID (EID)" numberField="emirates.emiratesId" numberLabel="Emirates ID Number" issueField="emirates.emiratesIssueDate" expiryField="emirates.emiratesExpiryDate" />
          <IdentitySection icon={FileBadge} iconClassName="text-primary-600" title="Passport" numberField="passport.passportNumber" numberLabel="Passport Number" issueField="passport.passportIssueDate" expiryField="passport.passportExpiryDate" />
          <IdentitySection icon={FileText} iconClassName="text-warning-600" title="Visa / Residency Permit" numberField="visa.visaUIDNumber" numberLabel="Visa Number" issueField="visa.visaIssueDate" expiryField="visa.visaExpiryDate" />
          <IdentitySection icon={HeartPulse} iconClassName="text-success-600" title="Health / Medical Insurance" numberField="healthInsurance.healthInsuranceCardNumber" numberLabel="Policy Number" issueField="healthInsurance.healthInsuranceIssueDate" expiryField="healthInsurance.healthInsuranceExpiryDate" />
        </div>
      </section>
    </div>
  );
}
