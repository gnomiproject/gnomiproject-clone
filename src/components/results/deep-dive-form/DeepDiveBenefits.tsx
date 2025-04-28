
import React from 'react';
import { FileText } from 'lucide-react';

interface DeepDiveBenefitsProps {
  archetypeName: string;
}

const DeepDiveBenefits = ({ archetypeName }: DeepDiveBenefitsProps) => {
  return (
    <>
      <div className="flex items-start gap-3 mb-4">
        <div className="text-red-600 font-bold">
          <FileText size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Get the Full {archetypeName} Report</h3>
          <div className="bg-red-50 text-red-800 text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1">FREE</div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">Deep Dive into This Archetype</p>
      
      <ul className="space-y-4 mb-6">
        <li className="flex items-start gap-2">
          <span className="text-green-600 pt-1">✓</span>
          <span>Comprehensive profile of the {archetypeName} archetype</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600 pt-1">✓</span>
          <span>Detailed analysis of healthcare utilization, cost trends, and condition prevalence</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600 pt-1">✓</span>
          <span>Key behaviors, strengths, and blind spots that define this group</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600 pt-1">✓</span>
          <span>Strategic opportunities to optimize care, access, and spend</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600 pt-1">✓</span>
          <span>Insight into the methodology behind the archetype model</span>
        </li>
      </ul>
      
      <p className="text-gray-700 mb-6">Unlock a richer understanding of your population—delivered straight to your inbox.</p>
    </>
  );
};

export default DeepDiveBenefits;
