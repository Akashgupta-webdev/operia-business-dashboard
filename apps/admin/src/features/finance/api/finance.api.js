import clientRequest from "@/app/apiClient";

export const getProfitLoss = (params) => clientRequest.get("/api/v1/profit-loss", { params });

export const getRevenueInflows = (params) => clientRequest.get("/api/v1/profit-loss/revenue-inflow", { params });

export const createExpense = (formData) => clientRequest.post("/api/v1/profit-loss/expense", formData);
