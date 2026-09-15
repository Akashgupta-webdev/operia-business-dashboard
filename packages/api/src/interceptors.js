// The application supplies its refresh endpoint and unauthorized-session policy.
export function installAuthRefreshInterceptor(client, { refresh, shouldRefresh, onUnauthorized }) {
    let refreshRequest = null;

    return client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const requestConfig = error.config;
            if (error.response?.status !== 401 || !requestConfig || requestConfig._retry || !shouldRefresh(requestConfig)) {
                return Promise.reject(error);
            }

            requestConfig._retry = true;

            try {
                refreshRequest ??= refresh().finally(() => {
                    refreshRequest = null;
                });
                await refreshRequest;
                return client(requestConfig);
            } catch (refreshError) {
                onUnauthorized?.();
                return Promise.reject(refreshError);
            }
        },
    );
}
