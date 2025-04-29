
import React, { ReactNode } from 'react';
import LeftNavigation from '../navigation/LeftNavigation';

interface ReportLayoutProps {
  children: ReactNode;
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
  isAdminView?: boolean;
}

const ReportLayout: React.FC<ReportLayoutProps> = ({
  children,
  activeSectionId,
  onNavigate,
  isAdminView = false
}) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Left Navigation */}
        <div className="md:sticky md:top-0 md:h-screen">
          <LeftNavigation activeSectionId={activeSectionId} onNavigate={onNavigate} />
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
