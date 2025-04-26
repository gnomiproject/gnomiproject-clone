
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import generateArchetypeReports from '@/utils/archetypeReportGenerator';

/**
 * Hook to handle report generation
 */
const useReportGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  /**
   * Generate reports for all archetypes
   */
  const generateAllReports = async () => {
    setIsGenerating(true);
    
    try {
      // Call the report generation utility
      const results = await generateArchetypeReports(supabase);
      console.log('Report generation completed:', results);
      return results;
    } catch (error) {
      console.error('Error generating reports:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateAllReports,
    isGenerating
  };
};

export default useReportGeneration;
