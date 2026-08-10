import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { UserRound, Settings, LogOut, Moon, Sun } from "lucide-react";
import {
  setDarkTheme,
  setLightTheme,
} from "@/store/slice/themeSlice";
import useCurrentClient from "@/hooks/useCurrentClient";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "AD";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default function Layout() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const { data: client } = useCurrentClient();

  useEffect(() => {
    if (!["light", "dark"].includes(theme)) return;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      dispatch(setDarkTheme());
    } else {
      dispatch(setLightTheme());
    }
  }, [dispatch]);

  const handleToggleTheme = () => {
    if (theme === "dark") {
      dispatch(setLightTheme());
      localStorage.setItem("theme", "light");
    } else {
      dispatch(setDarkTheme());
      localStorage.setItem("theme", "dark");
    }
  };

  const clientName = client?.name || "Client";
  const clientRole = client?.accessRole || "Client";
  const clientEmail = client?.email || "";
  const avatarUrl = "https://placehold.net/avatar.svg";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="sticky top-0 z-40 flex h-(--header-height) items-center justify-between border-b border-border bg-card/95 px-4 text-card-foreground shadow-card backdrop-blur md:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground" />

            <Separator
              orientation="vertical"
              className="h-4"
            />

            <div>
              <h1 className="text-body-md font-semibold text-foreground">
                Operia Business
              </h1>

              <p className="hidden text-label-sm text-muted-foreground md:block">
                Insurance CRM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="adminProfile cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface-container-lowest px-2 py-1.5 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary" >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={clientName}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold">{getInitials(clientName)}</span>
                    )}
                  </div>

                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-foreground">
                      {clientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {clientRole}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-border bg-popover text-popover-foreground shadow-overlay">
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {clientName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {clientEmail || clientRole}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <NavLink to={"settings?tab=my-profile"} className="w-full">
                    <span className="flex items-center justify-start gap-2">
                      <UserRound className="size-4 " />
                      <span className="">Profile</span>
                    </span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink to="settings?tab=account-settings" className="w-full">
                    <span className="flex items-center justify-start gap-2">
                      <Settings className="size-4 " />
                      <span className="">Account</span>
                    </span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleToggleTheme}
                  className="cursor-pointer"
                >
                  <span className="flex items-center justify-start gap-2">
                    {theme === "dark" ? (
                      <>
                        <Sun className="size-4" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="size-4" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                >
                  <NavLink to="/dashboard/logout" className="w-full">
                    <span className="flex items-center justify-start gap-2 ">
                      <LogOut className="size-4" />
                      <span className="">Logout</span>
                    </span>
                  </NavLink>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </header>
        <main
          className="flex-1 bg-background text-foreground"
        >
          <div
            className="mx-auto w-full max-w-(--container-max-width)"
          >
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
