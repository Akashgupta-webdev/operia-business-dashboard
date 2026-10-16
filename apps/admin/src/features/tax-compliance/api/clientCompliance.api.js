import clientRequest from "@/app/apiClient";

export async function updateComplianceDueDate({ companyId, payload }) {
  const response = await clientRequest.patch(`/api/v1/client/updateNextVATorTAXDueDate/${encodeURIComponent(companyId)}`, payload);
  return response.data.data;
}

export async function getClientCompliance(clientId, signal) {
  const response = await clientRequest.get(`/api/v1/client/${encodeURIComponent(clientId)}/compliance`, { signal });
  return response.data;
}

export async function getClientFilings(clientId, type, { page, limit, signal }) {
  const resource = type === "VAT" ? "vat-filings" : "tax-filings";
  const response = await clientRequest.get(`/api/v1/client/${encodeURIComponent(clientId)}/${resource}`, { params: { page, limit }, signal });
  return response.data;
}
