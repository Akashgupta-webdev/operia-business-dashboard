import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateClientDriver } from "@/features/clients/api/drivers.api";

const useUpdateClientDriver = (driverId, clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await updateClientDriver(driverId, payload);
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

export default useUpdateClientDriver;
