import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClientVehicle } from "@/features/clients/api/vehicles.api";

const useCreateClientVehicle = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await createClientVehicle(clientId, payload);
      return response.data.data;
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: clientKeys.all }),
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) }),
    ]),
  });
};

export default useCreateClientVehicle;
