
import React from 'react';
import Button from '@/components/shared/Button';
import { ArchetypeDetailedData } from '@/types/archetype';
import { FileText } from 'lucide-react';

interface PremiumReportProps {
  archetypeData: ArchetypeDetailedData;
}

const PremiumReport = ({ archetypeData }: PremiumReportProps) => {
  const color = `archetype-${archetypeData.id}`;

  return (
    <div className="bg-gray-50 px-8 py-12 border-t">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Want to go deeper on your archetype?</h2>
        
        <div className="bg-white rounded-lg border p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <FileText className={`text-${color} h-6 w-6`} />
                <h3 className="text-xl font-bold">
                  Get the Full Engaged {archetypeData.name} Report
                </h3>
                <span className={`bg-${color}/10 text-${color} text-xs px-3 py-1 rounded-full font-medium`}>FREE</span>
              </div>
              
              <p className="text-gray-700 mb-6 text-left">
                Deep Dive into This Archetype
              </p>

              <ul className="space-y-6 text-left mb-6">
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Comprehensive profile of the {archetypeData.name} archetype</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Detailed analysis of healthcare utilization, cost trends, and condition prevalence</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Key behaviors, strengths, and blind spots that define this group</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Strategic opportunities to optimize care, access, and spend</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-3 flex-shrink-0 text-lg`}>✓</span>
                  <span>Insight into the methodology behind the archetype model</span>
                </li>
              </ul>
              
              <p className="text-gray-600 mb-6 text-left">
                Unlock a richer understanding of your population—delivered straight to your inbox.
              </p>
              
              <Button 
                className={`bg-${color} hover:bg-${color}/90 text-white w-full lg:w-auto px-8`}
              >
                Request your full report now
              </Button>
            </div>
            
            <div className="hidden lg:flex flex-col justify-center items-center">
              <img 
                src="/lovable-uploads/a1c0aade-d5e8-4602-b139-27202ba32c31.png" 
                alt="Data gnome" 
                className="w-48 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumReport;
