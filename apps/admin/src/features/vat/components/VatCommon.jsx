import { Link } from "react-router-dom";
import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import { Textarea } from "@operio/ui/components/textarea";
import { Card } from "@operio/ui/components/card";
import { useVatAccess } from "../hooks/useVat";
import { errorInfo, label } from "../utils/vat";

export function VatGuard({ children }) {
  const query = useVatAccess();
  if (query.isPending) return <p role="status" className="p-6">Checking Admin access…</p>;
  if (query.isError) return <ErrorNotice error={query.error} reload={query.refetch} />;
  if (!query.allowed) return <p role="alert" className="p-6">Access denied. VAT filings require an active Admin account.</p>;
  return children;
}
export function Panel({ title, children }) {
  return <Card className="gap-4 border border-border-default bg-surface-primary p-5 shadow-card ring-0"><h2 className="text-body-lg font-semibold">{title}</h2>{children}</Card>;
}
export function Field({ name, title, value, onChange, options, multiline, error, ...props }) {
  const Component = multiline ? Textarea : Input;
  return <label className="grid min-w-0 gap-1.5 text-caption font-medium"><span>{title}</span>{options ? <select name={name} value={value ?? ""} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className="min-h-11 w-full rounded-md border border-border-default bg-surface-primary px-3 text-body-sm" {...props}><option value="">Select…</option>{options.map((option) => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? label(option)}</option>)}</select> : <Component className="min-h-11" name={name} value={value ?? ""} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} {...props} />}{error && <span role="alert" className="text-destructive">{error}</span>}</label>;
}
export function ErrorNotice({ error, reload, company }) {
  if (!error) return null;
  const info = errorInfo(error);
  return <div role="alert" className="space-y-2 rounded-lg border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700"><p>{info.message}</p>{info.details.map((d, i) => <p key={i}>{d.field}: {d.issue}</p>)}{info.correlationId && <p>Support reference: {info.correlationId}</p>}<div className="flex flex-wrap gap-3">{reload && <Button type="button" variant="outline" onClick={reload}>Reload latest record</Button>}{info.status === 401 && <Link to="/login" className="underline">Sign in</Link>}{info.code === "VAT_PERIOD_EXISTS" && <Link to={`/vat-filings${company ? `?company=${company}` : ""}`} className="underline">Find existing filing (all statuses)</Link>}{info.status === 404 && <Link to="/vat-filings" className="underline">Return to VAT filings</Link>}</div></div>;
}
export function PeriodFields({ values, set, errors = {} }) {
  return <div className="grid gap-4 sm:grid-cols-3">{[["periodStart", "Period start"], ["periodEnd", "Period end"], ["dueDate", "Statutory deadline"]].map(([name, title]) => <Field key={name} name={name} title={title} type="date" min="1900-01-01" max="9999-12-31" value={values[name]} onChange={(v) => set(name, v)} error={errors[name]} required />)}</div>;
}
export function FeeFields({ values, set, errors = {} }) {
  return <div className="grid gap-4 sm:grid-cols-2"><Field name="packagePrice" title="Our service fee (AED)" inputMode="decimal" value={values.packagePrice} onChange={(v) => set("packagePrice", v)} error={errors.packagePrice} /><Field name="paymentStatus" title="Service fee payment state" options={["Unpaid", "Partial", "Paid"]} value={values.paymentStatus} onChange={(v) => set("paymentStatus", v)} error={errors.paymentStatus} /><Field name="targetCompletionDate" title="Internal target (optional)" type="date" value={values.targetCompletionDate} onChange={(v) => set("targetCompletionDate", v)} error={errors.targetCompletionDate} /><Field name="notes" title="Internal notes (one per line)" multiline value={values.notes} onChange={(v) => set("notes", v)} error={errors.notes} /></div>;
}
