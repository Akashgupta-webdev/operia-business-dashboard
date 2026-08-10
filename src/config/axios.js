import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const clienRequest = axios.create({
    baseURL: `${API_URL}/`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

clienRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const requestConfig = error.config;
        const requestUrl = requestConfig?.url || "";
        const shouldRefresh = error.response?.status === 401
            && requestConfig
            && !requestConfig._retry
            && !requestUrl.includes("/auth/login")
            && !requestUrl.includes("/auth/refresh");

        if (!shouldRefresh) return Promise.reject(error);

        requestConfig._retry = true;

        try {
            refreshRequest ??= clienRequest.post("/auth/refresh").finally(() => {
                refreshRequest = null;
            });
            await refreshRequest;
            return clienRequest(requestConfig);
        } catch (refreshError) {
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("auth:unauthorized"));
            }
            return Promise.reject(refreshError);
        }
    },
);

export default clienRequest;
