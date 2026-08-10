import { ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DashboardPagination } from "./DashboardPagination";

const statusClasses = {
  "due-soon": "bg-warning-container text-warning-container-foreground",
  pending: "bg-warning-container text-warning-container-foreground",
  active: "bg-success-container text-success-container-foreground",
  overdue: "bg-destructive-container text-destructive-container-foreground",
  completed: "bg-accent text-accent-foreground",
};

function ClientCell({ action }) {
  return (
    <div className="flex min-w-40 items-center gap-2.5">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg text-label-sm font-semibold", action.avatarClass)}>
        {action.initials}
      </span>
      <span className="truncate font-medium text-foreground">{action.client}</span>
    </div>
  );
}

export function UpcomingActionsTable({
  actions,
  totalActions,
  page,
  pageCount,
  pageSize,
  onPageChange,
}) {
  const firstResult = totalActions === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastResult = Math.min(page * pageSize, totalActions);

  return (
    <Card className="gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-card ring-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
        <h2 className="font-heading text-body-md font-semibold text-card-foreground">
          Upcoming Actions &amp; Deadlines
        </h2>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View All
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-200 border-collapse text-left text-body-md">
          <thead>
            <tr className="border-b border-border bg-surface-container-low">
              <th className="px-4 py-3 text-label-md font-semibold tracking-[0.05em] text-muted-foreground uppercase md:px-6">Client</th>
              <th className="px-4 py-3 text-label-md font-semibold tracking-[0.05em] text-muted-foreground uppercase">Company</th>
              <th className="px-4 py-3 text-label-md font-semibold tracking-[0.05em] text-muted-foreground uppercase">Action Required</th>
              <th className="px-4 py-3 text-label-md font-semibold tracking-[0.05em] text-muted-foreground uppercase">Due Date</th>
              <th className="px-4 py-3 text-label-md font-semibold tracking-[0.05em] text-muted-foreground uppercase">Status</th>
              <th className="px-4 py-3 text-right text-label-md font-semibold tracking-[0.05em] text-muted-foreground uppercase md:px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {actions.length > 0 ? (
              actions.map((action) => (
                <tr key={action.id} className="h-13 border-b border-border/70 transition-colors last:border-b-0 hover:bg-muted/50">
                  <td className="px-4 py-2 md:px-6"><ClientCell action={action} /></td>
                  <td className="max-w-52 truncate px-4 py-2 text-muted-foreground">{action.company}</td>
                  <td className={cn("max-w-56 truncate px-4 py-2 font-medium", action.statusKey === "overdue" ? "text-destructive" : "text-foreground")}>{action.action}</td>
                  <td className={cn("whitespace-nowrap px-4 py-2 tabular-nums", action.statusKey === "overdue" ? "font-medium text-destructive" : "text-muted-foreground")}>{action.dueDateLabel}</td>
                  <td className="px-4 py-2">
                    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-label-sm font-semibold whitespace-nowrap", statusClasses[action.statusKey])}>
                      {action.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right md:px-6">
                    <Button variant="outline" size="icon-xs" aria-label={`View action for ${action.client}`}>
                      <Eye />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <p className="font-medium text-foreground">No actions found</p>
                  <p className="mt-1 text-body-sm text-muted-foreground">Try changing one or more dashboard filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-surface-container-lowest px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="text-center text-body-sm text-muted-foreground sm:text-left">
          Showing <span className="font-medium text-foreground">{firstResult}–{lastResult}</span> of <span className="font-medium text-foreground">{totalActions}</span> actions
        </p>
        <DashboardPagination page={page} pageCount={pageCount} onPageChange={onPageChange} />
      </div>
    </Card>
  );
}
