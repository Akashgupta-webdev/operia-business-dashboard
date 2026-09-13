import { useQuery } from "@tanstack/react-query";
import ClientService from "@/service/client.service";

export const AUTH_SESSION_QUERY_KEY = ["auth", "session"];

export const fetchAuthSession = async () => {
    const response = await ClientService.sessions();
    return response.data.data;
};

const useAuthSession = (options = {}) => useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: fetchAuthSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...options,
});

export default useAuthSession;
