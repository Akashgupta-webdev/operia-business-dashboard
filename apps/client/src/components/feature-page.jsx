import { Card, CardContent } from '@operio/ui/components/card';
import PageHeader from './page-header';

export default function FeaturePage({ title, description, icon: Icon, message }) {
  return <div className="space-y-6"><PageHeader title={title} description={description} />
    <Card className="border-border-default bg-surface-primary shadow-sm"><CardContent className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-xl bg-accent text-primary"><Icon aria-hidden="true" className="size-6" /></span>
      <h2 className="text-heading-sm font-semibold">{title}</h2>
      <p className="max-w-md text-body-sm text-text-secondary">{message}</p>
    </CardContent></Card>
  </div>;
}
