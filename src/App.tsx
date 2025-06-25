import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArchetypeDataProvider } from "@/contexts/ArchetypeDataContext";
import ApiRequestMonitor from "@/components/shared/ApiRequestMonitor";
import { RenderCounter } from "@/components/shared/PerformanceMonitor";
import Index from "./pages/Index";
import Assessment from "./pages/Assessment";
import Insights from "./pages/Insights";
import About from "./pages/About";
import ReportView from "./pages/ReportView";
import ReportViewer from "./pages/ReportViewer";
import AdminReportViewer from "./pages/AdminReportViewer";
import AdminReportDebug from "./pages/AdminReportDebug";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import FixedHeader from "./components/layout/FixedHeader";
import ErrorBoundary from "./components/shared/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - longer stale time
      gcTime: 30 * 60 * 1000,    // 30 minutes - longer cache time
      retry: 0, // Disable retries to prevent request spam
      retryDelay: 3000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false, // Important: don't refetch on mount if data exists
      // Add network mode and deduplication
      networkMode: 'online',
    },
  },
});

// Add query deduplication logging in development
if (process.env.NODE_ENV !== 'production') {
  queryClient.getQueryCache().subscribe(event => {
    if (event.type === 'added') {
      console.log(`[Query Cache] Added: ${JSON.stringify(event.query.queryKey)}`);
    }
  });
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArchetypeDataProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <div className="min-h-screen bg-gray-50">
                <RenderCounter componentName="App">
                  <ApiRequestMonitor />
                  <FixedHeader />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/assessment" element={<Assessment />} />
                      <Route path="/insights" element={<Insights />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/report/:reportId" element={<ReportView />} />
                      <Route path="/report-viewer/:reportId" element={<ReportViewer />} />
                      <Route path="/admin/report/:reportId" element={<AdminReportViewer />} />
                      <Route path="/admin/report-debug" element={<AdminReportDebug />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </RenderCounter>
              </div>
              <Toaster />
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </ArchetypeDataProvider>
    </QueryClientProvider>
  );
}

export default App;
