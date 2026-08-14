import { joiResolver } from "@hookform/resolvers/joi";
import { Clock3, Pencil, Save, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CLIENT_STATUS_OPTIONS,
  CLIENT_TYPE_OPTIONS,
  PREFERRED_COMMUNICATION_OPTIONS,
} from "@/constants/ClientsPage";
import useUpdateClient from "@/hooks/useUpdateClient";
import { editClientSchema } from "@/validator/ClientDetailPage";
import { FieldError, FormField, TextAreaField } from "./QuickAddFormFields";

const formatEnum = (value = "") => value
  .toLowerCase()
  .split("_")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(" ");

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

const getDefaultValues = (client) => ({
  name: client.name ?? "",
  emiratesIdNumber: client.emiratesIdNumber ?? "",
  emailAddress: client.emailAddress ?? "",
  mobileNumber: client.mobileNumber ?? "",
  whatsappNumber: client.whatsappNumber ?? "",
  clientType: client.clientType ?? "INDIVIDUAL",
  nationality: client.nationality ?? "",
  passportNumber: client.passportNumber ?? "",
  address: client.address ?? "",
  preferredCommunicationMethod: client.preferredCommunicationMethod ?? "",
  clientStatus: client.clientStatus ?? "ACTIVE",
});

const createUpdatePayload = (values) => ({
  ...Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)),
  address: values.address?.trim() || null,
});

export function ClientPersonalInfo({ client }) {
  const [isEditing, setIsEditing] = useState(false);
  const updateClient = useUpdateClient(client.clientId);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm({
    defaultValues: getDefaultValues(client),
    resolver: joiResolver(editClientSchema),
    mode: "onTouched",
  });

  const startEditing = () => {
    reset(getDefaultValues(client));
    updateClient.reset();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (updateClient.isPending) return;
    reset(getDefaultValues(client));
    setIsEditing(false);
  };

  const onSubmit = async (values) => {
    try {
      await updateClient.mutateAsync(createUpdatePayload(values));
      toast.success("Personal information updated successfully.");
      setIsEditing(false);
    } catch (error) {
      const apiError = error.response?.data?.error;
      const editableFields = getDefaultValues(client);

      apiError?.details?.forEach((detail) => {
        if (detail.field && Object.hasOwn(editableFields, detail.field)) {
          setError(detail.field, { type: "server", message: detail.issue });
        }
      });
      toast.error(apiError?.message || "We couldn't update the client. Please try again.");
    }
  };

  return (
    <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-card ring-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 pt-5 pb-0 md:px-6 md:pt-6">
        <CardTitle className="flex items-center gap-2 text-body-lg font-semibold">
          <UserRound className="size-5 text-primary" aria-hidden="true" />
          Personal Information
        </CardTitle>
        {isEditing ? (
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={updateClient.isPending} onClick={cancelEditing}>
              <X data-icon="inline-start" />Cancel
            </Button>
            <Button type="submit" form="client-personal-information-form" size="sm" disabled={updateClient.isPending}>
              <Save data-icon="inline-start" />{updateClient.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={startEditing}>
            <Pencil data-icon="inline-start" />Edit
          </Button>
        )}
      </CardHeader>

      {isEditing ? (
        <form id="client-personal-information-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="grid grid-cols-1 gap-x-5 gap-y-4 px-5 py-5 sm:grid-cols-2 md:px-6 md:py-6">
            <FormField control={control} error={errors.name} label="Full name" name="name" maxLength={200} autoComplete="name" />
            <FormField control={control} error={errors.emiratesIdNumber} label="Emirates ID" name="emiratesIdNumber" maxLength={30} required={false} />
            <FormField control={control} error={errors.emailAddress} label="Email" name="emailAddress" type="email" maxLength={254} autoComplete="email" required={false} />
            <FormField control={control} error={errors.mobileNumber} label="Mobile" name="mobileNumber" type="tel" maxLength={30} autoComplete="tel" required={false} />
            <FormField control={control} error={errors.whatsappNumber} label="WhatsApp" name="whatsappNumber" type="tel" maxLength={30} required={false} />
            <FormField control={control} error={errors.clientType} label="Client type" name="clientType" type="select" options={CLIENT_TYPE_OPTIONS} />
            <FormField control={control} error={errors.nationality} label="Nationality" name="nationality" maxLength={120} required={false} />
            <FormField control={control} error={errors.passportNumber} label="Passport number" name="passportNumber" maxLength={30} required={false} />
            <FormField control={control} error={errors.preferredCommunicationMethod} label="Preferred communication" name="preferredCommunicationMethod" type="select" options={PREFERRED_COMMUNICATION_OPTIONS} />
            <FormField control={control} error={errors.clientStatus} label="Client status" name="clientStatus" type="select" options={CLIENT_STATUS_OPTIONS} />
            <TextAreaField className="sm:col-span-2" control={control} error={errors.address} label="Address" name="address" maxLength={500} rows={3} />
            <FieldError id="client-contact-error" message={errors.root?.message} />
          </CardContent>
        </form>
      ) : (
        <CardContent className="px-5 py-5 md:px-6 md:py-6">
          <dl className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            <InfoItem label="Full name" value={client.name} />
            <InfoItem label="Emirates ID" value={client.emiratesIdNumber} />
            <InfoItem label="Email" value={client.emailAddress} />
            <InfoItem label="Mobile" value={client.mobileNumber} />
            <InfoItem label="WhatsApp" value={client.whatsappNumber} />
            <InfoItem label="Client type" value={formatEnum(client.clientType)} />
            <InfoItem label="Nationality" value={client.nationality} />
            <InfoItem label="Passport number" value={client.passportNumber} />
            <InfoItem label="Preferred communication" value={formatEnum(client.preferredCommunicationMethod)} />
            <InfoItem label="Client status" value={formatEnum(client.clientStatus)} />
            <div className="sm:col-span-2">
              <InfoItem label="Address" value={client.address} />
            </div>
          </dl>
        </CardContent>
      )}
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
