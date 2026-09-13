import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CLIENTS_QUERY_KEY } from "@/constants/client";
import { CLIENT_DETAIL_QUERY_KEY } from "@/hooks/useClient";
import ClientService from "@/service/client.service";

const useUpdateClientService = (serviceId, clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await ClientService.updateClientService(serviceId, payload);
      return response.data.data;
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY }),
      clientId
        ? queryClient.invalidateQueries({ queryKey: [...CLIENT_DETAIL_QUERY_KEY, clientId] })
        : Promise.resolve(),
    ]),
  });
};

export default useUpdateClientService;
