import { Controller, useFormContext } from "react-hook-form";
import {
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CarFront,
  FileText,
  IdCard,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const getNestedError = (errors, name) => name
  .replace(/\[(\d+)\]/g, ".$1")
  .split(".")
  .filter(Boolean)
  .reduce((current, key) => current?.[key], errors);

const stepVisuals = {
  "Client details": { icon: UserRound, className: "bg-accent text-primary" },
  "Company information": { icon: Building2, className: "bg-info-container text-info-container-foreground" },
  "Personnel & Members": { icon: UsersRound, className: "bg-success-container text-success-container-foreground" },
  Vehicles: { icon: CarFront, className: "bg-warning-container text-warning-container-foreground" },
  Drivers: { icon: IdCard, className: "bg-info-container text-info-container-foreground" },
  Services: { icon: BriefcaseBusiness, className: "bg-accent text-primary" },
  "Supporting documents": { icon: FileText, className: "bg-warning-container text-warning-container-foreground" },
  "Fees & collection": { icon: WalletCards, className: "bg-success-container text-success-container-foreground" },
  "Dates & follow-up": { icon: BellRing, className: "bg-info-container text-info-container-foreground" },
  "Confirm & complete": { icon: BadgeCheck, className: "bg-success-container text-success-container-foreground" },
};

export function WizardField({
  name,
  label,
  required = false,
  className,
  inputClassName,
  type = "text",
  ...props
}) {
  const { register, formState: { errors } } = useFormContext();
  const error = getNestedError(errors, name);
  const errorId = `${name.replaceAll(".", "-")}-error`;

  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={name} className="mb-1 block text-caption font-semibold text-text-primary">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <Input
        {...register(name)}
        id={name}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-9 border-border-default bg-surface-primary px-2.5 text-caption shadow-none placeholder:text-caption hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          inputClassName,
        )}
        {...props}
      />
      {error?.message && (
        <p id={errorId} role="alert" className="mt-1 text-caption text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

export function WizardSelect({
  name,
  label,
  options,
  placeholder = "Select an option",
  required = false,
  className,
}) {
  const { control, formState: { errors } } = useFormContext();
  const error = getNestedError(errors, name);
  const errorId = `${name.replaceAll(".", "-")}-error`;

  return (
    <div className={cn("min-w-0", className)}>
      <label className="mb-1 block text-caption font-semibold text-text-primary">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value || null} onValueChange={field.onChange}>
            <SelectTrigger
              aria-label={label}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              size="sm"
              className="h-9 w-full border-border-default bg-surface-primary px-2.5 text-caption text-text-primary hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent align="start">
              {options.map((option) => {
                const value = typeof option === "string" ? option : option.value;
                const optionLabel = typeof option === "string" ? option : option.label;
                return (
                  <SelectItem key={value} value={value}>
                    {optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      />
      {error?.message && (
        <p id={errorId} role="alert" className="mt-1 text-caption text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

export function WizardTextarea({ name, label, placeholder, className }) {
  const { register, formState: { errors } } = useFormContext();
  const error = getNestedError(errors, name);
  const errorId = `${name.replaceAll(".", "-")}-error`;

  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={name} className="mb-1 block text-caption font-semibold text-text-primary">
        {label}
      </label>
      <Textarea
        {...register(name)}
        id={name}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="min-h-16 border-border-default bg-surface-primary text-caption shadow-none placeholder:text-caption hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
      />
      {error?.message && (
        <p id={errorId} role="alert" className="mt-1 text-caption text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

export function WizardFileField({ name, label = "File", accept }) {
  const { register, formState: { errors } } = useFormContext();
  const error = getNestedError(errors, name);
  const errorId = `${name.replaceAll(".", "-")}-error`;

  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-1 block text-caption font-semibold text-text-primary">
        {label}
      </label>
      <Input
        {...register(name)}
        id={name}
        type="file"
        accept={accept}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-9 border-border-default bg-surface-primary px-2 py-1 text-caption file:mr-3 file:h-6 file:rounded-md file:bg-surface-secondary file:px-2 file:text-caption file:text-text-primary"
      />
      {error?.message ? (
        <p id={errorId} role="alert" className="mt-1 text-caption text-destructive">
          {error.message}
        </p>
      ) : (
        <p className="mt-1 text-caption text-text-muted">Maximum 10 MiB.</p>
      )}
    </div>
  );
}

export function StepHeading({ title, description, action }) {
  const visual = stepVisuals[title] || stepVisuals["Client details"];
  const Icon = visual.icon;

  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-bold tracking-tight text-text-primary">{title}</h2>
        <p className="mt-0.5 text-caption text-text-secondary">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {action}
        <span className={cn("flex size-9 items-center justify-center rounded-lg", visual.className)}>
          <Icon aria-hidden="true" className="size-4.5" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

export function RepeatableCard({ number, title, onRemove, children }) {
  return (
    <fieldset className="overflow-hidden rounded-lg border border-border-default bg-surface-primary">
      <legend className="sr-only">{title} {number}</legend>
      <div className="flex items-center justify-between border-b border-border-default bg-surface-secondary px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-accent text-caption font-bold text-accent-foreground">
            {number}
          </span>
          <p className="text-body-sm font-semibold text-text-primary">{title}</p>
        </div>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 px-2 text-caption font-semibold text-destructive hover:bg-destructive-container hover:text-destructive"
          >
            Remove
          </Button>
        )}
      </div>
      <div className="p-3">{children}</div>
    </fieldset>
  );
}
