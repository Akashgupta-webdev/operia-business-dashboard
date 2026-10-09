import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Banknote,
  CalendarDays,
  FileText,
  Grid2X2,
  LoaderCircle,
  NotebookPen,
  Receipt,
  Save,
  Tag,
  UserRound,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@operio/ui/components/dialog";
import { Input } from "@operio/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@operio/ui/components/select";
import { Textarea } from "@operio/ui/components/textarea";
import { EXPENSE_CATEGORIES, EXPENSE_PAYMENT_METHODS } from "@/features/finance/constants/finance";
import useCreateExpense from "@/features/finance/hooks/useCreateExpense";
import { expenseCreateSchema } from "@/features/finance/schemas/finance.schema";

function localDateValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultValues() {
  return {
    expenseTitle: "",
    expenseCategory: EXPENSE_CATEGORIES[0],
    expenseAmount: "",
    expenseDate: localDateValue(),
    paymentMethod: EXPENSE_PAYMENT_METHODS[0],
    vendorName: "",
    receiptReference: "",
    notes: "",
  };
}

function FieldError({ error }) {
  return error ? <p role="alert" className="mt-1 text-[10px] leading-4 text-danger-600">{error.message}</p> : null;
}

function FieldLabel({ children, htmlFor, required = false }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium text-text-primary">
      {children}{required && <span className="ml-1 text-danger-600" aria-hidden="true">*</span>}
    </label>
  );
}

function InputShell({ children, icon: Icon }) {
  return (
    <div className="relative mt-1">
      <Icon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-3.5 -translate-y-1/2 text-text-muted" />
      {children}
    </div>
  );
}

function cleanPayload(values) {
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
      .filter(([, value]) => value !== ""),
  );
}

const normalizeServerPath = (path = "") => (Array.isArray(path) ? path.join(".") : path)
  .replace(/^(body|payload|expense)\./, "");

