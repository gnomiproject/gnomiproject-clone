
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArchetypeDetailedData } from '@/types/archetype';
import { useReportAccess } from '../useReportAccess';

interface UseReportDataResult {
  reportData: any;
  archetypeData: ArchetypeDetailedData | null;
  averageData: any | null;
  isLoading: boolean;
  error: Error | null;
  debugInfo: any;
  refreshData: () => Promise<void>;
  isUsingFallbackData?: boolean;
}

/**
 * Hook to fetch report data for a specified archetype
 * 
 * This is a wrapper around useReportAccess that provides a consistent interface
 * for components that need report data
 */
export const useReportData = (
  archetypeId: string,
  token: string | undefined,
  options = {
    isAdminView: false,
    skipCache: false
  }
): UseReportDataResult => {
  // Use the refactored hook for data fetching
  return useReportAccess({
    archetypeId,
    token: token || '',
    isAdminView: options.isAdminView,
    skipCache: options.skipCache
  });
};
