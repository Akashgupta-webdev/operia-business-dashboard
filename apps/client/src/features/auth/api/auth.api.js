import apiClient from '@/app/apiClient';
import { AUTH_ENDPOINTS } from '../constants/auth';

export const login = (payload) => apiClient.post(AUTH_ENDPOINTS.login, payload);
export async function getSession() {
  try {
    const response = await apiClient.get(AUTH_ENDPOINTS.session);
    return response.data.data ?? null;
  } catch (error) {
    if (error.response?.status === 401) return null;
    throw error;
  }
}
export async function logout() {
  try {
    await apiClient.post(AUTH_ENDPOINTS.logout);
  } catch (error) {
    if (error.response?.status !== 401) throw error;
  }
}
