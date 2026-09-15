import clientRequest from "@/app/apiClient";

export const deleteClientRelatedRecord = (recordId, actionOn) => clientRequest.delete(
    "/api/v1/client/related",
    { params: { _id: recordId, actionOn } },
);
