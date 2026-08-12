import { joiResolver } from "@hookform/resolvers/joi";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COMPANY_FORM_STEPS,
  COMPANY_STATUS_OPTIONS,
  COMPANY_TYPE_OPTIONS,
  CREATE_COMPANY_DEFAULT_VALUES,
} from "@/constants/ClientCompaniesPage";
import useCreateCompany from "@/hooks/useCreateCompany";
import { cn } from "@/lib/utils";
import { createCompanySchema } from "@/validator/ClientCompaniesPage";

function FieldError({ id, message }) {
  if (!message) return null;
  return <p id={id} role="alert" className="mt-1 text-xs text-destructive">{message}</p>;
}

function TextField({ error, label, name, register, required = false, ...props }) {
  const errorId = `${name.replaceAll(".", "-")}-error`;

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-body-sm font-medium text-foreground">
        {label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
      </label>
      <Input
        id={name}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...register(name)}
        {...props}
      />
      <FieldError id={errorId} message={error?.message} />
    </div>
  );
}

function TextAreaField({ error, label, name, register, rows = 3, ...props }) {
  const errorId = `${name.replaceAll(".", "-")}-error`;

  return (
    <div className="sm:col-span-2">
      <label htmlFor={name} className="mb-1.5 block text-body-sm font-medium text-foreground">{label}</label>
      <textarea
        id={name}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
        {...register(name)}
        {...props}
      />
      <FieldError id={errorId} message={error?.message} />
    </div>
  );
}

function SelectField({ control, error, label, name, options, placeholder, required = false }) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-body-sm font-medium text-foreground">
        {label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select items={options} value={field.value || null} onValueChange={field.onChange}>
            <SelectTrigger
              id={name}
              aria-required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              className="h-8! w-full"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      <FieldError id={errorId} message={error?.message} />
    </div>
  );
}

