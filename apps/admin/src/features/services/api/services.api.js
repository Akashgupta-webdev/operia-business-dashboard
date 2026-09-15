import clientRequest from "@/app/apiClient";

export const getServices = (params) => clientRequest.get("/api/v1/service", { params });

export const createService = (formData) => clientRequest.post("/api/v1/service", formData);

export const deleteService = (serviceId) => clientRequest.delete(
    `/api/v1/services/${encodeURIComponent(serviceId)}`,
);
