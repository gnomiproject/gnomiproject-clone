
import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 1,
      retryDelay: 3000,
    },
  },
});

// Config for static data that shouldn't expire (like reports)
export const staticDataQueryOptions = {
  staleTime: Infinity,    // Never consider data stale
  gcTime: Infinity,       // Never garbage collect
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
};

// Config specifically for report data that includes fallback and error handling
export const reportDataQueryOptions = {
  ...staticDataQueryOptions,
  retry: 1,               // Limit retries
  retryDelay: 5000,       // Longer delay between retries
  // Add specialized error handlers in the components using this config
};
