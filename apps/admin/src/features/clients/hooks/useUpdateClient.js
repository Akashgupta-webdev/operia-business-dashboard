import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateClient } from "@/features/clients/api/clients.api";

const useUpdateClient = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await updateClient(clientId, payload);
      return response.data.data;
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: clientKeys.all }),
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) }),
    ]),
  });
};

export default useUpdateClient;
