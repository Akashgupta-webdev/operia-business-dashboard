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

import { Input } from "@operio/ui/components/input";
import { Button } from "@operio/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@operio/ui/components/select";
import { Textarea } from "@operio/ui/components/textarea";
import { cn } from "@operio/ui/lib/utils";

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
  prefix,
  type = "text",
  ...props
}) {
  const { register, formState: { errors } } = useFormContext();
  const error = getNestedError(errors, name);
  const errorId = `${name.replaceAll(".", "-")}-error`;

  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-primary">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <div className="relative">
        {prefix && <span className="absolute inset-y-0 left-0 z-10 flex items-center rounded-l-sm border border-border-default bg-surface-secondary px-2 text-xs text-text-secondary">{prefix}</span>}
      <Input
        {...register(name)}
        id={name}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-8 min-h-8! border-border-default bg-surface-primary px-2.5 text-xs shadow-none placeholder:text-xs md:text-xs hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          prefix && "pl-12",
          inputClassName,
        )}
        {...props}
      />
      </div>
      {error?.message && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
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
  onChange,
  allowClear = false,
  required = false,
  className,
}) {
  const { control, formState: { errors } } = useFormContext();
  const error = getNestedError(errors, name);
  const errorId = `${name.replaceAll(".", "-")}-error`;

  return (
    <div className={cn("min-w-0", className)}>
      <label className="mb-1 block text-xs font-medium text-primary">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value || null} onValueChange={(value) => { field.onChange(value === "__clear__" ? "" : value); onChange?.(value); }}>
            <SelectTrigger
              aria-label={label}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              size="sm"
              className="h-8 min-h-8! w-full border-border-default bg-surface-primary px-2.5 text-xs text-text-primary hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent align="start">
              {allowClear && <SelectItem value="__clear__">Not Set</SelectItem>}
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
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
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
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-primary">
        {label}
      </label>
      <Textarea
        {...register(name)}
        id={name}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="min-h-16 border-border-default bg-surface-primary text-xs shadow-none placeholder:text-xs md:text-xs hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
      />
      {error?.message && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
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
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-primary">
        {label}
      </label>
      <Input
        {...register(name)}
        id={name}
        type="file"
        accept={accept}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-8 min-h-8! border-border-default bg-surface-primary px-2 py-1 text-xs file:mr-3 file:h-6 file:rounded-md file:bg-surface-secondary file:px-2 file:text-xs file:text-text-primary"
      />
      {error?.message ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
          {error.message}
        </p>
      ) : (
        <p className="mt-1 text-xs text-text-muted">Maximum 10 MiB.</p>
      )}
    </div>
  );
}

export function StepHeading({ title, description, action }) {
  const visual = stepVisuals[title] || stepVisuals["Client details"];
  const Icon = visual.icon;

  return (
    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
      <div>
        <h2 className="text-xs font-semibold tracking-tight text-text-primary">{title}</h2>
        <p className="mt-0.5 text-xs leading-4 text-text-secondary">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {action}
        <span className={cn("flex size-8 items-center justify-center rounded-lg", visual.className)}>
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
          <span className="flex size-6 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground">
            {number}
          </span>
          <p className="text-xs font-medium text-primary">{title}</p>
        </div>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 px-2 text-xs font-semibold text-destructive hover:bg-destructive-container hover:text-destructive"
          >
            Remove
          </Button>
        )}
      </div>
      <div className="p-3">{children}</div>
    </fieldset>
  );
}
