import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { Logger } from './utils/logger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Auto refetch in background for fresh data
      retry: (failureCount, error: any) => {
        // Only retry safe network errors, don't retry client errors like 401, 403, 404
        if (error?.statusCode >= 400 && error?.statusCode < 500) {
           return false;
        }
        return failureCount < 2; // Retry 2 times max for 5xx or network errors
      },
      staleTime: 1000 * 60 * 5, // 5 minutes cache before becoming stale
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      Logger.error(`Global Query Error:`, error.message);
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      Logger.error(`Global Mutation Error:`, error.message);
    }
  })
});
