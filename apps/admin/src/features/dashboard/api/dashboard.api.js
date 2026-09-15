import clientRequest from "@/app/apiClient";

export const getClientDashboardKPI = (params) => clientRequest.get("/api/v1/client/dashboard/kpi", { params });
