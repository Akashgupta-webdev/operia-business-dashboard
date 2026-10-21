import useClients from "@/features/clients/hooks/useClients";

export default function useInvoiceClients({ page, limit = 15, search }) {
  return useClients({ page, limit, search, sort: "Newest First" });
}
