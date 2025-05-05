import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Section } from '@/components/shared/Section';
import ReportDebugTools from '../ReportDebugTools';

// Lazy load all section components for better initial loading performance
const LazyReportIntroduction = lazy(() => import('../sections/ReportIntroduction'));
const LazyArchetypeProfile = lazy(() => import('../sections/ArchetypeProfile'));
const LazyDemographicsSection = lazy(() => import('../sections/DemographicsSection'));
const LazyUtilizationPatterns = lazy(() => import('../sections/UtilizationPatterns'));
const LazyDiseaseManagement = lazy(() => import('../sections/DiseaseManagement'));
const LazyCareGaps = lazy(() => import('../sections/CareGaps'));
const LazyRiskFactors = lazy(() => import('../sections/RiskFactors'));
const LazyCostAnalysis = lazy(() => import('../sections/CostAnalysis'));
const LazySwotAnalysis = lazy(() => import('../sections/SwotAnalysis'));
const LazyStrategicRecommendationsSection = lazy(() => import('../sections/strategic-recommendations/StrategicRecommendationsSection'));
const LazyContactSection = lazy(() => import('../sections/ContactSection'));

interface ReportBodyProps {
  reportData: any;
  userData?: any;
  averageData?: any;
  isDebugMode: boolean;
  showDebugData: boolean;
  showDiagnostics: boolean;
  setShowDebugData: (show: boolean) => void;
  setShowDiagnostics: (show: boolean) => void;
  handleRefreshData: () => void;
  isAdminView: boolean;
  debugInfo?: any;
}

// Simple loading fallback component
const SectionLoading = () => (
  <div className="py-12 flex justify-center items-center">
    <div className="animate-pulse space-y-4 w-full max-w-md">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

// Error fallback component
const SectionError = ({ message }: { message: string }) => (
  <div className="py-8 px-4 border border-red-200 bg-red-50 rounded-lg">
    <h3 className="text-lg font-medium text-red-800">Error Loading Section</h3>
    <p className="text-red-700 mt-2">{message}</p>
  </div>
);

const ReportBody: React.FC<ReportBodyProps> = ({
  reportData,
  userData,
  averageData,
  isDebugMode,
  showDebugData,
  showDiagnostics,
  setShowDebugData,
  setShowDiagnostics,
  handleRefreshData,
  isAdminView,
  debugInfo
}) => {
  // Track which sections have been viewed to optimize rendering
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set(['introduction']));
  
  // State to track section loading errors
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({});
  
  // Intersection Observer to detect when sections come into view
  useEffect(() => {
    console.log("[ReportBody] Setting up intersection observer for sections");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.id) {
            console.log(`Section entering viewport: ${entry.target.id}`);
            setViewedSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 } // 10% of the section must be visible
    );
    
    // Track all section elements
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
      console.log(`Observing section: ${section.id}`);
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Helper to determine if a section should be rendered
  const shouldRenderSection = (sectionId: string): boolean => {
    return viewedSections.has(sectionId);
  };

  // Add debug logging
  console.log('[ReportBody] Rendering with data:', {
    hasReportData: !!reportData, 
    hasUserData: !!userData,
    viewedSections: Array.from(viewedSections),
    reportDataSample: reportData ? {
      id: reportData.id || reportData.archetype_id,
      name: reportData.name || reportData.archetype_name,
    } : 'No data'
  });

  // Error handling function for section rendering errors
  const handleSectionError = (sectionId: string, error: any) => {
    console.error(`Error rendering section ${sectionId}:`, error);
    setSectionErrors(prev => ({
      ...prev,
      [sectionId]: error?.message || 'Unknown error loading this section'
    }));
  };

  // Verify that reportData is available
  if (!reportData) {
    return <SectionError message="No report data available. Please refresh the page and try again." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 print:px-8">
      {/* Sections in the reordered sequence */}
      <Section id="introduction">
        <Suspense fallback={<SectionLoading />}>
          <LazyReportIntroduction userData={userData} />
        </Suspense>
      </Section>
      
      <Section id="archetype-profile">
        {shouldRenderSection('archetype-profile') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['archetype-profile'] ? (
              <SectionError message={sectionErrors['archetype-profile']} />
            ) : (
              <LazyArchetypeProfile reportData={reportData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="demographics">
        {shouldRenderSection('demographics') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['demographics'] ? (
              <SectionError message={sectionErrors['demographics']} />
            ) : (
              <LazyDemographicsSection reportData={reportData} averageData={averageData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="utilization-patterns">
        {shouldRenderSection('utilization-patterns') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['utilization-patterns'] ? (
              <SectionError message={sectionErrors['utilization-patterns']} />
            ) : (
              <LazyUtilizationPatterns reportData={reportData} averageData={averageData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="disease-management">
        {shouldRenderSection('disease-management') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['disease-management'] ? (
              <SectionError message={sectionErrors['disease-management']} />
            ) : (
              <LazyDiseaseManagement reportData={reportData} averageData={averageData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="care-gaps">
        {shouldRenderSection('care-gaps') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['care-gaps'] ? (
              <SectionError message={sectionErrors['care-gaps']} />
            ) : (
              <LazyCareGaps reportData={reportData} averageData={averageData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="risk-factors">
        {shouldRenderSection('risk-factors') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['risk-factors'] ? (
              <SectionError message={sectionErrors['risk-factors']} />
            ) : (
              <LazyRiskFactors reportData={reportData} averageData={averageData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="cost-analysis">
        {shouldRenderSection('cost-analysis') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['cost-analysis'] ? (
              <SectionError message={sectionErrors['cost-analysis']} />
            ) : (
              <LazyCostAnalysis reportData={reportData} averageData={averageData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>

      <Section id="swot-analysis">
        {shouldRenderSection('swot-analysis') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['swot-analysis'] ? (
              <SectionError message={sectionErrors['swot-analysis']} />
            ) : (
              <LazySwotAnalysis reportData={reportData} archetypeData={reportData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="recommendations">
        {shouldRenderSection('recommendations') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['recommendations'] ? (
              <SectionError message={sectionErrors['recommendations']} />
            ) : (
              <LazyStrategicRecommendationsSection reportData={reportData} averageData={averageData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="about-report">
        {shouldRenderSection('about-report') ? (
          <Suspense fallback={<SectionLoading />}>
            {sectionErrors['about-report'] ? (
              <SectionError message={sectionErrors['about-report']} />
            ) : (
              <LazyContactSection userData={userData} />
            )}
          </Suspense>
        ) : <SectionLoading />}
      </Section>

      {/* Debug tools for admin and debug mode */}
      {isDebugMode && (
        <Section id="debug" className="print:hidden">
          <ReportDebugTools 
            showDebugData={showDebugData}
            toggleDebugData={() => setShowDebugData(!showDebugData)}
            showDiagnostics={showDiagnostics}
            toggleDiagnostics={() => setShowDiagnostics(!showDiagnostics)}
            onRefreshData={handleRefreshData}
            isAdminView={isAdminView}
            debugInfo={debugInfo}
          />
        </Section>
      )}
    </div>
  );
};

export default React.memo(ReportBody);
