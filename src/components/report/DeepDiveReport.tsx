
import React, { lazy, Suspense, useEffect } from 'react';
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
  
  // Debug logging to see the data structure coming in
  useEffect(() => {
    console.log('DeepDiveReport: Component mounted with data', {
      reportDataExists: !!reportData,
      reportDataKeys: reportData ? Object.keys(reportData) : [],
      id: reportData?.id || reportData?.archetype_id,
      name: reportData?.name || reportData?.archetype_name,
      // Log specific properties we need
      swotProperties: {
        strengths: reportData?.strengths ? `${typeof reportData.strengths} (${Array.isArray(reportData.strengths) ? reportData.strengths.length : 'not array'})` : 'undefined',
        weaknesses: reportData?.weaknesses ? `${typeof reportData.weaknesses} (${Array.isArray(reportData.weaknesses) ? reportData.weaknesses.length : 'not array'})` : 'undefined',
        opportunities: reportData?.opportunities ? `${typeof reportData.opportunities} (${Array.isArray(reportData.opportunities) ? reportData.opportunities.length : 'not array'})` : 'undefined',
        threats: reportData?.threats ? `${typeof reportData.threats} (${Array.isArray(reportData.threats) ? reportData.threats.length : 'not array'})` : 'undefined',
      },
      recommendations: reportData?.strategic_recommendations ? 
        `${typeof reportData.strategic_recommendations} (${Array.isArray(reportData.strategic_recommendations) ? reportData.strategic_recommendations.length : 'not array'})` 
        : 'undefined'
    });
    
    return () => {
      console.log('DeepDiveReport: Component unmounting');
    };
  }, [reportData]);
  
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
  
  // Define the archetype name and id safely
  const archetypeName = safeReportData?.name || safeReportData?.archetype_name || 'Unknown Archetype';
  const archetypeId = safeReportData?.id || safeReportData?.archetype_id || 'unknown';
  
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
      
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-[1200px]">
        <ReportIntroduction
          archetypeName={archetypeName}
          archetypeId={archetypeId}
          userData={userData}
          isAdminView={isAdminView}
        />
        
        <ExecutiveSummary 
          archetypeData={safeReportData}
        />
        
        <ArchetypeProfile
          reportData={safeReportData}
          averageData={averageData}
        />
        
        <SwotAnalysis 
          archetypeData={safeReportData}
        />
        
        <DemographicsSection
          reportData={safeReportData}
          averageData={averageData}
        />
        
        <RiskFactors
          reportData={safeReportData}
          averageData={averageData}
        />
        
        {/* Lazy-loaded sections wrapped in error boundaries */}
        <ErrorBoundary fallback={<SectionErrorFallback title="Cost Analysis" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <CostAnalysis
              reportData={safeReportData}
              averageData={averageData}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback title="Utilization Patterns" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <UtilizationPatterns
              reportData={safeReportData}
              averageData={averageData}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback title="Disease Management" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <DiseaseManagement
              reportData={safeReportData}
              averageData={averageData}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback title="Care Gaps" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <CareGaps
              reportData={safeReportData}
              averageData={averageData}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback title="Strategic Recommendations" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <StrategicRecommendations
              reportData={safeReportData}
              averageData={averageData}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ContactSection
          userData={userData}
          isAdminView={isAdminView}
        />
      </div>
    </div>
  );
};

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('DeepDiveReport section error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Fallback component for section errors
const SectionErrorFallback = ({ title }: { title: string }) => (
  <div className="my-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">
      This section couldn't be loaded due to a data or rendering issue.
    </p>
  </div>
);

export default DeepDiveReport;
