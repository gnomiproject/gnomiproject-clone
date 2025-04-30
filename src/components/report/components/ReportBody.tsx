
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Section } from '@/components/shared/Section';
import ReportDebugTools from '../ReportDebugTools';

// Lazy load all section components for better initial loading performance
const LazyReportIntroduction = lazy(() => import('../sections/ReportIntroduction'));
const LazyArchetypeProfile = lazy(() => import('../sections/ArchetypeProfile'));
const LazySwotAnalysis = lazy(() => import('../sections/SwotAnalysis'));
const LazyDemographicsSection = lazy(() => import('../sections/DemographicsSection'));
const LazyCostAnalysis = lazy(() => import('../sections/CostAnalysis'));
const LazyUtilizationPatterns = lazy(() => import('../sections/UtilizationPatterns'));
const LazyDiseaseManagement = lazy(() => import('../sections/DiseaseManagement'));
const LazyCareGaps = lazy(() => import('../sections/CareGaps'));
const LazyRiskFactors = lazy(() => import('../sections/RiskFactors'));
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
  
  // Intersection Observer to detect when sections come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.id) {
            setViewedSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 } // 10% of the section must be visible
    );
    
    // Track all section elements
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Helper to determine if a section should be rendered
  const shouldRenderSection = (sectionId: string): boolean => {
    return viewedSections.has(sectionId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 print:px-8">
      <Section id="introduction">
        <Suspense fallback={<SectionLoading />}>
          <LazyReportIntroduction userData={userData} />
        </Suspense>
      </Section>
      
      <Section id="archetype-profile">
        {shouldRenderSection('archetype-profile') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazyArchetypeProfile reportData={reportData} />
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="swot-analysis">
        {shouldRenderSection('swot-analysis') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazySwotAnalysis reportData={reportData} />
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="demographics">
        {shouldRenderSection('demographics') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazyDemographicsSection reportData={reportData} averageData={averageData} />
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="cost-analysis">
        {shouldRenderSection('cost-analysis') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazyCostAnalysis reportData={reportData} averageData={averageData} />
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="utilization-patterns">
        {shouldRenderSection('utilization-patterns') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazyUtilizationPatterns reportData={reportData} averageData={averageData} />
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="disease-management">
        {shouldRenderSection('disease-management') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazyDiseaseManagement reportData={reportData} averageData={averageData} />
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="care-gaps">
        {shouldRenderSection('care-gaps') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazyCareGaps reportData={reportData} averageData={averageData} />
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="risk-factors">
        {shouldRenderSection('risk-factors') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazyRiskFactors reportData={reportData} averageData={averageData} />
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="recommendations">
        {shouldRenderSection('recommendations') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazyStrategicRecommendationsSection reportData={reportData} averageData={averageData} />
          </Suspense>
        ) : <SectionLoading />}
      </Section>
      
      <Section id="contact">
        {shouldRenderSection('contact') ? (
          <Suspense fallback={<SectionLoading />}>
            <LazyContactSection userData={userData} />
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
