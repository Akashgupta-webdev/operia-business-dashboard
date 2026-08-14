import { useState } from "react";
import { Headphones, KeyRound, Landmark, LockKeyhole, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AUTH_SESSION_QUERY_KEY } from "@/hooks/useAuthSession";
import ClientService from "@/service/client.service";

const ACCESS_KEY_LENGTH = 12;

export default function LoginPage() {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleAccessKeyChange = (event) => {
    const nextValue = event.target.value.replace(/\D/g, "").slice(0, ACCESS_KEY_LENGTH);
    setAccessKey(nextValue);
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (accessKey.length !== ACCESS_KEY_LENGTH) {
      setError("Enter your 12-digit access key.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await ClientService.login({ accessKey });
      await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch {
      setError("We couldn’t authenticate that key. Check it and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#001329] px-4 py-10 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,77,137,0.24)_0%,rgba(0,39,78,0.12)_34%,transparent_70%)]"
      />

      <Card className="relative w-full max-w-[380px] gap-0 rounded-2xl border border-white/10 bg-[#152942]/95 py-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/5 backdrop-blur-sm">
        <CardHeader className="flex flex-col items-center gap-0 px-6 pt-7 pb-5 text-center sm:px-7 sm:pt-8">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-inner">
            <Landmark aria-hidden="true" className="size-7 text-white" strokeWidth={2.2} />
          </div>
          <CardTitle className="text-[23px] leading-7 font-semibold tracking-[-0.02em] text-white">
            Operio Business
          </CardTitle>
          <CardDescription className="mt-1.5 text-xs font-medium text-slate-300">
            Corporate Services CRM
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6 sm:px-7">
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="access-key" className="mb-2 block text-xs font-semibold text-slate-200">
              Secure Access Key
            </label>
            <div className="relative">
              <KeyRound
                aria-hidden="true"
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
              />
              <input
                id="access-key"
                name="accessKey"
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={ACCESS_KEY_LENGTH}
                value={accessKey}
                onChange={handleAccessKeyChange}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "access-key-error" : undefined}
                placeholder="Enter your 12-digit key"
                className="h-11 w-full rounded-lg border border-white/10 bg-[#0b1c31] pr-4 pl-10 text-sm text-white shadow-inner outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[#6ca5dd] focus:ring-3 focus:ring-[#6ca5dd]/20 aria-invalid:border-red-400/70 aria-invalid:ring-red-400/15"
              />
            </div>

            <div className="min-h-6 pt-1.5">
              {error && (
                <p id="access-key-error" role="alert" className="text-xs text-red-300">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-11 w-full border border-white/10 bg-[#31445f] text-sm font-semibold text-white shadow-sm hover:bg-[#3c526f] focus-visible:border-[#8bbbea] focus-visible:ring-[#6ca5dd]/30"
            >
              <LockKeyhole aria-hidden="true" className="size-4" />
              {isSubmitting ? "Authenticating…" : "Authenticate"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between rounded-b-2xl border-t border-white/10 bg-transparent px-6 py-4 text-[11px] font-medium text-slate-400 sm:px-7">
          <a
            href="mailto:support@operiobusiness.com"
            className="inline-flex items-center gap-1.5 rounded-sm transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6ca5dd]"
          >
            <Headphones aria-hidden="true" className="size-3.5" />
            Support
          </a>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            End-to-End Encrypted
          </span>
        </CardFooter>
      </Card>
    </main>
  );
}
