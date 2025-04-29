
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
  debugInfo?: any;
}

const DeepDiveReport = ({ 
  reportData, 
  userData, 
  averageData, 
  loading = false,
  isAdminView = false,
  debugInfo
}: DeepDiveReportProps) => {
  // Debug logging to see the data structure coming in
  console.log('DeepDiveReport: Component mounted with data', {
    reportDataExists: !!reportData,
    reportDataType: typeof reportData,
    reportName: reportData?.name || reportData?.archetype_name,
    reportId: reportData?.id || reportData?.archetype_id,
    userDataExists: !!userData,
    tokenAccess: !isAdminView && userData?.access_token ? 
      `Using token: ${userData.access_token.substring(0, 5)}...` : 
      'Not using token access',
    hasStrategicRecommendations: reportData?.strategic_recommendations && 
      (Array.isArray(reportData.strategic_recommendations) ? 
        reportData.strategic_recommendations.length > 0 : 
        Object.keys(reportData.strategic_recommendations).length > 0)
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
            
            {debugInfo && (
              <div className="mt-4 p-3 bg-red-100 rounded text-xs font-mono overflow-auto">
                <p>Debug Info:</p>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Create a safe copy of the data 
  const safeReportData = {...reportData};
  
  // Ensure all required arrays exist
  if (!Array.isArray(safeReportData.strengths)) safeReportData.strengths = [];
  if (!Array.isArray(safeReportData.weaknesses)) safeReportData.weaknesses = [];
  if (!Array.isArray(safeReportData.opportunities)) safeReportData.opportunities = [];
  if (!Array.isArray(safeReportData.threats)) safeReportData.threats = [];
  
  // Handle strategic_recommendations being either an array or an object (or missing)
  if (!safeReportData.strategic_recommendations) {
    safeReportData.strategic_recommendations = [];
  } else if (!Array.isArray(safeReportData.strategic_recommendations) && typeof safeReportData.strategic_recommendations === 'object') {
    // Convert object to array if needed
    safeReportData.strategic_recommendations = Object.values(safeReportData.strategic_recommendations);
  }
  
  // Ensure name field exists
  if (!safeReportData.name && safeReportData.archetype_name) {
    safeReportData.name = safeReportData.archetype_name;
  }
  
  // Check if we're using fallback data
  const usingFallbackData = (
    !safeReportData.strategic_recommendations || 
    (Array.isArray(safeReportData.strategic_recommendations) && safeReportData.strategic_recommendations.length === 0) ||
    !userData ||
    isAdminView
  );
  
  // Check if we have employee size data
  const hasEmployeeData = !!(
    userData?.exact_employee_count || 
    (userData?.assessment_result?.exactData?.employeeCount)
  );
  
  // Token-based access debug info
  const hasTokenAccess = !isAdminView && userData?.access_token;
  
  return (
    <div className="bg-white min-h-screen">
      {/* Token access debug banner */}
      {hasTokenAccess && (
        <div className="bg-green-50 border-green-200 border-b p-4 text-green-800 text-sm sticky top-0 z-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <span>
                <strong>Token Access:</strong> Using token {userData.access_token.substring(0, 5)}...
                {userData.access_count > 1 && ` (Viewed ${userData.access_count} times)`}
              </span>
              <span className="text-xs bg-green-100 px-2 py-1 rounded">
                {new Date(userData.last_accessed || userData.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
      
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
