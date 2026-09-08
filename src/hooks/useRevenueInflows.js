import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { REVENUE_INFLOW_QUERY_KEY } from "@/constants/finance";
import ClientService from "@/service/client.service";

const useRevenueInflows = ({ page, limit }) => useQuery({
  queryKey: [...REVENUE_INFLOW_QUERY_KEY, { page, limit }],
  queryFn: async () => {
    const response = await ClientService.getRevenueInflows({ page, limit });
    return response.data;
  },
  placeholderData: keepPreviousData,
  retry: (failureCount, error) => error?.response?.status !== 422 && failureCount < 2,
});

export default useRevenueInflows;
