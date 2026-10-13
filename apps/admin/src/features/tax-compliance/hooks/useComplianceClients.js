import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComplianceClients, setClientCompliance } from "../api/complianceClients.api";
import { complianceKeys } from "../constants/queryKeys";
import { clientKeys } from "@/features/clients/constants/queryKeys";

export function useComplianceClients({ added, search = "", enabled = true }) {
  return useInfiniteQuery({
    queryKey: complianceKeys.list(added, search),
    queryFn: ({ pageParam, signal }) => getComplianceClients({ added, page: pageParam, search, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page.page < lastPage.page.totalPages ? lastPage.page.page + 1 : undefined,
    enabled,
  });
}

export function useSetClientCompliance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setClientCompliance,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: complianceKeys.all }),
        queryClient.invalidateQueries({ queryKey: clientKeys.all }),
        queryClient.invalidateQueries({ queryKey: clientKeys.detailRoot }),
      ]);
    },
  });
}
