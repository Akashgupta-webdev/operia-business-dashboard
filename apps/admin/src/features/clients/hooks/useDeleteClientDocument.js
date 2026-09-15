import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteClientDocument } from "@/features/clients/api/documents.api";

const useDeleteClientDocument = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId) => {
      const response = await deleteClientDocument(documentId);
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

export default useDeleteClientDocument;
