
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '@/utils/debounce';

interface UseReportNavigationProps {
  initialSectionId?: string;
}

export const useReportNavigation = ({ initialSectionId = 'introduction' }: UseReportNavigationProps = {}) => {
  const [activeSectionId, setActiveSectionId] = useState(initialSectionId);
  const [isNavigating, setIsNavigating] = useState(false);
  const lastNavigationTime = useRef(0);
  const navigationDelayMs = 800; // Prevent rapid navigation requests

  // Handle navigation with proper debouncing to prevent rapid successive calls
  const handleNavigate = useCallback((sectionId: string) => {
    const now = Date.now();
    
    // Prevent rapid navigation requests
    if (now - lastNavigationTime.current < navigationDelayMs) {
      console.log(`[Navigation] Skipping rapid navigation request to ${sectionId}`);
      return;
    }
    
    console.log(`[Navigation] Navigating to section: ${sectionId}`);
    setIsNavigating(true);
    setActiveSectionId(sectionId);
    lastNavigationTime.current = now;
    
    // Find element and scroll to it
    const element = document.getElementById(sectionId);
    if (element) {
      try {
        console.log(`[Navigation] Scrolling to element with ID: ${sectionId}`);
        element.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error scrolling to section:', error);
      }
    } else {
      console.warn(`[Navigation] Element with ID ${sectionId} not found`);
    }
    
    // Reset navigation state after a short delay
    setTimeout(() => {
      setIsNavigating(false);
    }, navigationDelayMs);
  }, []);

  // Detect scroll position to update active section, but with throttling
  useEffect(() => {
    // Throttle the scroll handler
    const throttledScrollHandler = debounce(() => {
      if (isNavigating) return;
      
      // Get all section elements - ensure these IDs match the ones in ReportSections.tsx
      const sections = document.querySelectorAll('[id^="introduction"], [id^="executive-summary"], [id^="archetype-profile"], [id^="demographics"], [id^="utilization-patterns"], [id^="disease-management"], [id^="care-gaps"], [id^="risk-factors"], [id^="cost-analysis"], [id^="swot-analysis"], [id^="recommendations"], [id^="about-report"]');
      
      // Find the section that's most visible in the viewport
      let mostVisibleSection = null;
      let maxVisibility = 0;
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visibility = visibleHeight > 0 ? visibleHeight / rect.height : 0;
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleSection = section;
        }
      });
      
      // Update active section if we found one and it's significantly visible
      if (mostVisibleSection && maxVisibility > 0.3) {
        const sectionId = mostVisibleSection.id;
        if (sectionId !== activeSectionId) {
          console.log(`[Navigation] Updating active section to ${sectionId} based on scroll`);
          setActiveSectionId(sectionId);
        }
      }
    }, 200);

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [activeSectionId, isNavigating]);

  return {
    activeSectionId,
    setActiveSectionId,
    handleNavigate,
    isNavigating
  };
};
