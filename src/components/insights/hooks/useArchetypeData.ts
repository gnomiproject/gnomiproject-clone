
import { useState, useEffect, useMemo, useRef } from 'react';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { useArchetypeDetails } from '@/hooks/archetype/useArchetypeDetails';

export const useArchetypeData = (
  archetypeId: ArchetypeId,
  initialReportData: ArchetypeDetailedData,
  assessmentResult?: any,
  isUnlocked?: boolean
) => {
  const processedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ArchetypeDetailedData>(initialReportData);
  
  const { data: refreshedData, isLoading: refreshLoading, refetch } = useArchetypeDetails(archetypeId);

  // Process assessment result
  const processedAssessmentResult = useMemo(() => {
    if (processedRef.current) {
      return assessmentResult;
    }
    
    console.log('[useArchetypeData] Using assessment result data', {
      hasAssessmentResult: !!assessmentResult,
      archetypeId,
      exactEmployeeCount: assessmentResult?.exactData?.employeeCount
    });
    
    processedRef.current = true;
    
    if (assessmentResult && !assessmentResult.exactData) {
      const storedEmployeeCount = sessionStorage.getItem('healthcareArchetypeExactEmployeeCount');
      const result = {...assessmentResult};
      result.exactData = {
        employeeCount: storedEmployeeCount ? Number(storedEmployeeCount) : null
      };
      return result;
    }
    return assessmentResult;
  }, [assessmentResult, archetypeId]);

  // Refresh data when unlocked
  useEffect(() => {
    if (isUnlocked && refreshedData && !refreshLoading) {
      console.log("[useArchetypeData] Received refreshed data", {
        isUnlocked,
        archetypeName: refreshedData.name || refreshedData.archetype_name
      });
      setReportData(refreshedData);
    }
  }, [refreshedData, refreshLoading, isUnlocked]);

  // Clean up on archetype change
  useEffect(() => {
    return () => {
      processedRef.current = false;
    };
  }, [archetypeId]);

  // Resolve archetype names and colors
  const name = reportData?.name || reportData?.archetype_name || reportData?.id?.toUpperCase() || 'Unnamed Archetype';
  const shortDescription = reportData?.short_description || '';
  const familyId = reportData?.familyId || reportData?.family_id;
  const familyName = reportData?.familyName || reportData?.family_name || '';
  const familyColor = reportData?.hexColor || reportData?.color || (reportData as any)?.hex_color || '#4B5563';

  return {
    reportData,
    isLoading,
    setIsLoading,
    refetch,
    processedAssessmentResult,
    name,
    shortDescription,
    familyId,
    familyName,
    familyColor
  };
};
