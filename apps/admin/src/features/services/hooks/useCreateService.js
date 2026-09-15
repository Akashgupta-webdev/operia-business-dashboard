import { serviceKeys } from "@/features/services/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createService } from "@/features/services/api/services.api";

const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await createService(payload);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.all }),
  });
};

export default useCreateService;
