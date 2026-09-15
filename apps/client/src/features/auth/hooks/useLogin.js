import { resetSession } from '../utils/resetSession';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession, login } from '../api/auth.api';
import { authKeys } from '../constants/queryKeys';

export default function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      await login(payload);
      await resetSession(queryClient);
      const session = await queryClient.fetchQuery({ queryKey: authKeys.session, queryFn: getSession, staleTime: 0 });
      if (!session) throw new Error('Session unavailable');
      return session;
    },
  });
}
