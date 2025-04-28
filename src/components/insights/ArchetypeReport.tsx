
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
import { Card } from '@/components/ui/card';
import { Rocket, Building2 } from 'lucide-react';

interface ArchetypeReportProps {
  archetypeId: ArchetypeId;
  reportData: any;
  dataSource?: string;
  hideRequestSection?: boolean;
}

const ArchetypeReport = ({ archetypeId, reportData, dataSource, hideRequestSection = false }: ArchetypeReportProps) => {
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();
  const [activeTab, setActiveTab] = useState('overview');
  const renderCountRef = useRef(0);
  const processedRef = useRef(false);
  const mountedRef = useRef(true);
  
  // Log component lifecycle for debugging
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`ArchetypeReport: Mount/Render #${renderCountRef.current} for ${archetypeId}`);
    
    // Reset flags when archetypeId changes
    if (archetypeId) {
      processedRef.current = false;
    }
    
    return () => {
      mountedRef.current = false;
      console.log(`ArchetypeReport: Unmounting for ${archetypeId}`);
    };
  }, [archetypeId]);
  
  // If no data was provided, fallback to local data
  const localArchetype = getArchetypeEnhanced(archetypeId);
  const archetype = reportData || localArchetype;
  const family = archetype ? getFamilyById(archetype.familyId || archetype.family_id) : undefined;
  
  if (!archetype) {
    return null;
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
  
  // Ensure we have strategic priorities data with fallback
  const strategicPriorities = archetype?.strategic_recommendations || 
    archetype?.enhanced?.strategicPriorities || [];
  
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
        
        <TabsContent value="overview" className="mt-6 space-y-8">
          <OverviewTab archetypeData={archetype} familyColor={familyHexColor} hideRequestSection={hideRequestSection} />
        </TabsContent>
        
        <TabsContent value="priorities" className="mt-6">
          <h3 className="text-2xl font-bold mb-6">Strategic Priorities for {archetype.name}</h3>
          <div className="space-y-6">
            {(strategicPriorities).map((priority: any, index: number) => (
              <Card key={index} className="bg-white border rounded-lg p-6 shadow-sm overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg p-4 flex-shrink-0" 
                    style={{ backgroundColor: `${archetypeHexColor}20`, color: archetypeHexColor }}>
                    <span className="text-xl font-bold">{priority.recommendation_number || priority.number || index+1}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">{priority.title}</h4>
                    <p className="text-gray-700">{priority.description}</p>
                  </div>
                </div>
              </Card>
            ))}
            
            {strategicPriorities.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-500">No strategic priorities available</h4>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <MetricsTab archetypeData={archetype} hideRequestSection={hideRequestSection} />
        </TabsContent>
        
        <TabsContent value="swot" className="mt-6">
          <SwotTab archetypeData={archetype} swotData={swotData} hideRequestSection={hideRequestSection} />
        </TabsContent>
        
        <TabsContent value="industries" className="mt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-6">Common Industries</h3>
              <Card className="bg-white border rounded-lg p-6">
                <p className="text-gray-700 whitespace-pre-line">
                  {archetype.industries || 'No industry data available'}
                </p>
              </Card>
            </div>
            
            <div className="md:w-1/2 flex items-center justify-center">
              <div className="max-w-xs">
                <img 
                  src={gnomeImages.welcome || gnomeImages.presentation}
                  alt="Industries Guide"
                  className="max-h-80 mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/gnomes/placeholder.svg';
                  }}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <ArchetypeFooter archetypeHexColor={archetypeHexColor} />
    </div>
  );
};

export default ArchetypeReport;
