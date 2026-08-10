import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from '@/routes/index.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import store from './store/store';
import { Provider } from 'react-redux';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppRoutes />
        <Toaster richColors={true} position="top-center" />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
