import clientRequest from "@/app/apiClient";

export const updateClientVehicle = (vehicleId, formData) => clientRequest.patch(
    `/api/v1/client/vehicle/${encodeURIComponent(vehicleId)}`,
    formData,
);

export const createClientVehicle = (clientId, formData) => clientRequest.post(
    `/api/v1/client/${encodeURIComponent(clientId)}/vehicle`,
    formData,
);
