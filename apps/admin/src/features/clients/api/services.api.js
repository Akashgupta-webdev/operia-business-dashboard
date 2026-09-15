import clientRequest from "@/app/apiClient";

export const updateClientService = (serviceId, formData) => clientRequest.patch(
    `/api/v1/client/service/${encodeURIComponent(serviceId)}`,
    formData,
);

export const deleteClientService = (serviceId) => clientRequest.delete(
    `/api/v1/client/service/${encodeURIComponent(serviceId)}`,
);

export const createClientService = (clientId, formData) => clientRequest.post(
    `/api/v1/client/${encodeURIComponent(clientId)}/service`,
    formData,
);

export const getClientServices = (clientId, params) => clientRequest.get(
    `/api/v1/clients/${encodeURIComponent(clientId)}/services`,
    { params },
);

export const updateService = (clientId, serviceId, formData) => clientRequest.patch(
    `/api/v1/clients/${encodeURIComponent(clientId)}/services/${encodeURIComponent(serviceId)}`,
    formData,
);
