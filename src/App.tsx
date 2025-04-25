
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar from '@/components/layout/Navbar';
import Index from '@/pages/Index';
import Assessment from '@/pages/Assessment';
import Results from '@/pages/Results';
import DeepReport from '@/pages/DeepReport';
import Insights from '@/pages/Insights';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';
import DirectReport from '@/pages/DirectReport';
import ArchetypeDeepReport from '@/pages/ArchetypeDeepReport';

const version = "0.0.1";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/deep-report" element={<DeepReport />} />
            <Route path="/direct-report/:archetypeId" element={<DirectReport />} />
            <Route path="/archetype-report/:archetypeId" element={<ArchetypeDeepReport />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
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
