import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteClientService } from "@/features/clients/api/services.api";

const useDeleteClientService = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (serviceId) => {
      const response = await deleteClientService(serviceId);
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

export default useDeleteClientService;
