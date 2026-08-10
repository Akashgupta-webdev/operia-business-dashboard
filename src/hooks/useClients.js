import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CLIENTS_QUERY_KEY } from "@/constants/ClientsPage";
import ClientService from "@/service/client.service";

const fetchClients = async ({ page, limit, search }) => {
  const params = { page, limit };
  if (search) params.search = search;

  const response = await ClientService.getClients(params);

  return {
    clients: response.data.data ?? [],
    page: response.data.page ?? { page, limit, total: 0, totalPages: 0 },
  };
};

const useClients = ({ page, limit, search }) => useQuery({
  queryKey: [...CLIENTS_QUERY_KEY, { page, limit, search }],
  queryFn: () => fetchClients({ page, limit, search }),
  placeholderData: keepPreviousData,
});

export default useClients;
