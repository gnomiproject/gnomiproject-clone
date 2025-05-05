import React from 'react';
import { format } from 'date-fns';
import { ArchetypeId } from '@/types/archetype';
import { getArchetypeColorHex } from '@/data/colors';
import { Badge } from '@/components/ui/badge';
import WebsiteImage from '@/components/common/WebsiteImage';

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
  
  // Keep logger for debugging
  console.log('[ReportIntroduction] Rendering with:', {
    archetypeId,
    archetypeName,
    familyName,
    color: archetypeColor
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
      
      {/* Welcome section */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <WebsiteImage 
            type="magnifying_glass" 
            altText="Gnome with magnifying glass"
            className="h-40 w-40 object-contain flex-shrink-0"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Let's Dive Deep</h2>
            
            <p className="text-gray-700 mb-3">
              Thanks for requesting a closer look at your healthcare archetype. This report unpacks the patterns your organization shares with others like it—based on data from hundreds of employers and millions of covered lives.
            </p>
            
            <p className="text-gray-700 mb-3">
              Inside, you'll find insights to help you understand your workforce's healthcare behaviors, compare yourself to similar companies, and explore ideas for smarter benefits decisions.
            </p>
            
            <p className="text-gray-700">
              We're excited to help you turn these insights into action. Let's get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIntroduction;
