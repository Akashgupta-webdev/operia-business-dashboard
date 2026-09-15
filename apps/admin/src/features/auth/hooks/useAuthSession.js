import { authKeys } from "@/features/auth/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { sessions } from "@/features/auth/api/auth.api";


export const fetchAuthSession = async () => {
    const response = await sessions();
    return response.data.data;
};

const useAuthSession = (options = {}) => useQuery({
    queryKey: authKeys.session,
    queryFn: fetchAuthSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
    ...options,
});

export default useAuthSession;
