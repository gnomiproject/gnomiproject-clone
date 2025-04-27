
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import FallbackBanner from './FallbackBanner';
import DeepDiveReportContent from './sections/DeepDiveReportContent';

interface DeepDiveReportProps {
  reportData: ArchetypeDetailedData;
  userData?: any;
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
    reportDataKeys: reportData ? Object.keys(reportData) : [],
    id: reportData?.id || reportData?.archetype_id,
    name: reportData?.name || reportData?.archetype_name,
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
  
  // Ensure all required arrays exist
  if (!Array.isArray(safeReportData.strengths)) safeReportData.strengths = [];
  if (!Array.isArray(safeReportData.weaknesses)) safeReportData.weaknesses = [];
  if (!Array.isArray(safeReportData.opportunities)) safeReportData.opportunities = [];
  if (!Array.isArray(safeReportData.threats)) safeReportData.threats = [];
  if (!Array.isArray(safeReportData.strategic_recommendations)) safeReportData.strategic_recommendations = [];
  
  // Check if we're using fallback data
  const usingFallbackData = !safeReportData.strategic_recommendations || safeReportData.strategic_recommendations.length === 0;
  
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
      
      {/* Fallback data banner */}
      {usingFallbackData && !loading && (
        <FallbackBanner show={true} />
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
