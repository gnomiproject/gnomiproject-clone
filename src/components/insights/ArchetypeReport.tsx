
import React, { useState, useRef, useEffect } from 'react';
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { gnomeImages } from '@/utils/gnomeImages';
import { getArchetypeColorHex } from '@/data/colors';
import ArchetypeHeader from './components/ArchetypeHeader';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeFooter from './components/ArchetypeFooter';
import OverviewTab from './tabs/OverviewTab';
import MetricsTab from './tabs/MetricsTab';
import SwotTab from './tabs/SwotTab';
import DiseaseAndCareTab from './tabs/DiseaseAndCareTab';
import { Skeleton } from '@/components/ui/skeleton';

interface ArchetypeReportProps {
  archetypeId: ArchetypeId;
  reportData: any;
  dataSource?: string;
  hideRequestSection?: boolean;
  isLoading?: boolean;
}

const ArchetypeReport = ({ 
  archetypeId, 
  reportData, 
  dataSource, 
  hideRequestSection = false,
  isLoading = false 
}: ArchetypeReportProps) => {
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();
  const [activeTab, setActiveTab] = useState('overview');
  const renderCountRef = useRef(0);
  const processedRef = useRef(false);
  const mountedRef = useRef(true);
  
  // Log component lifecycle for debugging
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`ArchetypeReport: Mount/Render #${renderCountRef.current} for ${archetypeId}`);
    console.log(`ArchetypeReport: Data source is ${dataSource || 'not specified'}`);
    
    // Reset flags when archetypeId changes
    if (archetypeId) {
      processedRef.current = false;
    }
    
    return () => {
      mountedRef.current = false;
      console.log(`ArchetypeReport: Unmounting for ${archetypeId}`);
    };
  }, [archetypeId, dataSource]);
  
  // If no data was provided, fallback to local data
  const localArchetype = getArchetypeEnhanced(archetypeId);
  const archetype = reportData || localArchetype;
  const family = archetype ? getFamilyById(archetype.familyId || archetype.family_id) : undefined;
  
  if (!archetype && !isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-lg text-gray-600">No data available for this archetype.</p>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden mb-12 max-w-6xl mx-auto p-6">
        <Skeleton className="h-16 w-full mb-4" />
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Get family color to use consistently throughout the report
  const familyHexColor = getArchetypeColorHex(archetype.familyId || archetype.family_id);
  const archetypeHexColor = archetype.hexColor || archetype.hex_color || getArchetypeColorHex(archetype.id);
  
  // Choose a gnome image based on archetype
  const gnomeImage = archetypeId.startsWith('a') 
    ? gnomeImages.presentation 
    : archetypeId.startsWith('b') 
      ? gnomeImages.clipboard 
      : gnomeImages.magnifying;

  // Ensure we have SWOT data with fallback
  const swotData = {
    strengths: archetype?.strengths || archetype?.enhanced?.swot?.strengths || [],
    weaknesses: archetype?.weaknesses || archetype?.enhanced?.swot?.weaknesses || [],
    opportunities: archetype?.opportunities || archetype?.enhanced?.swot?.opportunities || [],
    threats: archetype?.threats || archetype?.enhanced?.swot?.threats || []
  };
  
  // Debug data
  console.log("ArchetypeReport rendering with data:", {
    name: archetype.name,
    id: archetype.id,
    familyId: archetype.familyId || archetype.family_id,
    dataKeys: Object.keys(archetype).filter(key => !key.startsWith('_')).join(', '),
    metricsExample: {
      "Demo_Average Family Size": archetype["Demo_Average Family Size"],
      "Demo_Average Age": archetype["Demo_Average Age"]
    },
    swotDataLengths: {
      strengths: swotData.strengths?.length || 0,
      weaknesses: swotData.weaknesses?.length || 0,
      opportunities: swotData.opportunities?.length || 0,
      threats: swotData.threats?.length || 0
    }
  });
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-12 max-w-6xl mx-auto">
      <ArchetypeHeader 
        name={archetype.name || archetype.id?.toUpperCase()}
        description={archetype.short_description || ''}
        familyId={archetype.familyId || archetype.family_id}
        familyName={family?.name || archetype.familyName || archetype.family_name || ''}
        familyColor={familyHexColor}
        archetypeHexColor={archetypeHexColor}
        dataSource={dataSource}
        gnomeImage={gnomeImage}
      />
      
      <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <ArchetypeNavTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <TabsContent value="overview" className="mt-6 space-y-8 px-6">
          <OverviewTab archetypeData={archetype} familyColor={familyHexColor} hideRequestSection={hideRequestSection} />
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6 px-6">
          <MetricsTab archetypeData={archetype} hideRequestSection={hideRequestSection} />
        </TabsContent>
        
        <TabsContent value="swot" className="mt-6 px-6">
          <SwotTab archetypeData={archetype} swotData={swotData} hideRequestSection={hideRequestSection} />
        </TabsContent>
        
        <TabsContent value="diseaseAndCare" className="mt-6 px-6">
          <DiseaseAndCareTab archetypeData={archetype} hideRequestSection={hideRequestSection} />
        </TabsContent>
      </Tabs>
      
      <ArchetypeFooter archetypeHexColor={archetypeHexColor} />
    </div>
  );
};

export default ArchetypeReport;
