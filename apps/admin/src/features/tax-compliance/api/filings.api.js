import clientRequest from "@/app/apiClient";

function resource(type) {
  if (type !== "VAT" && type !== "TAX") throw new Error("Invalid filing type");
  return type;
}

export async function createFiling({ type, companyId, payload }) {
  const response = await clientRequest.post(`/api/v1/client/createFiling${resource(type)}/${encodeURIComponent(companyId)}`, payload);
  return response.data.data;
}

export async function updateFiling({ type, id, payload }) {
  const response = await clientRequest.patch(`/api/v1/client/updateFiling${resource(type)}/${encodeURIComponent(id)}`, payload);
  return response.data.data;
}

export async function deleteFiling({ type, id }) {
  const response = await clientRequest.delete(`/api/v1/client/deleteFiling${resource(type)}/${encodeURIComponent(id)}`);
  return response.data.data;
}
