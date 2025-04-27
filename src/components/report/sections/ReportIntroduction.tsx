
import React from 'react';

interface ReportIntroductionProps {
  archetypeName: string;
  archetypeId: string;
  userData: any;
  isAdminView?: boolean;
}

const ReportIntroduction = ({ 
  archetypeName, 
  archetypeId, 
  userData,
  isAdminView = false
}: ReportIntroductionProps) => {
  const formattedArchetypeId = archetypeId.toUpperCase();
  
  return (
    <div className="mb-12 print:mb-8">
      <div className="print:hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Deep Dive Report
            </h1>
            <p className="text-gray-500 mt-2">
              Comprehensive analysis for Archetype {formattedArchetypeId}: {archetypeName}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-600">
              {isAdminView ? (
                <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                  Admin Preview
                </span>
              ) : (
                <span>
                  Prepared for: <span className="font-semibold">{userData?.name || 'N/A'}</span>
                </span>
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {isAdminView ? 
                'Sample Organization' : 
                (userData?.organization || 'N/A')
              }
            </p>
          </div>
        </div>
        
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-6"></div>
      </div>
      
      {/* For print version */}
      <div className="hidden print:block mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Deep Dive Report: {archetypeName}</h1>
          <p className="text-gray-600 text-sm">
            Archetype {formattedArchetypeId}
          </p>
        </div>
        <div className="h-0.5 w-full bg-gray-300 mt-2"></div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About This Report</h2>
        
        <p className="text-gray-700 mb-3">
          This comprehensive deep dive report provides an in-depth analysis of the <strong>{archetypeName}</strong> archetype 
          (ID: {formattedArchetypeId}), including detailed metrics, strategic recommendations, and actionable insights.
        </p>
        
        <p className="text-gray-700">
          The report examines key health factors across demographics, utilization patterns, risk factors, 
          cost analysis, care gaps, and disease management. Each section includes comparison data against 
          population averages to provide context for the findings.
        </p>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">How to Use This Report</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Review the Executive Summary for key highlights</li>
            <li>Examine each section for detailed analysis</li>
            <li>Focus on the Strategic Recommendations for actionable steps</li>
            <li>Use the SWOT Analysis to understand strengths and opportunities</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportIntroduction;
