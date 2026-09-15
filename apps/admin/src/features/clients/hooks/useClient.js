import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/features/clients/api/clients.api";

const useClient = (clientId) => useQuery({
  queryKey: clientKeys.detail(clientId),
  queryFn: async () => {
    const response = await getClient(clientId);
    return response.data.data ?? null;
  },
  enabled: Boolean(clientId),
  retry: (failureCount, error) => error?.response?.status !== 404 && failureCount < 2,
});

export default useClient;
