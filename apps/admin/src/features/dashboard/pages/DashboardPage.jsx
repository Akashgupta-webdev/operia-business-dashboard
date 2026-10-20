import { AlertCircle, Clock3, Plus, ShieldCheck, UserRoundPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@operio/ui/components/button";
import { Skeleton } from "@operio/ui/components/skeleton";
import useCurrentClient from "@/features/auth/hooks/useCurrentClient";
import useClientDashboardKPI from "@/features/dashboard/hooks/useClientDashboardKPI";
import { DashboardMetricCard } from "../components/KpiDashboardSections";
import DashboardRenewals from "../components/DashboardRenewals";
import { TodayTasks, RecentActivities } from "../components/DashboardActivityPanels";

export default function DashboardPage() {
  const user = useCurrentClient();
  const query = useClientDashboardKPI({ type: "all" });
  const data = query.data;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const name = user.data?.name?.trim().split(/\s+/)[0];
  const dueSoon = data?.dueSoonBreakdown?.within30Days;
  const metrics = [
    { icon: Users, label: "Total Clients", value: data?.totalClients, helper: "Registered clients", href: "/clients", tone: "primary" },
    { icon: Clock3, label: "Renewals Due Soon", value: dueSoon, helper: "Within 30 days", href: "/renewals", tone: "warning" },
    { icon: AlertCircle, label: "Expired Records", value: data?.totalExpired, helper: "Action required", href: "/renewals", tone: "danger" },
    { icon: ShieldCheck, label: "Active Compliance", value: data?.validAndCompliant, helper: "Valid & up to date", href: "/renewals", tone: "success" },
  ];

  return (
    <div className="min-h-[calc(100svh-var(--header-height))] min-w-0 space-y-4 bg-app-background px-3 py-4 sm:px-6">
      <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">{greeting}{name ? `, ${name}` : ""} <span aria-hidden="true">{"\u{1F44B}"}</span></h1>
          <p className="mt-2 text-xs text-text-secondary">{dueSoon !== undefined ? `You have ${dueSoon} renewals due within 30 days. Let's keep everything up to date.` : "Let's keep everything up to date."}</p>
        </div>
        <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap sm:gap-3">
          <Button disabled title="Quote creation is not available yet" style={{ borderRadius: 8 }} className="h-auto gap-3 bg-primary-800 px-4 py-3 text-white disabled:opacity-100"><Plus className="size-6" aria-hidden="true" /><span className="text-left text-xs">Create Quote<span className="mt-1 block text-[10px] font-normal">Coming soon</span></span></Button>
          <Button nativeButton={false} render={<Link to="/clients/new" />} style={{ borderRadius: 8 }} className="h-auto gap-3 bg-success-700 px-4 py-3 text-white hover:bg-success-800"><UserRoundPlus className="size-6" aria-hidden="true" /><span className="text-left text-xs">Add Client<span className="mt-1 block text-[10px] font-normal">Register a new client</span></span></Button>
          <Button nativeButton={false} render={<Link to="/tax-and-compliance" />} variant="secondary" style={{ borderRadius: 8 }} className="h-auto gap-3 bg-primary-100 px-4 py-3 text-primary-800 hover:bg-primary-200"><ShieldCheck className="size-6" aria-hidden="true" /><span className="text-left text-xs">Add Compliance<span className="mt-1 block text-[10px] font-normal">Manage compliance records</span></span></Button>
        </div>
      </header>
      {query.isError && <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-danger-200 bg-danger-50 p-3 text-xs text-danger-700">{data ? "Unable to refresh KPIs. Showing the last available results." : "Unable to load dashboard KPIs."}<Button variant="outline" size="sm" onClick={() => query.refetch()}>Try again</Button></div>}
      <section aria-label="Dashboard KPIs" aria-busy={query.isFetching} className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-4">
        {query.isPending ? metrics.map((metric) => <Skeleton key={metric.label} className="h-28 rounded-xl" />) : metrics.map((metric) => <DashboardMetricCard key={metric.label} {...metric} value={metric.value ?? "—"} />)}
      </section>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.4fr)_minmax(260px,1fr)]">
        <DashboardRenewals />
        <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1"><TodayTasks /><RecentActivities /></aside>
      </div>
    </div>
  );
}
