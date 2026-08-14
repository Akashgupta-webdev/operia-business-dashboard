import clientRequest from "@/config/axios";

const ClientService = {
    login: (formData) => clientRequest.post("/api/v1/auth/login", formData),
    refresh: () => clientRequest.post("/api/v1/auth/refresh"),
    logout: () => clientRequest.post("/api/v1/auth/logout"),
    logoutAll: () => clientRequest.post("/api/v1/auth/logout-all"),
    changePassword: (formData) => clientRequest.post("/api/v1/auth/change-password", formData),
    sessions: () => clientRequest.get("/api/v1/auth/session"),

    me: () => clientRequest.get("/api/v1/user/me"),

    getClients: (params) => clientRequest.get("/api/v1/clients", { params }),
    getClient: (clientId) => clientRequest.get(`/api/v1/clients/${encodeURIComponent(clientId)}`),
    updateClient: (clientId, formData) => clientRequest.patch(
        `/api/v1/clients/${encodeURIComponent(clientId)}`,
        formData,
    ),
    createClient: (formData) => clientRequest.post("/api/v1/clients", formData),
    createClientWithService: (formData) => clientRequest.post("/api/v1/clients/with-service", formData),
    getClientCompanies: (clientId, params) => clientRequest.get(
        `/api/v1/companies/client/${encodeURIComponent(clientId)}`,
        { params },
    ),
    getClientServices: (clientId, params) => clientRequest.get(
        `/api/v1/clients/${encodeURIComponent(clientId)}/services`,
        { params },
    ),
    updateService: (clientId, serviceId, formData) => clientRequest.patch(
        `/api/v1/clients/${encodeURIComponent(clientId)}/services/${encodeURIComponent(serviceId)}`,
        formData,
    ),
    deleteService: (serviceId) => clientRequest.delete(
        `/api/v1/services/${encodeURIComponent(serviceId)}`,
    ),
    createCompany: (formData) => clientRequest.post("/api/v1/companies", formData),
};

export default ClientService;
