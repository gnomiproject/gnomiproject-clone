
import React, { memo } from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import SectionTitle from '@/components/shared/SectionTitle';
import { Section } from '@/components/shared/Section';
import GnomePlaceholder from './introduction/GnomePlaceholder';
import ArchetypeIdentityCard from './archetype-profile/ArchetypeIdentityCard';
import KeyCharacteristicsList from './archetype-profile/KeyCharacteristicsList';
import IndustryComposition from './archetype-profile/IndustryComposition';
import DistinctiveMetrics from './archetype-profile/DistinctiveMetrics';
import ProfileNavigation from './archetype-profile/ProfileNavigation';
import { Card } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

export interface ArchetypeProfileSectionProps {
  archetypeData: ArchetypeDetailedData;
}

// The main component logic
const ArchetypeProfileSectionBase: React.FC<ArchetypeProfileSectionProps> = ({ archetypeData }) => {
  // Console log for debugging render cycles
  console.log('[ArchetypeProfileSection] Rendering with data:', 
    archetypeData?.name || archetypeData?.archetype_name || 'Unknown');
  
  if (!archetypeData) {
    return (
      <Section id="archetype-profile">
        <SectionTitle title="Archetype Profile" />
        <Card className="p-6">
          <p>No archetype data available.</p>
        </Card>
      </Section>
    );
  }

  return (
    <Section id="archetype-profile">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <a href="#home" className="flex items-center gap-2 text-gray-500 hover:text-primary">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </a>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Archetype Profile</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <div className="w-full md:w-2/3">
          <SectionTitle 
            title="Archetype Profile" 
            subtitle="Detailed insights into the characteristics and behaviors that define your organization's archetype."
          />
        </div>
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="h-48 w-48">
            <GnomePlaceholder type="magnifying" />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Archetype Identity Card */}
        <ArchetypeIdentityCard archetype={archetypeData} />
        
        {/* Key Characteristics */}
        {archetypeData.key_characteristics && (
          <KeyCharacteristicsList 
            characteristics={archetypeData.key_characteristics} 
            archetypeColor={archetypeData.hexColor || '#6E59A5'}
          />
        )}
        
        {/* Industry Composition */}
        <IndustryComposition industries={archetypeData.industries || ''} />
        
        {/* Distinctive Metrics */}
        <DistinctiveMetrics 
          metrics={archetypeData.distinctive_metrics || []} 
          archetypeId={archetypeData.id || archetypeData.archetype_id || ''}
        />
        
        {/* Navigation */}
        <ProfileNavigation onNavigate={id => console.log(`Navigation to ${id} will be handled by parent`)} />
      </div>
    </Section>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
const ArchetypeProfileSection = memo(ArchetypeProfileSectionBase);

export default ArchetypeProfileSection;
