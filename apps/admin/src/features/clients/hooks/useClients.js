import { clientKeys } from "@/features/clients/constants/queryKeys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getClients } from "@/features/clients/api/clients.api";

const fetchClients = ({ page, limit, search, status, clientType, sort }) => async () => {
  const params = { page, limit, sort };
  if (search) params.search = search;
  if (status) params.status = status;
  if (clientType) params.clientType = clientType;

  const response = await getClients(params);

  return {
    clients: response.data.data ?? [],
    page: response.data.page ?? { page, limit, total: 0, totalPages: 0 },
  };
};

const useClients = ({ page, limit, search, status, clientType, sort }) => useQuery({
  queryKey: clientKeys.list({ page, limit, search, status, clientType, sort }),
  queryFn: fetchClients({ page, limit, search, status, clientType, sort }),
  placeholderData: keepPreviousData,
});

export default useClients;
