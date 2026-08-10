import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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

const linkClass = (isActive: boolean) =>
  cn(
    "relative flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border px-3 text-left text-body-sm font-medium leading-none whitespace-nowrap transition-colors",
    "text-sidebar-foreground/75 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
    "group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
    isActive
      ? "border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground "
      : "border-transparent"
  );

const subLinkClass = (isActive: boolean) =>
  cn(
    "flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-3 text-left text-label-sm font-medium whitespace-nowrap transition-colors",
    "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
  );

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation();

  return (
    <SidebarGroup className="px-0">
      <SidebarMenu className="mt-1 gap-1">
        {items.map((item) => {
          const hasChildren = Boolean(item.items?.length);
          const isParentActive =
            location.pathname === item.url ||
            (item.url !== "/dashboard" && location.pathname.startsWith(item.url));

          if (hasChildren) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive || isParentActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={linkClass(isParentActive)}
                    >
                      {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-5 mt-1 border-l border-sidebar-border pl-2">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={subItem.url}
                              className={({ isActive }) => subLinkClass(isActive)}
                            >
                              <span className="truncate">{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          if (item.target === "_blank") {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={linkClass(false)}
                >
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <NavLink
                  to={item.url}
                  end={item.url === "/dashboard"}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                  <span className="truncate group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
