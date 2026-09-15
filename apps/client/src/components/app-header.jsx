import { Bell, LogOut, Menu, Moon, Search, Sun, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@operio/ui/components/button';
import { Input } from '@operio/ui/components/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@operio/ui/components/dropdown-menu';
import { useSidebar } from '@operio/ui/components/sidebar';
import { navigationItems } from '@/app/navigation';
import useAuthSession from '@/features/auth/hooks/useAuthSession';
import useLogout from '@/features/auth/hooks/useLogout';
import useTheme from '@/hooks/useTheme';

export default function AppHeader() {
  const navigate = useNavigate();
  const { toggleSidebar, isMobile, openMobile, state } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useAuthSession();
  const logout = useLogout();
  const name = typeof session?.name === 'string' && session.name.trim() ? session.name : 'My account';
  const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  async function signOut() {
    if (logout.isPending) return;
    try { await logout.mutateAsync(); navigate('/login', { replace: true }); }
    catch { toast.error('Unable to sign out. Please try again.'); }
  }
  function search(event) {
    event.preventDefault();
    const term = new FormData(event.currentTarget).get('search').trim().toLowerCase();
    if (!term) return;
    const match = navigationItems.find(item => item.title.toLowerCase().includes(term));
    if (match) { navigate(match.url); event.currentTarget.reset(); }
    else toast.info('No matching page found.');
  }
  return <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center justify-between gap-3 border-b border-border-default bg-surface-primary px-3 sm:px-6">
    <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar" aria-expanded={isMobile ? openMobile : state === 'expanded'} className="size-10"><Menu aria-hidden="true" className="size-5" /></Button><span className="hidden rounded-full bg-accent px-3 py-1 text-caption font-semibold text-primary sm:block">Client Portal</span></div>
    <form onSubmit={search} role="search" aria-label="Find a page" className="relative hidden max-w-sm flex-1 md:block"><Search aria-hidden="true" className="pointer-events-none absolute top-3 left-3 size-4 text-text-muted" /><Input name="search" aria-label="Search pages" placeholder="Search your workspace…" className="h-10 bg-surface-secondary pl-9" /></form>
    <div className="flex items-center gap-1 sm:gap-2"><Button variant="ghost" size="icon" nativeButton={false} render={<Link to="/notifications" />} aria-label="Open notifications" className="size-10"><Bell aria-hidden="true" /></Button>
      <Button variant="ghost" size="icon" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme} className="size-10">{theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</Button>
      <DropdownMenu><DropdownMenuTrigger render={<Button variant="ghost" />} aria-label="Open account menu" className="h-11 gap-2 px-2"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{initials}</span><span className="hidden max-w-32 truncate text-body-sm sm:inline">{name}</span></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48"><DropdownMenuItem nativeButton={false} render={<Link to="/profile" />}><UserRound aria-hidden="true" />My profile</DropdownMenuItem><DropdownMenuItem disabled={logout.isPending} onClick={signOut}><LogOut aria-hidden="true" />{logout.isPending ? 'Signing out…' : 'Sign out'}</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>;
}
