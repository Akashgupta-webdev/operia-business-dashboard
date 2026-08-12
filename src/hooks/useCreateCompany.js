import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CLIENT_COMPANIES_QUERY_KEY } from "@/constants/ClientCompaniesPage";
import ClientService from "@/service/client.service";

const useCreateCompany = (clientId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await ClientService.createCompany(formData);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: [...CLIENT_COMPANIES_QUERY_KEY, clientId],
    }),
  });
};

export default useCreateCompany;
