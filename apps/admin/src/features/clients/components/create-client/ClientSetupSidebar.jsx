import { Check } from "lucide-react";
import { CLIENT_SETUP_STEPS } from "@/features/clients/constants/client";
import { cn } from "@operio/ui/lib/utils";

export default function ClientSetupSidebar({ currentStep, completedSteps, onStepSelect, visibleSteps }) {
  return (
    <aside className="h-fit w-full rounded-xl border border-border-default bg-surface-secondary/50 p-4 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:max-h-[calc(100svh-var(--header-height)-2rem)] lg:overflow-y-auto lg:w-52 lg:shrink-0">
      <h2 className="mb-3 text-xs font-medium text-text-secondary">Setup progress</h2>
      <nav aria-label="Client setup steps">
        <ol className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:block">
          {visibleSteps.map((step, index) => {
            const active = step === currentStep;
            const complete = completedSteps.includes(step) && !active;
            return (
              <li key={step} className="relative pb-4 last:pb-0">
                {index < visibleSteps.length - 1 && <span aria-hidden="true" className={cn("absolute top-7 bottom-1 left-3 hidden w-px bg-border-default lg:block", complete && "bg-primary/40")} />}
                <button type="button" disabled={!active && !complete} onClick={() => onStepSelect(step)} aria-current={active ? "step" : undefined} className="relative flex min-h-7 w-full items-center gap-3 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default">
                  <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full border border-text-muted bg-surface-primary text-xs text-text-secondary", active && "border-primary bg-primary text-primary-foreground", complete && "border-primary bg-primary/10 text-primary")}>
                    {complete ? <Check aria-hidden="true" className="size-3" /> : index + 1}
                  </span>
                  <span className={cn("text-xs font-medium text-text-secondary", active && "font-semibold text-text-primary")}>{CLIENT_SETUP_STEPS[step - 1].title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
