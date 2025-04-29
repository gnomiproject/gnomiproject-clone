
import React, { memo, useCallback } from 'react';

interface Section {
  id: string;
  name: string;
}

interface LeftNavigationProps {
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
  sections: Section[];
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ 
  activeSectionId, 
  onNavigate,
  sections
}) => {
  const handleNavigation = useCallback((sectionId: string) => {
    // Avoid event handlers that could create closures on every render
    // We'll apply the event in the JSX directly
    onNavigate(sectionId);
  }, [onNavigate]);

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
                onClick={() => handleNavigation(section.id)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center group transition-colors ${
                  activeSectionId === section.id 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                type="button"
              >
                <span className="ml-2">
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
            Navigate through sections using the links above to browse the complete report.
          </p>
        </div>
      </div>
    </div>
  );
};

// Export with React.memo to prevent unnecessary re-renders
export default memo(LeftNavigation);
