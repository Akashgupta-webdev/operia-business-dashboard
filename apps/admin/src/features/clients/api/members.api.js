import clientRequest from "@/app/apiClient";

export const updateClientMember = (memberId, formData) => clientRequest.patch(
    `/api/v1/client/member/${encodeURIComponent(memberId)}`,
    formData,
);

export const createClientMember = (clientId, formData) => clientRequest.post(
    `/api/v1/client/${encodeURIComponent(clientId)}/member`,
    formData,
);
