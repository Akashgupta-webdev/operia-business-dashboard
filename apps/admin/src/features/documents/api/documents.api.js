import apiClient from '@/app/apiClient';

export async function getDocuments({ page, limit = 50, search }, signal) {
  const response = await apiClient.get('/api/v1/client/documents', {
    params: { page, limit, search: search || undefined },
    signal,
  });
  return response.data;
}
