import { useQuery } from "@tanstack/react-query";
import { getClientCompliance, getClientFilings } from "../api/clientCompliance.api";
import { complianceKeys } from "../constants/queryKeys";

export function useClientCompliance(clientId) {
  return useQuery({ queryKey: complianceKeys.detail(clientId), queryFn: ({ signal }) => getClientCompliance(clientId, signal), enabled: Boolean(clientId) });
}

export function useClientFilings(clientId, type, page, limit, enabled = true) {
  return useQuery({
    queryKey: complianceKeys.filings(clientId, type, page, limit),
    queryFn: ({ signal }) => getClientFilings(clientId, type, { page, limit, signal }),
    enabled: Boolean(clientId) && enabled,
  });
}
