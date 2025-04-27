
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar from '@/components/layout/Navbar';
import Index from '@/pages/Index';
import Assessment from '@/pages/Assessment';
import Insights from '@/pages/Insights';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';
import ReportView from '@/pages/ReportView';
import ReportViewer from '@/pages/ReportViewer';
import AdminReportViewer from '@/pages/AdminReportViewer';

const version = "0.0.1";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            {/* Main application routes */}
            <Route path="/" element={<Index />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/about" element={<About />} />
            
            {/* Standard report routes */}
            <Route path="/insights/report/:archetypeId" element={<ReportViewer />} />
            <Route path="/report/:archetypeId" element={<ReportViewer />} />
            <Route path="/report/:archetypeId/:token" element={<ReportViewer />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<Admin />} />
            
            {/* Admin-specific lightweight report viewers */}
            <Route path="/admin/insights-report/:archetypeId" element={<AdminReportViewer />} />
            <Route path="/admin/report/:archetypeId" element={<AdminReportViewer />} />
            
            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </div>
    </BrowserRouter>
  );
}

export default App;
export { version };
