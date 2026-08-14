import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CLIENT_SERVICES_QUERY_KEY } from "@/constants/ClientDetailPage";
import ClientService from "@/service/client.service";

const useInvalidateClientServices = (clientId) => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({
    queryKey: [...CLIENT_SERVICES_QUERY_KEY, clientId],
  });
};

export const useUpdateService = (clientId) => {
  const invalidateClientServices = useInvalidateClientServices(clientId);

  return useMutation({
    mutationFn: async ({ serviceId, payload }) => {
      const response = await ClientService.updateService(clientId, serviceId, payload);
      return response.data.data;
    },
    onSuccess: invalidateClientServices,
  });
};

export const useDeleteService = (clientId) => {
  const invalidateClientServices = useInvalidateClientServices(clientId);

  return useMutation({
    mutationFn: (serviceId) => ClientService.deleteService(serviceId),
    onSuccess: invalidateClientServices,
  });
};
