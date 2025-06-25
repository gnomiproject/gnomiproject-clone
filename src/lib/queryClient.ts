
import { QueryClient } from '@tanstack/react-query';
import { isAdmin } from '@/integrations/supabase/client';

// Create query client with maximum deduplication for development
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Infinite cache in development to prevent any refetching
      staleTime: process.env.NODE_ENV === 'development' ? Infinity : (isAdmin ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60),
      gcTime: process.env.NODE_ENV === 'development' ? Infinity : (isAdmin ? 1000 * 60 * 60 * 24 : 1000 * 60 * 120),
      retry: 0, // No retries to avoid duplicate requests
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      // Disable all automatic refetching in development
      refetchInterval: false,
      refetchIntervalInBackground: false,
      // Enable request deduplication
      enabled: true,
    },
  },
});

// Add a method to inspect cache state for debugging
queryClient.getQueryCache().subscribe(event => {
  if (process.env.NODE_ENV !== 'production') {
    if (event.type === 'added' || event.type === 'removed') {
      console.log(`[QueryClient] Query cache ${event.type}: `, event.query.queryKey);
    }
  }
});
