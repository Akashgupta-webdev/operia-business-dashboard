import { authKeys } from "@/features/auth/constants/queryKeys";
import { joiResolver } from "@hookform/resolvers/joi";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
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

import Grainient from "@/components/Grainient";
import { Button } from "@operio/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@operio/ui/components/card";
import { Input } from "@operio/ui/components/input";
import { Separator } from "@operio/ui/components/separator";
import { ACCESS_KEY_LENGTH } from "@/features/auth/constants/auth";

import { login } from "@/features/auth/api/auth.api";
import { loginSchema } from "@/features/auth/schemas/auth.schema";

const LOGIN_FEATURES = [
  {
    icon: RefreshCw,
    iconClassName: "bg-warning-500/20 text-warning-100",
    title: "Renewals Radar",
    description: "Upcoming renewals & alerts",
  },
  {
    icon: Building2,
    iconClassName: "bg-success-500/20 text-success-100",
    title: "Entity Management",
    description: "Companies, employees & vehicles",
  },
  {
    icon: ShieldCheck,
    iconClassName: "bg-info-500/20 text-info-100",
    title: "Compliance Hub",
    description: "Trade license, VAT & visa tracking",
  },
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
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-app-background px-4 py-5 text-text-primary sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Grainient
          color1="#A78BFA"
          color2="#4F46E5"
          color3="#312E81"
          timeSpeed={0.7}
          colorBalance={-0.05}
          warpStrength={1.2}
          warpFrequency={5}
          warpSpeed={2.2}
          warpAmplitude={36}
          blendAngle={22}
          blendSoftness={0.08}
          rotationAmount={420}
          noiseScale={2}
          grainAmount={0.12}
          grainScale={2}
          grainAnimated
          contrast={1.25}
          saturation={1.05}
          zoom={1}
        />
        <div className="absolute inset-0 bg-neutral-950/5" />
      </div>

      <Card className="relative grid w-full max-w-[1040px] gap-0 overflow-hidden rounded-2xl border border-border-default bg-surface-primary py-0 shadow-lg ring-0 lg:grid-cols-[minmax(310px,38%)_1fr]">
        <aside className="relative flex overflow-hidden bg-[linear-gradient(145deg,var(--auth-panel-start),var(--auth-panel-end))] p-5 text-neutral-0 sm:p-6 lg:flex-col lg:p-8">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:20px_20px]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-20 -bottom-20 size-72 rounded-full border border-neutral-0/10"
          />

          <div className="relative z-10 flex w-full flex-col">
            <div className="flex items-center gap-3 lg:flex-col lg:text-center">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-neutral-0 p-1.5 shadow-md lg:size-14">
                <img
                  src="/favicon.jpeg"
                  alt="Operio Business"
                  className="size-full rounded-lg object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-bold tracking-wide">OPERIO</p>
                <p className="mt-0.5 text-caption font-semibold tracking-wide text-neutral-0/75">
                  CRM &amp; COMPLIANCE SUITE
                </p>
              </div>
            </div>

            <div className="mt-5 hidden lg:block">
              <h2 className="max-w-[280px] text-2xl leading-[1.25] font-bold tracking-tight">
                Your Business Operations, One Platform.
              </h2>
              <p className="mt-2 max-w-[300px] text-body-sm leading-5 text-neutral-0/75">
                Clients. Renewals. Compliance. Documents. All connected.
              </p>
            </div>

            <div className="mt-5 hidden space-y-2 lg:block">
              {LOGIN_FEATURES.map((feature) => (
                <FeatureItem key={feature.title} {...feature} />
              ))}
            </div>

            <div className="mt-5 hidden items-center justify-between border-t border-neutral-0/15 pt-4 text-caption font-medium text-neutral-0/75 lg:flex">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-success-500" />
                System Online
              </span>
              <span>v3.2</span>
            </div>
          </div>
        </aside>

        <section className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-14">
          <div className="w-full max-w-[460px]">
            <CardHeader className="flex flex-col items-center gap-0 p-0 text-center">
              <CardTitle>
                <h1 className="text-section-heading font-bold tracking-tight text-text-primary">
                  Welcome to Operio
                </h1>
              </CardTitle>
              <span className="mt-3 rounded-md border border-primary-200 bg-primary-50 px-3 py-1 text-caption font-semibold tracking-wide text-primary-700">
                ADMINISTRATION MANAGEMENT
              </span>
              <CardDescription className="mt-2 text-body-sm text-text-secondary">
                Sign in securely to access your management dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-6 p-0">
              <form onSubmit={handleSubmit(handleLogin)} noValidate>
                <div className="space-y-2">
                  <label
                    htmlFor="access-key"
                    className="block text-body-sm font-semibold tracking-wide text-text-primary"
                  >
                    MASTER ACCESS KEY
                  </label>
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
                      placeholder="Enter access key"
                      className="h-12 bg-surface-primary pr-12 pl-12 text-body-md shadow-sm hover:border-outline focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
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
                  className="mt-4 h-12 w-full bg-[linear-gradient(90deg,var(--auth-panel-end),var(--auth-panel-start))] text-body-md font-semibold text-neutral-0 shadow-md hover:opacity-90 active:opacity-80"
                >
                  {isSubmitting ? "Unlocking dashboard…" : "Unlock Dashboard"}
                  {isSubmitting ? (
                    <LockKeyhole aria-hidden="true" className="size-4 animate-pulse" />
                  ) : (
                    <ArrowRight aria-hidden="true" className="size-4" />
                  )}
                </Button>
              </form>

              <Separator className="my-5 bg-border-default" />

              <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-caption text-text-muted">
                <LockKeyhole aria-hidden="true" className="size-3.5" />
                <span>Secure Session</span>
                <span aria-hidden="true">•</span>
                <span>Authorized Access Only</span>
              </p>
            </CardContent>
          </div>
        </section>
      </Card>
    </main>
  );
}

function FeatureItem({ icon: Icon, iconClassName, title, description }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-0/10 bg-neutral-0/10 px-3 py-2.5 backdrop-blur-sm">
      <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-body-sm font-semibold text-neutral-0">{title}</span>
        <span className="block text-caption text-neutral-0/70">{description}</span>
      </span>
    </div>
  );
}
