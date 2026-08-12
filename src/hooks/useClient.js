import { useQuery } from "@tanstack/react-query";

import ClientService from "@/service/client.service";

export const CLIENT_QUERY_KEY = ["client"];

const fetchClient = async (clientId) => {
  const response = await ClientService.getClient(clientId);
  return response.data.data ?? null;
};

const useClient = (clientId) => useQuery({
  queryKey: [...CLIENT_QUERY_KEY, clientId],
  queryFn: () => fetchClient(clientId),
  enabled: Boolean(clientId),
  retry: (failureCount, error) => {
    const status = error?.response?.status;
    return status !== 404 && failureCount < 2;
  },
});

export default useClient;
