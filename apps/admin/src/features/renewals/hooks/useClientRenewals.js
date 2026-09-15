import { renewalKeys } from "@/features/renewals/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

import { RENEWALS_PAGE_SIZE } from "@/features/renewals/constants/renewals";
import { getClientRenewals } from "@/features/renewals/api/renewals.api";

export default function useClientRenewals(page) {
  return useQuery({
    queryKey: renewalKeys.list({ page, limit: RENEWALS_PAGE_SIZE }),
    queryFn: async () => {
      const response = await getClientRenewals({ page, limit: RENEWALS_PAGE_SIZE });
      return response.data;
    },
    retry: (count, error) => ![401, 403, 422].includes(error?.response?.status) && count < 2,
  });
}
