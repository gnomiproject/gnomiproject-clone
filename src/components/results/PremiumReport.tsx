
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
        
        <p className="text-gray-600 text-center text-lg mb-10">
          Get your free, personalized 15+ page report
        </p>

        <div className="bg-white rounded-lg border p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className={`text-${color} h-6 w-6`} />
            <h3 className="text-xl font-bold">Complete {archetypeData.name} Analysis</h3>
            <span className={`bg-${color}/10 text-${color} text-xs px-3 py-1 rounded-full font-medium`}>FREE</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>✓</span>
                  <span>In-depth profile of the {archetypeData.name} archetype</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>✓</span>
                  <span>Key cost drivers and healthcare behaviors specific to your organization</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>✓</span>
                  <span>How your utilization patterns compare across all nine archetypes</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>✓</span>
                  <span>Strategic recommendations tailored to your archetype's strengths and blind spots</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>✓</span>
                  <span>A detailed look at disease prevalence, care access, and spending trends</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col justify-center items-center lg:items-end lg:min-w-[300px]">
              <p className="text-gray-600 mb-4 text-center lg:text-right">
                Unlock a richer understanding of your population—delivered straight to your inbox.
              </p>
              <Button 
                className={`bg-${color} hover:bg-${color}/90 text-white w-full lg:w-auto px-8`}
              >
                Request your full report now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumReport;
