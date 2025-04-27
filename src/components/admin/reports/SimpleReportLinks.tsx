
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { archetypes } from '@/data/adminArchetypes';

interface SimpleReportLinksProps {
  reportType: 'insights' | 'deepdive';
}

const SimpleReportLinks: React.FC<SimpleReportLinksProps> = ({ reportType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {archetypes.map(archetype => {
        const reportUrl = reportType === 'insights' 
          ? `/insights/report/${archetype.id}`
          : `/report/${archetype.id}/admin-view`;
          
        return (
          <Card key={archetype.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <h3 className="font-bold text-lg mb-2">{archetype.name}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{archetype.description}</p>
                <a 
                  href={reportUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                  <span>View {reportType === 'insights' ? 'Insights' : 'Deep Dive'} Report</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SimpleReportLinks;
