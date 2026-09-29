import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '../api/documents.api';
import { documentKeys } from '../constants/queryKeys';

export default function useDocuments(filters) {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: ({ signal }) => getDocuments(filters, signal),
  });
}
