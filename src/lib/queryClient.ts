
import { QueryClient } from '@tanstack/react-query';
import { isAdmin } from '@/integrations/supabase/client';

// Create query client with settings optimized based on user mode
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Admin mode uses more aggressive settings to reduce load
      staleTime: isAdmin ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60, // 24 hours for admin, 1 hour for normal
      gcTime: isAdmin ? 1000 * 60 * 60 * 24 : 1000 * 60 * 120, // 24 hours for admin, 2 hours for normal
      retry: isAdmin ? 0 : 1, // No retries for admin to avoid hammering API
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
