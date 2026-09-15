import { LoaderCircle } from 'lucide-react';

export default function SuspenseLoader({ label = 'Loading your workspace…' }) {
  return <div role="status" className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-text-secondary">
    <LoaderCircle aria-hidden="true" className="size-6 motion-safe:animate-spin text-primary" />
    <span className="text-body-sm">{label}</span>
  </div>;
}
