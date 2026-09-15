import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteClientRelatedRecord } from "@/features/clients/api/related-records.api";

const useDeleteClientRelatedRecord = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recordId, actionOn }) => {
      const response = await deleteClientRelatedRecord(recordId, actionOn);
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

export default useDeleteClientRelatedRecord;
