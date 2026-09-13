import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { PROFIT_LOSS_QUERY_KEY } from "@/constants/finance";
import ClientService from "@/service/client.service";

const useProfitLoss = ({ month, year }) => useQuery({
  queryKey: [...PROFIT_LOSS_QUERY_KEY, { month, year }],
  queryFn: async () => {
    const response = await ClientService.getProfitLoss({ month, year });
    return response.data.data;
  },
  placeholderData: keepPreviousData,
  retry: (failureCount, error) => error?.response?.status !== 422 && failureCount < 2,
});

export default useProfitLoss;
