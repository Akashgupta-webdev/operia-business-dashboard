import { companyKeys } from "@/features/companies/constants/queryKeys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getClientCompanies } from "@/features/companies/api/companies.api";

const useClientCompanies = ({ page, limit, search }) => useQuery({
  queryKey: companyKeys.list({ page, limit, search }),
  queryFn: async () => {
    const params = { page, limit };
    if (search) params.search = search;
    const response = await getClientCompanies(params);
    return {
      companies: response.data.data ?? [],
      page: response.data.page ?? { page, limit, total: 0, totalPages: 0 },
    };
  },
  placeholderData: keepPreviousData,
  retry: (failureCount, error) => error?.response?.status !== 422 && failureCount < 2,
});

export default useClientCompanies;
