import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CLIENTS_QUERY_KEY } from "@/constants/ClientsPage";
import ClientService from "@/service/client.service";

const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await ClientService.createClient(formData);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY }),
  });
};

export default useCreateClient;
