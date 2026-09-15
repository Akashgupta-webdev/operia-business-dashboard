import { resetSession } from '../utils/resetSession';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { UNAUTHORIZED_EVENT } from '../constants/auth';

export default function useSessionEvents() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const clearSession = () => {
      void resetSession(queryClient);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, clearSession);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, clearSession);
  }, [queryClient]);
}
