
import React from 'react';
import Button from '@/components/shared/Button';
import { ArchetypeDetailedData } from '@/types/archetype';

interface PremiumReportProps {
  archetypeData: ArchetypeDetailedData;
}

const PremiumReport = ({ archetypeData }: PremiumReportProps) => {
  const color = `archetype-${archetypeData.id}`;

  return (
    <div className="bg-gray-50 px-8 py-6 border-t">
      <h3 className="text-xl font-bold mb-4">Want a More In-Depth Analysis?</h3>
      <p className="text-gray-600 mb-6">
        Get a comprehensive report tailored specifically for your organization based on your {archetypeData.name} archetype.
      </p>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-${color} text-xl`}>📄</span>
          <h4 className="text-xl font-bold">Complete {archetypeData.id} Archetype Analysis</h4>
          <span className={`bg-${color}/10 text-${color} text-xs px-2 py-1 rounded-full`}>PREMIUM</span>
        </div>

        <h5 className="font-bold mb-4">Your detailed report includes:</h5>

        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className={`text-${color} mr-2`}>→</span>
            <span>Customized benchmarking against similar organizations</span>
          </li>
          <li className="flex items-start">
            <span className={`text-${color} mr-2`}>→</span>
            <span>Strategic implementation roadmap with priorities</span>
          </li>
          <li className="flex items-start">
            <span className={`text-${color} mr-2`}>→</span>
            <span>Cost-saving estimates specific to your business</span>
          </li>
          <li className="flex items-start">
            <span className={`text-${color} mr-2`}>→</span>
            <span>Expert consultation with a healthcare strategist</span>
          </li>
        </ul>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600 mb-4 md:mb-0">
            Our team will prepare a custom analysis within 24 hours.
          </p>
          <Button className={`bg-${color} hover:bg-${color}/90 text-white w-full md:w-auto`}>
            Request My Detailed Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumReport;
