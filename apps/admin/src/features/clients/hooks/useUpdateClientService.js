import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateClientService } from "@/features/clients/api/services.api";

const useUpdateClientService = (serviceId, clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await updateClientService(serviceId, payload);
      return response.data.data;
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: clientKeys.all }),
      clientId
        ? queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) })
        : Promise.resolve(),
    ]),
  });
};

export default useUpdateClientService;
