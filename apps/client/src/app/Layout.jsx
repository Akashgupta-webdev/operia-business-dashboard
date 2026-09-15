import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@operio/ui/components/sidebar';
import AppSidebar from '@/components/app-sidebar';
import AppHeader from '@/components/app-header';
import SuspenseLoader from '@/components/suspense-loader';
import { navigationItems } from './navigation';

export default function Layout() {
  const { pathname } = useLocation();
  const content = useRef(null);
  useEffect(() => {
    const page = navigationItems.find(item => pathname === item.url);
    document.title = (page?.title || 'Page not found') + ' | Operio Client Portal';
    content.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return <SidebarProvider>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:p-3 focus:text-primary-foreground">Skip to content</a>
    <AppSidebar /><SidebarInset className="min-w-0 bg-app-background"><AppHeader />
      <div id="main-content" ref={content} tabIndex={-1} className="flex-1 p-4 outline-none sm:p-6 lg:p-8"><div className="mx-auto w-full max-w-7xl"><Suspense fallback={<SuspenseLoader />}><Outlet /></Suspense></div></div>
      <footer className="border-t border-border-default px-6 py-4 text-caption text-text-muted">Operio · Client Portal</footer>
    </SidebarInset>
  </SidebarProvider>;
}
