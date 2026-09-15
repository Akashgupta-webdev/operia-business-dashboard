import { financeKeys } from "@/features/finance/constants/queryKeys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProfitLoss } from "@/features/finance/api/finance.api";

const useProfitLoss = ({ month, year }) => useQuery({
  queryKey: financeKeys.profitLoss({ month, year }),
  queryFn: async () => {
    const response = await getProfitLoss({ month, year });
    return response.data.data;
  },
  placeholderData: keepPreviousData,
  retry: (failureCount, error) => error?.response?.status !== 422 && failureCount < 2,
});

export default useProfitLoss;
