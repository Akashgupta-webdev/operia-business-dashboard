import { financeKeys } from "@/features/finance/constants/queryKeys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getRevenueInflows } from "@/features/finance/api/finance.api";

const useRevenueInflows = ({ page, limit }) => useQuery({
  queryKey: financeKeys.revenueInflows({ page, limit }),
  queryFn: async () => {
    const response = await getRevenueInflows({ page, limit });
    return response.data;
  },
  placeholderData: keepPreviousData,
  retry: (failureCount, error) => error?.response?.status !== 422 && failureCount < 2,
});

export default useRevenueInflows;
