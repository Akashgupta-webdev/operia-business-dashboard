import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CLIENTS_QUERY_KEY } from "@/constants/client";
import ClientService from "@/service/client.service";

const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request) => {
      const response = await ClientService.createClient(request);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY }),
  });
};

export default useCreateClient;
