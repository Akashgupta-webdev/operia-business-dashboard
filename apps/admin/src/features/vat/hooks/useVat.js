import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVatAdmin, listVat, detailVat, listCompanies, createVat, commandVat, uploadVat } from "../api/vat.api";
import { vatKeys } from "../constants/vat";
import { isAdmin } from "../utils/vat";
import { clientKeys } from "@/features/clients/constants/queryKeys";
import { dashboardKeys } from "@/features/dashboard/constants/queryKeys";
export const useVatAdmin = () => useQuery({ queryKey: vatKeys.admin, queryFn: getVatAdmin, retry: false, staleTime: 60000, refetchOnMount: true });
export function useVatList(filters, enabled = true) { return useQuery({ queryKey: vatKeys.list(filters), queryFn: ({ signal }) => listVat(filters, signal), enabled, staleTime: 0, refetchOnMount: true, retry: false }); }
export function useVatDetail(id) { return useQuery({ queryKey: vatKeys.detail(id), queryFn: ({ signal }) => detailVat(id, signal), enabled: Boolean(id), staleTime: 0, refetchOnMount: true, retry: false }); }
export function useVatCompanies(filters, enabled = true) { return useQuery({ queryKey: vatKeys.companies(filters), queryFn: ({ signal }) => listCompanies(filters, signal), enabled, staleTime: 0, refetchOnMount: true, retry: false }); }
export function useVatMutation() {
  const cache = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: ({ kind, service, action, payload, companyClient, purpose, file }) => kind === "create" ? createVat(companyClient, payload) : kind === "upload" ? uploadVat(service, purpose, file) : commandVat(service.id, action, payload),
    onSuccess: async (result, variables) => {
      const service = result.service ?? (variables.kind === "create" ? result : variables.service);
      if (result.service) cache.setQueryData(vatKeys.detail(service.id), (previous) => previous ? { ...previous, service: result.service } : previous);
      await Promise.all([vatKeys.all, clientKeys.detail(service.client), clientKeys.all, dashboardKeys.all].map((queryKey) => cache.invalidateQueries({ queryKey })));
    },
  });
}
export function useVatAccess() {
  const query = useVatAdmin();
  return { ...query, allowed: !query.isError && isAdmin(query.data) };
}
