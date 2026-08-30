import { useQuery } from "@tanstack/react-query";

import ClientService from "@/service/client.service";

export const CLIENT_DETAIL_QUERY_KEY = ["client-detail"];

const useClient = (clientId) => useQuery({
  queryKey: [...CLIENT_DETAIL_QUERY_KEY, clientId],
  queryFn: async () => {
    const response = await ClientService.getClient(clientId);
    return response.data.data ?? null;
  },
  enabled: Boolean(clientId),
  retry: (failureCount, error) => error?.response?.status !== 404 && failureCount < 2,
});

export default useClient;
