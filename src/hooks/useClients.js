import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CLIENTS_QUERY_KEY } from "@/constants/client";
import ClientService from "@/service/client.service";

const fetchClients = ({ page, limit, search, status, clientType, sort }) => async () => {
  const params = { page, limit, sort };
  if (search) params.search = search;
  if (status) params.status = status;
  if (clientType) params.clientType = clientType;

  const response = await ClientService.getClients(params);

  return {
    clients: response.data.data ?? [],
    page: response.data.page ?? { page, limit, total: 0, totalPages: 0 },
  };
};

const useClients = ({ page, limit, search, status, clientType, sort }) => useQuery({
  queryKey: [...CLIENTS_QUERY_KEY, { page, limit, search, status, clientType, sort }],
  queryFn: fetchClients({ page, limit, search, status, clientType, sort }),
  placeholderData: keepPreviousData,
});

export default useClients;
