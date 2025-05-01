
/**
 * SwotTab Component - Transitional component that imports the dedicated InsightsSwotTab
 * This is kept for backward compatibility
 */
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import InsightsSwotTab from './InsightsSwotTab';

interface SwotTabProps {
  archetypeData: ArchetypeDetailedData;
}

const SwotTab = ({ archetypeData }: SwotTabProps) => {
  // Simply pass through to the dedicated InsightsSwotTab component
  return <InsightsSwotTab archetypeData={archetypeData} />;
};

export default SwotTab;
