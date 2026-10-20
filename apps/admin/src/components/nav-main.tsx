import { NavLink, useLocation } from "react-router-dom";

import type { SidebarNavSection } from "@/components/app-sidebar";
import {
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@operio/ui/components/sidebar";
import { cn } from "@operio/ui/lib/utils";

const isRouteActive = (pathname: string, url: string) => {
  if (url === "/dashboard") {
    return pathname === "/" || pathname === "/dashboard";
  }

  return pathname === url || pathname.startsWith(`${url}/`);
};

const linkClass = (isActive: boolean) =>
  cn(
    "flex min-h-[38px] w-full items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium transition-colors",
    "text-text-secondary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
    "group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
    "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-text-muted",
    isActive &&
      "bg-primary-50 font-semibold text-primary-700 shadow-sm ring-1 ring-primary-100 dark:bg-primary-900/40 dark:text-primary-200 [&_svg]:text-primary-600",
  );

export function NavMain({ sections }: { sections: SidebarNavSection[] }) {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <nav aria-label="Primary navigation">
      {sections.map((section) => (
        <SidebarGroup
          key={section.label}
          className="px-0 py-1.5 first:pt-0 last:pb-0 group-data-[collapsible=icon]:py-1"
        >
          <SidebarGroupLabel className="mb-0.5 h-5 px-3 text-[10px] font-semibold tracking-widest text-primary-600 uppercase group-data-[collapsible=icon]:hidden">
            {section.label}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.75">
            {section.items.map((item) => {
              const isActive = isRouteActive(pathname, item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <NavLink
                        to={item.url}
                        onClick={() => { if (isMobile) setOpenMobile(false); }}
                        aria-current={isActive ? "page" : undefined}
                        className={linkClass(isActive)}
                      />
                    }
                    isActive={isActive}
                    tooltip={item.title}
                    className="h-[38px] rounded-lg text-[13px] group-data-[collapsible=icon]:min-h-0"
                  >
                    <item.icon aria-hidden="true" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </nav>
  );
}