export default function RecordExpenseDialog({ open, onOpenChange }) {
  const mutation = useCreateExpense();
  const { control, formState: { errors }, handleSubmit, register, reset, setError } = useForm({
    resolver: joiResolver(expenseCreateSchema, { abortEarly: false }),
    defaultValues: defaultValues(),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) reset(defaultValues());
  }, [open, reset]);

  const handleOpenChange = (nextOpen) => {
    if (!mutation.isPending) onOpenChange(nextOpen);
  };

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(cleanPayload(values));
      toast.success("Expense voucher recorded successfully.");
      onOpenChange(false);
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];
      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (path) setError(path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
      });
      toast.error(response?.error?.message || response?.message || "Unable to record the expense. Please review the form and try again.");
    }
  }, () => toast.error("Please review the highlighted expense fields."));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border-default px-4 py-3 pr-12">
          <div className="flex items-start gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
              <Receipt aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base leading-5 font-semibold text-text-primary">Record New Operating Expense Voucher</DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-4 text-text-secondary">Add the expense details to record a new operating expense voucher.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            <div>
              <FieldLabel htmlFor="expense-title" required>Expense Title / Purpose</FieldLabel>
              <InputShell icon={FileText}>
                <Input id="expense-title" placeholder="e.g. DED Initial Approval Fee, Amer Typing Voucher" aria-required="true" aria-invalid={Boolean(errors.expenseTitle)} className="h-9 min-h-9! pl-8 text-[13px] placeholder:text-[13px] md:text-[13px]" {...register("expenseTitle")} />
              </InputShell>
              <FieldError error={errors.expenseTitle} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="expense-category" required>Expense Category</FieldLabel>
                <Controller name="expenseCategory" control={control} render={({ field }) => (
                  <InputShell icon={Grid2X2}>
                    <Select value={field.value || null} onValueChange={field.onChange}>
                      <SelectTrigger id="expense-category" aria-required="true" aria-invalid={Boolean(errors.expenseCategory)} className="h-9 w-full pl-8 text-[13px]"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>{EXPENSE_CATEGORIES.map((category) => <SelectItem className="text-[13px]" key={category} value={category}>{category}</SelectItem>)}</SelectContent>
                    </Select>
                  </InputShell>
                )} />
                <FieldError error={errors.expenseCategory} />
              </div>
              <div>
                <FieldLabel htmlFor="expense-amount" required>Amount (AED)</FieldLabel>
                <InputShell icon={Banknote}>
                  <Input id="expense-amount" type="text" inputMode="decimal" placeholder="0.00" aria-required="true" aria-invalid={Boolean(errors.expenseAmount)} className="h-9 min-h-9! pl-8 text-[13px] placeholder:text-[13px] md:text-[13px] tabular-nums" {...register("expenseAmount")} />
                </InputShell>
                <FieldError error={errors.expenseAmount} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="expense-date">Expense Date</FieldLabel>
                <InputShell icon={CalendarDays}>
                  <Input id="expense-date" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" maxLength={10} aria-describedby="expense-date-format" aria-invalid={Boolean(errors.expenseDate)} className="h-9 min-h-9! pl-8 text-[13px] placeholder:text-[13px] md:text-[13px] tabular-nums" {...register("expenseDate")} />
                </InputShell>
                <p id="expense-date-format" className="mt-1 text-[10px] leading-4 text-text-muted">Format: YYYY-MM-DD</p>
                <FieldError error={errors.expenseDate} />
              </div>
              <div>
                <FieldLabel htmlFor="payment-method">Payment Method</FieldLabel>
                <Controller name="paymentMethod" control={control} render={({ field }) => (
                  <InputShell icon={Receipt}>
                    <Select value={field.value || null} onValueChange={field.onChange}>
                      <SelectTrigger id="payment-method" aria-invalid={Boolean(errors.paymentMethod)} className="h-9 w-full pl-8 text-[13px]"><SelectValue placeholder="Select payment method" /></SelectTrigger>
                      <SelectContent>{EXPENSE_PAYMENT_METHODS.map((method) => <SelectItem className="text-[13px]" key={method} value={method}>{method}</SelectItem>)}</SelectContent>
                    </Select>
                  </InputShell>
                )} />
                <FieldError error={errors.paymentMethod} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="vendor-name">Vendor / Authority Name</FieldLabel>
                <InputShell icon={UserRound}>
                  <Input id="vendor-name" placeholder="e.g. Dubai Economy, MOHRE, Amer" aria-invalid={Boolean(errors.vendorName)} className="h-9 min-h-9! pl-8 text-[13px] placeholder:text-[13px] md:text-[13px]" {...register("vendorName")} />
                </InputShell>
                <FieldError error={errors.vendorName} />
              </div>
              <div>
                <FieldLabel htmlFor="receipt-reference">Receipt / Transaction Ref</FieldLabel>
                <InputShell icon={Tag}>
                  <Input id="receipt-reference" placeholder="e.g. REC-98234" aria-invalid={Boolean(errors.receiptReference)} className="h-9 min-h-9! pl-8 text-[13px] placeholder:text-[13px] md:text-[13px]" {...register("receiptReference")} />
                </InputShell>
                <FieldError error={errors.receiptReference} />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="expense-notes">Additional Notes (Optional)</FieldLabel>
              <div className="relative mt-1">
                <NotebookPen aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 size-3.5 text-text-muted" />
                <Textarea id="expense-notes" rows={2} maxLength={2000} placeholder="Optional details or linked client reference..." aria-invalid={Boolean(errors.notes)} className="min-h-16! resize-y pl-8 text-[13px] placeholder:text-[13px] md:text-[13px]" {...register("notes")} />
              </div>
              <FieldError error={errors.notes} />
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border-default bg-surface-primary px-4 py-3">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending} className="h-8 px-3 text-xs">Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="h-8 gap-1.5 px-3 text-xs font-medium">
              {mutation.isPending ? <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" /> : <Save aria-hidden="true" className="size-3.5" />}
              {mutation.isPending ? "Saving Expense..." : "Save Expense Voucher"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
