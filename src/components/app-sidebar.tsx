import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  Handshake,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import useCurrentClient from "@/hooks/useCurrentClient";
import ClientService from "@/service/client.service";
import { toast } from "sonner";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  target?: string;
  items?: {
    title: string;
    url: string;
  }[];
};

const navMain: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [],
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Workflow,
    items: [],
  },
  {
    title: "Companies",
    url: "/companies",
    icon: Workflow,
    items: [],
  },
  {
    title: "Services",
    url: "/services",
    icon: CalendarDays,
    isActive: true,
    items: [],
  },
  {
    title: "Documents",
    url: "/documents",
    icon: Home,
    items: [],
  },
  {
    title: "Tax & Compliance",
    url: "/tax-and-compliance",
    icon: Handshake,
    items: [],
  },
  {
    title: "Visa & Employees",
    url: "/visa-and-employees",
    icon: Handshake,
    items: [],
  },
  {
    title: "Renewals",
    url: "/renewals",
    icon: Handshake,
    items: [],
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Handshake,
    items: [],
  },
  {
    title: "Reminders",
    url: "/reminders",
    icon: Handshake,
    items: [],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const getInitials = (name?: string) => {
  if (!name) return "US";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: client } = useCurrentClient();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const clientName = client?.name || "Client";
  const clientRole = client?.accessRole || "Client";
  const clientEmail = client?.email || "Client";
  const avatarUrl = "https://placehold.net/avatar.svg";

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await ClientService.logout();
      queryClient.clear();
      toast.success(response.data?.message || "Logout successful");
      navigate("/login", { replace: true });
    } catch (error: any) {
      const message = error.response?.data?.error?.message
        || error.response?.data?.message
        || error.response?.data?.msg
        || "Unable to logout. Please try again.";
      toast.error(message);
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="px-3 pb-2 pt-2 group-data-[collapsible=icon]:px-2">
        <div className="flex flex-col items-center gap-2 text-center group-data-[collapsible=icon]:gap-0">
          <img
            src="/favicon.jpeg"
            alt="Divyam"
            className="h-12 w-auto object-contain group-data-[collapsible=icon]:h-9"
          />
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="text-[19px] font-semibold uppercase tracking-[0.32em] text-sidebar-primary">
              OPERIO
            </div>
            <p className="mt-0.5 text-label-sm font-medium italic text-muted-foreground">
              Business
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-2 group-data-[collapsible=icon]:px-1">
        <NavMain items={navMain} />
      </SidebarContent>

      <div className="mx-3 mb-2 mt-auto h-px bg-sidebar-border group-data-[collapsible=icon]:hidden" />

      <SidebarFooter className="px-3 pb-4 pt-1 group-data-[collapsible=icon]:px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-full border border-sidebar-border bg-surface-container-lowest p-1.5 text-left text-sidebar-foreground outline-none transition-colors hover:border-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-1">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-sidebar-primary bg-sidebar-accent text-label-sm font-semibold text-sidebar-accent-foreground">
                <Avatar className="h-full w-full">
                  <AvatarImage src={avatarUrl} alt={clientName} />
                  <AvatarFallback className="bg-sidebar-accent text-label-sm text-sidebar-accent-foreground">
                    {getInitials(clientName)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-sidebar bg-success" />
              </span>
              <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <span className="block truncate text-label-md font-semibold text-sidebar-foreground">
                  {clientName}
                </span>
                <span className="block text-label-sm text-success">
                  {clientRole}
                </span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            className="w-56 border-border bg-popover text-popover-foreground"
          >
            <DropdownMenuLabel className="font-medium">
              <div className="truncate text-sm">{clientName}</div>
              {clientEmail && (
                <div className="truncate text-xs font-normal text-muted-foreground">
                  {clientEmail}
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings?tab=my-profile")}>
              <UserCircle className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
