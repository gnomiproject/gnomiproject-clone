
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/layout/Navbar';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Lazy load non-critical routes to improve initial loading performance
const Assessment = lazy(() => import('@/pages/Assessment'));
const Insights = lazy(() => import('@/pages/Insights'));
const About = lazy(() => import('@/pages/About'));
const Admin = lazy(() => import('@/pages/Admin'));
const ReportView = lazy(() => import('@/pages/ReportView'));
const ReportViewer = lazy(() => import('@/pages/ReportViewer'));
const AdminReportViewer = lazy(() => import('@/pages/AdminReportViewer'));
const AdminReportDebug = lazy(() => import('@/pages/AdminReportDebug'));
const ReactQueryDevtools = lazy(() => 
  import('@tanstack/react-query-devtools').then(module => ({
    default: module.ReactQueryDevtools
  }))
);

const version = "0.0.3"; // Updated version number

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
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            {/* Main application routes - Index is critical, so not lazy loaded */}
            <Route path="/" element={<Index />} />
            
            {/* All other routes are lazy loaded */}
            <Route path="/assessment" element={
              <Suspense fallback={<PageLoader />}>
                <Assessment />
              </Suspense>
            } />
            
            <Route path="/insights" element={
              <Suspense fallback={<PageLoader />}>
                <Insights />
              </Suspense>
            } />
            
            <Route path="/about" element={
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            } />
            
            {/* Report routes */}
            <Route path="/insights/report/:archetypeId" element={
              <Suspense fallback={<PageLoader />}>
                <Insights />
              </Suspense>
            } />
            
            <Route path="/report/:archetypeId" element={
              <Suspense fallback={<PageLoader />}>
                <ReportViewer />
              </Suspense>
            } />
            
            <Route path="/report/:archetypeId/:token" element={
              <Suspense fallback={<PageLoader />}>
                <ReportViewer />
              </Suspense>
            } />
            
            <Route path="/report-view/:archetypeId" element={
              <Suspense fallback={<PageLoader />}>
                <ReportView />
              </Suspense>
            } /> {/* Legacy route */}
            
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
