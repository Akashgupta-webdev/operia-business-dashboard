import { useVatAccess } from "@/features/vat/hooks/useVat";
import {
  Building2,
  CalendarDays,
  ChartCandlestick,
  ChartNoAxesColumnIncreasing,
  DollarSign,
  FileText,
  LayoutDashboard,
  MessageSquare,
  RefreshCw,
  Settings,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@operio/ui/components/sidebar";

export type SidebarNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type SidebarNavSection = {
  label: string;
  items: SidebarNavItem[];
};

const navigationSections: SidebarNavSection[] = [
  {
    label: "Dashboard",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Customer",
    items: [
      { title: "Clients", url: "/clients", icon: UsersRound },
      { title: "Companies", url: "/companies", icon: Building2 },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Finance - P&L", url: "/finance", icon: ChartCandlestick },
      { title: "Support & Tasks", url: "/support-&-tasks", icon: MessageSquare },
      { title: "Documents", url: "/documents", icon: FileText },
    ],
  },
  {
    label: "Compliance",
    items: [
      { title: "Renewals", url: "/renewals", icon: RefreshCw },
      { title: "Compliance", url: "/tax-and-compliance", icon: ShieldCheck },
      { title: "Calendar", url: "/calendars", icon: CalendarDays },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Reports", url: "/reports", icon: ChartNoAxesColumnIncreasing },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const vatAccess = useVatAccess();
  const sections = navigationSections.map((section) => section.label === "Compliance" && vatAccess.allowed ? { ...section, items: [...section.items, { title: "VAT filings", url: "/vat-filings", icon: FileText }] } : section);
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="h-(--header-height) justify-center border-b border-sidebar-border px-5 py-0 group-data-[collapsible=icon]:px-1.5">
        <div className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <img
            src="/favicon.jpeg"
            alt="Operio"
            className="size-8 shrink-0 rounded-lg border border-sidebar-border object-cover shadow-sm group-data-[collapsible=icon]:size-8"
          />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-body-lg leading-6 font-bold tracking-tight text-text-primary">
              Operio
            </p>
            <p className="truncate text-xs font-semibold tracking-wide text-primary-600 uppercase">
              CRM &amp; Compliance Suite
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 group-data-[collapsible=icon]:px-1.5">
        <NavMain sections={sections} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
