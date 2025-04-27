
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
import { useMediaQuery } from '@/hooks/use-mobile';

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
  const isMobile = useMediaQuery("(max-width: 768px)");
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
        <FallbackBanner 
          message="This report is using fallback data because the complete data isn't available from the database." 
        />
      )}
      
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-[1200px]">
        <ReportIntroduction
          archetypeName={reportData.name}
          archetypeId={reportData.id}
          userData={userData}
          isAdminView={isAdminView}
        />
        
        <ExecutiveSummary 
          archetype={reportData}
          isMobile={isMobile}
        />
        
        <ArchetypeProfile
          archetype={reportData}
        />
        
        <SwotAnalysis 
          strengths={reportData.strengths || reportData?.enhanced?.swot?.strengths || []}
          weaknesses={reportData.weaknesses || reportData?.enhanced?.swot?.weaknesses || []}
          opportunities={reportData.opportunities || reportData?.enhanced?.swot?.opportunities || []}
          threats={reportData.threats || reportData?.enhanced?.swot?.threats || []}
          familyId={reportData.familyId || reportData.family_id}
        />
        
        <DemographicsSection
          archetype={reportData}
          averageData={averageData}
        />
        
        <RiskFactors
          archetype={reportData}
          averageData={averageData}
        />
        
        <CostAnalysis
          archetype={reportData}
          averageData={averageData}
        />
        
        <UtilizationPatterns
          archetype={reportData}
          averageData={averageData}
        />
        
        <DiseaseManagement
          archetype={reportData}
          averageData={averageData}
        />
        
        <CareGaps
          archetype={reportData}
          averageData={averageData}
        />
        
        <StrategicRecommendations
          recommendations={reportData.strategic_recommendations || []}
          archetypeId={reportData.id}
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
