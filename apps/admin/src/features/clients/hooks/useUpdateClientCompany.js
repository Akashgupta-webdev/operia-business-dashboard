import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateClientCompany } from "@/features/clients/api/companies.api";

const useUpdateClientCompany = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await updateClientCompany(clientId, payload);
      return response.data.data;
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: clientKeys.all }),
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) }),
    ]),
  });
};

export default useUpdateClientCompany;
