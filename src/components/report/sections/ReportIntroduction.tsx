
import React from 'react';
import { format } from 'date-fns';
import { ArchetypeId } from '@/types/archetype';
import { getArchetypeColorHex } from '@/data/colors';
import { Badge } from '@/components/ui/badge';

interface ReportIntroductionProps {
  userData: any;
  archetypeId?: ArchetypeId;
  archetypeName?: string;
  familyName?: string;
  shortDescription?: string;
}

const ReportIntroduction = ({ 
  userData,
  archetypeId = 'a1' as ArchetypeId,
  archetypeName,
  familyName,
  shortDescription
}: ReportIntroductionProps) => {
  // Get report date and basic user data
  const reportDate = userData?.created_at ? format(new Date(userData.created_at), 'MMMM d, yyyy') : 'N/A';
  const employeeCount = userData?.exact_employee_count || userData?.assessment_result?.exactData?.employeeCount;
  const archetypeColor = archetypeId ? getArchetypeColorHex(archetypeId) : '#00B0F0';
  
  // Get archetype data with better fallbacks
  const displayArchetypeName = archetypeName || userData?.archetype_name || userData?.assessment_result?.archetype?.name || 'Unknown Archetype';
  const displayFamilyName = familyName || userData?.family_name || userData?.assessment_result?.family?.name || 'Unknown Family';
  const displayDescription = shortDescription || userData?.short_description || '';
  
  console.log('[ReportIntroduction] Rendering with:', {
    archetypeId,
    archetypeName: displayArchetypeName,
    familyName: displayFamilyName,
    color: archetypeColor,
  });

  return (
    <div className="mb-12 print:mb-8">
      <div className="print:hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Deep Dive Report
            </h1>
            <p className="text-gray-500 mt-2">
              Comprehensive analysis for your organization
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-600">
              <span>
                Prepared for: <span className="font-semibold">{userData?.name || 'N/A'}</span>
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {userData?.organization || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Report Date: {reportDate}
            </p>
            {employeeCount && (
              <p className="text-sm text-gray-600 mt-1">
                Organization Size: {employeeCount.toLocaleString()} employees
              </p>
            )}
          </div>
        </div>
        
        <div 
          className="h-1 w-full rounded-full mb-6"
          style={{ background: `linear-gradient(to right, ${archetypeColor}, ${archetypeColor}90, ${archetypeColor}70)` }}
        ></div>
      </div>
      
      {/* For print version */}
      <div className="hidden print:block mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Deep Dive Report</h1>
          <p className="text-gray-600 text-sm">
            Generated: {reportDate}
          </p>
        </div>
        <div className="h-0.5 w-full bg-gray-300 mt-2"></div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About This Report</h2>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-3">
            Based on your assessment results, your company most closely matches{' '}
            <span className="font-semibold">{displayArchetypeName}</span>{' '}
            <span 
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: `${archetypeColor}20`, color: archetypeColor }}
            >
              [{archetypeId.toUpperCase()}]
            </span>, which is part of the "{displayFamilyName}" family.
          </p>
        </div>
        
        {displayDescription && (
          <p className="text-gray-700 mb-4">
            {displayDescription}
          </p>
        )}
        
        <p className="text-gray-700 mb-4">
          This comprehensive deep dive report provides an in-depth analysis of your organization's healthcare archetype, 
          including detailed metrics, strategic recommendations, and actionable insights tailored specifically to {displayArchetypeName}.
        </p>
        
        <p className="text-gray-700 mb-4">
          The report examines key health factors across demographics, utilization patterns, risk factors, 
          cost analysis, care gaps, and disease management. Each section includes comparison data against 
          population averages to provide context for the findings, with special attention to the areas where {displayArchetypeName} typically excel or face challenges.
        </p>
        
        <div className="mt-5">
          <h3 className="text-lg font-semibold mb-2">How to Use This Report</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Review each section for detailed analysis relevant to {displayArchetypeName}</li>
            <li>Use the navigation sidebar to jump between sections</li>
            <li>Focus on the Strategic Recommendations for actionable steps designed for your archetype</li>
            <li>Use the SWOT Analysis to understand strengths and opportunities unique to your archetype classification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportIntroduction;
