import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/features/clients/api/clients.api";

const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request) => {
      const response = await createClient(request);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clientKeys.all }),
  });
};

export default useCreateClient;
