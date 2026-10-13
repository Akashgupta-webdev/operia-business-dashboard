import clientRequest from "@/app/apiClient";

export async function getComplianceClients({ added, page, search, signal }) {
  const route = added ? "getClientAddedInComplianceService" : "getClientForAddingInComplianceService";
  const response = await clientRequest.get(`/api/v1/client/${route}`, {
    params: { page, limit: 20, search: search || undefined }, signal,
  });
  return response.data;
}

export function setClientCompliance({ clientId, added }) {
  const route = added ? "AddClientInComplianceService" : "RemoveClientFromComplianceService";
  return clientRequest.patch(`/api/v1/client/${route}`, { _id: clientId });
}
