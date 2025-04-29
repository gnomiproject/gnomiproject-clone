
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import FallbackBanner from './FallbackBanner';
import DeepDiveReportContent from './sections/DeepDiveReportContent';
import { ReportUserData } from '@/hooks/useReportUserData';

interface DeepDiveReportProps {
  reportData: ArchetypeDetailedData;
  userData?: ReportUserData | any;
  averageData: any;
  loading?: boolean;
  isAdminView?: boolean;
}

const DeepDiveReport = ({ 
  reportData, 
  userData, 
  averageData, 
  loading = false,
  isAdminView = false
}: DeepDiveReportProps) => {
  // Debug logging to see the data structure coming in
  console.log('DeepDiveReport: Component mounted with data', {
    reportDataExists: !!reportData,
    reportDataType: typeof reportData,
    reportName: reportData?.name || reportData?.archetype_name,
    reportId: reportData?.id || reportData?.archetype_id,
    hasStrategicRecommendations: reportData?.strategic_recommendations && reportData.strategic_recommendations.length > 0,
    strategicRecommendationsType: reportData?.strategic_recommendations ? typeof reportData.strategic_recommendations : 'undefined'
  });
  
  // Apply safety checks before rendering
  if (!reportData) {
    console.error('DeepDiveReport: No report data provided');
    return (
      <div className="bg-white min-h-screen p-8">
        <div className="container mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            <h2 className="text-lg font-semibold mb-2">Error Loading Report</h2>
            <p>Unable to load report data. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Create a safe copy of the data 
  const safeReportData = {...reportData};
  
  // Ensure all required arrays exist and handle different data structures
  if (!Array.isArray(safeReportData.strengths)) safeReportData.strengths = [];
  if (!Array.isArray(safeReportData.weaknesses)) safeReportData.weaknesses = [];
  if (!Array.isArray(safeReportData.opportunities)) safeReportData.opportunities = [];
  if (!Array.isArray(safeReportData.threats)) safeReportData.threats = [];
  if (!Array.isArray(safeReportData.strategic_recommendations)) safeReportData.strategic_recommendations = [];
  
  // Ensure name field exists
  if (!safeReportData.name && safeReportData.archetype_name) {
    safeReportData.name = safeReportData.archetype_name;
  }
  
  // Check if we're using fallback data - improve the detection logic
  const usingFallbackData = (
    !safeReportData.strategic_recommendations || 
    safeReportData.strategic_recommendations.length === 0 ||
    !userData ||
    isAdminView
  );
  
  // Check if we have employee size data
  const hasEmployeeData = !!(
    userData?.exact_employee_count || 
    (userData?.assessment_result?.exactData?.employeeCount)
  );
  
  return (
    <div className="bg-white min-h-screen">
      {/* Admin View Banner */}
      {isAdminView && (
        <div className="bg-yellow-50 border-yellow-200 border-b p-4 text-yellow-800 text-sm sticky top-0 z-50 flex justify-between items-center">
          <span>
            <strong>Admin View</strong> - Viewing with placeholder user data. User-specific metrics may not be accurate.
          </span>
          <button 
            className="text-yellow-700 hover:text-yellow-900 font-medium text-xs bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded"
            onClick={() => window.print()}
          >
            Print Report
          </button>
        </div>
      )}
      
      {/* Fallback data banner - only show if not admin view to avoid duplicate banners */}
      {usingFallbackData && !loading && !isAdminView && (
        <FallbackBanner show={true} />
      )}
      
      {/* Employee size context banner */}
      {hasEmployeeData && !isAdminView && (
        <div className="bg-blue-50 border-blue-200 border-b p-3 text-blue-800 text-sm">
          <div className="container mx-auto">
            <span>
              <strong>Personalized Report</strong> - This report is tailored for an organization with approximately {(userData?.exact_employee_count || userData?.assessment_result?.exactData?.employeeCount).toLocaleString()} employees.
            </span>
          </div>
        </div>
      )}
      
      <DeepDiveReportContent
        archetype={safeReportData}
        userData={userData}
        averageData={averageData}
      />
    </div>
  );
};

export default DeepDiveReport;
