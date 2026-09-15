import clientRequest from "@/app/apiClient";

export const login = (formData) => clientRequest.post("/api/v1/auth/login", formData);

export const refresh = () => clientRequest.post("/api/v1/auth/refresh");

export const logout = () => clientRequest.post("/api/v1/auth/logout");

export const logoutAll = () => clientRequest.post("/api/v1/auth/logout-all");

export const changePassword = (formData) => clientRequest.post("/api/v1/auth/change-password", formData);

export const sessions = () => clientRequest.get("/api/v1/auth/session");

export const me = () => clientRequest.get("/api/v1/user/me");
