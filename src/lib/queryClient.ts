
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Significantly increased stale time to reduce unnecessary refetches
      staleTime: 1000 * 60 * 60, // 60 minutes
      // More aggressive caching - using 'gcTime' instead of 'cacheTime' which is deprecated
      gcTime: 1000 * 60 * 120, // 2 hours
      // Only retry once to avoid hammering the API during issues
      retry: 1,
      // Disable automatic refetching completely
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      // Enable request deduplication
      enabled: true,
    },
  },
});

// Add a method to inspect cache state for debugging
queryClient.getQueryCache().subscribe(event => {
  if (process.env.NODE_ENV !== 'production') {
    if (event.type === 'added' || event.type === 'removed') {
      console.log(`Query cache ${event.type}: `, event.query.queryKey);
    }
  }
});
