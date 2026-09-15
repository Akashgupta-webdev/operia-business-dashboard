import { dashboardKeys } from "@/features/dashboard/constants/queryKeys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getClientDashboardKPI } from "@/features/dashboard/api/dashboard.api";

const useClientDashboardKPI = (filters) => useQuery({
  queryKey: dashboardKeys.kpi(filters),
  queryFn: async () => {
    const params = {};
    if (filters.type && filters.type !== "all") params.type = filters.type;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    const response = await getClientDashboardKPI(params);
    return response.data.data;
  },
  placeholderData: keepPreviousData,
  retry: (failureCount, error) => error?.response?.status !== 422 && failureCount < 2,
});

export default useClientDashboardKPI;
