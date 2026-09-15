import clientRequest from "@/app/apiClient";

export const getClientRenewals = ({ page, limit }) => clientRequest.get("/api/v1/client/renewals", { params: { page, limit } });
