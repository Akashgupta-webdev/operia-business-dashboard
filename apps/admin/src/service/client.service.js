import clientRequest from "@/config/axios";

const ClientService = {
    login: (formData) => clientRequest.post("/api/v1/auth/login", formData),
    refresh: () => clientRequest.post("/api/v1/auth/refresh"),
    logout: () => clientRequest.post("/api/v1/auth/logout"),
    logoutAll: () => clientRequest.post("/api/v1/auth/logout-all"),
    changePassword: (formData) => clientRequest.post("/api/v1/auth/change-password", formData),
    sessions: () => clientRequest.get("/api/v1/auth/session"),

    me: () => clientRequest.get("/api/v1/user/me"),

    getClients: (params) => clientRequest.get("/api/v1/client", { params }),
    getClientDashboardKPI: (params) => clientRequest.get("/api/v1/client/dashboard/kpi", { params }),
    getProfitLoss: (params) => clientRequest.get("/api/v1/profit-loss", { params }),
    getRevenueInflows: (params) => clientRequest.get("/api/v1/profit-loss/revenue-inflow", { params }),
    createExpense: (formData) => clientRequest.post("/api/v1/profit-loss/expense", formData),
    getClient: (clientId) => clientRequest.get(`/api/v1/client/${encodeURIComponent(clientId)}`),
    updateClient: (clientId, formData) => clientRequest.patch(
        `/api/v1/client/${encodeURIComponent(clientId)}`,
        formData,
    ),
    updateClientCompany: (clientId, formData) => clientRequest.patch(
        `/api/v1/client/${encodeURIComponent(clientId)}/company`,
        formData,
    ),
    updateClientMember: (memberId, formData) => clientRequest.patch(
        `/api/v1/client/member/${encodeURIComponent(memberId)}`,
        formData,
    ),
    updateClientVehicle: (vehicleId, formData) => clientRequest.patch(
        `/api/v1/client/vehicle/${encodeURIComponent(vehicleId)}`,
        formData,
    ),
    updateClientDriver: (driverId, formData) => clientRequest.patch(
        `/api/v1/client/driver/${encodeURIComponent(driverId)}`,
        formData,
    ),
    updateClientService: (serviceId, formData) => clientRequest.patch(
        `/api/v1/client/service/${encodeURIComponent(serviceId)}`,
        formData,
    ),
    deleteClientService: (serviceId) => clientRequest.delete(
        `/api/v1/client/service/${encodeURIComponent(serviceId)}`,
    ),
    createClientMember: (clientId, formData) => clientRequest.post(
        `/api/v1/client/${encodeURIComponent(clientId)}/member`,
        formData,
    ),
    createClientVehicle: (clientId, formData) => clientRequest.post(
        `/api/v1/client/${encodeURIComponent(clientId)}/vehicle`,
        formData,
    ),
    createClientDriver: (clientId, formData) => clientRequest.post(
        `/api/v1/client/${encodeURIComponent(clientId)}/driver`,
        formData,
    ),
    createClientService: (clientId, formData) => clientRequest.post(
        `/api/v1/client/${encodeURIComponent(clientId)}/service`,
        formData,
    ),
    addClientDocument: (clientId, formData) => clientRequest.post(
        `/api/v1/client/${encodeURIComponent(clientId)}/document`,
        formData,
    ),
    deleteClientDocument: (documentId) => clientRequest.delete(
        `/api/v1/client/document/${encodeURIComponent(documentId)}`,
    ),
    deleteClientRelatedRecord: (recordId, actionOn) => clientRequest.delete(
        "/api/v1/client/related",
        { params: { _id: recordId, actionOn } },
    ),
    createClient: ({ payload, files = [] }) => {
        if (!files.length) return clientRequest.post("/api/v1/client", payload);

        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload));
        files.forEach((file) => formData.append("documents", file));

        return clientRequest.post("/api/v1/client", formData, {
            headers: { "Content-Type": undefined },
        });
    },
    createClientWithService: (formData) => clientRequest.post("/api/v1/clients/with-service", formData),
    getServices: (params) => clientRequest.get("/api/v1/service", { params }),
    createService: (formData) => clientRequest.post("/api/v1/service", formData),
    getClientRenewals: ({ page, limit }) => clientRequest.get("/api/v1/client/renewals", { params: { page, limit } }),
    getClientCompanies: (params) => clientRequest.get("/api/v1/client/companies", { params }),
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
