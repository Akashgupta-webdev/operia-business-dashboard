import clientRequest from "@/app/apiClient";

export const getClientCompanies = (params) => clientRequest.get("/api/v1/client/companies", { params });

export const createCompany = (formData) => clientRequest.post("/api/v1/companies", formData);
