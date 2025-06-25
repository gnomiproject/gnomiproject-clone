
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArchetypeDataProvider } from "@/contexts/ArchetypeDataContext";
import ApiRequestMonitor from "@/components/shared/ApiRequestMonitor";
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
import PerformanceMonitor from "./components/shared/PerformanceMonitor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 1,
      retryDelay: 3000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArchetypeDataProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <div className="min-h-screen bg-gray-50">
                <PerformanceMonitor />
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
