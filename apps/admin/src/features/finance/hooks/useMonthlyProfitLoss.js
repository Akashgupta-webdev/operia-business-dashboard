import { useQueries } from "@tanstack/react-query";
import { getProfitLoss } from "../api/finance.api";
import { financeKeys } from "../constants/queryKeys";
import { FINANCE_MONTHS } from "../constants/finance";

export default function useMonthlyProfitLoss(year) {
  return useQueries({
    queries: FINANCE_MONTHS.map(({ value }) => {
      const period = { month: Number(value), year };
      return {
        queryKey: financeKeys.profitLoss(period),
        queryFn: async () => (await getProfitLoss(period)).data.data,
        retry: (failureCount, error) => error?.response?.status !== 422 && failureCount < 2,
      };
    }),
  });
}
