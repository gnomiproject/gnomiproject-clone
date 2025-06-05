
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
  userName?: string;
  userOrganization?: string;
}

const ReportIntroduction = ({ 
  userData,
  reportData,
  archetypeId = 'a1' as ArchetypeId,
  archetypeName,
  familyName,
  shortDescription,
  userName,
  userOrganization
}: ReportIntroductionProps) => {
  // Enhanced debug logging
  console.log('[ReportIntroduction] Props received:', {
    hasUserData: !!userData,
    userName,
    userOrganization,
    userDataKeys: userData ? Object.keys(userData) : 'No userData'
  });

  // Get report date and basic user data with enhanced extraction
  const reportDate = userData?.created_at ? format(new Date(userData.created_at), 'MMMM d, yyyy') : format(new Date(), 'MMMM d, yyyy');
  
  // Extract employee count with multiple fallback paths
  const employeeCount = userData?.exact_employee_count || 
                       userData?.assessment_result?.exactData?.employeeCount ||
                       userData?.assessment_result?.exact_employee_count;

  // Use provided userName and userOrganization, or extract from userData with fallbacks
  const displayName = userName || 
                     userData?.name || 
                     userData?.assessment_result?.name ||
                     'Healthcare Professional';
                     
  const displayOrganization = userOrganization || 
                             userData?.organization || 
                             userData?.assessment_result?.organization ||
                             'Healthcare Organization';

  console.log('[ReportIntroduction] Final display values:', {
    displayName,
    displayOrganization,
    reportDate,
    employeeCount
  });

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
                Prepared for: <span className="font-semibold">{displayName}</span>
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {displayOrganization}
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
        <div className="mt-2 text-sm text-gray-600">
          Prepared for: {displayName} | {displayOrganization}
        </div>
      </div>
    </div>
  );
};

export default ReportIntroduction;
