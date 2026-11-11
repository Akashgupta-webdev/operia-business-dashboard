import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../api/finance.api";
import { financeKeys } from "../constants/queryKeys";

export default function useExpenses(filters) {
  return useQuery({
    queryKey: financeKeys.expenses(filters),
    queryFn: async ({ signal }) => (await getExpenses(filters, signal)).data,
    retry: (count, error) => ![401, 403, 422].includes(error?.response?.status) && count < 2,
  });
}
