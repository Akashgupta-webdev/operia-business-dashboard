import "./LoginPage.css";
import { authKeys } from "@/features/auth/constants/queryKeys";
import { joiResolver } from "@hookform/resolvers/joi";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Users,
  FileText,
  ClipboardCheck,
  ChartNoAxesCombined,
  Clock3,
  TrendingUp,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@operio/ui/components/button";
import { Input } from "@operio/ui/components/input";
import { ACCESS_KEY_LENGTH } from "@/features/auth/constants/auth";

import { login } from "@/features/auth/api/auth.api";
import { loginSchema } from "@/features/auth/schemas/auth.schema";

const LOGIN_FEATURES = [
  { icon: Users, tone: "purple", title: "Client Management", description: "Organize & grow your client base" },
  { icon: FileText, tone: "green", title: "Compliance & Documents", description: "Keep everything in one place" },
  { icon: RefreshCw, tone: "orange", title: "Renewals Tracking", description: "Never miss a renewal" },
  { icon: FileText, tone: "blue", title: "Quotes & Policies", description: "Create and manage with ease" },
  { icon: ClipboardCheck, tone: "pink", title: "Tasks & Follow-ups", description: "Stay on top of every action" },
  { icon: ChartNoAxesCombined, tone: "purple", title: "Reports & Insights", description: "Make better decisions" },
];

export default function LoginPage() {
  const [showAccessKey, setShowAccessKey] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: joiResolver(loginSchema),
    defaultValues: { accessKey: "" },
  });
  const accessKeyField = register("accessKey");

  const handleAccessKeyChange = (event) => {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, ACCESS_KEY_LENGTH);
    clearErrors("accessKey");
    accessKeyField.onChange(event);
  };

  const handleLogin = async ({ accessKey }) => {
    try {
      await login({ accessKey });
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch {
      setError(
        "accessKey",
        {
          type: "server",
          message: "We couldn’t authenticate that key. Check it and try again.",
        },
        { shouldFocus: true },
      );
    }
  };

  const errorMessage = errors.accessKey?.message;

  return (
    <main className="operio-login">
      <div className="login-layout">
        <aside className="login-intro">
          <LoginBrand />
          <h2>Manage.<br /><span>Track.</span><br /><em>Grow.</em></h2>
          <p className="login-intro-copy">One platform for clients, renewals, compliance and business operations.</p>
          <div className="login-features">
            {LOGIN_FEATURES.map(({ icon: Icon, tone, title, description }) => (
              <div className="login-feature" key={title}>
                <span className={"login-feature-icon " + tone}><Icon aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </div>
            ))}
          </div>
          <p className="login-tagline">Simplify Compliance.<br />Accelerate Growth.</p>
        </aside>
        <div className="login-floaters" aria-hidden="true">
          <div className="login-float clients"><Users /><div>Clients<strong>120+</strong></div><TrendingUp /></div>
          <div className="login-float renewals"><Clock3 /><div>Renewals<strong>&#10003; On Track</strong></div></div>
          <div className="login-float compliance"><ShieldCheck /><div>Compliance<strong>100%</strong><span /></div></div>
          <div className="login-float growth"><div>Business<br />Growth</div><ChartNoAxesCombined /></div>
        </div>
        <section className="login-card" aria-labelledby="login-title">
          <header className="login-card-header">
            <LoginBrand />
            <p className="login-portal"><span className="login-portal-desktop">Admin Portal</span><span className="login-portal-mobile">Administration Management Portal</span></p>
            <h1 id="login-title">Welcome Back <span role="img" aria-label="waving hand">&#128075;</span></h1>
            <p className="login-description">Sign in to access your management dashboard.</p>
          </header>
          <div className="login-form-content">
              <form onSubmit={handleSubmit(handleLogin)} noValidate>
                <div className="space-y-2">
                  <div className="login-label-row"><label
                    htmlFor="access-key"
                    className="block text-body-sm font-semibold tracking-wide text-text-primary"
                  >
                    MASTER ACCESS KEY
                  </label><details className="login-recovery"><summary>Forgot key?</summary><p>Contact your administrator to recover your access key.</p></details></div>
                  <div className="relative">
                    <KeyRound
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-text-muted"
                    />
                    <Input
                      {...accessKeyField}
                      id="access-key"
                      type={showAccessKey ? "text" : "password"}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={ACCESS_KEY_LENGTH}
                      onChange={handleAccessKeyChange}
                      aria-invalid={Boolean(errorMessage)}
                      aria-describedby={errorMessage ? "access-key-error" : "access-key-help"}
                      placeholder="Enter your access key"
                      className="login-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccessKey((visible) => !visible)}
                      aria-label={showAccessKey ? "Hide access key" : "Show access key"}
                      className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {showAccessKey ? (
                        <EyeOff aria-hidden="true" className="size-4" />
                      ) : (
                        <Eye aria-hidden="true" className="size-4" />
                      )}
                    </button>
                  </div>

                  {errorMessage ? (
                    <div
                      id="access-key-error"
                      role="alert"
                      aria-live="polite"
                      className="flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-body-sm font-medium text-danger-700"
                    >
                      <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  ) : (
                    <p id="access-key-help" className="sr-only">
                      Use the access key provided by your administrator.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="login-submit"
                >
                  {isSubmitting ? "Unlocking dashboard…" : "Unlock Dashboard"}
                  {isSubmitting ? (
                    <LockKeyhole aria-hidden="true" className="size-4 animate-pulse" />
                  ) : (
                    <ArrowRight aria-hidden="true" className="size-4" />
                  )}
                </Button>
              </form>
            <div className="login-divider"><span />OR<span /></div>
            <p className="login-security"><LockKeyhole aria-hidden="true" /><span>Secure Session</span><span aria-hidden="true">&bull;</span><span>Authorized Access Only</span></p>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoginBrand() {
  return (
    <div className="login-brand">
      <img src="/favicon.jpeg" alt="Operio" width="80" height="80" />
      <div><p>OPERIO</p><span>CRM &amp; COMPLIANCE SUITE</span></div>
    </div>
  );
}
