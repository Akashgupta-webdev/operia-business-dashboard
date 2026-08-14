import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CLIENTS_QUERY_KEY } from "@/constants/ClientsPage";
import { CLIENT_QUERY_KEY } from "@/hooks/useClient";
import ClientService from "@/service/client.service";

const useUpdateClient = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await ClientService.updateClient(clientId, payload);
      return response.data.data;
    },
    onSuccess: (updatedClient) => {
      queryClient.setQueryData([...CLIENT_QUERY_KEY, clientId], (currentClient) => ({
        ...currentClient,
        ...updatedClient,
      }));
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
};

export default useUpdateClient;
