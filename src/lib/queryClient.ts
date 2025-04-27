
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Increased stale time to reduce unnecessary refetches
      staleTime: 1000 * 60 * 15, // 15 minutes
      // More aggressive caching - using 'gcTime' instead of 'cacheTime' which is deprecated
      gcTime: 1000 * 60 * 30, // 30 minutes
      // Only retry once to avoid hammering the API during issues
      retry: 1,
      // Disable automatic refetching on window focus for API-intensive pages
      refetchOnWindowFocus: false,
      // Disable automatic refetching on reconnect for more stability
      refetchOnReconnect: false,
    },
  },
});
