import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, FileText, Trash2, Upload } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CLIENT_STATUS_OPTIONS,
  CLIENT_TYPE_OPTIONS,
  COMPANY_TYPE_OPTIONS,
  PREFERRED_COMMUNICATION_OPTIONS,
  QUICK_ADD_DEFAULT_VALUES,
  SERVICE_CATEGORIES,
  SERVICE_STATUS_OPTIONS,
} from "@/constants/ClientsPage";
import useCreateClientWithService from "@/hooks/useCreateClientWithService";
import { cn } from "@/lib/utils";
import {
  getServiceDetailSchema,
  quickAddClientSchema,
  quickAddCompanySchema,
  quickAddPaymentSchema,
  quickAddReminderSchema,
  quickAddServiceSchema,
} from "@/validator/ClientsPage";
import { FieldError, FormField, OptionalSectionToggle, TextAreaField } from "./QuickAddFormFields";

const MAX_DOCUMENTS = 10;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

const PAYMENT_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "CHEQUE", label: "Cheque" },
];

const STEP_COPY = {
  client: ["Client", "Add the client's identity and contact details."],
  company: ["Company", "Add the company linked to this client."],
  service: ["Service", "Choose a category to load its mandatory fields."],
  documents: ["Documents", "Upload up to 10 supporting documents."],
  payment: ["Payment", "Optionally record the initial payment."],
  reminder: ["Reminder", "Optionally schedule the first follow-up."],
};

const getNestedError = (errors, path) => path.split(".").reduce((value, key) => value?.[key], errors);

const cleanObject = (value) => {
  if (Array.isArray(value)) return value.map(cleanObject);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .filter(([, child]) => child !== "" && child !== undefined && child !== null)
      .map(([key, child]) => [key, cleanObject(child)]));
  }
  return value;
};

const toIsoDate = (value) => value ? new Date(`${value}T00:00:00.000Z`).toISOString() : value;

