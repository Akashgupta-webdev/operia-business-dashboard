import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CalendarDays,
  LoaderCircle,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@operio/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@operio/ui/components/dropdown-menu";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@operio/ui/components/sidebar";
import useCurrentClient from "@/features/auth/hooks/useCurrentClient";
import { logout } from "@/features/auth/api/auth.api";
import { setDarkTheme, setLightTheme } from "@/store/slice/themeSlice";

const portalRoutes = [
  { label: "Dashboard", url: "/dashboard" },
  { label: "Clients", url: "/clients" },
  { label: "Companies", url: "/companies" },
  { label: "Finance - P&L", url: "/finance" },
  { label: "Reminders", url: "/reminders" },
  { label: "Documents", url: "/documents" },
  { label: "Renewals", url: "/renewals" },
  { label: "Tax & Compliance", url: "/tax-and-compliance" },
  { label: "Calendar", url: "/calendars" },
  { label: "Reports", url: "/reports" },
  { label: "Settings", url: "/settings" },
];

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "AD";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

function UaeClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit",
    hourCycle: "h23", weekday: "short", day: "2-digit", month: "2-digit", year: "numeric",
  }).formatToParts(now).map(({ type, value }) => [type, value]));
  const label = `${parts.hour}:${parts.minute}, ${parts.weekday} ${parts.day}-${parts.month}-${parts.year}`;
  return <div className="flex shrink-0 items-center gap-1.5 text-text-secondary" title="UAE time (UTC+4)">
    <CalendarDays aria-hidden="true" className="size-4 text-primary-600" />
    <time dateTime={now.toISOString()} aria-label={`UAE time: ${label}`} className="whitespace-nowrap text-[10px] font-medium tabular-nums sm:text-xs">{label}</time>
  </div>;
}

function CustomSidebarTrigger() {
  const { isMobile, openMobile, state, toggleSidebar } = useSidebar();
  const isExpanded = isMobile ? openMobile : state === "expanded";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={isExpanded}
      title="Toggle sidebar"
      className="size-11 shrink-0 text-primary-600 hover:bg-accent hover:text-primary focus-visible:ring-primary/30"
    >
      <Menu aria-hidden="true" className="size-5" strokeWidth={2} />
    </Button>
  );
}

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useSelector((state) => state.theme);
  const { data: client } = useCurrentClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    dispatch(savedTheme === "dark" ? setDarkTheme() : setLightTheme());
  }, [dispatch]);


  const handleToggleTheme = () => {
    dispatch(theme === "dark" ? setLightTheme() : setDarkTheme());
  };

  const handlePortalSearch = (event) => {
    event.preventDefault();
    const searchValue = new FormData(event.currentTarget)
      .get("portalSearch")
      ?.toString()
      .trim()
      .toLowerCase();

    if (!searchValue) return;

    const match = portalRoutes.find((route) =>
      route.label.toLowerCase().includes(searchValue),
    );

    if (match) {
      navigate(match.url);
      event.currentTarget.reset();
      return;
    }

    toast.info("No matching portal found.");
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await logout();
      queryClient.clear();
      toast.success(response.data?.message || "Logout successful");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to logout. Please try again.");
      setIsLoggingOut(false);
    }
  };

  const clientName = client?.name || "Admin";
  const clientRole = client?.accessRole || "Admin";
  const clientEmail = client?.email || "";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex min-h-(--header-height) flex-wrap gap-y-2 py-2 items-center justify-between border-b border-border-default bg-surface-primary px-3 text-text-primary md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <CustomSidebarTrigger />

            <div className="hidden h-7 items-center gap-2 rounded-lg border border-primary-100 bg-accent px-3 text-body-sm font-semibold text-accent-foreground xl:flex dark:border-primary-800">
              <UserRound aria-hidden="true" className="size-3.5 text-primary" />
              <span className="max-w-44 truncate">{clientRole} (Management)</span>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            <UaeClock />
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open notifications"
                className="flex size-8 items-center justify-center rounded-lg text-primary-400 transition-colors hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Bell aria-hidden="true" className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 shadow-overlay">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="px-3 py-4 text-center text-body-sm text-text-muted">
                  You’re all caught up.
                </div>
              </DropdownMenuContent>
            </DropdownMenu>


            <form
              role="search"
              onSubmit={handlePortalSearch}
              className="relative hidden 2xl:block"
            >
              <label htmlFor="portal-search" className="sr-only">
                Search portals
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-primary-400"
              />
              <input
                id="portal-search"
                name="portalSearch"
                type="search"
                list="portal-options"
                placeholder="Portals / Search..."
                className="h-8 w-64 rounded-lg border border-border-default bg-app-background pr-3 pl-9 text-body-sm text-text-primary outline-none transition-colors placeholder:text-text-muted hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <datalist id="portal-options">
                {portalRoutes.map((route) => (
                  <option key={route.url} value={route.label} />
                ))}
              </datalist>
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open account menu"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-caption font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {getInitials(clientName)}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-60 border-border-default bg-popover text-popover-foreground shadow-overlay"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="space-y-1">
                      <p className="font-medium text-text-primary">{clientName}</p>
                      <p className="truncate text-caption font-normal text-text-muted">
                        {clientEmail || clientRole}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<NavLink to="/settings?tab=my-profile" />}
                >
                  <UserRound aria-hidden="true" className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<NavLink to="/settings?tab=account-settings" />}
                >
                  <Settings aria-hidden="true" className="size-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleTheme}>
                  {theme === "dark" ? (
                    <Sun aria-hidden="true" className="size-4" />
                  ) : (
                    <Moon aria-hidden="true" className="size-4" />
                  )}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  {isLoggingOut ? (
                    <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <LogOut aria-hidden="true" className="size-4" />
                  )}
                  {isLoggingOut ? "Signing out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 bg-background text-foreground">
          <div className="mx-auto min-w-0 w-full max-w-(--container-max-width)">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
