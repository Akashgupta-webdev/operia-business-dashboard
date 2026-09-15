import clientRequest from "@/app/apiClient";

export const getClients = (params) => clientRequest.get("/api/v1/client", { params });

export const getClient = (clientId) => clientRequest.get(`/api/v1/client/${encodeURIComponent(clientId)}`);

export const updateClientCredentials = (clientId, payload) => clientRequest.patch(
    `/api/v1/client/${encodeURIComponent(clientId)}/credentials`,
    payload,
);

export const updateClient = (clientId, formData) => clientRequest.patch(
    `/api/v1/client/${encodeURIComponent(clientId)}`,
    formData,
);

export const createClient = ({ payload, files = [] }) => {
    if (!files.length) return clientRequest.post("/api/v1/client", payload);

    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    files.forEach((file) => formData.append("documents", file));

    return clientRequest.post("/api/v1/client", formData, {
        headers: { "Content-Type": undefined },
    });
};

export const createClientWithService = (formData) => clientRequest.post("/api/v1/clients/with-service", formData);
