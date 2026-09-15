import { useState } from 'react';
import { joiResolver } from '@hookform/resolvers/joi';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Eye, EyeOff, FileText, KeyRound, LoaderCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@operio/ui/components/button';
import { Card } from '@operio/ui/components/card';
import { Input } from '@operio/ui/components/input';
import useAuthSession from '../hooks/useAuthSession';
import useLogin from '../hooks/useLogin';
import { loginSchema } from '../schemas/auth.schema';
import { getReturnPath } from '../utils/returnPath';
import SuspenseLoader from '@/components/suspense-loader';

export default function LoginPage() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = useAuthSession();
  const mutation = useLogin();
  const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = useForm({ resolver: joiResolver(loginSchema), defaultValues: { emailAddress: '', password: '' } });
  const destination = getReturnPath(location.state?.from);
  async function submit(values) {
    clearErrors('root');
    try {
      await mutation.mutateAsync(values);
      navigate(destination, { replace: true });
    } catch (error) {
      const rejected = [401, 403, 422].includes(error.response?.status);
      setError('root', { type: 'server', message: rejected ? 'We couldn’t verify your email address and password. Check them and try again.' : 'We couldn’t sign you in. Please try again shortly.' });
    }
  }
  if (session.isPending) return <SuspenseLoader label="Checking your session…" />;
  if (session.data) return <Navigate to={destination} replace />;
  return <main className="flex min-h-svh items-center justify-center bg-app-background p-4 sm:p-8">
    <Card className="grid w-full max-w-5xl gap-0 overflow-hidden py-0 rounded-2xl border-border-default bg-surface-primary shadow-lg lg:grid-cols-2">
      <section className="flex flex-col justify-between gap-8 bg-primary p-8 text-primary-foreground sm:p-10">
        <div className="flex items-center gap-3"><ShieldCheck aria-hidden="true" className="size-8" /><span className="text-heading-md font-bold">Operio</span></div>
        <div><p className="text-caption font-semibold uppercase tracking-wide opacity-75">Your client workspace</p><h1 className="mt-3 text-display-md font-bold tracking-tight">Your business.<br />One connected space.</h1><p className="mt-4 text-body-sm leading-relaxed opacity-80">Access your company information, follow applications, and keep important documents close.</p></div>
        <div className="hidden gap-3 sm:grid"><div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 p-3"><Building2 aria-hidden="true" className="size-5" /><span className="text-body-sm">Company and application updates</span></div><div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 p-3"><FileText aria-hidden="true" className="size-5" /><span className="text-body-sm">Documents, renewals, and support</span></div></div>
      </section>
      <section className="flex flex-col justify-center p-6 sm:p-10">
        <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent text-primary"><KeyRound aria-hidden="true" className="size-6" /></span>
        <h2 className="text-heading-lg font-bold">Welcome back</h2><p className="mt-2 text-body-sm text-text-secondary">Sign in to your client portal with your email address and password.</p>
        <form onSubmit={handleSubmit(submit)} noValidate className="mt-7 space-y-5">
          <div className="space-y-2"><label htmlFor="email-address" className="text-body-sm font-semibold">Email address</label>
            <Input {...register('emailAddress')} id="email-address" type="email" autoComplete="username" disabled={isSubmitting} aria-invalid={Boolean(errors.emailAddress)} aria-describedby={errors.emailAddress ? 'email-address-error' : undefined} placeholder="client@example.com" className="h-12" />
            {errors.emailAddress && <p id="email-address-error" role="alert" className="text-body-sm text-destructive">{errors.emailAddress.message}</p>}
          </div>
          <div className="space-y-2"><label htmlFor="password" className="text-body-sm font-semibold">Password</label>
            <div className="relative"><Input {...register('password')} id="password" type={visible ? 'text' : 'password'} autoComplete="current-password" disabled={isSubmitting}
              aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} placeholder="Enter your password" className="h-12 pr-12" />
              <Button variant="ghost" size="icon" type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(value => !value)} className="absolute top-1 right-1 size-10">{visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</Button>
            </div>
            {errors.password && <p id="password-error" role="alert" className="text-body-sm text-destructive">{errors.password.message}</p>}
          </div>
          {errors.root && <p role="alert" className="text-body-sm text-destructive">{errors.root.message}</p>}
          <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-full font-semibold">{isSubmitting ? <LoaderCircle aria-hidden="true" className="motion-safe:animate-spin" /> : <ArrowRight aria-hidden="true" />}{isSubmitting ? 'Signing in…' : 'Sign in to your workspace'}</Button>
        </form>
        <p className="mt-6 border-t border-border-default pt-5 text-caption text-text-muted">Need help signing in? Contact your Operio team.</p>
      </section>
    </Card>
  </main>;
}
