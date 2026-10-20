import { renewalKeys } from "@/features/renewals/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

import { RENEWALS_PAGE_SIZE } from "@/features/renewals/constants/renewals";
import { getClientRenewals } from "@/features/renewals/api/renewals.api";

export default function useClientRenewals(page, limit = RENEWALS_PAGE_SIZE) {
  return useQuery({
    queryKey: renewalKeys.list({ page, limit }),
    queryFn: async () => {
      const response = await getClientRenewals({ page, limit });
      return response.data;
    },
    retry: (count, error) => ![401, 403, 422].includes(error?.response?.status) && count < 2,
  });
}
