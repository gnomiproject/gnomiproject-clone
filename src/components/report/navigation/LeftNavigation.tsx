
import React, { memo, useCallback, useMemo } from 'react';
import { useRenderPerformance } from '@/components/shared/PerformanceMonitor';
import { throttle } from '@/utils/debounce';

interface Section {
  id: string;
  name: string;
}

interface LeftNavigationProps {
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
  sections: Section[];
}

const LeftNavigationBase: React.FC<LeftNavigationProps> = ({ 
  activeSectionId, 
  onNavigate,
  sections
}) => {
  // Track render performance
  useRenderPerformance('LeftNavigation');
  
  // Use throttle instead of debounce for navigation links to ensure responsive UI
  // while still preventing excessive function calls
  const throttledNavigate = useCallback(
    throttle((sectionId: string) => {
      onNavigate(sectionId);
    }, 250),
    [onNavigate]
  );
  
  // Memoize section rendering to prevent recreating the entire list on each render
  const sectionItems = useMemo(() => {
    return sections.map(section => (
      <li key={section.id}>
        <button
          onClick={() => throttledNavigate(section.id)}
          className={`w-full text-left px-3 py-2 rounded-md flex items-center group transition-colors ${
            activeSectionId === section.id 
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          type="button"
          aria-current={activeSectionId === section.id ? 'page' : undefined}
        >
          <span className="ml-2">
            {section.name}
          </span>
        </button>
      </li>
    ));
  }, [sections, activeSectionId, throttledNavigate]);
  
  return (
    <div className="w-64 shrink-0 border-r border-gray-200 h-full bg-gray-50 print:hidden overflow-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Report Sections</h3>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {sectionItems}
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
export default memo(LeftNavigationBase);
