
import React, { lazy, Suspense } from 'react';
import ExecutiveSummary from './sections/ExecutiveSummary';
import SwotAnalysis from './sections/SwotAnalysis';
import ArchetypeProfile from './sections/ArchetypeProfile';
import DemographicsSection from './sections/DemographicsSection';
import MetricsAnalysis from './sections/MetricsAnalysis';
import RiskFactors from './sections/RiskFactors';
import ReportIntroduction from './sections/ReportIntroduction';
import ContactSection from './sections/ContactSection';
import { ArchetypeDetailedData } from '@/types/archetype';
import FallbackBanner from './FallbackBanner';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy-load non-critical sections
const UtilizationPatterns = lazy(() => import('./sections/UtilizationPatterns'));
const CostAnalysis = lazy(() => import('./sections/CostAnalysis'));
const DiseaseManagement = lazy(() => import('./sections/DiseaseManagement'));
const CareGaps = lazy(() => import('./sections/CareGaps'));
const StrategicRecommendations = lazy(() => import('./sections/StrategicRecommendations'));

// Loading fallback for lazy components
const SectionLoadingFallback = () => (
  <div className="py-8 px-4 border border-gray-200 rounded-lg animate-pulse bg-gray-50">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-32 bg-gray-200 rounded mb-4"></div>
    <div className="h-20 bg-gray-200 rounded"></div>
  </div>
);

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
  const isMobile = useIsMobile();
  
  // Add debug logging to see the data structure
  console.log('DeepDiveReport: Data received:', reportData);
  
  // Check if we're using fallback data
  const usingFallbackData = !reportData.strategic_recommendations || reportData.strategic_recommendations.length === 0;
  
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
      
      {/* If using fallback data, show a banner */}
      {usingFallbackData && !loading && (
        <FallbackBanner show={true} />
      )}
      
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-[1200px]">
        <ReportIntroduction
          archetypeName={reportData.name || reportData.archetype_name || 'Unknown Archetype'}
          archetypeId={reportData.id || reportData.archetype_id || 'unknown'}
          userData={userData}
          isAdminView={isAdminView}
        />
        
        <ExecutiveSummary 
          archetypeData={reportData}
        />
        
        <ArchetypeProfile
          reportData={reportData}
          averageData={averageData}
        />
        
        <SwotAnalysis 
          archetypeData={reportData}
        />
        
        <DemographicsSection
          reportData={reportData}
          averageData={averageData}
        />
        
        <RiskFactors
          reportData={reportData}
          averageData={averageData}
        />
        
        {/* Lazy-loaded sections */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <CostAnalysis
            reportData={reportData}
            averageData={averageData}
          />
        </Suspense>
        
        <Suspense fallback={<SectionLoadingFallback />}>
          <UtilizationPatterns
            reportData={reportData}
            averageData={averageData}
          />
        </Suspense>
        
        <Suspense fallback={<SectionLoadingFallback />}>
          <DiseaseManagement
            reportData={reportData}
            averageData={averageData}
          />
        </Suspense>
        
        <Suspense fallback={<SectionLoadingFallback />}>
          <CareGaps
            reportData={reportData}
            averageData={averageData}
          />
        </Suspense>
        
        <Suspense fallback={<SectionLoadingFallback />}>
          <StrategicRecommendations
            reportData={reportData}
            averageData={averageData}
          />
        </Suspense>
        
        <ContactSection
          userData={userData}
          isAdminView={isAdminView}
        />
      </div>
    </div>
  );
};

export default DeepDiveReport;
