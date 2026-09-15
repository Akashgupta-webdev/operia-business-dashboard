import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addClientDocument } from "@/features/clients/api/documents.api";

const useAddClientDocument = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await addClientDocument(clientId, formData);
      return response.data.data;
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: clientKeys.all }),
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) }),
    ]),
  });
};

export default useAddClientDocument;
