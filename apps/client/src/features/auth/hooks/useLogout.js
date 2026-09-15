import { resetSession } from '../utils/resetSession';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/auth.api';

export default function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await resetSession(queryClient);
    },
  });
}
