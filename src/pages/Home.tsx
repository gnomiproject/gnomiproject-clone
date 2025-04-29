
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to <span className="text-blue-600">Healthcare Analytics</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Discover insights about healthcare archetypes and explore detailed reports.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/report-viewer/a1/demo">View Sample Report</Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link to="/insights/a1">View Insights</Link>
          </Button>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Debug Tools</h2>
          <p className="text-gray-600 mb-4">
            This application includes built-in debugging tools. To activate debug mode:
          </p>
          <ul className="text-left list-disc list-inside space-y-2">
            <li>Add <code>?debug=datasources</code> to any URL</li>
            <li>Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded">Alt</kbd> + <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded">Shift</kbd> + <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded">D</kbd> to toggle debug mode</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
