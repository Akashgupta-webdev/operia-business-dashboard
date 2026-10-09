import { CLIENT_SETUP_STEPS } from "@/features/clients/constants/client";
import { useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { ArrowLeft, ArrowRight, Check, UserPlus, X } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@operio/ui/components/button";
import useCreateClient from "@/features/clients/hooks/useCreateClient";
import { buildClientCreationRequest, createClientDefaultValues } from "@/features/clients/utils/clientCreation";
import { CLIENT_STEP_FIELDS, clientCreationSchema } from "@/features/clients/schemas/client.schema";
import ClientSetupSidebar from "../components/create-client/ClientSetupSidebar";
import {
  ClientDetailsStep, CompanyStep, DocumentsStep, PaymentStep,
  PersonnelStep, ReminderStep, ReviewStep, ServicesStep, VehiclesAndDriversStep,
} from "../components/create-client/ClientSetupSteps";

const FIELD_STEP_PREFIXES = [
  ["client", 1], ["company", 2], ["members", 3], ["vehicles", 4], ["drivers", 4],
  ["services", 6], ["documents", 7], ["payments", 8], ["reminders", 9],
];
const CLIENT_STEP_COMPONENTS = [ClientDetailsStep, CompanyStep, PersonnelStep, VehiclesAndDriversStep, null, ServicesStep, DocumentsStep, PaymentStep, ReminderStep, ReviewStep];

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
  const clientType = useWatch({ control: methods.control, name: "client.clientType" });
  const visibleSteps = CLIENT_STEP_COMPONENTS.map((_, index) => index + 1).filter((step) => step !== 5 && (step !== 2 || clientType === "COMPANY"));
  const stepIndex = visibleSteps.indexOf(currentStep);
  const Step = CLIENT_STEP_COMPONENTS[currentStep - 1];

  const goNext = async () => {
    const valid = await methods.trigger(CLIENT_STEP_FIELDS[currentStep] || [], { shouldFocus: true });
    if (!valid) return;
    setCompletedSteps((steps) => steps.includes(currentStep) ? steps : [...steps, currentStep]);
    setCurrentStep(visibleSteps[Math.min(visibleSteps.length - 1, stepIndex + 1)]);
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
    <main className="min-h-[calc(100svh-var(--header-height))] bg-app-background px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <UserPlus aria-hidden="true" className="size-5 shrink-0 text-primary" strokeWidth={2} />
              <h1 className="text-xl font-semibold tracking-tight text-text-primary">Add {CLIENT_SETUP_STEPS[currentStep - 1].title}</h1>
            </div>
          </div>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate("/clients")} className="h-9 px-4">
            <X className="size-4 sm:hidden" /><span className="hidden sm:inline">Close</span>
          </Button>
        </header>
        <FormProvider {...methods}>
          <div className="flex flex-col items-start gap-3 lg:flex-row">
            <ClientSetupSidebar visibleSteps={visibleSteps} currentStep={currentStep} completedSteps={completedSteps} onStepSelect={setCurrentStep} />
            <form onSubmit={submit} noValidate className="flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-default bg-surface-primary shadow-card">
              <section className="flex-1 p-3 sm:p-4"><Step /></section>
              <footer className="flex items-center justify-between border-t border-border-default bg-surface-secondary/40 px-3 py-2 sm:px-4">
                <Button type="button" variant="outline" size="lg" onClick={() => setCurrentStep(visibleSteps[Math.max(0, stepIndex - 1)])} disabled={currentStep === 1 || mutation.isPending} className="h-9 px-4"><ArrowLeft className="size-4" /> Back</Button>
                {currentStep < 10 ? <Button type="button" size="lg" onClick={goNext} className="h-9 px-4 font-semibold shadow-md">Save & continue <ArrowRight className="size-4" /></Button> : <Button type="submit" size="lg" disabled={mutation.isPending} className="h-9 px-4 font-semibold shadow-md">{mutation.isPending ? "Creating client..." : <>Complete setup <Check className="size-4" /></>}</Button>}
              </footer>
            </form>
          </div>
        </FormProvider>
      </div>
    </main>
  );
}
