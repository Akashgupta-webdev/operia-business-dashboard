import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import { DateInput } from "@operio/ui/components/date-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import useClient from "@/features/clients/hooks/useClient";
import { useInvoiceMutation } from "../hooks/useInvoices";
import { decimalPattern, errorMessage, invoiceTypes, money, referenceId } from "../utils/invoice";
import { blankService, calculateService, contactNumberError, createInvoicePayload, emirates, initialCreateInvoice, nationalContactNumber, sumServiceMoney } from "../utils/createInvoice";

export default function CreateInvoiceForm({ client, type = invoiceTypes[0], onClose, onBusy }) {
  const [form, setForm] = useState(() => initialCreateInvoice(client, type));
  const [errors, setErrors] = useState({});
  const [uncertain, setUncertain] = useState(false);
  const pending = useRef(false);
  const mutation = useInvoiceMutation();
  const details = useClient(form.clientId);
  const companyName = details.data?.companies?.find((company) => referenceId(company) === form.companyId)?.companyName || client.companyName || client.companyId?.companyName || "Company unavailable";
  const taxTotal = sumServiceMoney(form.service, "taxAmount");
  const grandTotal = sumServiceMoney(form.service, "grandTotal");
  const update = (key, value) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); };
  function updateLine(index, key, value) {
    setForm((current) => ({ ...current, service: current.service.map((line, i) => i === index ? calculateService({ ...line, [key]: value }) : line) }));
    setErrors((current) => ({ ...current, [`service.${index}.${key}`]: undefined }));
  }
  const fieldProps = (name) => ({ id: `invoice-create-${name}`, name, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `invoice-error-${name}` : undefined });
  const error = (name) => errors[name] && <p id={`invoice-error-${name}`} className="mt-1 text-xs text-destructive">{errors[name]}</p>;
  async function submit(event) {
    event.preventDefault();
    if (pending.current || uncertain) return;
    const nextErrors = {};
    const contactError = contactNumberError(form.contactNo);
    if (contactError) nextErrors.contactNo = contactError;
    if (!/^[a-f0-9]{24}$/i.test(form.clientId)) nextErrors.clientId = "Select a valid client.";
    if (!/^[a-f0-9]{24}$/i.test(form.companyId)) nextErrors.companyId = "Select a company belonging to this client.";
    for (const key of ["customerName", "fullAddress", "trnNo"]) if (!form[key].trim()) nextErrors[key] = "This field is required.";
    form.service.forEach((line, index) => {
      const calculated = calculateService(line);
      for (const key of ["taxAmount", "grandTotal"]) if (!new RegExp("^" + decimalPattern + "$").test(calculated[key])) nextErrors[`service.${index}.${key}`] = "Enter valid prices and quantity. Calculated amounts must not exceed 16 integer digits.";
      if (!line.itemDescription.trim()) nextErrors[`service.${index}.itemDescription`] = "Enter a description.";
      if (!Number.isFinite(Number(line.qty)) || Number(line.qty) <= 0) nextErrors[`service.${index}.qty`] = "Enter a quantity greater than zero.";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    pending.current = true; onBusy(true);
    try {
      const result = await mutation.mutateAsync({ payload: createInvoicePayload(form) });
      toast.success(`Invoice ${result.invoiceNo || result.invoiceNumber || ""} created`);
      onClose(true);
    } catch (failure) {
      setErrors(Object.fromEntries((failure?.response?.data?.error?.details || []).filter((entry) => entry.field).map((entry) => [entry.field, entry.issue])));
      if (!failure.response || failure.response.status >= 500) setUncertain(true);
    } finally { pending.current = false; onBusy(false); }
  }
  const controlClass = "h-11! min-h-11! rounded-none text-xs md:text-xs";
  const labelClass = "mb-1 block text-xs";
  return <form onSubmit={submit} className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg bg-primary-50 p-3"><p className="text-xs text-text-secondary">Selected client</p><p className="mt-1 text-sm font-semibold">{client.name}</p>{error("clientId")}</div>
      <div className="rounded-lg border border-border-default bg-surface-secondary p-3"><p className="text-xs text-text-secondary">Company</p><p className="mt-1 text-sm font-semibold">{companyName}</p>{error("companyId")}{!form.companyId && <p className="mt-1 text-xs text-destructive">This client needs a company before an invoice can be created.</p>}</div>
    </div>
    <fieldset disabled={mutation.isPending || uncertain} className="space-y-5">
      <section className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Client and invoice details">
        <div><label htmlFor="invoice-create-invoiceType" className={labelClass}>Invoice type *</label><Input {...fieldProps("invoiceType")} readOnly value={form.invoiceType} className={controlClass + " disabled:opacity-100"} />{error("invoiceType")}</div>
        {[["customerName", "Customer name"], ["emailAddress", "Email address"]].map(([name, label]) => <div key={name}><label htmlFor={`invoice-create-${name}`} className={labelClass}>{label} *</label><Input {...fieldProps(name)} type={name === "emailAddress" ? "email" : "text"} required value={form[name]} onChange={(event) => update(name, event.target.value)} className={controlClass} />{error(name)}</div>)}
        <div><label htmlFor="invoice-create-emirate" className={labelClass}>Emirate</label><Select items={[{ value: "none", label: "Not specified" }, ...emirates.map((value) => ({ value, label: value }))]} value={form.emirate || "none"} onValueChange={(value) => update("emirate", value === "none" ? "" : value)}><SelectTrigger {...fieldProps("emirate")} className={controlClass + " w-full border-input"}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Not specified</SelectItem>{emirates.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>{error("emirate")}</div>
        <div><label htmlFor="invoice-create-trnNo" className={labelClass}>Company TRN *</label><Input {...fieldProps("trnNo")} required value={form.trnNo} onChange={(event) => update("trnNo", event.target.value)} className={controlClass} />{error("trnNo")}</div>
        <div><label htmlFor="invoice-create-contactNo" className={labelClass}>Contact number</label><div className="flex h-11 items-center border border-input focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50"><span className="flex h-full shrink-0 items-center border-r border-input px-3 text-xs">+971</span><Input {...fieldProps("contactNo")} type="tel" inputMode="tel" autoComplete="tel-national" aria-label="Contact number, UAE country code +971" value={nationalContactNumber(form.contactNo)} onBlur={() => setErrors((current) => ({ ...current, contactNo: contactNumberError(form.contactNo) || undefined }))} onChange={(event) => update("contactNo", nationalContactNumber(event.target.value))} className="h-full! min-h-0! rounded-none border-0 text-xs focus-visible:ring-0 md:text-xs" /></div>{error("contactNo")}</div>
        {[["issueDate", "Issue date"], ["dueDate", "Due date"]].map(([name, label]) => <div key={name}><label htmlFor={`invoice-create-${name}`} className={labelClass}>{label} *</label><DateInput {...fieldProps(name)} required value={form[name]} onChange={(event) => update(name, event.target.value)} className={controlClass} />{error(name)}</div>)}
        <div className="sm:col-span-2 lg:col-span-4"><label htmlFor="invoice-create-fullAddress" className={labelClass}>Address *</label><Input {...fieldProps("fullAddress")} placeholder="Building, Street, Area, City, UAE" required value={form.fullAddress} onChange={(event) => update("fullAddress", event.target.value)} className={controlClass} />{error("fullAddress")}</div>
      </section>
      <section className="space-y-3"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Services ({form.service.length}/100)</h3><Button type="button" size="sm" variant="outline" disabled={form.service.length >= 100} onClick={() => update("service", [...form.service, blankService()])}><Plus className="size-4" />Add service</Button></div>{error("service")}
        <div className="overflow-x-auto border border-border-default">
          <table className="w-full min-w-[1050px] table-fixed border-collapse text-xs">
            <caption className="sr-only">Invoice service lines and totals in AED</caption>
            <colgroup><col className="w-12" /><col /><col className="w-20" /><col className="w-28" /><col className="w-28" /><col className="w-24" /><col className="w-28" /><col className="w-32" /><col className="w-10" /></colgroup>
            <thead className="bg-surface-secondary"><tr>{["Item", "Description", "Qty", "Govt Rate", "Service Price", "Tax Code", "Tax Amount", "Grand Total", ""].map((heading, index) => <th key={index} scope="col" className="border-b border-r border-border-default px-2 py-3 text-center font-medium last:border-r-0">{heading || <span className="sr-only">Remove</span>}</th>)}</tr></thead>
            <tbody>{form.service.map((line, index) => <tr key={index} className="align-middle [&>td]:border-r [&>td]:border-b [&>td]:border-border-default [&>td]:p-2 [&>td:last-child]:border-r-0">
              <td className="text-center">{index + 1}</td>
              <td><Input {...fieldProps(`service.${index}.itemDescription`)} aria-label={`Service ${index + 1} description`} required placeholder="Service description" value={line.itemDescription} onChange={(event) => updateLine(index, "itemDescription", event.target.value)} className={controlClass} />{error(`service.${index}.itemDescription`)}</td>
              <td><Input {...fieldProps(`service.${index}.qty`)} aria-label={`Service ${index + 1} quantity`} type="number" step="any" min="0" required value={line.qty} onChange={(event) => updateLine(index, "qty", event.target.value)} className={controlClass + " px-1 text-center"} />{error(`service.${index}.qty`)}</td>
              {["govtRate", "servicePrice", "taxCode", "taxAmount", "grandTotal"].map((key) => <td key={key}>{key === "taxCode" ? <Select items={[{ value: "0", label: "Tax 0%" }, { value: "5", label: "Tax 5%" }]} value={line.taxCode} onValueChange={(value) => updateLine(index, key, value)}><SelectTrigger {...fieldProps(`service.${index}.taxCode`)} aria-label={`Service ${index + 1} tax code`} className={controlClass + " w-full border-input px-1"}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0">Tax 0%</SelectItem><SelectItem value="5">Tax 5%</SelectItem></SelectContent></Select> : <Input {...fieldProps(`service.${index}.${key}`)} aria-label={`Service ${index + 1} ${{ govtRate: "government rate", servicePrice: "service price", taxAmount: "tax amount", grandTotal: "grand total" }[key]} in AED`} required={key === "servicePrice"} readOnly={key === "taxAmount" || key === "grandTotal"} inputMode="decimal" pattern={decimalPattern} title="Nonnegative decimal, up to 16 integer digits and 2 decimal places" value={line[key]} onChange={(event) => updateLine(index, key, event.target.value)} className={controlClass + " px-1 text-right tabular-nums"} />}{error(`service.${index}.${key}`)}</td>)}
              <td><Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove service ${index + 1}`} disabled={form.service.length === 1} onClick={() => { update("service", form.service.filter((_, i) => i !== index)); setErrors({}); }}><Trash2 className="size-3.5 text-destructive" /></Button></td>
            </tr>)}</tbody>
            <tfoot className="[&>tr>td]:border-r [&>tr>td]:border-border-default [&>tr>td]:px-2 [&>tr>td]:py-2 [&>tr>td:last-child]:border-r-0">
              <tr className="border-b border-border-default"><th scope="row" colSpan={6} className="border-r border-border-default px-3 py-2 text-right font-semibold">Sub Total (AED)</th><td className="text-right tabular-nums">{taxTotal === null ? "—" : money(taxTotal)}</td><td className="text-right tabular-nums">{grandTotal === null ? "—" : money(grandTotal)}</td><td /></tr>
              <tr className="bg-primary-50/40"><th scope="row" colSpan={7} className="border-r border-border-default px-3 py-2 text-right font-semibold">Total (AED)</th><td className="text-right font-bold tabular-nums">{grandTotal === null ? "—" : money(grandTotal)}</td><td /></tr>
            </tfoot>
          </table>
        </div>
        <p className="text-xs text-text-muted">Tax is calculated on service price × quantity. Grand total includes government charges and tax.</p>
      </section>

    </fieldset>
    {mutation.isError && <p role="alert" className="text-sm text-destructive">{uncertain ? "The result is uncertain. Close this form and check the invoice list before creating another invoice." : errorMessage(mutation.error)}</p>}
    <div className="flex justify-end gap-3"><Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => onClose()}>Cancel</Button><Button type="submit" disabled={mutation.isPending || uncertain || !form.companyId}>{mutation.isPending ? "Creating..." : "Create invoice"}</Button></div>
  </form>;
}
