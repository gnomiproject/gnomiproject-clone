
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
  
  // Add debug logging to see the data structure
  console.log('DeepDiveReport: Data received:', reportData);

  // Debug log to see what's happening during render
  useEffect(() => {
    console.log('DeepDiveReport: Component mounted with data', {
      reportDataExists: !!reportData,
      reportDataKeys: reportData ? Object.keys(reportData) : [],
      name: reportData?.name || reportData?.archetype_name,
      id: reportData?.id || reportData?.archetype_id,
      swot: {
        strengths: reportData?.strengths?.length || 0,
        weaknesses: reportData?.weaknesses?.length || 0,
        opportunities: reportData?.opportunities?.length || 0,
        threats: reportData?.threats?.length || 0
      },
      recommendations: reportData?.strategic_recommendations?.length || 0
    });
    
    return () => {
      console.log('DeepDiveReport: Component unmounting');
    };
  }, [reportData]);
  
  // Check if report data is valid to prevent rendering errors
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
  
  // Safety checks to ensure data is usable before attempting to render
  const ensureDataSafety = () => {
    // Create defaults for critical fields if they're missing
    if (!reportData.strengths) reportData.strengths = [];
    if (!reportData.weaknesses) reportData.weaknesses = [];
    if (!reportData.opportunities) reportData.opportunities = [];
    if (!reportData.threats) reportData.threats = [];
    if (!reportData.strategic_recommendations) reportData.strategic_recommendations = [];
    
    return true;
  };
  
  // Skip rendering if data doesn't pass safety checks
  if (!ensureDataSafety()) {
    console.error('DeepDiveReport: Data safety check failed');
    return (
      <div className="bg-white min-h-screen p-8">
        <div className="container mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-800">
            <h2 className="text-lg font-semibold mb-2">Data Validation Error</h2>
            <p>The report data structure is incomplete or invalid. Please contact support.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if we're using fallback data
  const usingFallbackData = !reportData.strategic_recommendations || reportData.strategic_recommendations.length === 0;

  // Get name and id safely from either format
  const archetypeName = reportData?.name || reportData?.archetype_name || 'Unknown Archetype';
  const archetypeId = reportData?.id || reportData?.archetype_id || 'unknown';
  
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
          archetypeName={archetypeName}
          archetypeId={archetypeId}
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
        
        {/* Lazy-loaded sections wrapped in error boundaries */}
        <ErrorBoundary fallback={<SectionErrorFallback title="Cost Analysis" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <CostAnalysis
              reportData={reportData}
              averageData={averageData}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback title="Utilization Patterns" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <UtilizationPatterns
              reportData={reportData}
              averageData={averageData}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback title="Disease Management" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <DiseaseManagement
              reportData={reportData}
              averageData={averageData}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback title="Care Gaps" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <CareGaps
              reportData={reportData}
              averageData={averageData}
            />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback title="Strategic Recommendations" />}>
          <Suspense fallback={<SectionLoadingFallback />}>
            <StrategicRecommendations
              reportData={reportData}
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
