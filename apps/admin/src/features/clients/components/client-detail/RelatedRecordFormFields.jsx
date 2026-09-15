import { Controller, useFormContext } from "react-hook-form";

import { DateInput } from "@operio/ui/components/date-input";
import { Input } from "@operio/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@operio/ui/components/select";
import { MEMBER_TYPE_OPTIONS } from "@/features/clients/constants/client";

function getInitials(name = "Member") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function getNestedValue(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

function FormField({ name, label, date = false, placeholder }) {
  const { register, formState: { errors } } = useFormContext();
  const error = getNestedValue(errors, name);
  const errorId = `${name.replaceAll(".", "-")}-error`;
  const FieldComponent = date ? DateInput : Input;

  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-1.5 block text-caption font-medium text-text-primary">{label}</label>
      <FieldComponent
        {...register(name)}
        id={name}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-11 border-border-default bg-surface-primary px-3 text-body-sm shadow-none hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
      />
      {error?.message && <p id={errorId} role="alert" className="mt-1 text-caption text-destructive">{error.message}</p>}
    </div>
  );
}

function MemberTypeField() {
  const { control, formState: { errors } } = useFormContext();
  const errorId = "memberType-error";

  return (
    <div className="min-w-0">
      <label htmlFor="memberType" className="mb-1.5 block text-caption font-medium text-text-primary">Member Type</label>
      <Controller
        name="memberType"
        control={control}
        render={({ field }) => (
          <Select value={field.value || null} onValueChange={(value) => field.onChange(value === "__clear__" ? "" : value)}>
            <SelectTrigger id="memberType" onBlur={field.onBlur} aria-invalid={Boolean(errors.memberType)} aria-describedby={errors.memberType ? errorId : undefined} className="h-11 w-full border-border-default bg-surface-primary px-3 text-body-sm shadow-none hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20">
              <SelectValue placeholder="Select member type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__clear__">No member type</SelectItem>
              {MEMBER_TYPE_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      />
      {errors.memberType?.message && <p id={errorId} role="alert" className="mt-1 text-caption text-destructive">{errors.memberType.message}</p>}
    </div>
  );
}

function IdentitySection({ title, children }) {
  return (
    <fieldset className="space-y-4 border-0 p-0">
      <legend className="mb-4 text-body-sm font-semibold text-text-primary">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </fieldset>
  );
}

export function MemberFormFields({ member }) {
  const memberName = member?.name || "Unnamed member";
  return (
    <>
      {member && (
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-body-md font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{getInitials(memberName)}</span>
          <div className="min-w-0">
            <p className="truncate text-body-md font-semibold text-text-primary">{memberName}</p>
            <span className="mt-1 inline-block rounded-md bg-primary-50 px-2 py-0.5 text-caption font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">{member.memberType || "Member"}</span>
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField name="name" label="Full Name" placeholder="Enter full name" />
        <MemberTypeField />
      </div>
      <IdentitySection title="Passport Information">
        <FormField name="passport.passportNumber" label="Passport No" placeholder="A1234567" />
        <FormField name="passport.passportIssueDate" label="Passport Issued" date />
        <FormField name="passport.passportExpiryDate" label="Passport Expiry" date />
      </IdentitySection>
      <IdentitySection title="Emirates ID Information">
        <FormField name="emirates.emiratesId" label="Emirates ID" placeholder="784-YYYY-XXXXXXX-X" />
        <FormField name="emirates.emiratesIssueDate" label="EID Issued" date />
        <FormField name="emirates.emiratesExpiryDate" label="EID Expiry" date />
      </IdentitySection>
      <IdentitySection title="Visa Information">
        <FormField name="visa.visaUIDNumber" label="Visa UID Number" placeholder="9 to 15 digits" />
        <FormField name="visa.visaIssueDate" label="E-Visa Issued" date />
        <FormField name="visa.visaExpiryDate" label="E-Visa Expiry" date />
      </IdentitySection>
      <IdentitySection title="Health Insurance Information">
        <FormField name="healthInsurance.healthInsuranceCardNumber" label="Card Number" placeholder="Enter card number" />
        <FormField name="healthInsurance.healthInsuranceIssueDate" label="Health Insurance Issued" date />
        <FormField name="healthInsurance.healthInsuranceExpiryDate" label="Health Insurance Expiry" date />
      </IdentitySection>
    </>
  );
}

export function VehicleFormFields() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField name="registrationNumer" label="Vehicle Registration No" placeholder="DXB-A-12345" />
      <FormField name="policyNumber" label="Policy No" placeholder="POLICY-2026-001" />
      <FormField name="insuranceExpiry" label="Insurance Expiry" date />
      <FormField name="tcNumber" label="TC Number" placeholder="TC-10001" />
      <FormField name="registrationExpiry" label="Registration Expiry" date />
    </div>
  );
}

export function DriverFormFields() {
  return (
    <>
      <FormField name="name" label="Driver Name" placeholder="Enter driver name" />
      <fieldset className="border-0 p-0">
        <legend className="mb-4 text-body-sm font-semibold text-text-primary">License Information</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField name="licenceIssueDate" label="License Issue" date />
          <FormField name="licenceExpiryDate" label="License Expiry" date />
        </div>
      </fieldset>
    </>
  );
}
