import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@operio/ui/components/button';
import SuspenseLoader from '@/components/suspense-loader';
import useAuthSession from '@/features/auth/hooks/useAuthSession';

export default function ProtectedRoute() {
  const location = useLocation();
  const { data: session, isPending, isError, isFetching, refetch } = useAuthSession();
  if (isPending) return <SuspenseLoader label="Checking your session…" />;
  if (isError) return <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
    <h1 className="text-heading-sm font-semibold">We couldn’t check your session</h1>
    <p role="alert" className="text-text-secondary">Check your connection and try again.</p>
    <Button disabled={isFetching} onClick={() => refetch()}>Try again</Button>
  </main>;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
