import React, { useMemo, useRef, useEffect } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { useArchetypes } from '@/hooks/useArchetypes';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import InsightsView from './InsightsView';

interface InsightsContainerProps {
  archetypeId: ArchetypeId;
  onRetakeAssessment: () => void;
  assessmentResult?: any;
  assessmentAnswers?: any;
}

const InsightsContainer = ({ 
  archetypeId, 
  onRetakeAssessment,
  assessmentResult,
  assessmentAnswers 
}: InsightsContainerProps) => {
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
    
    // Get data from API or fallback to local data
    const data = dbArchetypeData || getArchetypeDetailedById(archetypeId);
    
    // Log warning if no data is found
    if (!data) {
      console.warn(`DetailedArchetypeReport: No data found for archetype ${archetypeId}`);
    }
    
    return data;
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
  
  // Show error state if no data is available
  if (!archetypeData) {
    return (
      <div className="w-full p-6 rounded-lg bg-white shadow border border-red-200">
        <h3 className="text-lg font-semibold text-red-600">No Data Available</h3>
        <p className="mt-2 text-gray-700">Unable to load archetype data for ID: {archetypeId}</p>
        <button 
          className="mt-4 px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          onClick={onRetakeAssessment}
        >
          Retake Assessment
        </button>
      </div>
    );
  }
  
  // Create a default fallback for basic props to prevent null errors
  const safeArchetypeData = {
    ...archetypeData,
    name: archetypeData.name || `Archetype ${archetypeId.toUpperCase()}`,
    hexColor: archetypeData.hexColor || '#6E59A5',
    color: archetypeData.color || '#6E59A5',
    familyName: archetypeData.familyName || archetypeData.family_name || 'Healthcare Archetype'
  };
  
  // Use ArchetypeReport directly instead of ArchetypeContent to ensure DeepDiveRequestForm is included
  return (
    <InsightsView 
      archetypeId={archetypeId}
      reportData={safeArchetypeData}
      assessmentResult={assessmentResult}
      assessmentAnswers={assessmentAnswers}
      hideRequestSection={false}
    />
  );
};

export default InsightsContainer;
