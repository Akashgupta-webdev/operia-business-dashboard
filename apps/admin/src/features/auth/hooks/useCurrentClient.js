import { authKeys } from "@/features/auth/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { sessions } from "@/features/auth/api/auth.api";


export const fetchCurrentClient = async () => {
  const response = await sessions();
  return response.data.data ?? null;
};

const useCurrentClient = (options = {}) => useQuery({
  queryKey: authKeys.currentClient,
  queryFn: fetchCurrentClient,
  retry: false,
  staleTime: 5 * 60 * 1000,
  refetchOnMount: true,
  ...options,
});

export default useCurrentClient;
