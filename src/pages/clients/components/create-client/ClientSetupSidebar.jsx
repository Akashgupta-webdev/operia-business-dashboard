import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CLIENT_SETUP_STEPS } from "@/constants/client";
import { cn } from "@/lib/utils";

export default function ClientSetupSidebar({ currentStep, completedSteps, onStepSelect }) {
  const progress = currentStep === 10 ? 100 : Math.round(((currentStep - 1) / 9) * 100);

  return (
    <aside className="border-b border-border-default bg-surface-secondary/40 p-4 lg:w-52 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-body-sm font-semibold text-text-secondary">
          <span>Setup progress</span><span>{progress}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-border-default">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <nav aria-label="Client setup steps" className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:flex lg:flex-col lg:gap-1.5">
        {CLIENT_SETUP_STEPS.map((step, index) => {
          const number = index + 1;
          const complete = completedSteps.includes(number) && number !== currentStep;
          const active = number === currentStep;
          const enabled = active || complete;
          return (
            <Button key={step.title} type="button" variant="ghost" disabled={!enabled} onClick={() => onStepSelect(number)}
              aria-current={active ? "step" : undefined}
              className={cn("h-auto w-full justify-start gap-2 rounded-lg px-1.5 py-2 text-left whitespace-normal transition-colors", active && "bg-accent hover:bg-accent", enabled && !active && "hover:bg-surface-secondary", !enabled && "cursor-default opacity-100")}>
              <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-md border border-border-default bg-surface-primary text-caption font-semibold text-text-secondary", active && "border-primary bg-primary text-primary-foreground", complete && "border-success/25 bg-success-container text-success")}>{complete ? <Check className="size-3.5" /> : number}</span>
              <span className="min-w-0">
                <span className={cn("block truncate text-body-sm font-semibold text-text-primary", active && "text-accent-foreground")}>{step.title}</span>
                <span className="hidden truncate text-caption text-text-muted lg:block">{step.description}</span>
              </span>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
