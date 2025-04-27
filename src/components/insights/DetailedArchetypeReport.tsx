
import React, { useMemo, useRef, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import ArchetypeContent from './ArchetypeContent';
import { useGetArchetype } from '@/hooks/useGetArchetype';

interface DetailedArchetypeReportProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
}

const DetailedArchetypeReport = ({ archetypeId, onRetakeAssessment }: DetailedArchetypeReportProps) => {
  const { getArchetypeDetailedById } = useArchetypes();
  const renderCountRef = useRef(0);
  const processedRef = useRef(false);
  const mountedRef = useRef(true);
  const { archetypeData: dbArchetypeData, isLoading } = useGetArchetype(archetypeId);
  
  // Log component lifecycle for debugging
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`DetailedArchetypeReport: Mount/Render #${renderCountRef.current} for ${archetypeId}`);
    
    // Reset flags when archetypeId changes
    if (archetypeId) {
      processedRef.current = false;
    }
    
    return () => {
      mountedRef.current = false;
      console.log(`DetailedArchetypeReport: Unmounting for ${archetypeId}`);
    };
  }, [archetypeId]);
  
  // Use memoization with strict dependency tracking to prevent redundant calculations
  const archetypeData = useMemo(() => {
    // Skip processing if already done or component unmounted
    if (processedRef.current || !mountedRef.current) {
      console.log(`DetailedArchetypeReport: Skipping redundant processing for ${archetypeId}`);
      return dbArchetypeData || getArchetypeDetailedById(archetypeId);
    }
    
    // Set processing flag immediately before any operations
    processedRef.current = true;
    console.log(`DetailedArchetypeReport: Processing data for ${archetypeId} (sequence #${renderCountRef.current})`);
    
    return dbArchetypeData || getArchetypeDetailedById(archetypeId);
  }, [dbArchetypeData, getArchetypeDetailedById, archetypeId]);
  
  // Skip rendering if loading to prevent flicker
  if (isLoading) {
    return (
      <div className="w-full p-6 rounded-lg bg-white shadow">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <ArchetypeContent 
      archetypeData={archetypeData}
      archetypeId={archetypeId}
      onRetakeAssessment={onRetakeAssessment}
    />
  );
};

export default DetailedArchetypeReport;
