import { joiResolver } from "@hookform/resolvers/joi";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLIENT_STATUS_OPTIONS, CREATE_CLIENT_DEFAULT_VALUES, PREFERRED_COMMUNICATION_OPTIONS } from "@/constants/ClientsPage";
import useCreateClient from "@/hooks/useCreateClient";
import { createClientSchema } from "@/validator/ClientsPage";

function FieldError({ id, message }) {
  if (!message) return null;
  return <p id={id} role="alert" className="mt-1 text-xs text-destructive">{message}</p>;
}

function TextField({ label, name, error, register, required = false, ...props }) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-body-sm font-medium text-foreground">
        {label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
      </label>
      <Input id={name} aria-required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...register(name)} {...props} />
      <FieldError id={errorId} message={error?.message} />
    </div>
  );
}

function ClientSelectField({ control, error, label, name, options, placeholder }) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-body-sm font-medium text-foreground">
        {label}{name === "preferredCommunicationMethod" && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select items={options} value={field.value || null} onValueChange={field.onChange}>
            <SelectTrigger id={name} aria-required={name === "preferredCommunicationMethod"} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="h-8! w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      <FieldError id={errorId} message={error?.message} />
    </div>
  );
}

const cleanPayload = (values) => Object.fromEntries(
  Object.entries(values).filter(([, value]) => value !== "" && value !== undefined),
);

export function QuickAddClientDialog({ open, onOpenChange }) {
  const createClient = useCreateClient();
  const { control, formState: { errors }, handleSubmit, register, reset, setError } = useForm({
    defaultValues: CREATE_CLIENT_DEFAULT_VALUES,
    resolver: joiResolver(createClientSchema),
  });

  const handleOpenChange = (nextOpen) => {
    if (nextOpen || createClient.isPending) return;
    reset();
    createClient.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values) => {
    try {
      const client = await createClient.mutateAsync(cleanPayload(values));
      toast.success(`${client.name} was added successfully.`);
      reset();
      onOpenChange(false);
    } catch (error) {
      const apiError = error.response?.data?.error;
      const details = Array.isArray(apiError?.details) ? apiError.details : [];

      details.forEach((detail) => {
        if (detail.field && Object.hasOwn(CREATE_CLIENT_DEFAULT_VALUES, detail.field)) {
          setError(detail.field, { type: "server", message: detail.issue });
        }
      });

      toast.error(apiError?.message || "We couldn't add the client. Please try again.");
    }
  };

  const contactError = errors.root?.message || errors[""]?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>Quick add client</DialogTitle>
          <DialogDescription>Add the client's details and choose how they prefer to be contacted.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex max-h-[calc(100vh-8.5rem)] flex-col">
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
            <TextField label="Full name" name="name" required error={errors.name} register={register} autoComplete="name" maxLength={200} />
            <TextField label="Mobile number" name="mobileNumber" error={errors.mobileNumber} register={register} autoComplete="tel" maxLength={30} placeholder="+971 50 123 4567" />
            <TextField label="WhatsApp number" name="whatsappNumber" error={errors.whatsappNumber} register={register} autoComplete="tel" maxLength={30} placeholder="+971 50 123 4567" />
            <TextField label="Email address" name="emailAddress" error={errors.emailAddress} register={register} type="email" autoComplete="email" maxLength={254} placeholder="client@example.com" />

            <div className="-mt-1 sm:col-span-2">
              <p className="text-xs text-muted-foreground">Provide at least one mobile, WhatsApp, or email contact.</p>
              <FieldError id="contact-error" message={contactError} />
            </div>

            <TextField label="Nationality" name="nationality" error={errors.nationality} register={register} autoComplete="country-name" maxLength={120} />
            <TextField label="Emirates ID number" name="emiratesIdNumber" error={errors.emiratesIdNumber} register={register} maxLength={30} placeholder="784-1990-1234567-1" />
            <TextField label="Passport number" name="passportNumber" error={errors.passportNumber} register={register} maxLength={30} />
            <ClientSelectField control={control} error={errors.preferredCommunicationMethod} label="Preferred communication" name="preferredCommunicationMethod" options={PREFERRED_COMMUNICATION_OPTIONS} placeholder="Select a method" />
            <ClientSelectField control={control} error={errors.clientStatus} label="Client status" name="clientStatus" options={CLIENT_STATUS_OPTIONS} />

            <div className="sm:col-span-2">
              <label htmlFor="address" className="mb-1.5 block text-body-sm font-medium text-foreground">Address</label>
              <textarea id="address" rows={2} maxLength={500} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} className="min-h-16 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20" {...register("address")} />
              <FieldError id="address-error" message={errors.address?.message} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className="mb-1.5 block text-body-sm font-medium text-foreground">Notes</label>
              <textarea id="notes" rows={3} maxLength={5000} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "notes-error" : undefined} placeholder="Add any helpful context about the client" className="min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20" {...register("notes")} />
              <FieldError id="notes-error" message={errors.notes?.message} />
            </div>
          </div>

          <DialogFooter className="border-t bg-surface-container-low px-6 py-4">
            <Button type="button" variant="outline" disabled={createClient.isPending} onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createClient.isPending}>{createClient.isPending ? "Adding client…" : "Add client"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
