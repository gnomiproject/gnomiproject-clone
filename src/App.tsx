
import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import FixedHeader from '@/components/layout/FixedHeader';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Assessment from '@/pages/Assessment';
import Insights from '@/pages/Insights'; // Direct import to avoid dynamic loading issues

// Lazy load other non-critical routes
const About = lazy(() => import('@/pages/About'));
const Admin = lazy(() => import('@/pages/Admin'));
const ReportView = lazy(() => import('@/pages/ReportView'));
const ReportViewer = lazy(() => import('@/pages/ReportViewer'));
const AdminReportViewer = lazy(() => import('@/pages/AdminReportViewer'));
const AdminReportDebug = lazy(() => import('@/pages/AdminReportDebug'));
const ReportEmailDiagnostic = lazy(() => import('@/components/report/ReportEmailDiagnostic'));
const ReactQueryDevtools = lazy(() => 
  import('@tanstack/react-query-devtools').then(module => ({
    default: module.ReactQueryDevtools
  }))
);

const version = "0.0.3"; // Version number

// Loading fallback for lazy components
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-pulse text-center">
      <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
    </div>
  </div>
);

function App() {
  // Add module loading error tracking
  useEffect(() => {
    console.log("App rendering: Routes initialized");
    
    // Add global error handler for resource loading failures
    const handleError = (event) => {
      console.error("Resource loading error:", {
        url: event.target?.src || event.target?.href || 'unknown',
        type: event.target?.tagName || 'unknown'
      });
    };
    
    window.addEventListener('error', handleError, true);
    return () => window.removeEventListener('error', handleError, true);
  }, []);
  
  return (
    <BrowserRouter>
      <div className="app">
        {/* Fixed header on all pages */}
        <FixedHeader />
        
        {/* Routes without padding to account for header (individual pages will handle their own padding) */}
        <main>
          <Routes>
            {/* Main application routes */}
            <Route path="/" element={<Index />} />
            
            {/* Direct render for Assessment and Insights to fix dynamic import issues */}
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/report/:archetypeId" element={<Insights />} />
            
            {/* All other routes are lazy loaded */}
            <Route path="/about" element={
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            } />
            
            {/* Report routes - these will handle their own headers */}
            <Route path="/report/:archetypeId/:token" element={
              <Suspense fallback={<PageLoader />}>
                <ReportViewer />
              </Suspense>
            } />
            
            <Route path="/report/:archetypeId" element={
              <Suspense fallback={<PageLoader />}>
                <ReportViewer />
              </Suspense>
            } />
            
            <Route path="/report-view/:archetypeId" element={
              <Suspense fallback={<PageLoader />}>
                <ReportView />
              </Suspense>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <Suspense fallback={<PageLoader />}>
                <Admin />
              </Suspense>
            } />
            
            <Route path="/admin/insights-report/:archetypeId" element={
              <Suspense fallback={<PageLoader />}>
                <AdminReportViewer />
              </Suspense>
            } />
            
            <Route path="/admin/report/:archetypeId" element={
              <Suspense fallback={<PageLoader />}>
                <AdminReportViewer />
              </Suspense>
            } />
            
            <Route path="/admin/debug/:archetypeId" element={
              <Suspense fallback={<PageLoader />}>
                <AdminReportDebug />
              </Suspense>
            } />
            
            {/* Email diagnostics routes */}
            <Route path="/admin/email-diagnostics" element={
              <Suspense fallback={<PageLoader />}>
                <ReportEmailDiagnostic />
              </Suspense>
            } />
            
            <Route path="/admin/report-diagnostics" element={
              <Suspense fallback={<PageLoader />}>
                <ReportEmailDiagnostic initialTab="report-diagnostic" />
              </Suspense>
            } />
            
            <Route path="/admin/report-diagnostics/:archetypeId/:token" element={
              <Suspense fallback={<PageLoader />}>
                <ReportEmailDiagnostic initialTab="report-diagnostic" />
              </Suspense>
            } />
            
            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
        {import.meta.env.DEV && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
export { version };
