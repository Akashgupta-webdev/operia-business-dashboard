import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './queryClient';

export default function AppProviders({ children }) {
  return <QueryClientProvider client={queryClient}>{children}<Toaster richColors position="top-center" /></QueryClientProvider>;
}
