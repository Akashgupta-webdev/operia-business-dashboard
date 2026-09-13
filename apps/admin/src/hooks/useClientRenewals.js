import { useQuery } from "@tanstack/react-query";

import { RENEWALS_PAGE_SIZE, RENEWALS_QUERY_KEY } from "@/constants/renewals";
import ClientService from "@/service/client.service";

export default function useClientRenewals(page) {
  return useQuery({
    queryKey: [...RENEWALS_QUERY_KEY, { page, limit: RENEWALS_PAGE_SIZE }],
    queryFn: async () => {
      const response = await ClientService.getClientRenewals({ page, limit: RENEWALS_PAGE_SIZE });
      return response.data;
    },
    retry: (count, error) => ![401, 403, 422].includes(error?.response?.status) && count < 2,
  });
}