function StepProgress({ currentStep, steps }) {
  return (
    <nav aria-label="Quick add progress" className="overflow-x-auto border-b bg-surface-container-low px-5 py-4 sm:px-6">
      <ol className="flex min-w-max items-center gap-2">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <li key={step} aria-current={isCurrent ? "step" : undefined} className="flex items-center gap-2">
              <span className={cn(
                "flex size-7 items-center justify-center rounded-full border text-label-sm font-semibold",
                isComplete && "border-primary bg-primary text-primary-foreground",
                isCurrent && "border-primary bg-primary-fixed text-on-primary-fixed",
                !isComplete && !isCurrent && "border-outline-variant bg-card text-muted-foreground",
              )}>
                {isComplete ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span className={cn("text-body-sm font-medium", isCurrent ? "text-foreground" : "text-muted-foreground")}>{STEP_COPY[step][0]}</span>
              {index < steps.length - 1 && <span className="mx-1 h-px w-5 bg-outline-variant" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function QuickAddServiceDialog({ open, onOpenChange }) {
  const createPackage = useCreateClientWithService();
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [documentError, setDocumentError] = useState("");
  const { control, clearErrors, formState: { errors }, getValues, handleSubmit, reset, setError, setValue } = useForm({
    defaultValues: QUICK_ADD_DEFAULT_VALUES,
  });
  const clientType = useWatch({ control, name: "client.clientType" });
  const category = useWatch({ control, name: "service.category" });
  const paymentEnabled = useWatch({ control, name: "paymentEnabled" });
  const reminderEnabled = useWatch({ control, name: "reminderEnabled" });
  const previousCategory = useRef(category);

  const steps = useMemo(() => ["client", ...(clientType === "COMPANY" ? ["company"] : []), "service", "documents", "payment", "reminder"], [clientType]);
  const stepKey = steps[currentStep] ?? steps[steps.length - 1];
  const selectedService = SERVICE_CATEGORIES.find((service) => service.value === category);

  useEffect(() => {
    if (previousCategory.current !== category) {
      setValue("service.detail", {});
      clearErrors("service.detail");
      previousCategory.current = category;
    }
  }, [category, clearErrors, setValue]);

  const applyValidation = (schema, value, prefix) => {
    clearErrors(prefix);
    const { error } = schema.validate(value, { abortEarly: false, convert: true });
    if (!error) return true;

    error.details.forEach((detail) => {
      const path = [prefix, ...detail.path].filter(Boolean).join(".");
      setError(path, { type: "validation", message: detail.message.replaceAll('"', "") });
    });
    return false;
  };

  const validateStep = (key, values = getValues()) => {
    if (key === "client") return applyValidation(quickAddClientSchema, values.client, "client");
    if (key === "company") return applyValidation(quickAddCompanySchema, values.company, "company");
    if (key === "service") {
      const serviceValid = applyValidation(quickAddServiceSchema, values.service, "service");
      if (!values.service.category) return false;
      const detailValid = applyValidation(getServiceDetailSchema(values.service.category), values.service.detail, "service.detail");
      return serviceValid && detailValid;
    }
    if (key === "documents") return !documentError;
    if (key === "payment") return !values.paymentEnabled || applyValidation(quickAddPaymentSchema, values.payment, "payment");
    if (key === "reminder") return !values.reminderEnabled || applyValidation(quickAddReminderSchema, values.reminder, "reminder");
    return true;
  };

  const handleNext = () => {
    if (!validateStep(stepKey)) return;
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handleDocuments = (event) => {
    const nextFiles = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (documents.length + nextFiles.length > MAX_DOCUMENTS) {
      setDocumentError(`Upload no more than ${MAX_DOCUMENTS} documents.`);
      return;
    }
    const oversized = nextFiles.find((file) => file.size > MAX_DOCUMENT_SIZE);
    if (oversized) {
      setDocumentError(`${oversized.name} is larger than 10 MiB.`);
      return;
    }
    setDocumentError("");
    setDocuments((current) => [...current, ...nextFiles]);
  };

  const handleOpenChange = (nextOpen) => {
    if (nextOpen || createPackage.isPending) return;
    reset(QUICK_ADD_DEFAULT_VALUES);
    setDocuments([]);
    setDocumentError("");
    setCurrentStep(0);
    createPackage.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values) => {
    const firstInvalidStep = steps.findIndex((step) => !validateStep(step, values));
    if (firstInvalidStep !== -1) {
      setCurrentStep(firstInvalidStep);
      return;
    }

    const payload = {
      client: cleanObject(values.client),
      service: cleanObject(values.service),
    };
    if (values.client.clientType === "COMPANY") payload.company = cleanObject(values.company);
    if (values.paymentEnabled) payload.payment = { ...cleanObject(values.payment), paymentDate: toIsoDate(values.payment.paymentDate) };
    if (values.reminderEnabled) payload.reminder = {
      ...cleanObject(values.reminder),
      dueDate: toIsoDate(values.reminder.dueDate),
      followUpsDate: toIsoDate(values.reminder.followUpsDate),
      reminderBefore: Number(values.reminder.reminderBefore),
    };

    try {
      const result = await createPackage.mutateAsync({ payload, documents });
      toast.success(`${values.client.name} and ${selectedService?.label || "service"} were added successfully.`);
      reset(QUICK_ADD_DEFAULT_VALUES);
      setDocuments([]);
      setCurrentStep(0);
      onOpenChange(false);
      return result;
    } catch (error) {
      const apiError = error.response?.data?.error;
      const details = Array.isArray(apiError?.details) ? apiError.details : [];
      details.forEach((detail) => {
        if (detail.field) setError(detail.field, { type: "server", message: detail.issue });
      });
      toast.error(apiError?.message || "We couldn't create the client service package. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] max-w-5xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 px-6 py-5 pr-14">
          <DialogTitle>Quick add client service</DialogTitle>
          <DialogDescription>Create the client, service, and optional follow-up records in one guided flow.</DialogDescription>
        </DialogHeader>

        <StepProgress currentStep={currentStep} steps={steps} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="mb-5">
              <h2 className="font-heading text-body-lg font-semibold text-foreground">{STEP_COPY[stepKey][0]}</h2>
              <p className="mt-1 text-body-sm text-muted-foreground">{STEP_COPY[stepKey][1]}</p>
            </div>

            {stepKey === "client" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={control} error={getNestedError(errors, "client.clientType")} label="Client type" name="client.clientType" options={CLIENT_TYPE_OPTIONS} type="select" />
                <FormField control={control} error={getNestedError(errors, "client.name")} label="Full name" name="client.name" maxLength={200} autoComplete="name" />
                <FormField control={control} error={getNestedError(errors, "client.mobileNumber")} label="Mobile number" name="client.mobileNumber" maxLength={30} autoComplete="tel" placeholder="+971 50 123 4567" />
                <FormField control={control} error={getNestedError(errors, "client.whatsappNumber")} label="WhatsApp number" name="client.whatsappNumber" maxLength={30} autoComplete="tel" placeholder="+971 50 123 4567" />
                <FormField control={control} error={getNestedError(errors, "client.emailAddress")} label="Email address" name="client.emailAddress" type="email" maxLength={254} autoComplete="email" />
                <FormField control={control} error={getNestedError(errors, "client.nationality")} label="Nationality" name="client.nationality" maxLength={120} />
                <FormField control={control} error={getNestedError(errors, "client.passportNumber")} label="Passport number" name="client.passportNumber" maxLength={30} />
                <FormField control={control} error={getNestedError(errors, "client.emiratesIdNumber")} label="Emirates ID number" name="client.emiratesIdNumber" maxLength={30} />
                <FormField control={control} error={getNestedError(errors, "client.preferredCommunicationMethod")} label="Preferred communication" name="client.preferredCommunicationMethod" options={PREFERRED_COMMUNICATION_OPTIONS} type="select" />
                <FormField control={control} error={getNestedError(errors, "client.clientStatus")} label="Client status" name="client.clientStatus" options={CLIENT_STATUS_OPTIONS} type="select" />
                <TextAreaField className="sm:col-span-2" control={control} error={getNestedError(errors, "client.address")} label="Address" name="client.address" maxLength={500} />
                <TextAreaField className="sm:col-span-2" control={control} error={getNestedError(errors, "client.notes")} label="Notes" name="client.notes" maxLength={5000} />
              </div>
            )}

            {stepKey === "company" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={control} error={getNestedError(errors, "company.companyName")} label="Company name" name="company.companyName" maxLength={200} />
                <FormField control={control} error={getNestedError(errors, "company.companyType")} label="Company type" name="company.companyType" options={COMPANY_TYPE_OPTIONS} type="select" />
                <FormField control={control} error={getNestedError(errors, "company.licence.number")} label="Licence number" name="company.licence.number" maxLength={100} />
                <FormField control={control} error={getNestedError(errors, "company.licence.expiryDate")} label="Licence expiry date" name="company.licence.expiryDate" type="date" />
                <FormField control={control} error={getNestedError(errors, "company.licence.activity")} label="Licence activity" name="company.licence.activity" required={false} maxLength={500} />
                <FormField control={control} error={getNestedError(errors, "company.licence.issueDate")} label="Licence issue date" name="company.licence.issueDate" type="date" required={false} />
                <FormField control={control} error={getNestedError(errors, "company.vatTrnNumber")} label="VAT TRN number" name="company.vatTrnNumber" required={false} maxLength={100} />
                <FormField control={control} error={getNestedError(errors, "company.corporateTaxRegistrationNumber")} label="Corporate tax registration number" name="company.corporateTaxRegistrationNumber" required={false} maxLength={100} />
                <FormField control={control} error={getNestedError(errors, "company.companyEmail")} label="Company email" name="company.companyEmail" type="email" required={false} maxLength={254} />
                <FormField control={control} error={getNestedError(errors, "company.companyMobile")} label="Company mobile" name="company.companyMobile" required={false} maxLength={30} />
                <TextAreaField className="sm:col-span-2" control={control} error={getNestedError(errors, "company.address")} label="Company address" name="company.address" maxLength={500} />
              </div>
            )}

            {stepKey === "service" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField className="sm:col-span-2" control={control} error={getNestedError(errors, "service.category")} label="Service category" name="service.category" options={SERVICE_CATEGORIES.map(({ value, label, group }) => ({ value, label: `${group} — ${label}` }))} type="select" />
                <FormField control={control} error={getNestedError(errors, "service.status")} label="Service status" name="service.status" options={SERVICE_STATUS_OPTIONS} type="select" />
                {selectedService && <div className="self-end rounded-lg bg-primary-fixed px-3 py-2 text-body-sm text-on-primary-fixed">{selectedService.fields.length} mandatory service fields</div>}
                {selectedService?.fields.map((field) => (
                  <FormField
                    key={`${category}-${field.name}`}
                    control={control}
                    error={getNestedError(errors, `service.detail.${field.name}`)}
                    label={field.label}
                    name={`service.detail.${field.name}`}
                    type={field.type}
                    options={field.options}
                    min={field.type === "number" ? "0" : undefined}
                    step={field.type === "number" ? "0.01" : undefined}
                    placeholder={field.placeholder}
                  />
                ))}
              </div>
            )}

            {stepKey === "documents" && (
              <div>
                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low px-6 py-8 text-center transition-colors hover:border-primary">
                  <Upload className="size-7 text-primary" aria-hidden="true" />
                  <span className="mt-3 text-body-md font-semibold text-foreground">Choose documents</span>
                  <span className="mt-1 text-body-sm text-muted-foreground">Up to 10 files, maximum 10 MiB each</span>
                  <input type="file" multiple onChange={handleDocuments} className="sr-only" />
                </label>
                <FieldError id="documents-error" message={documentError} />
                {documents.length > 0 && (
                  <ul className="mt-4 space-y-2" aria-label="Selected documents">
                    {documents.map((document, index) => (
                      <li key={`${document.name}-${document.lastModified}-${index}`} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                        <FileText className="size-4 shrink-0 text-primary" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate text-body-sm text-foreground">{document.name}</span>
                        <span className="text-xs text-muted-foreground">{(document.size / 1024 / 1024).toFixed(1)} MiB</span>
                        <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ${document.name}`} onClick={() => setDocuments((current) => current.filter((_, fileIndex) => fileIndex !== index))}>
                          <Trash2 />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {stepKey === "payment" && (
              <div className="space-y-5">
                <OptionalSectionToggle checked={paymentEnabled} label="Add payment details" description="Enable this when a payment was collected or is already scheduled." onChange={(checked) => setValue("paymentEnabled", checked)} />
                {paymentEnabled && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={control} error={getNestedError(errors, "payment.governmentFee")} label="Government fee" name="payment.governmentFee" type="number" min="0" step="0.01" />
                    <FormField control={control} error={getNestedError(errors, "payment.serviceFee")} label="Service fee" name="payment.serviceFee" type="number" min="0" step="0.01" />
                    <FormField control={control} error={getNestedError(errors, "payment.totalAmount")} label="Total amount" name="payment.totalAmount" type="number" min="0" step="0.01" />
                    <FormField control={control} error={getNestedError(errors, "payment.amountReceived")} label="Amount received" name="payment.amountReceived" type="number" min="0" step="0.01" />
                    <FormField control={control} error={getNestedError(errors, "payment.paymentMethod")} label="Payment method" name="payment.paymentMethod" options={PAYMENT_METHOD_OPTIONS} type="select" />
                    <FormField control={control} error={getNestedError(errors, "payment.paymentDate")} label="Payment date" name="payment.paymentDate" type="date" />
                    <FormField control={control} error={getNestedError(errors, "payment.paymentStatus")} label="Payment status" name="payment.paymentStatus" options={PAYMENT_STATUS_OPTIONS} type="select" />
                  </div>
                )}
              </div>
            )}

            {stepKey === "reminder" && (
              <div className="space-y-5">
                <OptionalSectionToggle checked={reminderEnabled} label="Add a reminder" description="Enable this to create a due date and follow-up schedule." onChange={(checked) => setValue("reminderEnabled", checked)} />
                {reminderEnabled && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField control={control} error={getNestedError(errors, "reminder.dueDate")} label="Due date" name="reminder.dueDate" type="date" />
                    <FormField control={control} error={getNestedError(errors, "reminder.reminderBefore")} label="Remind before (days)" name="reminder.reminderBefore" type="number" min="0" step="1" />
                    <FormField control={control} error={getNestedError(errors, "reminder.followUpsDate")} label="Follow-up date" name="reminder.followUpsDate" type="date" />
                    <TextAreaField className="sm:col-span-2" control={control} error={getNestedError(errors, "reminder.notes")} label="Reminder notes" name="reminder.notes" maxLength={5000} />
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t bg-surface-container-low px-5 py-4 sm:px-6">
            <Button type="button" variant="outline" disabled={createPackage.isPending} onClick={() => handleOpenChange(false)}>Cancel</Button>
            {currentStep > 0 && (
              <Button type="button" variant="outline" disabled={createPackage.isPending} onClick={() => setCurrentStep((step) => step - 1)}>
                <ChevronLeft data-icon="inline-start" /> Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Continue <ChevronRight data-icon="inline-end" />
              </Button>
            ) : (
              <Button type="submit" disabled={createPackage.isPending}>
                {createPackage.isPending ? "Creating package…" : "Create client service"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
