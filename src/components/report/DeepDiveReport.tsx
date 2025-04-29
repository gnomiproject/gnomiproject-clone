import React, { useState, useEffect } from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import ReportIntroduction from './sections/ReportIntroduction';
import ArchetypeProfile from './sections/ArchetypeProfile';
import DemographicsSection from './sections/DemographicsSection';
import CostAnalysis from './sections/CostAnalysis';
import UtilizationPatterns from './sections/UtilizationPatterns';
import DiseaseManagement from './sections/DiseaseManagement';
import CareGaps from './sections/CareGaps';
import RiskFactors from './sections/RiskFactors';
import SwotAnalysis from './sections/SwotAnalysis';
import StrategicRecommendations from './sections/StrategicRecommendations';
import ContactSection from './sections/ContactSection';
import ReportLayout from './layout/ReportLayout';

interface DeepDiveReportProps {
  reportData: ArchetypeDetailedData;
  userData: any;
  averageData: any;
  isAdminView?: boolean;
  debugInfo?: any;
}

const DeepDiveReport: React.FC<DeepDiveReportProps> = ({
  reportData,
  userData,
  averageData,
  isAdminView = false,
  debugInfo
}) => {
  // Track active section
  const [activeSectionId, setActiveSectionId] = useState('introduction');
  
  // Handle scroll to section
  const handleNavigate = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Section IDs
  const sectionIds = {
    introduction: 'introduction',
    archetypeProfile: 'archetype-profile',
    demographics: 'demographics',
    costAnalysis: 'cost-analysis',
    utilization: 'utilization-patterns',
    diseaseManagement: 'disease-management',
    careGaps: 'care-gaps',
    riskFactors: 'risk-factors',
    swotAnalysis: 'swot-analysis',
    recommendations: 'recommendations',
    contact: 'contact'
  };
  
  // Intersection Observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    Object.values(sectionIds).forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    
    return () => {
      Object.values(sectionIds).forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [reportData]);
  
  return (
    <ReportLayout 
      activeSectionId={activeSectionId} 
      onNavigate={handleNavigate}
      isAdminView={isAdminView}
    >
      {/* Header - Keep consistent across report */}
      <header className="bg-blue-50 border-b border-blue-100 py-4 px-6 mb-8 print:hidden">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-blue-800">
            Healthcare Archetype Deep Dive Report
          </h1>
          <p className="text-blue-600">
            {reportData.archetype_name || reportData.name}
          </p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pb-16">
        {/* Introduction Section */}
        <section id={sectionIds.introduction} className="mb-16">
          <ReportIntroduction 
            userData={userData}
          />
        </section>
        
        {/* Archetype Profile Section */}
        <section id={sectionIds.archetypeProfile} className="mb-16">
          <ArchetypeProfile 
            archetypeData={reportData}
          />
        </section>
        
        {/* Demographics Section */}
        <section id={sectionIds.demographics} className="mb-16">
          <DemographicsSection 
            reportData={reportData} 
            averageData={averageData}
          />
        </section>
        
        {/* Cost Analysis Section */}
        <section id={sectionIds.costAnalysis} className="mb-16">
          <CostAnalysis 
            reportData={reportData} 
            averageData={averageData}
          />
        </section>
        
        {/* Utilization Section */}
        <section id={sectionIds.utilization} className="mb-16">
          <UtilizationPatterns 
            reportData={reportData} 
            averageData={averageData}
          />
        </section>
        
        {/* Disease Management Section */}
        <section id={sectionIds.diseaseManagement} className="mb-16">
          <DiseaseManagement 
            reportData={reportData} 
            averageData={averageData}
          />
        </section>
        
        {/* Care Gaps Section */}
        <section id={sectionIds.careGaps} className="mb-16">
          <CareGaps 
            reportData={reportData} 
            averageData={averageData}
          />
        </section>
        
        {/* Risk Factors Section */}
        <section id={sectionIds.riskFactors} className="mb-16">
          <RiskFactors 
            reportData={reportData} 
            averageData={averageData}
          />
        </section>
        
        {/* SWOT Analysis Section */}
        <section id={sectionIds.swotAnalysis} className="mb-16">
          <SwotAnalysis 
            reportData={reportData}
          />
        </section>
        
        {/* Strategic Recommendations Section */}
        <section id={sectionIds.recommendations} className="mb-16">
          <StrategicRecommendations 
            reportData={reportData}
          />
        </section>
        
        {/* Contact Section */}
        <section id={sectionIds.contact} className="mb-16">
          <ContactSection 
            userData={userData}
          />
        </section>

        {/* Debug info for development and admin views */}
        {(isAdminView || import.meta.env.DEV) && debugInfo && (
          <div className="mt-20 p-4 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
            <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </ReportLayout>
  );
};

export default DeepDiveReport;
