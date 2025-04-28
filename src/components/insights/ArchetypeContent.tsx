
import React from 'react';
import { ArchetypeDetailedData } from '@/types/archetype';
import ArchetypeNavTabs from './components/ArchetypeNavTabs';
import ArchetypeHeader from './components/ArchetypeHeader';
import { Tabs } from "@/components/ui/tabs";
import { useState } from 'react';

interface ArchetypeContentProps {
  archetypeData: ArchetypeDetailedData;
  archetypeId: string;
  onRetakeAssessment: () => void;
}

const ArchetypeContent = ({ archetypeData, archetypeId, onRetakeAssessment }: ArchetypeContentProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="rounded-lg overflow-hidden bg-white">
      <ArchetypeHeader 
        name={archetypeData.name}
        description={archetypeData.short_description || ''}
        familyId={archetypeData.familyId || ''}
        familyName={archetypeData.familyName || ''}
        familyColor={archetypeData.hexColor || '#000000'}
        archetypeHexColor={archetypeData.hexColor || '#000000'}
        gnomeImage={`/assets/gnomes/${archetypeId}.png`}
      />
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <ArchetypeNavTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </Tabs>
    </div>
  );
};

export default ArchetypeContent;
