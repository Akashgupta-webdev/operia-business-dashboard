import { useFormContext } from "react-hook-form";
import { Input } from "@operio/ui/components/input";

export default function UaeMobileField({ name, label }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors.client?.[name.split(".")[1]];
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-primary">{label}</label>
      <div className="flex overflow-hidden rounded-sm border border-border-default focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <span aria-hidden="true" className="flex shrink-0 items-center border-r border-border-default bg-surface-secondary px-3 text-xs font-medium text-text-secondary">+971</span>
        <Input {...register(name)} id={name} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="50 123 4567" aria-invalid={Boolean(error)} aria-describedby={error ? `${hintId} ${errorId}` : hintId} className="h-8 min-h-8! min-w-0 rounded-none border-0 bg-surface-primary px-2.5 text-xs shadow-none placeholder:text-xs md:text-xs focus-visible:ring-0" />
      </div>
      <span id={hintId} className="sr-only">UAE country code +971. Enter a nine-digit mobile number.</span>
      {error?.message && <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">{error.message}</p>}
    </div>
  );
}
