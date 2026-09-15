import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { ArrowLeft, ArrowRight, Check, UserPlus, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import useCreateClient from "@/features/clients/hooks/useCreateClient";
import { buildClientCreationRequest, createClientDefaultValues } from "@/features/clients/utils/clientCreation";
import { CLIENT_STEP_FIELDS, clientCreationSchema } from "@/features/clients/schemas/client.schema";
import ClientSetupSidebar from "../components/create-client/ClientSetupSidebar";
import {
  ClientDetailsStep, CompanyStep, DocumentsStep, DriversStep, PaymentStep,
  PersonnelStep, ReminderStep, ReviewStep, ServicesStep, VehiclesStep,
} from "../components/create-client/ClientSetupSteps";

const FIELD_STEP_PREFIXES = [
  ["client", 1], ["company", 2], ["members", 3], ["vehicles", 4], ["drivers", 5],
  ["services", 6], ["documents", 7], ["payments", 8], ["reminders", 9],
];
const CLIENT_STEP_COMPONENTS = [ClientDetailsStep, CompanyStep, PersonnelStep, VehiclesStep, DriversStep, ServicesStep, DocumentsStep, PaymentStep, ReminderStep, ReviewStep];

const normalizeServerPath = (path = "") => path.replace(/^payload\./, "").replace(/\[(\d+)\]/g, ".$1");
const getStepForField = (path) => FIELD_STEP_PREFIXES.find(([prefix]) => path === prefix || path.startsWith(`${prefix}.`))?.[1] || 1;

export default function AddNewClientPage() {
  const navigate = useNavigate();
  const mutation = useCreateClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const methods = useForm({
    resolver: joiResolver(clientCreationSchema, { abortEarly: false }),
    defaultValues: useMemo(() => createClientDefaultValues(), []),
    mode: "onSubmit",
    shouldUnregister: false,
  });
  const Step = CLIENT_STEP_COMPONENTS[currentStep - 1];

  const goNext = async () => {
    const valid = await methods.trigger(CLIENT_STEP_FIELDS[currentStep] || [], { shouldFocus: true });
    if (!valid) return;
    setCompletedSteps((steps) => steps.includes(currentStep) ? steps : [...steps, currentStep]);
    setCurrentStep((step) => Math.min(10, step + 1));
  };

  const submit = methods.handleSubmit(async (values) => {
    try {
      const result = await mutation.mutateAsync(buildClientCreationRequest(values));
      toast.success("Client created successfully.");
      const clientId = result?.client?.id || result?.id;
      navigate(clientId ? `/clients/${clientId}` : "/clients", { replace: true });
    } catch (error) {
      const response = error?.response?.data;
      const details = response?.error?.details || response?.details || [];
      let firstErrorStep;
      details.forEach((detail) => {
        const path = normalizeServerPath(detail.field || detail.path);
        if (!path) return;
        methods.setError(path, { type: "server", message: detail.issue || detail.message || "This value was rejected." });
        firstErrorStep ??= getStepForField(path);
      });
      if (firstErrorStep) setCurrentStep(firstErrorStep);
      toast.error(response?.message || response?.error?.message || "Unable to create the client. Please review the form and try again.");
    }
  }, (errors) => {
    setCurrentStep(getStepForField(Object.keys(errors)[0]));
    toast.error("Please review the highlighted fields.");
  });

  return (
    <main className="min-h-[calc(100svh-var(--header-height))] bg-app-background px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <UserPlus aria-hidden="true" className="size-6 shrink-0 text-primary" strokeWidth={2} />
              <h1 className="text-section-heading font-bold tracking-tight text-text-primary">Add a new client</h1>
            </div>
            <p className="mt-1 text-body-md text-text-secondary">Complete the guided setup to create a detailed client record.</p>
          </div>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/clients")} className="h-9 px-4">
            <X className="size-4 sm:hidden" /><span className="hidden sm:inline">Close</span>
          </Button>
        </header>
        <FormProvider {...methods}>
          <form onSubmit={submit} noValidate className="flex min-h-[calc(100vh-12rem)] flex-col overflow-hidden rounded-xl border border-border-default bg-surface-primary shadow-card lg:flex-row">
            <ClientSetupSidebar currentStep={currentStep} completedSteps={completedSteps} onStepSelect={setCurrentStep} />
            <div className="flex min-w-0 flex-1 flex-col">
              <section className="flex-1 overflow-y-auto p-4 sm:p-5"><Step /></section>
              <footer className="flex items-center justify-between border-t border-border-default bg-surface-secondary/40 px-4 py-3 sm:px-5">
                <Button type="button" variant="outline" size="lg" onClick={() => setCurrentStep((step) => Math.max(1, step - 1))} disabled={currentStep === 1 || mutation.isPending} className="h-9 px-4"><ArrowLeft className="size-4" /> Back</Button>
                {currentStep < 10 ? <Button type="button" size="lg" onClick={goNext} className="h-9 px-4 font-semibold shadow-md">Save & continue <ArrowRight className="size-4" /></Button> : <Button type="submit" size="lg" disabled={mutation.isPending} className="h-9 px-4 font-semibold shadow-md">{mutation.isPending ? "Creating client..." : <>Complete setup <Check className="size-4" /></>}</Button>}
              </footer>
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
