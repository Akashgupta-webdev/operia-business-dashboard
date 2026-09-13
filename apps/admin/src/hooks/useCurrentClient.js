import { useQuery } from "@tanstack/react-query";
import ClientService from "@/service/client.service";

export const CURRENT_CLIENT_QUERY_KEY = ["client", "me"];

export const fetchCurrentClient = async () => {
  const response = await ClientService.sessions();
  return response.data.data ?? null;
};

const useCurrentClient = (options = {}) => useQuery({
  queryKey: CURRENT_CLIENT_QUERY_KEY,
  queryFn: fetchCurrentClient,
  retry: false,
  staleTime: 5 * 60 * 1000,
  refetchOnMount: true,
  ...options,
});

export default useCurrentClient;
