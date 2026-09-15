import { hashKey } from '@tanstack/react-query';
import { authKeys } from '../constants/queryKeys';

// Keep the observed session query attached while clearing account-specific data.
export async function resetSession(queryClient) {
  await queryClient.cancelQueries();
  queryClient.removeQueries({ predicate: query => query.queryHash !== hashKey(authKeys.session) });
  queryClient.setQueryData(authKeys.session, null);
}
