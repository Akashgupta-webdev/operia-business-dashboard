import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientKeys } from "@/features/clients/constants/queryKeys";
import { complianceKeys } from "../constants/queryKeys";
import { createFiling, updateFiling, deleteFiling } from "../api/filings.api";

export function useFilingMutation(action) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: { create: createFiling, update: updateFiling, delete: deleteFiling }[action],
    retry: false,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: complianceKeys.all }),
        queryClient.invalidateQueries({ queryKey: clientKeys.all }),
        queryClient.invalidateQueries({ queryKey: clientKeys.detailRoot }),
      ]);
    },
  });
}
