import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientCredentials } from "@/features/clients/api/clients.api";
import { clientKeys } from "@/features/clients/constants/queryKeys";

export default function useUpdateClientCredentials(clientId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await updateClientCredentials(clientId, payload);
      return response.data.data;
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: clientKeys.all }),
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) }),
    ]),
  });
}
