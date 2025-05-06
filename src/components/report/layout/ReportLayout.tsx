
import React, { ReactNode } from 'react';
import LeftNavigation from '../navigation/LeftNavigation';

interface ReportLayoutProps {
  children: ReactNode;
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
  isAdminView?: boolean;
  hideNavbar?: boolean;
}

const ReportLayout: React.FC<ReportLayoutProps> = ({
  children,
  activeSectionId,
  onNavigate,
  isAdminView = false,
  hideNavbar = false
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
    { id: 'about-report', name: 'About This Report' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Left Navigation */}
        <div className="md:sticky md:top-16 md:h-screen"> {/* Adjust top position to account for fixed header */}
          <LeftNavigation 
            activeSectionId={activeSectionId} 
            onNavigate={onNavigate} 
            sections={sections}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 md:max-h-screen md:overflow-y-auto">
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
