import clientRequest from "@/app/apiClient";

import { normalizeInvoice, normalizeInvoiceListItem } from "../utils/normalizeInvoice.js";

const route = "/api/v1/client/invoices";
export async function getInvoices(params, signal) {
  const response = (await clientRequest.get(route, { params, signal })).data;
  return { ...response, data: response.data.map(normalizeInvoiceListItem) };
}
export async function getInvoice(id, signal) {
  return normalizeInvoice((await clientRequest.get(`${route}/${encodeURIComponent(id)}`, { signal })).data.data);
}
export async function saveInvoice({ id, payload }) {
  const response = id
    ? await clientRequest.patch(`${route}/${encodeURIComponent(id)}`, payload)
    : await clientRequest.post(route, payload);
  return response.data.data;
}
export async function deleteInvoice({ id, version }) {
  return (await clientRequest.delete(`${route}/${encodeURIComponent(id)}`, { params: { expectedVersion: version } })).data.data;
}
