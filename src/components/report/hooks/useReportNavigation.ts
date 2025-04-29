
import { useState, useEffect, useCallback } from 'react';

interface UseReportNavigationProps {
  initialSectionId?: string;
}

export const useReportNavigation = ({ initialSectionId = 'introduction' }: UseReportNavigationProps = {}) => {
  const [activeSectionId, setActiveSectionId] = useState(initialSectionId);
  const [isNavigating, setIsNavigating] = useState(false);

  // Handle navigation with debouncing to prevent rapid successive calls
  const handleNavigate = useCallback((sectionId: string) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    setActiveSectionId(sectionId);
    
    // Find element and scroll to it
    const element = document.getElementById(sectionId);
    if (element) {
      try {
        element.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error scrolling to section:', error);
      }
    }
    
    // Reset navigation state after a short delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 800);
  }, [isNavigating]);

  // Also detect scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (isNavigating) return;
      
      // Get all section elements
      const sections = document.querySelectorAll('[id^="introduction"], [id^="executive-summary"], [id^="archetype-profile"], [id^="swot-analysis"], [id^="demographics"], [id^="cost-analysis"], [id^="utilization-patterns"], [id^="disease-management"], [id^="care-gaps"], [id^="risk-factors"], [id^="recommendations"], [id^="contact"]');
      
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
      
      // Update active section if we found one
      if (mostVisibleSection && maxVisibility > 0.3) {
        const sectionId = mostVisibleSection.id;
        if (sectionId !== activeSectionId) {
          setActiveSectionId(sectionId);
        }
      }
    };

    // Throttle scroll handler
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

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
