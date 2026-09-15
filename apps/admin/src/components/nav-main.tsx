import { NavLink, useLocation } from "react-router-dom";

import type { SidebarNavSection } from "@/components/app-sidebar";
import {
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
    "flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-body-sm font-medium transition-colors",
    "text-text-secondary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
    "group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
    "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-neutral-400",
    isActive &&
      "bg-sidebar-accent font-semibold text-sidebar-accent-foreground [&_svg]:text-sidebar-primary",
  );

export function NavMain({ sections }: { sections: SidebarNavSection[] }) {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Primary navigation">
      {sections.map((section) => (
        <SidebarGroup
          key={section.label}
          className="px-0 py-2 first:pt-1 last:pb-1 group-data-[collapsible=icon]:py-1"
        >
          <SidebarGroupLabel className="mb-1 h-8 px-3 text-body-md font-semibold tracking-wide text-primary-600 uppercase group-data-[collapsible=icon]:hidden">
            {section.label}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {section.items.map((item) => {
              const isActive = isRouteActive(pathname, item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <NavLink
                        to={item.url}
                        aria-current={isActive ? "page" : undefined}
                        className={linkClass(isActive)}
                      />
                    }
                    isActive={isActive}
                    tooltip={item.title}
                    className="h-auto py-1 text-[12px] hover:bg-transparent data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
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
