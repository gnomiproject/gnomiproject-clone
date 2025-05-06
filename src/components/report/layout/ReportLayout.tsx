
import React, { ReactNode } from 'react';
import LeftNavigation from '../navigation/LeftNavigation';
import Navbar from '@/components/layout/Navbar';

interface ReportLayoutProps {
  children: ReactNode;
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
  isAdminView?: boolean;
  hideNavbar?: boolean; // Add this prop
}

const ReportLayout: React.FC<ReportLayoutProps> = ({
  children,
  activeSectionId,
  onNavigate,
  isAdminView = false,
  hideNavbar = false // Default to false for backward compatibility
}) => {
  // Default sections for the navigation
  const sections = [
    { id: 'introduction', name: 'Introduction' },
    { id: 'executive-summary', name: 'Executive Summary' },
    { id: 'archetype-profile', name: 'Archetype Profile' },
    { id: 'swot-analysis', name: 'SWOT Analysis' },
    { id: 'demographics', name: 'Demographics' },
    { id: 'cost-analysis', name: 'Cost Analysis' },
    { id: 'utilization-patterns', name: 'Utilization Patterns' },
    { id: 'disease-management', name: 'Disease Management' },
    { id: 'care-gaps', name: 'Care Gaps' },
    { id: 'risk-factors', name: 'Risk Factors' },
    { id: 'recommendations', name: 'Recommendations' },
    { id: 'about-report', name: 'About This Report' }, // Changed 'contact' to 'about-report'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Add Navbar at the top if hideNavbar is false */}
      {!hideNavbar && <Navbar />}
      
      <div className="flex flex-col md:flex-row">
        {/* Left Navigation */}
        <div className={`md:sticky md:top-0 md:h-screen ${!hideNavbar ? 'mt-16' : ''}`}> {/* Adjust margin based on navbar visibility */}
          <LeftNavigation 
            activeSectionId={activeSectionId} 
            onNavigate={onNavigate} 
            sections={sections}
          />
        </div>
        
        {/* Main Content Area */}
        <div className={`flex-1 md:max-h-screen md:overflow-y-auto ${!hideNavbar ? 'pt-16' : ''}`}> {/* Adjust padding based on navbar visibility */}
          {children}
          
          {/* Admin indicator */}
          {isAdminView && (
            <div className="fixed bottom-4 right-4 bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Admin Preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportLayout;
