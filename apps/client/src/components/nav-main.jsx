import { NavLink, useLocation } from 'react-router-dom';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@operio/ui/components/sidebar';
import { cn } from '@operio/ui/lib/utils';

export default function NavMain({ items, counts = {} }) {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  return <nav aria-label="Primary navigation"><SidebarMenu className="gap-1.5">
    {items.map(({ title, url, icon: Icon, badge }) => {
      const active = pathname === url || pathname.startsWith(url + '/');
      const count = counts[badge];
      return <SidebarMenuItem key={url}>
        <SidebarMenuButton render={<NavLink to={url} onClick={() => { if (isMobile) setOpenMobile(false); }} />}
          isActive={active} tooltip={title}
          className={cn('h-11 rounded-lg px-3 font-semibold text-text-secondary [&>svg]:text-text-muted',
            active && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground [&>svg]:text-primary-foreground')}>
          <Icon aria-hidden="true" className="size-4" /><span className="truncate">{title}</span>
          {Number.isFinite(count) && count > 0 && <span aria-label={count + ' unread'} className={cn('ml-auto rounded-full px-1.5 text-xs group-data-[collapsible=icon]:hidden',
            active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-destructive text-white')}>{count > 99 ? '99+' : count}</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>;
    })}
  </SidebarMenu></nav>;
}
