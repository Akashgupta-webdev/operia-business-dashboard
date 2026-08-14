import { useQuery } from "@tanstack/react-query";

import { CLIENT_SERVICES_QUERY_KEY } from "@/constants/ClientDetailPage";
import ClientService from "@/service/client.service";

const SERVICES_PAGE_SIZE = 100;

const fetchClientServices = async (clientId) => {
  const firstResponse = await ClientService.getClientServices(clientId, {
    page: 1,
    limit: SERVICES_PAGE_SIZE,
  });
  const firstPage = firstResponse.data;
  const totalPages = firstPage.page?.totalPages ?? 0;

  if (totalPages <= 1) return firstPage.data ?? [];

  const remainingResponses = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => ClientService.getClientServices(clientId, {
      page: index + 2,
      limit: SERVICES_PAGE_SIZE,
    }))
  );

  return [
    ...(firstPage.data ?? []),
    ...remainingResponses.flatMap((response) => response.data.data ?? []),
  ];
};

const useClientServices = (clientId) => useQuery({
  queryKey: [...CLIENT_SERVICES_QUERY_KEY, clientId],
  queryFn: () => fetchClientServices(clientId),
  enabled: Boolean(clientId),
});

export default useClientServices;
