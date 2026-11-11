import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../api/finance.api";
import { financeKeys } from "../constants/queryKeys";

export default function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: financeKeys.all }),
    onError: (error) => {
      if (error?.response?.status === 404) return queryClient.invalidateQueries({ queryKey: financeKeys.all });
    },
  });
}
