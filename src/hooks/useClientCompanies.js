import { keepPreviousData, useQuery } from "@tanstack/react-query";

import ClientService from "@/service/client.service";

export const CLIENT_COMPANIES_QUERY_KEY = ["client-companies"];

const useClientCompanies = ({ page, limit, search }) => useQuery({
  queryKey: [...CLIENT_COMPANIES_QUERY_KEY, { page, limit, search }],
  queryFn: async () => {
    const params = { page, limit };
    if (search) params.search = search;
    const response = await ClientService.getClientCompanies(params);
    return {
      companies: response.data.data ?? [],
      page: response.data.page ?? { page, limit, total: 0, totalPages: 0 },
    };
  },
  placeholderData: keepPreviousData,
  retry: (failureCount, error) => error?.response?.status !== 422 && failureCount < 2,
});

export default useClientCompanies;
