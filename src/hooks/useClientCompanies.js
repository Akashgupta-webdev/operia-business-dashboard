import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CLIENT_COMPANIES_QUERY_KEY } from "@/constants/ClientCompaniesPage";
import ClientService from "@/service/client.service";

const fetchClientCompanies = async ({ clientId, limit, page }) => {
  const response = await ClientService.getClientCompanies(clientId, { page, limit });

  return {
    companies: response.data.data ?? [],
    page: response.data.page ?? { page, limit, total: 0, totalPages: 0 },
  };
};

const useClientCompanies = ({ clientId, limit, page }) => useQuery({
  queryKey: [...CLIENT_COMPANIES_QUERY_KEY, clientId, { page, limit }],
  queryFn: () => fetchClientCompanies({ clientId, limit, page }),
  enabled: Boolean(clientId),
  placeholderData: keepPreviousData,
});

export default useClientCompanies;
