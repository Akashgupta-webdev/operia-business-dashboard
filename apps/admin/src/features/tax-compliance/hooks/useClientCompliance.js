import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClientCompliance, getClientFilings, updateComplianceDueDate } from "../api/clientCompliance.api";
import { clientKeys } from "@/features/clients/constants/queryKeys";
import { complianceKeys } from "../constants/queryKeys";

export function useUpdateComplianceDueDate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateComplianceDueDate,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: complianceKeys.all }),
        queryClient.invalidateQueries({ queryKey: clientKeys.all }),
        queryClient.invalidateQueries({ queryKey: clientKeys.detailRoot }),
      ]);
    },
  });
}

export function useClientCompliance(clientId) {
  return useQuery({ queryKey: complianceKeys.detail(clientId), queryFn: ({ signal }) => getClientCompliance(clientId, signal), enabled: Boolean(clientId) });
}

export function useClientFilings(clientId, type, page, limit, enabled = true) {
  return useQuery({
    queryKey: complianceKeys.filings(clientId, type, page, limit),
    queryFn: ({ signal }) => getClientFilings(clientId, type, { page, limit, signal }),
    enabled: Boolean(clientId) && enabled,
  });
}
