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
    createClient: (formData) => clientRequest.post("/api/v1/clients", formData),
    getClientCompanies: (clientId, params) => clientRequest.get(
        `/api/v1/companies/client/${encodeURIComponent(clientId)}`,
        { params },
    ),
    createCompany: (formData) => clientRequest.post("/api/v1/companies", formData),
};

export default ClientService;
