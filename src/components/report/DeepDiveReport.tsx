
import React from 'react';
import ExecutiveSummary from './sections/ExecutiveSummary';
import SwotAnalysis from './sections/SwotAnalysis';
import ArchetypeProfile from './sections/ArchetypeProfile';
import DemographicsSection from './sections/DemographicsSection';
import MetricsAnalysis from './sections/MetricsAnalysis';
import RiskFactors from './sections/RiskFactors';
import UtilizationPatterns from './sections/UtilizationPatterns';
import CostAnalysis from './sections/CostAnalysis';
import DiseaseManagement from './sections/DiseaseManagement';
import CareGaps from './sections/CareGaps';
import StrategicRecommendations from './sections/StrategicRecommendations';
import ReportIntroduction from './sections/ReportIntroduction';
import ContactSection from './sections/ContactSection';
import { ArchetypeDetailedData } from '@/types/archetype';
import FallbackBanner from './FallbackBanner';
import { useIsMobile } from '@/hooks/use-mobile';

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
          archetypeName={reportData.name}
          archetypeId={reportData.id}
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
        
        <CostAnalysis
          reportData={reportData}
          averageData={averageData}
        />
        
        <UtilizationPatterns
          reportData={reportData}
          averageData={averageData}
        />
        
        <DiseaseManagement
          reportData={reportData}
          averageData={averageData}
        />
        
        <CareGaps
          reportData={reportData}
          averageData={averageData}
        />
        
        <StrategicRecommendations
          reportData={reportData}
          averageData={averageData}
        />
        
        <ContactSection
          userData={userData}
          isAdminView={isAdminView}
        />
      </div>
    </div>
  );
};

export default DeepDiveReport;
