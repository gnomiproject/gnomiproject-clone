
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LeftNavigationProps {
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ 
  activeSectionId, 
  onNavigate 
}) => {
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
    { id: 'contact', name: 'Contact' },
  ];

  return (
    <div className="w-64 shrink-0 border-r border-gray-200 h-full bg-gray-50 print:hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Report Sections</h3>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {sections.map(section => (
            <li key={section.id}>
              <button
                onClick={() => onNavigate(section.id)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center group transition-colors ${
                  activeSectionId === section.id 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {activeSectionId === section.id && (
                  <ChevronRight className="h-4 w-4 mr-2 text-blue-600" />
                )}
                <span className={activeSectionId !== section.id ? "ml-6" : ""}>
                  {section.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-4">
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-xs text-gray-600">
            Navigate through sections using the links above or use page scrolling to browse the complete report.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeftNavigation;
