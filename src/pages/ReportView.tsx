
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import InsightsReportContent from '@/components/report/sections/InsightsReportContent';
import { useGetArchetype } from '@/hooks/useGetArchetype';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { isValidArchetypeId } from '@/utils/archetypeValidation';
import { ArchetypeId } from '@/types/archetype';
import { trackReportAccess } from '@/utils/reports/accessTracking';

const ReportView = () => {
  const { archetypeId, token } = useParams();
  const hasTrackedRef = useRef(false);
  
  // Track report access when component mounts - with deduplication
  useEffect(() => {
    // Only track once per session for this component
    if (archetypeId && token && !hasTrackedRef.current) {
      console.log(`[ReportView] First view, tracking access for ${archetypeId}`);
      trackReportAccess(archetypeId, token);
      hasTrackedRef.current = true;
    }
  }, [archetypeId, token]);
  
  // Validate archetype ID
  if (!archetypeId || !isValidArchetypeId(archetypeId)) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-red-600">Invalid Archetype ID</h2>
        <p className="text-gray-600 mt-2">The requested archetype report could not be found.</p>
      </Card>
    );
  }

  // Type assertion to narrow the type to ArchetypeId
  const { archetypeData, isLoading, error } = useGetArchetype(archetypeId as ArchetypeId);

  if (error) {
    toast.error("Failed to load archetype data");
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Report</h2>
        <p className="text-gray-600 mt-2">There was an error loading the report data.</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <p className="text-gray-600">Loading report...</p>
        </div>
      </Card>
    );
  }

  if (!archetypeData) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-yellow-600">Report Not Found</h2>
        <p className="text-gray-600 mt-2">The requested archetype report could not be found.</p>
      </Card>
    );
  }

  return <InsightsReportContent archetype={archetypeData} />;
};

export default ReportView;
