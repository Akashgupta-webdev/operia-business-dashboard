import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CLIENT_DASHBOARD_KPI_QUERY_KEY } from "@/constants/dashboard";
import ClientService from "@/service/client.service";

const useClientDashboardKPI = (filters) => useQuery({
  queryKey: [...CLIENT_DASHBOARD_KPI_QUERY_KEY, filters],
  queryFn: async () => {
    const params = {};
    if (filters.type && filters.type !== "all") params.type = filters.type;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    const response = await ClientService.getClientDashboardKPI(params);
    return response.data.data;
  },
  placeholderData: keepPreviousData,
  retry: (failureCount, error) => error?.response?.status !== 422 && failureCount < 2,
});

export default useClientDashboardKPI;
