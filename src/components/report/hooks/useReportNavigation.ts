
import { useState, useEffect } from 'react';

interface UseReportNavigationProps {
  initialSectionId?: string;
}

export const useReportNavigation = ({ initialSectionId = 'introduction' }: UseReportNavigationProps = {}) => {
  const [activeSectionId, setActiveSectionId] = useState(initialSectionId);

  // Handle navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    activeSectionId,
    setActiveSectionId,
    handleNavigate
  };
};
