import clientRequest from "@/app/apiClient";

export const updateClientDriver = (driverId, formData) => clientRequest.patch(
    `/api/v1/client/driver/${encodeURIComponent(driverId)}`,
    formData,
);

export const createClientDriver = (clientId, formData) => clientRequest.post(
    `/api/v1/client/${encodeURIComponent(clientId)}/driver`,
    formData,
);
