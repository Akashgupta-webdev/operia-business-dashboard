import { financeKeys } from "@/features/finance/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createExpense } from "@/features/finance/api/finance.api";

const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense) => {
      const response = await createExpense(expense);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: financeKeys.all }),
  });
};

export default useCreateExpense;
