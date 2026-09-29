import apiClient from '@/app/apiClient';

export async function getDocuments({ page, search, documentTitle, clientName }, signal) {
  const response = await apiClient.get('/api/v1/client/documents', {
    params: { page, limit: 50, search: search || undefined, documentTitle: documentTitle || undefined, clientName: clientName || undefined },
    signal,
  });
  return response.data;
}
