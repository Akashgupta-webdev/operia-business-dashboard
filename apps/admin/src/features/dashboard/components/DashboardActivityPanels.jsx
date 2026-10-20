import { CalendarCheck, History } from "lucide-react";
import { Card } from "@operio/ui/components/card";

function ActivityPanel({ title, icon: Icon, children }) {
  return <Card className="gap-0 border border-border-default/60 bg-surface-primary p-4 shadow-none ring-0"><h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary"><Icon aria-hidden="true" className="size-4 text-text-secondary" />{title}</h2><div className="flex min-h-40 flex-col items-center justify-center px-3 text-center"><Icon aria-hidden="true" className="mb-3 size-8 text-primary-300" />{children}</div></Card>;
}

export function TodayTasks() {
  return <ActivityPanel title="Today's Tasks" icon={CalendarCheck}><p className="text-xs font-medium text-text-primary">Your tasks will appear here</p><p className="mt-2 text-[11px] text-text-muted">Task updates are coming soon.</p></ActivityPanel>;
}

export function RecentActivities() {
  return <ActivityPanel title="Recent Activities" icon={History}><p className="text-xs font-medium text-text-primary">Stay up to date with your team</p><p className="mt-2 text-[11px] text-text-muted">Recent activity updates are coming soon.</p></ActivityPanel>;
}
