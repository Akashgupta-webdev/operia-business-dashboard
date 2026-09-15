import { Card, CardContent } from '@operio/ui/components/card';
import PageHeader from '@/components/page-header';
import useAuthSession from '@/features/auth/hooks/useAuthSession';

export default function ProfilePage() {
  const { data: session } = useAuthSession();
  const fields = [['Name', session?.name], ['Email address', session?.email], ['Account role', session?.accessRole]];
  return <div className="space-y-6"><PageHeader title="Profile" description="Your account information." />
    <Card className="max-w-3xl border-border-default bg-surface-primary shadow-sm"><CardContent className="p-6"><dl className="divide-y divide-border-default">
      {fields.map(([label, value]) => <div key={label} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-3"><dt className="text-body-sm text-text-secondary">{label}</dt><dd className="break-words text-body-sm font-medium sm:col-span-2">{typeof value === 'string' && value ? value : 'Not provided'}</dd></div>)}
    </dl></CardContent></Card>
  </div>;
}
