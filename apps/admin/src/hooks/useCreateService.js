import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SERVICES_QUERY_KEY } from "@/constants/ServicesPage";
import ClientService from "@/service/client.service";

const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await ClientService.createService(payload);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY }),
  });
};

export default useCreateService;
