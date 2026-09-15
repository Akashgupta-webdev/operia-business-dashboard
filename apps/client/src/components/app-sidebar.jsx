import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@operio/ui/components/sidebar';
import { navigationItems } from '@/app/navigation';
import NavMain from './nav-main';

export default function AppSidebar() {
  return <Sidebar collapsible="icon" className="border-sidebar-border">
    <SidebarHeader className="h-(--header-height) justify-center border-b border-sidebar-border px-4 group-data-[collapsible=icon]:px-2">
      <Link to="/dashboard" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Operio Client Portal home">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"><ShieldCheck aria-hidden="true" className="size-5" /></span>
        <span className="group-data-[collapsible=icon]:hidden"><span className="block text-heading-sm font-bold leading-tight">Operio</span><span className="block text-xs font-semibold text-text-muted">CLIENT PORTAL</span></span>
      </Link>
    </SidebarHeader>
    <SidebarContent className="px-3 py-5 group-data-[collapsible=icon]:px-2"><NavMain items={navigationItems} /></SidebarContent>
    <SidebarFooter className="border-t border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:hidden">
      <p className="text-caption font-medium text-text-secondary">Your business, connected.</p><p className="text-xs text-text-muted">Operio Client Portal</p>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>;
}
