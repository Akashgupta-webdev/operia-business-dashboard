import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneClasses = {
  primary: {
    card: "border-border",
    icon: "bg-accent text-primary",
    value: "text-primary",
    helper: "text-muted-foreground",
  },
  warning: {
    card: "border-warning/25",
    icon: "bg-warning-container text-warning-container-foreground",
    value: "text-warning",
    helper: "text-warning-container-foreground",
  },
  destructive: {
    card: "border-destructive/25",
    icon: "bg-destructive-container text-destructive-container-foreground",
    value: "text-destructive",
    helper: "text-destructive",
  },
  success: {
    card: "border-success/25",
    icon: "bg-success-container text-success-container-foreground",
    value: "text-success",
    helper: "text-success-container-foreground",
  },
};

export function MetricCards({ metrics }) {
  return (
    <section aria-label="Business metrics" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const tone = toneClasses[metric.tone] || toneClasses.primary;

        return (
          <Card
            key={metric.label}
            className={cn(
              "gap-2 rounded-xl border bg-card px-4 py-3 shadow-card ring-0",
              tone.card
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("flex size-7 items-center justify-center rounded-lg", tone.icon)}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="truncate text-label-sm font-semibold tracking-[0.05em] text-muted-foreground uppercase">
                {metric.label}
              </span>
            </div>
            <div>
              <p className={cn("text-xl font-bold leading-6 tabular-nums", tone.value)}>
                {metric.value}
              </p>
              <p className={cn("mt-0.5 truncate text-[10px] leading-4", tone.helper)}>
                {metric.helper}
              </p>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
