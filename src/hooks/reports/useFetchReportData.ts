
import { supabase } from '@/integrations/supabase/client';
import { ReportType } from '@/utils/reports/schemaUtils';
import type { ReportDataSource } from '@/utils/reports/dataSourceUtils';
import { ArchetypeDetailedData } from '@/types/archetype';

interface TokenAccessResponse {
  data: {
    id: string;
    archetype_id: string;
    name: string;
    organization: string;
    email: string;
    created_at: string;
  } | null;
  error: any;
}

export const fetchReportData = async (
  archetypeId: string,
  reportType: ReportType,
  dataSourceTable: ReportDataSource
): Promise<ArchetypeDetailedData | null> => {
  const { data, error } = await supabase
    .from(dataSourceTable)
    .select('*')
    .eq('archetype_id', archetypeId)
    .maybeSingle();

  if (error) throw error;
  
  return data as ArchetypeDetailedData | null;
};

export const fetchTokenAccess = async (archetypeId: string, token: string): Promise<TokenAccessResponse> => {
  return await supabase
    .from('report_requests')
    .select('id, archetype_id, name, organization, email, created_at')
    .eq('archetype_id', archetypeId)
    .eq('access_token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
};
