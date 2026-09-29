import { createApiClient, installAuthRefreshInterceptor } from "@operio/api";

const apiClient = createApiClient({
    baseURL: `${import.meta.env.VITE_API_URL}/`,
    timeout: 10000,
    headers: { Accept: "application/json" },
    withCredentials: true,
});

installAuthRefreshInterceptor(apiClient, {
    // Preserve the existing transport URL, which differs from the explicit refresh API.
    refresh: () => apiClient.post("/auth/refresh"),
    shouldRefresh: (config) => {
        const url = config.url || "";
        if (config.vatWrite) {
            if (typeof window !== "undefined") window.dispatchEvent(new Event("auth:unauthorized"));
            return false;
        }
        return !url.includes("/auth/login") && !url.includes("/auth/refresh");
    },
    onUnauthorized: () => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth:unauthorized"));
        }
    },
});

export default apiClient;
