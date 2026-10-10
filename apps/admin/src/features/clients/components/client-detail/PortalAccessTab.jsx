import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@operio/ui/components/button";
import { Card } from "@operio/ui/components/card";
import { Input } from "@operio/ui/components/input";
import useUpdateClientCredentials from "@/features/clients/hooks/useUpdateClientCredentials";
import { clientCredentialsIdSchema, clientCredentialsSchema } from "@/features/clients/schemas/clientCredentials.schema";

import { generateClientPortalPassword } from "@/features/clients/utils/clientPortalPassword";

export default function PortalAccessTab({ client, clientId }) {
  const [showPassword, setShowPassword] = useState(false);
  const mutation = useUpdateClientCredentials(clientId);
  const { register, control, setValue, handleSubmit, reset, setError, clearErrors, formState: { errors, defaultValues } } = useForm({
    defaultValues: { emailAddress: client.emailAddress ?? "", password: client.password ?? "", portalAccess: client.portalAccess ?? "Disable" },
  });

  const emailAddress = useWatch({ control, name: "emailAddress" });
  const password = useWatch({ control, name: "password" });
  const portalAccess = useWatch({ control, name: "portalAccess" });
  const portalEnabled = portalAccess === "Enable";
  const hasChanges = emailAddress.trim().toLowerCase() !== defaultValues.emailAddress.trim().toLowerCase()
    || password !== defaultValues.password
    || portalAccess !== defaultValues.portalAccess;

  const generatePassword = () => {
    setValue("password", generateClientPortalPassword(client.name), { shouldDirty: true });
    clearErrors("password");
    setShowPassword(true);
  };

  const submit = handleSubmit(async (values) => {
    clearErrors();
    if (clientCredentialsIdSchema.validate(clientId).error) {
      setError("root", { message: "A valid client ID is required to update credentials." });
      return;
    }

    const payload = {};
    if (values.emailAddress.trim().toLowerCase() !== defaultValues.emailAddress.trim().toLowerCase()) payload.emailAddress = values.emailAddress;
    if (values.password !== defaultValues.password) payload.password = values.password;
    if (values.portalAccess !== defaultValues.portalAccess) payload.portalAccess = values.portalAccess;
    const validation = clientCredentialsSchema.validate(payload, { abortEarly: false });
    if (validation.error) {
      validation.error.details.forEach((detail) => {
        setError(detail.path[0] || "root", { message: detail.path.length ? detail.message : "Change the email address, password, or portal access before saving." });
      });
      return;
    }

    try {
      const updated = await mutation.mutateAsync(validation.value);
      reset({ emailAddress: updated?.emailAddress ?? validation.value.emailAddress ?? values.emailAddress, password: values.password, portalAccess: updated?.portalAccess ?? values.portalAccess });
      setShowPassword(false);
      toast.success("Client credentials updated successfully.");
    } catch (error) {
      const serverError = error?.response?.data?.error;
      setError("root", { message: serverError?.message || "Unable to update credentials. Please try again." });
      serverError?.details?.forEach((detail) => {
        if (["emailAddress", "password", "portalAccess"].includes(detail.field)) setError(detail.field, { message: detail.issue });
      });
    }
  });

  return (
    <Card className="gap-5 border border-border-default bg-surface-primary p-5 shadow-card ring-0 sm:p-6">
      <div>
        <h2 className="text-subsection font-semibold text-text-primary">Portal Access</h2>
        <p className="mt-1 text-body-sm text-text-secondary">View and update the client’s sign-in credentials. Only changed fields are saved.</p>
      </div>
      <form onSubmit={submit} noValidate className="space-y-4">
        <fieldset disabled={mutation.isPending} className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <label htmlFor="portal-email" className="shrink-0 text-body-sm font-medium sm:pt-2">Email address</label>
            <div className="w-full space-y-1.5 sm:max-w-lg">
            <Input id="portal-email" type="email" autoComplete="off" {...register("emailAddress")} aria-invalid={Boolean(errors.emailAddress)} aria-describedby={errors.emailAddress ? "portal-email-error" : undefined} />
            {errors.emailAddress && <p id="portal-email-error" className="text-caption text-danger-600">{errors.emailAddress.message}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <label htmlFor="portal-password" className="shrink-0 text-body-sm font-medium sm:pt-2">Password</label>
            <div className="w-full space-y-1.5 sm:max-w-lg">
            <div className="flex gap-2">
              <Input id="portal-password" type={showPassword ? "text" : "password"} autoComplete="new-password" {...register("password")} aria-invalid={Boolean(errors.password)} aria-describedby="portal-password-help portal-password-error" />
              <Button type="button" variant="outline" onClick={generatePassword} aria-label="Generate password" title="Generate password" className="shrink-0 px-3"><RefreshCw aria-hidden="true" className="size-4" /></Button>
              <Button type="button" variant="outline" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? "Hide" : "Show"}</Button>
            </div>
            <p id="portal-password-help" className="text-caption text-text-muted">At least 8 characters, up to 72 UTF-8 bytes.</p>
            <p id="portal-password-error" className="text-caption text-danger-600">{errors.password?.message}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <span id="portal-access-label" className="shrink-0 text-body-sm font-medium sm:pt-2">Portal Access</span>
            <div className="w-full space-y-1.5 sm:max-w-lg">
              <div role="group" aria-labelledby="portal-access-label" aria-describedby={errors.portalAccess ? "portal-access-error" : undefined} className="inline-flex gap-1 rounded-full border border-border-default bg-surface-secondary p-1">
                <Button type="button" variant={portalEnabled ? "default" : "ghost"} aria-pressed={portalEnabled} onClick={() => setValue("portalAccess", "Enable", { shouldDirty: true })} className="h-8 rounded-full px-4 text-xs">Enabled</Button>
                <Button type="button" variant={!portalEnabled ? "default" : "ghost"} aria-pressed={!portalEnabled} onClick={() => setValue("portalAccess", "Disable", { shouldDirty: true })} className="h-8 rounded-full px-4 text-xs">Disabled</Button>
              </div>
              {errors.portalAccess && <p id="portal-access-error" role="alert" className="text-caption text-danger-600">{errors.portalAccess.message}</p>}
            </div>
          </div>
        </fieldset>
        {errors.root && <p role="alert" className="text-body-sm text-danger-600">{errors.root.message}</p>}
        <Button type="submit" disabled={mutation.isPending || !hasChanges}>{mutation.isPending ? "Saving..." : "Save credentials"}</Button>
      </form>
    </Card>
  );
}
