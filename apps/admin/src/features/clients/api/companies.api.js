import clientRequest from "@/app/apiClient";

export const updateClientCompany = (clientId, formData) => clientRequest.patch(
    `/api/v1/client/${encodeURIComponent(clientId)}/company`,
    formData,
);