function StepIndicator({ currentStep }) {
  return (
    <ol className="grid grid-cols-4 gap-2 px-6 py-4" aria-label="Company form progress">
      {COMPANY_FORM_STEPS.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <li key={step.title} aria-current={isCurrent ? "step" : undefined}>
            <div className={cn("mb-2 h-1 rounded-full", index <= currentStep ? "bg-primary" : "bg-surface-container-highest")} />
            <div className="flex items-start gap-2">
              <span className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-label-sm font-semibold",
                index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {isComplete ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span className={cn("hidden pt-0.5 text-label-sm font-medium sm:block", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                {step.title}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const prunePayload = (values) => {
  const prune = (value) => {
    if (Array.isArray(value)) return value.map(prune).filter((item) => item !== undefined);
    if (value && typeof value === "object" && !(value instanceof Date)) {
      const entries = Object.entries(value)
        .map(([key, item]) => [key, prune(item)])
        .filter(([, item]) => item !== undefined);
      return entries.length ? Object.fromEntries(entries) : undefined;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed || undefined;
    }
    return value;
  };

  const payload = prune(values);
  if (payload?.notes) payload.notes = [payload.notes];
  if (payload?.iban) payload.iban = payload.iban.toUpperCase();
  return payload;
};

const getNestedError = (errors, name) => name.split(".").reduce((value, part) => value?.[part], errors);

export function AddCompanyDialog({ clientDatabaseId, open, onOpenChange }) {
  const [currentStep, setCurrentStep] = useState(0);
  const createCompany = useCreateCompany(clientDatabaseId);
  const initialClientReference = clientDatabaseId || "";
  const {
    control,
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    trigger,
  } = useForm({
    defaultValues: { ...CREATE_COMPANY_DEFAULT_VALUES, client: initialClientReference },
    resolver: joiResolver(createCompanySchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) reset({ ...CREATE_COMPANY_DEFAULT_VALUES, client: initialClientReference });
  }, [initialClientReference, open, reset]);

  const resetDialog = () => {
    setCurrentStep(0);
    reset({ ...CREATE_COMPANY_DEFAULT_VALUES, client: initialClientReference });
    createCompany.reset();
  };

  const handleOpenChange = (nextOpen) => {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }
    if (createCompany.isPending) return;
    resetDialog();
    onOpenChange(false);
  };

  const goNext = async () => {
    const isValid = await trigger(COMPANY_FORM_STEPS[currentStep].fields, { shouldFocus: true });
    if (isValid) setCurrentStep((step) => Math.min(step + 1, COMPANY_FORM_STEPS.length - 1));
  };

  const clearStep = (stepIndex) => {
    COMPANY_FORM_STEPS[stepIndex].fields.forEach((field) => {
      setValue(field, "", { shouldDirty: true });
    });
    clearErrors(COMPANY_FORM_STEPS[stepIndex].fields);
  };

  const skipStep = () => {
    clearStep(currentStep);
    setCurrentStep((step) => Math.min(step + 1, COMPANY_FORM_STEPS.length - 1));
  };

  const onSubmit = async (values) => {
    try {
      const company = await createCompany.mutateAsync(prunePayload(values));
      toast.success(`${company?.companyName || values.companyName} was added successfully.`);
      resetDialog();
      onOpenChange(false);
    } catch (error) {
      const apiError = error.response?.data?.error;
      const details = Array.isArray(apiError?.details) ? apiError.details : [];
      let firstErrorStep = COMPANY_FORM_STEPS.length - 1;

      details.forEach((detail) => {
        const field = detail.field?.replace(/\[(\d+)\]/g, ".$1");
        const stepIndex = COMPANY_FORM_STEPS.findIndex((step) => step.fields.includes(field));
        if (field && stepIndex >= 0) {
          setError(field, { type: "server", message: detail.issue });
          firstErrorStep = Math.min(firstErrorStep, stepIndex);
        }
      });

      if (details.length) setCurrentStep(firstErrorStep);
      toast.error(apiError?.message || "We couldn't add the company. Please try again.");
    }
  };

  const skipFinalStep = () => {
    clearStep(currentStep);
    handleSubmit(onSubmit)();
  };

  const step = COMPANY_FORM_STEPS[currentStep];
  const isLastStep = currentStep === COMPANY_FORM_STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>Add company</DialogTitle>
          <DialogDescription>Create a company profile for this client in four short steps.</DialogDescription>
        </DialogHeader>

        <StepIndicator currentStep={currentStep} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex max-h-[calc(100vh-13.5rem)] flex-col">
          <section className="overflow-y-auto px-6 py-5" aria-labelledby="company-step-title">
            <div className="mb-5">
              <p className="text-label-sm font-semibold tracking-[0.05em] text-primary uppercase">Step {currentStep + 1} of 4</p>
              <h2 id="company-step-title" className="mt-1 font-heading text-body-lg font-semibold text-foreground">{step.title}</h2>
              <p className="mt-1 text-body-sm text-muted-foreground">{step.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
              {currentStep === 0 && (
                <>
                  <input type="hidden" {...register("client")} />
                  <TextField label="Company name" name="companyName" required error={errors.companyName} register={register} maxLength={200} autoComplete="organization" />
                  <TextField label="Trade name" name="tradeName" error={errors.tradeName} register={register} maxLength={200} />
                  <TextField label="Legal name" name="legalName" error={errors.legalName} register={register} maxLength={200} />
                  <SelectField control={control} error={errors.companyType} label="Company type" name="companyType" options={COMPANY_TYPE_OPTIONS} placeholder="Select company type" required />
                  <TextField label="Free zone name" name="freeZoneName" error={errors.freeZoneName} register={register} maxLength={200} />
                </>
              )}

              {currentStep === 1 && (
                <>
                  <TextField label="Licence number" name="licence.number" error={errors.licence?.number} register={register} maxLength={100} />
                  <TextField label="Licence activity" name="licence.activity" error={errors.licence?.activity} register={register} maxLength={500} />
                  <TextField label="Licence issue date" name="licence.issueDate" error={errors.licence?.issueDate} register={register} type="date" />
                  <TextField label="Licence expiry date" name="licence.expiryDate" error={errors.licence?.expiryDate} register={register} type="date" />
                  <TextField label="Establishment card number" name="establishment.cardNumber" error={errors.establishment?.cardNumber} register={register} maxLength={100} />
                  <TextField label="Establishment card expiry" name="establishment.cardExpiryDate" error={errors.establishment?.cardExpiryDate} register={register} type="date" />
                  <TextField label="VAT TRN number" name="vatTrnNumber" error={errors.vatTrnNumber} register={register} maxLength={100} />
                  <TextField label="Corporate tax registration" name="corporateTaxRegistrationNumber" error={errors.corporateTaxRegistrationNumber} register={register} maxLength={100} />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <TextField label="Company email" name="companyEmail" error={errors.companyEmail} register={register} type="email" maxLength={254} autoComplete="email" placeholder="info@example.com" />
                  <TextField label="Company mobile" name="companyMobile" error={errors.companyMobile} register={register} maxLength={30} autoComplete="tel" placeholder="+971 50 123 4567" />
                  <TextAreaField label="Address" name="address" error={errors.address} register={register} maxLength={500} rows={3} />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <TextField label="Bank name" name="bankName" error={errors.bankName} register={register} maxLength={200} />
                  <TextField label="Account name" name="accountName" error={errors.accountName} register={register} maxLength={200} />
                  <TextField label="IBAN" name="iban" error={errors.iban} register={register} maxLength={34} placeholder="AE07..." />
                  <TextField label="Account number" name="accountNumber" error={errors.accountNumber} register={register} maxLength={100} />
                  <SelectField control={control} error={errors.companyStatus} label="Company status" name="companyStatus" options={COMPANY_STATUS_OPTIONS} />
                  <div />
                  <TextAreaField label="Notes" name="notes" error={getNestedError(errors, "notes")} register={register} maxLength={5000} placeholder="Add internal notes about this company" />
                </>
              )}
            </div>
          </section>

          <DialogFooter className="mt-auto border-t bg-surface-container-low px-6 py-4 sm:justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={createCompany.isPending} onClick={() => handleOpenChange(false)}>Cancel</Button>
              {currentStep > 0 && (
                <Button type="button" variant="ghost" disabled={createCompany.isPending} onClick={() => setCurrentStep((value) => value - 1)}>
                  <ChevronLeft data-icon="inline-start" />Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {step.optional && !isLastStep && (
                <Button type="button" variant="ghost" disabled={createCompany.isPending} onClick={skipStep}>Skip</Button>
              )}
              {step.optional && isLastStep && (
                <Button type="button" variant="ghost" disabled={createCompany.isPending} onClick={skipFinalStep}>Skip & add</Button>
              )}
              {!isLastStep ? (
                <Button type="button" onClick={goNext}>
                  Continue<ChevronRight data-icon="inline-end" />
                </Button>
              ) : (
                <Button type="submit" disabled={createCompany.isPending}>
                  {createCompany.isPending ? "Adding company…" : "Add company"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
