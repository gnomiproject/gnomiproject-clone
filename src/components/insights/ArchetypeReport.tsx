import React, { useState, useEffect } from 'react';
import { useArchetypes } from '@/hooks/useArchetypes';
import { ArchetypeId } from '@/types/archetype';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChartBar, FileText, StarHalf, Award, Building2, Rocket, Heart, AlertCircle, Info } from 'lucide-react';
import { gnomeImages } from '@/utils/gnomeImages';
import { getArchetypeColorHex } from '@/data/colors';
import { cn } from '@/lib/utils';
import ReportError from '@/components/report/ReportError';
import MetricsTab from './tabs/MetricsTab';
import OverviewTab from './tabs/OverviewTab';
import SwotTab from './tabs/SwotTab';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ArchetypeReportProps {
  archetypeId: ArchetypeId;
  reportData: any;
  dataSource?: string;
}

const ArchetypeReport = ({ archetypeId, reportData, dataSource }: ArchetypeReportProps) => {
  const { getArchetypeEnhanced, getFamilyById } = useArchetypes();
  const [activeTab, setActiveTab] = useState('overview');
  
  // If no data was provided, fallback to local data
  const localArchetype = getArchetypeEnhanced(archetypeId);
  const archetype = reportData || localArchetype;
  const family = archetype ? getFamilyById(archetype.familyId || archetype.family_id) : undefined;
  
  // If no archetype data is found, show a user-friendly error with retry option
  if (!archetype) {
    return (
      <ReportError 
        title="Archetype Not Found"
        message={`We couldn't find data for archetype "${archetypeId}". This might be due to a temporary data loading issue.`}
        actionLabel="Retry Loading Data"
        onAction={() => window.location.reload()}
      />
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
  
  // Make sure we have a consistent data structure regardless of source
  const normalizeArchetypeData = () => {
    return {
      id: archetype.id || archetype.archetype_id,
      name: archetype.name || archetype.archetype_name,
      shortDescription: archetype.short_description || '',
      longDescription: archetype.long_description || '',
      familyId: archetype.familyId || archetype.family_id,
      familyName: archetype.familyName || archetype.family_name,
      keyCharacteristics: Array.isArray(archetype.key_characteristics) 
        ? archetype.key_characteristics 
        : archetype.key_characteristics?.split(',').map((s: string) => s.trim()) || [],
      industries: archetype.industries || ''
    };
  };
  
  const normalizedData = normalizeArchetypeData();
  
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
      {/* Top colored border using the appropriate archetype color */}
      <div className="h-2" style={{ backgroundColor: archetypeHexColor }}></div>
      
      <div className="p-6 md:p-8">
        {dataSource && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs text-muted-foreground">
              Data source: {dataSource}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col md:flex-row gap-8 mb-10 items-center">
          <div className="md:flex-grow space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-opacity-10 border-0" style={{ 
                backgroundColor: `${familyHexColor}20`, 
                color: familyHexColor 
              }}>
                {`Family ${normalizedData.familyId?.toUpperCase() || 'Unknown'}`}
              </Badge>
              <Badge variant="outline">{normalizedData.id.toUpperCase()}</Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{normalizedData.name}</h1>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              {normalizedData.shortDescription}
            </p>
          </div>
          
          {/* Gnome mascot image */}
          <div className="flex-shrink-0 hidden md:block">
            <img 
              src={gnomeImage}
              alt={`${normalizedData.name} Guide`}
              className="h-48 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/gnomes/placeholder.svg';
              }}
            />
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-gray-100 p-1 overflow-x-auto flex whitespace-nowrap max-w-full justify-start md:justify-center">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              <FileText className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="priorities" className="data-[state=active]:bg-white">
              <Rocket className="w-4 h-4 mr-2" />
              Strategic Priorities
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-white">
              <ChartBar className="w-4 h-4 mr-2" />
              Key Metrics
            </TabsTrigger>
            <TabsTrigger value="swot" className="data-[state=active]:bg-white">
              <StarHalf className="w-4 h-4 mr-2" />
              SWOT Analysis
            </TabsTrigger>
            <TabsTrigger value="industries" className="data-[state=active]:bg-white">
              <Building2 className="w-4 h-4 mr-2" />
              Industries
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-8">
            <OverviewTab archetypeData={archetype} familyColor={familyHexColor} />
          </TabsContent>
          
          {/* Strategic Priorities Tab */}
          <TabsContent value="priorities" className="mt-6">
            <h3 className="text-2xl font-bold mb-6">Strategic Priorities for {normalizedData.name}</h3>
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
          
          {/* Metrics & Traits Tab */}
          <TabsContent value="metrics" className="mt-6">
            <MetricsTab archetypeData={archetype} />
          </TabsContent>
          
          {/* SWOT Analysis Tab */}
          <TabsContent value="swot" className="mt-6">
            <SwotTab archetypeData={archetype} swotData={swotData} />
          </TabsContent>
          
          {/* Industries Tab */}
          <TabsContent value="industries" className="mt-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-6">Common Industries</h3>
                <Card className="bg-white border rounded-lg p-6">
                  <p className="text-gray-700 whitespace-pre-line">
                    {normalizedData.industries || 'No industry data available'}
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
      </div>
      
      {/* Call to action footer */}
      <div className="bg-gray-50 p-6 md:p-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Want a deeper analysis?</h3>
            <p className="text-gray-600 max-w-xl">Get a customized report tailored to your specific organization with detailed metrics and actionable recommendations.</p>
          </div>
          <Button 
            className="text-white px-6 py-3"
            style={{ backgroundColor: archetypeHexColor }}
            onClick={() => window.open('/contact', '_blank')}
          >
            Request Custom Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeReport;
