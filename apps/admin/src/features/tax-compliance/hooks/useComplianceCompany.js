import useClient from "@/features/clients/hooks/useClient";

export default function useComplianceCompany(clientId, client, enabled = true) {
  const details = useClient(enabled && !client.companyId ? clientId : undefined);
  const companies = details.data?.companies ?? [];
  const matches = companies.filter((company) => company.companyName === client.companyName);
  const company = matches.length === 1 ? matches[0] : companies.length === 1 ? companies[0] : null;
  return { companyId: client.companyId || company?._id || company?.id, details };
}
