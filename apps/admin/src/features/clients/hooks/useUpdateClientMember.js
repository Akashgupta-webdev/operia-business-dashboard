import { clientKeys } from "@/features/clients/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateClientMember } from "@/features/clients/api/members.api";

const useUpdateClientMember = (memberId, clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await updateClientMember(memberId, payload);
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

export default useUpdateClientMember;
