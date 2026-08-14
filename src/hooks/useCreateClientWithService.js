import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CLIENTS_QUERY_KEY } from "@/constants/ClientsPage";
import ClientService from "@/service/client.service";

const useCreateClientWithService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, documents }) => {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      documents.forEach((document) => formData.append("documents", document));

      const response = await ClientService.createClientWithService(formData);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY }),
  });
};

export default useCreateClientWithService;
