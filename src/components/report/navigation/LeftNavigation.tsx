
import React, { memo, useCallback, useMemo } from 'react';
import { useRenderPerformance } from '@/components/shared/PerformanceMonitor';
import { throttle } from '@/utils/debounce';
import { ArrowRight, Mail } from 'lucide-react';

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
  
  console.log('[LeftNavigation] Rendering with sections:', { 
    sectionsCount: sections.length,
    activeSectionId,
    sections: sections.map(s => s.id)
  });
  
  // Use throttle instead of debounce for navigation links to ensure responsive UI
  // while still preventing excessive function calls
  const throttledNavigate = useCallback(
    throttle((sectionId: string) => {
      console.log(`[LeftNavigation] Navigating to section: ${sectionId}`);
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
    <div className="w-64 shrink-0 border-r border-gray-200 h-full bg-gray-50 print:hidden overflow-auto mt-16">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Report Sections</h3>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {sectionItems}
        </ul>
      </nav>

      <div className="p-4 mt-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <h4 className="text-blue-800 font-medium flex items-center">
            <Mail className="h-4 w-4 mr-2" /> Contact Us
          </h4>
          <p className="text-xs text-gray-600 mt-2">
            Want to see your data alongside the archetype? Have feedback to share? Need help?
          </p>
          <a 
            href="mailto:artemis@nomihealth.com" 
            className="mt-2 text-xs text-blue-700 hover:text-blue-800 inline-flex items-center"
          >
            artemis@nomihealth.com <ArrowRight className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Export with React.memo to prevent unnecessary re-renders
export default memo(LeftNavigationBase);
