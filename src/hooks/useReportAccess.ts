
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { ArchetypeId } from '@/types/archetype';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { useReportUserData } from '@/hooks/useReportUserData';
import { useReportData } from '@/hooks/useReportData';

export interface UseReportAccessResult {
  archetypeId: ArchetypeId;
  token: string | undefined;
  isInsightsReport: boolean;
  isAdminView: boolean;
  initialLoading: boolean;
  skipCache: boolean;
  setSkipCache: (skip: boolean) => void;
  isRetrying: boolean;
  setIsRetrying: (retrying: boolean) => void;
  
  // Data and states
  archetypeData: any;
  archetypeLoading: boolean;
  archetypeError: Error | null;
  dataSource: string;
  reportData: any;
  averageData: any;
  reportLoading: boolean;
  reportError: Error | null;
  userData: any;
  userDataLoading: boolean;
  isValidAccess: boolean;
  userDataError: Error | null;
  
  // Actions
  handleRetry: () => Promise<void>;
  refreshArchetypeData: () => Promise<void>;
  refreshReportData: () => void;
}

export const useReportAccess = (): UseReportAccessResult => {
  const { archetypeId = '', token } = useParams();
  const location = useLocation();
  
  // State variables
  const [initialLoading, setInitialLoading] = useState(true);
  const [isInsightsReport, setIsInsightsReport] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [skipCache, setSkipCache] = useState(false);
  
  // Debug logging for URL parameters
  useEffect(() => {
    console.log('[ReportAccess] URL parameters:', {
      archetypeId,
      token: token ? `${token.substring(0, 5)}...` : 'missing',
      pathname: location.pathname
    });
  }, [archetypeId, token, location]);
  
  // Validate archetypeId
  const validArchetypeId = isValidArchetypeId(archetypeId) ? archetypeId as ArchetypeId : 'a1' as ArchetypeId;
  
  // Call hooks UNCONDITIONALLY for data fetching
  const { 
    archetypeData, 
    isLoading: archetypeLoading, 
    error: archetypeError, 
    dataSource,
    refetch: refetchArchetype,
    refreshData: refreshArchetypeData
  } = useGetArchetype(validArchetypeId, skipCache);
  
  const {
    userData,
    isLoading: userDataLoading,
    isValid: isValidAccess,
    error: userDataError
  } = useReportUserData(token, validArchetypeId);
  
  const {
    reportData,
    averageData,
    isLoading: reportLoading,
    error: reportError,
    retry: retryReportData,
    refreshData: refreshReportData
  } = useReportData({
    archetypeId: validArchetypeId,
    token: token || '',
    isInsightsReport,
    skipCache
  });

  // Determine report type
  useEffect(() => {
    setIsInsightsReport(location.pathname.startsWith('/insights/report'));
    setIsAdminView(token === 'admin-view');
    
    console.log('[ReportAccess] Report type determined:', {
      isInsightsReport: location.pathname.startsWith('/insights/report'),
      isAdminView: token === 'admin-view',
      token: token ? `${token.substring(0, 5)}...` : 'missing'
    });
  }, [location.pathname, token]);
  
  // Initial loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to handle retry when there's a connection error
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await refetchArchetype();
      toast.success("Reconnected successfully");
    } catch (err) {
      toast.error("Connection failed. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    archetypeId: validArchetypeId,
    token,
    isInsightsReport,
    isAdminView,
    initialLoading,
    skipCache,
    setSkipCache,
    isRetrying,
    setIsRetrying,
    
    // Data and states
    archetypeData,
    archetypeLoading,
    archetypeError,
    dataSource,
    reportData,
    averageData,
    reportLoading,
    reportError,
    userData,
    userDataLoading,
    isValidAccess,
    userDataError,
    
    // Actions
    handleRetry,
    refreshArchetypeData,
    refreshReportData
  };
};
