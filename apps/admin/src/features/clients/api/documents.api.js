import clientRequest from "@/app/apiClient";

export const addClientDocument = (clientId, formData) => clientRequest.post(
    `/api/v1/client/${encodeURIComponent(clientId)}/document`,
    formData,
);

export const deleteClientDocument = (documentId) => clientRequest.delete(
    `/api/v1/client/document/${encodeURIComponent(documentId)}`,
);
