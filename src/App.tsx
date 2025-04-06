
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Index from './pages/Index';
import About from './pages/About';
import Assessment from './pages/Assessment';
import Insights from './pages/Insights';
import Results from './pages/Results';
import NotFound from './pages/NotFound';
import ColorSafelist from './components/utils/ColorSafelist';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {/* Hidden component to ensure color classes are included in the build */}
        <ColorSafelist />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
