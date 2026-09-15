import { createApiClient, installAuthRefreshInterceptor } from '@operio/api';
import { AUTH_ENDPOINTS, UNAUTHORIZED_EVENT } from '@/features/auth/constants/auth';

const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_URL || '/',
  timeout: 10000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});
installAuthRefreshInterceptor(apiClient, {
  refresh: () => apiClient.post(AUTH_ENDPOINTS.refresh),
  // Session restores expired access on the server; a 401 means it could not recover.
  shouldRefresh: ({ url }) => ![AUTH_ENDPOINTS.login, AUTH_ENDPOINTS.session, AUTH_ENDPOINTS.refresh].includes(url),
  onUnauthorized: () => window.dispatchEvent(new Event(UNAUTHORIZED_EVENT)),
});
export default apiClient;
