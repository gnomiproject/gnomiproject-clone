
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { ArchetypeDetailedData, ArchetypeId } from '@/types/archetype';
import { trackReportAccess } from '@/utils/reports/accessTracking';
import { getFromCache, setInCache, clearFromCache } from '@/utils/reports/reportCache';

// Re-export from the new refactored location for backward compatibility
export { useReportData } from './reports/useReportData';

// Export the default too for imports that use "import useReportData from '...'"
import { useReportData as useReportDataNew } from './reports/useReportData';
export default useReportDataNew;
