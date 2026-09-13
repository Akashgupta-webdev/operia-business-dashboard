import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PROFIT_LOSS_QUERY_KEY } from "@/constants/finance";
import ClientService from "@/service/client.service";

const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense) => {
      const response = await ClientService.createExpense(expense);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFIT_LOSS_QUERY_KEY }),
  });
};

export default useCreateExpense;
