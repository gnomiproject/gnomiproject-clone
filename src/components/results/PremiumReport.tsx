
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
        <h2 className="text-3xl font-bold text-center mb-4">Want a More In-Depth Analysis?</h2>
        
        <p className="text-gray-600 text-center text-lg mb-10">
          Get a comprehensive report tailored specifically for your organization based on your {archetypeData.name} archetype.
        </p>

        <div className="bg-white rounded-lg border p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className={`text-${color} h-6 w-6`} />
            <h3 className="text-xl font-bold">Complete {archetypeData.id} Archetype Analysis</h3>
            <span className={`bg-${color}/10 text-${color} text-xs px-3 py-1 rounded-full font-medium`}>PREMIUM</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-4">Your detailed report includes:</h4>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>›</span>
                  <span>Customized benchmarking against similar organizations</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>›</span>
                  <span>Strategic implementation roadmap with priorities</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>›</span>
                  <span>Cost-saving estimates specific to your business</span>
                </li>
                <li className="flex items-start">
                  <span className={`text-${color} mr-2`}>›</span>
                  <span>Expert consultation with a healthcare strategist</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col justify-center items-center lg:items-end lg:min-w-[300px]">
              <p className="text-gray-600 mb-4 text-center lg:text-right">
                Our team will prepare a custom analysis within 24 hours.
              </p>
              <Button 
                className={`bg-${color} hover:bg-${color}/90 text-white w-full lg:w-auto px-8`}
              >
                Request My Detailed Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumReport;
