
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { archetypes } from '@/data/adminArchetypes';

const AdminReportsPanel = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'deepdive'>('insights');

  const openReport = (archetypeId: string) => {
    const path = activeTab === 'insights' 
      ? `/report/${archetypeId}/admin-view`
      : `/report/${archetypeId}/admin-view`;
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6 space-x-4">
        <button 
          className={`px-4 py-2 rounded transition-colors ${
            activeTab === 'insights' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('insights')}
        >
          Insights Reports
        </button>
        <button 
          className={`px-4 py-2 rounded transition-colors ${
            activeTab === 'deepdive' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('deepdive')}
        >
          Deep Dive Reports
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archetypes.map(archetype => (
          <Card key={archetype.id} className="p-4">
            <h3 className="font-bold text-lg mb-2">{archetype.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{archetype.description}</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              onClick={() => openReport(archetype.id)}
            >
              View {activeTab === 'insights' ? 'Insights' : 'Deep Dive'} Report
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReportsPanel;
