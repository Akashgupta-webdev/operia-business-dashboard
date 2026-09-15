import { useQuery } from '@tanstack/react-query';
import { getSession } from '../api/auth.api';
import { authKeys } from '../constants/queryKeys';

export default function useAuthSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: getSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: true,
  });
}
