import client from "@/app/apiClient";
import { normalizeDto } from "../utils/vat.js";
const root = "/api/v1/client";
const malformed = () => { throw new Error("Invalid API response; reload before retrying a write."); };
const serviceResult = (service) => {
  if (!service?.id || service.serviceCode !== "VAT_RETURN_FILING" || !service.details?.vat || !Number.isInteger(service.version)) malformed();
  return service;
};
async function unwrap(request) {
  const response = await request;
  if (!response.data || typeof response.data !== "object" || !("data" in response.data)) malformed();
  return normalizeDto(response.data);
}
const writeConfig = { vatWrite: true };
export const getVatAdmin = async ({ signal }) => {
  const result = await unwrap(client.get("/api/v1/me", { signal }));
  return result.data?.user ?? result.data;
};
export async function listVat(params, signal) {
  const result = await unwrap(client.get(`${root}/services`, { params: { ...params, serviceCode: "VAT_RETURN_FILING" }, signal }));
  if (!Array.isArray(result.data) || !Number.isInteger(result.page?.number) || typeof result.page?.hasMore !== "boolean") malformed();
  result.data.forEach(serviceResult);
  return result;
}
export async function detailVat(id, signal) {
  const { data } = await unwrap(client.get(`${root}/service/${encodeURIComponent(id)}`, { signal }));
  serviceResult(data?.service);
  if (!Array.isArray(data.documents)) malformed();
  return data;
}
export async function listCompanies(params, signal) {
  const result = await unwrap(client.get(`${root}/companies`, { params, signal }));
  if (!Array.isArray(result.data) || !Number.isInteger(result.page?.page) || !Number.isInteger(result.page?.totalPages)) malformed();
  return result;
}
export const createVat = async (clientId, payload) => serviceResult((await unwrap(client.post(`${root}/${encodeURIComponent(clientId)}/service`, payload, writeConfig))).data);
export const commandVat = async (id, action, payload) => {
  const path = `${root}/service/${encodeURIComponent(id)}`;
  const result = await unwrap(action === "fee" ? client.patch(path, payload, writeConfig) : client.post(`${path}/vat/${action}`, payload, writeConfig));
  const data = action === "fee" ? { service: result.data } : result.data;
  serviceResult(data?.service);
  if (action === "create-next-period") serviceResult(data.nextService);
  return data;
};
export async function uploadVat(service, purpose, file) {
  if (!file || file.size > 10 * 1024 * 1024) throw Object.assign(new Error("Choose a file of at most 10 MiB."), { response: { status: 422, data: { error: { message: "Choose a file of at most 10 MiB." } } } });
  const body = new FormData();
  body.append("documents", file); body.append("service", service.id); body.append("purpose", purpose);
  body.append("documentType", "Other"); body.append("documentTitle", file.name.slice(0, 200));
  const { data } = await unwrap(client.post(`${root}/${encodeURIComponent(service.client)}/document`, body, { ...writeConfig, headers: { "Content-Type": undefined } }));
  if (!data?.id) malformed();
  return data;
}
