import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CLIENTS_QUERY_KEY } from "@/constants/client";
import { CLIENT_DETAIL_QUERY_KEY } from "@/hooks/useClient";
import ClientService from "@/service/client.service";

const useDeleteClientDocument = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId) => {
      const response = await ClientService.deleteClientDocument(documentId);
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

export default useDeleteClientDocument;
