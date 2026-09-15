import { Card } from "@operio/ui/components/card";
import { cn } from "@operio/ui/lib/utils";

export default function SummaryCard({ icon: Icon, label, value, description, tone }) {
  const tones = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300",
    success: "bg-success-50 text-success-600 dark:bg-success-700/20 dark:text-success-500",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-500",
    danger: "bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-500",
  };
  return <Card size="sm" className="flex-row items-center gap-3 border border-border-default bg-surface-primary p-3 shadow-card ring-0"><span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", tones[tone])}><Icon aria-hidden="true" className="size-4" /></span><div className="min-w-0"><p className="text-[10px] leading-4 font-semibold text-text-muted">{label}</p><p className="truncate text-[9px] leading-4 text-text-muted">{description}</p></div><p className="ml-auto text-body-sm font-bold text-text-primary" data-numeric>{value}</p></Card>;
}

