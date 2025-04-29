
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const ReportView = () => {
  const { archetypeId, token } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Report View</h1>
        <p className="text-gray-600">
          Viewing report for archetype: {archetypeId || 'No archetype specified'}
        </p>
        {token && (
          <p className="text-gray-600 mt-2">
            Access token: {token.substring(0, 5)}...
          </p>
        )}
      </Card>
    </div>
  );
};

export default ReportView;
