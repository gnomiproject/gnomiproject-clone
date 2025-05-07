
import React from 'react';
import { format } from 'date-fns';
import { ArchetypeId } from '@/types/archetype';
import { getArchetypeColorHex } from '@/data/colors';
import { Badge } from '@/components/ui/badge';
import WebsiteImage from '@/components/common/WebsiteImage';
import ArchetypeInsightsCard from './introduction/ArchetypeInsightsCard';

interface ReportIntroductionProps {
  userData: any;
  reportData?: any;
  archetypeId?: ArchetypeId;
  archetypeName?: string;
  familyName?: string;
  shortDescription?: string;
}

const ReportIntroduction = ({ 
  userData,
  reportData,
  archetypeId = 'a1' as ArchetypeId,
  archetypeName,
  familyName,
  shortDescription
}: ReportIntroductionProps) => {
  // Get report date and basic user data
  const reportDate = userData?.created_at ? format(new Date(userData.created_at), 'MMMM d, yyyy') : 'N/A';
  const employeeCount = userData?.exact_employee_count || userData?.assessment_result?.exactData?.employeeCount;
  const archetypeColor = archetypeId ? getArchetypeColorHex(archetypeId) : '#00B0F0';

  return (
    <div className="mb-8 print:mb-4">
      <div className="print:hidden">
        <div className="flex justify-between items-start mb-4">
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
          className="h-1 w-full rounded-full mb-4"
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
    </div>
  );
};

export default ReportIntroduction;
