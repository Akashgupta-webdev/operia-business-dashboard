import { Link } from 'react-router-dom';
import { Button } from '@operio/ui/components/button';

export default function NotFoundPage() {
  return <div className="flex min-h-80 flex-col items-center justify-center gap-4 p-6 text-center"><p className="text-caption font-semibold text-primary">404</p><h1 className="text-heading-lg font-bold">Page not found</h1><p className="text-text-secondary">The page you’re looking for isn’t available.</p><Button nativeButton={false} render={<Link to="/dashboard" />}>Back to dashboard</Button></div>;
}
