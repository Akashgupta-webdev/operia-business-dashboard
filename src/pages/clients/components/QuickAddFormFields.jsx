import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function FieldError({ id, message }) {
  if (!message) return null;
  return <p id={id} role="alert" className="mt-1 text-xs text-destructive">{message}</p>;
}

export function FormField({ className, control, error, label, name, options, required = true, type = "text", ...props }) {
  const errorId = `${name.replaceAll(".", "-")}-error`;
  const inputId = name.replaceAll(".", "-");

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-body-sm font-medium text-foreground">
        {label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
      </label>
      {type === "select" ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select items={options} value={field.value || null} onValueChange={field.onChange}>
              <SelectTrigger id={inputId} aria-required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="h-9! w-full bg-background">
                <SelectValue placeholder={props.placeholder || `Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      ) : (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              {...props}
              id={inputId}
              type={type}
              value={field.value ?? ""}
              aria-required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="h-9 bg-background"
            />
          )}
        />
      )}
      <FieldError id={errorId} message={error?.message} />
    </div>
  );
}

export function TextAreaField({ className, control, error, label, name, required = false, ...props }) {
  const errorId = `${name.replaceAll(".", "-")}-error`;
  const inputId = name.replaceAll(".", "-");

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-body-sm font-medium text-foreground">
        {label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            {...props}
            id={inputId}
            value={field.value ?? ""}
            aria-required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className="min-h-20 w-full resize-y rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
          />
        )}
      />
      <FieldError id={errorId} message={error?.message} />
    </div>
  );
}

export function OptionalSectionToggle({ checked, description, disabled, label, onChange }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card", disabled && "cursor-not-allowed opacity-60")}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 size-4 accent-primary" />
      <span>
        <span className="block text-body-md font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-body-sm text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}
