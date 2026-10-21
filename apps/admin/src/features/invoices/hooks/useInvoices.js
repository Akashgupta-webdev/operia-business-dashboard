import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInvoice, getInvoices, saveInvoice, deleteInvoice } from "../api/invoices.api";
import { invoiceKeys } from "../constants/queryKeys";

export function useInvoices(params) {
  return useQuery({ queryKey: invoiceKeys.list(params), queryFn: ({ signal }) => getInvoices(params, signal) });
}
export function useInvoice(id) {
  return useQuery({ queryKey: invoiceKeys.detail(id), queryFn: ({ signal }) => getInvoice(id, signal), enabled: Boolean(id), staleTime: 0 });
}
export function useInvoiceMutation(remove = false) {
  const cache = useQueryClient();
  return useMutation({ mutationFn: remove ? deleteInvoice : saveInvoice, retry: false, onSuccess: () => cache.invalidateQueries({ queryKey: invoiceKeys.all }) });
}
