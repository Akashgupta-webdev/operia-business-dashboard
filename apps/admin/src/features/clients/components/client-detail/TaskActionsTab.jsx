import { CalendarCheck, Check, CheckCircle2, ChevronRight, Clock3, Plus } from "lucide-react";

import { Button } from "@operio/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@operio/ui/components/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@operio/ui/components/collapsible";
import { cn } from "@operio/ui/lib/utils";

const completedStatuses = new Set(["completed", "closed"]);

function formatDate(value) {
  if (!value) return "No due date";
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-");
    return `${day}/${month}/${year}`;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB").format(date);
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-danger-50 text-danger-700",
    Normal: "bg-info-50 text-info-700",
    Low: "bg-neutral-100 text-neutral-600",
  };
  return <span className={cn("rounded-md px-2 py-0.5 text-[9px] font-semibold", styles[priority] ?? styles.Normal)}>{priority || "Normal"}</span>;
}

function TaskCard({ task, completed = false }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-default bg-surface-primary p-4 sm:flex-row sm:items-start">
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", completed ? "bg-success-50" : "bg-primary-50")}>
        {completed ? <Check aria-hidden="true" className="size-4 text-success-600" /> : <Clock3 aria-hidden="true" className="size-4 text-primary-600" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2"><h3 className="text-body-sm font-semibold text-text-primary">{task.title || task.notes?.[0] || "Client follow-up"}</h3><PriorityBadge priority={task.priority} /></div>
        {task.notes?.length > 1 && <p className="mt-1 line-clamp-2 text-caption text-text-secondary">{task.notes.slice(1).join(" · ")}</p>}
        <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-text-muted"><CalendarCheck aria-hidden="true" className="size-3.5" />{completed ? "Completed" : "Follow up"}: {formatDate(task.followupDate || task.completedAt)}</p>
      </div>
      {!completed && <Button type="button" variant="outline" size="sm" disabled title="Complete-action API is not configured" className="gap-1.5 opacity-100"><Check aria-hidden="true" className="size-3.5" />Mark complete</Button>}
    </div>
  );
}

function EmptyOpenTasks() {
  return (
    <div className="px-5 py-9 text-center">
      <div className="mx-auto flex size-8 items-center justify-center rounded-full border-2 border-success-500"><Check aria-hidden="true" className="size-4 text-success-600" /></div>
      <p className="mt-3 text-caption font-semibold text-text-primary">All client tasks are completed!</p>
      <p className="mt-1 text-[11px] text-text-muted">Click “Add Action” to schedule new follow-ups or reminders.</p>
    </div>
  );
}

export default function TaskActionsTab({ reminders = [] }) {
  const activeTasks = reminders.filter((task) => !completedStatuses.has(task.status?.toLowerCase()));
  const completedTasks = reminders.filter((task) => completedStatuses.has(task.status?.toLowerCase()));

  return (
    <div className="space-y-4">
      <Card className="gap-0 border border-border-default bg-surface-primary py-0 shadow-card ring-0">
        <CardHeader className="flex-row items-center border-b border-border-default bg-surface-secondary/50 px-5 py-3">
          <CalendarCheck aria-hidden="true" className="size-4 text-primary-600" />
          <CardTitle className="text-caption font-bold uppercase tracking-wide">Active Open Tasks ({activeTasks.length})</CardTitle>
          <Button type="button" size="sm" disabled title="Create-action API is not configured" className="ml-auto gap-1.5 bg-primary-700 text-neutral-0 opacity-100"><Plus aria-hidden="true" className="size-3.5" />Add Action</Button>
        </CardHeader>
        <CardContent className="p-0">
          {activeTasks.length ? <div className="space-y-3 p-4">{activeTasks.map((task) => <TaskCard key={task.id} task={task} />)}</div> : <EmptyOpenTasks />}
        </CardContent>
      </Card>

      <Collapsible>
        <Card className="gap-0 border border-border-default bg-surface-primary py-0 shadow-card ring-0">
          <CollapsibleTrigger className="group flex w-full items-center gap-2 px-5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <CheckCircle2 aria-hidden="true" className="size-4 text-success-600" />
            <span className="text-caption font-bold uppercase tracking-wide text-text-primary">Closed / Completed Actions ({completedTasks.length})</span>
            <span className="ml-auto text-[10px] font-semibold text-text-muted">Expand</span>
            <ChevronRight aria-hidden="true" className="size-4 text-text-muted transition-transform group-data-panel-open:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 border-t border-border-default p-4">
              {completedTasks.length ? completedTasks.map((task) => <TaskCard key={task.id} task={task} completed />) : <p className="py-5 text-center text-caption text-text-muted">No completed actions yet.</p>}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
