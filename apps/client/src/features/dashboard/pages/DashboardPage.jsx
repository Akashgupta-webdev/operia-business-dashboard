import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@operio/ui/components/card';
import { navigationItems } from '@/app/navigation';
import PageHeader from '@/components/page-header';
import useAuthSession from '@/features/auth/hooks/useAuthSession';

export default function DashboardPage() {
  const { data: session } = useAuthSession();
  const name = typeof session?.name === 'string' ? session.name.trim().split(/\s+/)[0] : '';
  return <div className="space-y-6">
    <PageHeader title={name ? 'Welcome back, ' + name : 'Welcome to your workspace'} description="Your company, applications, and documents. All in one place." />
    <section className="rounded-xl border border-primary/15 bg-accent p-6 sm:p-8" aria-labelledby="workspace-heading">
      <p className="text-caption font-semibold uppercase tracking-wide text-primary">Client workspace</p>
      <h2 id="workspace-heading" className="mt-2 text-heading-md font-semibold">What would you like to do today?</h2>
      <p className="mt-2 max-w-2xl text-body-sm text-text-secondary">Find your business information, follow applications, and stay connected with your team.</p>
    </section>
    <section aria-label="Explore your workspace" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {navigationItems.slice(1).map(({ title, url, icon: Icon }) => <Card key={url} className="border-border-default bg-surface-primary shadow-sm">
        <Link to={url} className="group flex items-center gap-4 rounded-xl p-5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"><Icon aria-hidden="true" className="size-5" /></span>
          <span className="flex-1 text-body-sm font-semibold">{title}</span><ArrowRight aria-hidden="true" className="size-4 text-text-muted group-hover:text-primary" />
        </Link>
      </Card>)}
    </section>
  </div>;
}
