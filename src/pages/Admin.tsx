
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Static list of archetypes - no data fetching
const archetypes = [
  { id: 'a1', name: 'Savvy Healthcare Navigators', family: 'a' },
  { id: 'a2', name: 'Complex Condition Managers', family: 'a' },
  { id: 'a3', name: 'Proactive Care Consumers', family: 'a' },
  { id: 'b1', name: 'Resourceful Adapters', family: 'b' },
  { id: 'b2', name: 'Healthcare Pragmatists', family: 'b' },
  { id: 'b3', name: 'Care Channel Optimizers', family: 'b' },
  { id: 'c1', name: 'Scalable Access Architects', family: 'c' },
  { id: 'c2', name: 'Care Adherence Advocates', family: 'c' },
  { id: 'c3', name: 'Engaged Healthcare Consumers', family: 'c' }
];

const Admin = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Reports Access</CardTitle>
          <CardDescription>
            View insights and deep dive reports for all archetypes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Insights Reports Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Insights Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {archetypes.map(archetype => (
                  <a 
                    key={`insights-${archetype.id}`}
                    href={`/insights/report/${archetype.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded hover:bg-gray-100 transition-colors"
                  >
                    <span className="inline-block px-2 py-1 mr-2 bg-gray-200 rounded text-sm">
                      {archetype.family.toUpperCase()}
                    </span>
                    {archetype.name}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Deep Dive Reports Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Deep Dive Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {archetypes.map(archetype => (
                  <a 
                    key={`deepdive-${archetype.id}`}
                    href={`/report/${archetype.id}/admin-view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded hover:bg-gray-100 transition-colors"
                  >
                    <span className="inline-block px-2 py-1 mr-2 bg-gray-200 rounded text-sm">
                      {archetype.family.toUpperCase()}
                    </span>
                    {archetype.name}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Experiencing performance issues?</strong> Try our static HTML version:
              </p>
              <a 
                href="/admin-reports.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 text-sm inline-flex items-center"
              >
                Open Static Report Links
                <svg 
                  className="ml-1 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500 mt-4 p-4 bg-gray-50 rounded-lg">
        <p><strong>Note:</strong> Reports will open in a new tab to prevent browser resource limitations.</p>
        <p className="mt-2">If you encounter any issues with report loading, try clearing your browser cache or using a different browser.</p>
      </div>
    </div>
  );
};

export default Admin;
