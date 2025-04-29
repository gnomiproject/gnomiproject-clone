
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { DebugProvider } from '@/components/debug/DebugProvider';

const ReportViewer = () => {
  const { archetypeId, token } = useParams();
  
  return (
    <DebugProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Report Viewer</h1>
          <p className="text-gray-600">
            Viewing report for archetype: {archetypeId || 'No archetype specified'}
          </p>
          {token && (
            <p className="text-gray-600 mt-2">
              Access token: {token.substring(0, 5)}...
            </p>
          )}
          <p className="mt-4 text-sm bg-blue-50 p-3 rounded border border-blue-100">
            Try adding <code>?debug=datasources</code> to the URL to activate debug mode.
            <br />
            You can also press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> to toggle debug mode.
          </p>
        </Card>
      </div>
    </DebugProvider>
  );
};

export default ReportViewer;
